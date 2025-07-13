#!/usr/bin/env python3
"""
AI-powered document combiner system
Detects and combines multi-page letters, telegrams, and reports
"""

import json
import re
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

# Add the parent directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@dataclass
class DocumentGroup:
    """Represents a group of related logbook entries that form a complete document"""
    id: str
    document_type: str  # 'letter', 'telegram', 'report', 'list', 'narrative'
    title: str
    date_entry: Optional[str]
    location: Optional[str]
    entries: List[Dict]
    combined_content: str
    is_complete: bool
    confidence: float
    date_inferred: bool = False

class DocumentCombiner:
    def __init__(self):
        self.document_patterns = self._create_document_patterns()
        
    def _create_document_patterns(self) -> Dict[str, Dict]:
        """Create patterns to identify different document types"""
        return {
            'letter': {
                'start_patterns': [
                    r'^.*(?:House|Street|Lane|Road),?\s*$',  # Address line
                    r'^\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)[,\s]+\d{4}',  # Date
                    r'^Dear\s+(?:Mr|Mrs|Miss|Dr|Professor)\s+\w+',  # Salutation
                    r'^\w+\s+\w+,\s*Esq\.',  # Name with Esq.
                ],
                'end_patterns': [
                    r'(?:Yours\s+(?:sincerely|truly|faithfully)|Sincerely|Best\s+regards|Kind\s+regards),?\s*$',
                    r'^[A-Z]\.\s*[A-Z]\.\s*\w+\s*$',  # Initials and name
                    r'^[A-Z]{2,4}\/[A-Z]{2,4}\s*$',  # Initials like HSB/EMO
                ],
                'continuation_patterns': [
                    r'\.\.\.$',  # Ellipsis
                    r'[a-z]\s*$',  # Ends mid-sentence
                    r'[,;]\s*$',  # Ends with comma or semicolon
                ]
            },
            'telegram': {
                'start_patterns': [
                    r'^[A-Z]+,\s+[A-Z]+\.\s+\d{1,2}',  # SOUTHAMPTON, JAN. 28
                    r'^[A-Z]+\s+[A-Z]+\s+\d{1,2}',  # LONDON JAN 29
                    r'^GANNGOR|^NLT|^CHGO',  # Telegraph codes
                ],
                'end_patterns': [
                    r'^[A-Z]+\s*$',  # All caps signature
                    r'Stop\.\s*$',  # Telegraph stop
                    r'Love,?\s*$',  # Common ending
                ],
                'continuation_patterns': [
                    r'Stop\s*$',  # Telegraph stop (but not final)
                    r'[a-z]\s*$',  # Ends mid-sentence
                ]
            },
            'report': {
                'start_patterns': [
                    r'^(?:GENERAL|POLITICAL|ECONOMIC|TECHNICAL)\s+(?:SITUATION|REPORT|ANALYSIS)',
                    r'^(?:Page|Section)\s+\d+',
                    r'^PROSPECTS\s+FOR\s+THE\s+FUTURE',
                    r'^\d+\.\s+[A-Z]',  # Numbered sections
                ],
                'end_patterns': [
                    r'^(?:End\s+of\s+)?(?:Report|Section|Chapter)',
                    r'^\*\*\*\s*$',  # Section break
                ],
                'continuation_patterns': [
                    r'\.\.\.$',  # Incomplete
                    r'[a-z]\s*$',  # Mid-sentence
                    r':\s*$',  # Ends with colon
                ]
            },
            'list': {
                'start_patterns': [
                    r'^LIST\s+OF\s+',
                    r'^\(\d+\)',  # Numbered list (1)
                    r'^\d+\.',  # Numbered list 1.
                    r'^[A-Z]-No\.\s+\d+',  # Equipment lists A-No. 1
                    r'^PLACES\s+VISITED',
                ],
                'end_patterns': [
                    r'^END\s+OF\s+LIST',
                    r'^\*Note:',  # Note at end
                ],
                'continuation_patterns': [
                    r'^\d+\s*$',  # Just numbers
                    r'^[A-Z]\s*$',  # Just letters
                    r'^\(\d+\)\s*$',  # Incomplete numbered item
                ]
            },
            'narrative': {
                'start_patterns': [
                    r'^I\s+(?:arrived|met|visited|went|saw)',
                    r'^The\s+(?:journey|trip|visit)',
                    r'^During\s+(?:my|the|this)',
                ],
                'end_patterns': [
                    r'\.\s*$',  # Complete sentence
                ],
                'continuation_patterns': [
                    r'[a-z]\s*$',  # Mid-sentence
                    r'[,;]\s*$',  # Continues
                    r'\band\s*$',  # Ends with 'and'
                ]
            }
        }
    
    def identify_document_type(self, content: str) -> Tuple[str, float]:
        """Identify the type of document and confidence level"""
        if not content:
            return 'unknown', 0.0
        
        content_lower = content.lower()
        scores = {}
        
        for doc_type, patterns in self.document_patterns.items():
            score = 0.0
            
            # Check start patterns
            for pattern in patterns['start_patterns']:
                if re.search(pattern, content, re.IGNORECASE | re.MULTILINE):
                    score += 0.4
                    break  # Only count one start pattern
            
            # Check end patterns  
            for pattern in patterns['end_patterns']:
                if re.search(pattern, content, re.IGNORECASE | re.MULTILINE):
                    score += 0.3
                    break  # Only count one end pattern
            
            # Check continuation patterns
            for pattern in patterns['continuation_patterns']:
                if re.search(pattern, content, re.IGNORECASE | re.MULTILINE):
                    score += 0.2
                    break  # Only count one continuation pattern
            
            # Additional heuristics
            if doc_type == 'letter':
                if any(word in content_lower for word in ['dear', 'sincerely', 'yours truly', 'regards']):
                    score += 0.1
                if re.search(r'\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)', content_lower):
                    score += 0.1
            
            elif doc_type == 'telegram':
                if any(word in content_lower for word in ['stop', 'cable', 'wire', 'ganngor', 'chgo']):
                    score += 0.2
                if len(content.split()) < 100:  # Telegrams tend to be shorter
                    score += 0.1
            
            elif doc_type == 'report':
                if any(word in content_lower for word in ['analysis', 'situation', 'prospects', 'conclusion']):
                    score += 0.1
                if len(content.split()) > 200:  # Reports tend to be longer
                    score += 0.1
            
            elif doc_type == 'list':
                numbered_items = len(re.findall(r'^\d+\.|\(\d+\)', content, re.MULTILINE))
                if numbered_items > 3:
                    score += 0.2
                if any(word in content_lower for word in ['specification', 'equipment', 'item', 'description']):
                    score += 0.1
            
            scores[doc_type] = min(score, 1.0)  # Cap at 1.0
        
        if not scores:
            return 'unknown', 0.0
        
        best_type = max(scores, key=scores.get)
        best_score = scores[best_type]
        
        # Require minimum confidence
        if best_score < 0.3:
            return 'unknown', best_score
        
        return best_type, best_score
    
    def is_continuation(self, entry1: Dict, entry2: Dict) -> Tuple[bool, float]:
        """Check if entry2 is a continuation of entry1"""
        content1 = entry1.get('content', '').strip()
        content2 = entry2.get('content', '').strip()
        
        if not content1 or not content2:
            return False, 0.0
        
        confidence = 0.0
        
        # Check page numbers (sequential)
        page1 = entry1.get('page_number', 0)
        page2 = entry2.get('page_number', 0)
        if page1 and page2 and abs(page2 - page1) <= 5:  # Within 5 pages
            confidence += 0.2
        
        # Check dates (same or close)
        date1 = entry1.get('date_entry')
        date2 = entry2.get('date_entry')
        if date1 and date2 and date1 == date2:
            confidence += 0.3
        elif date1 and not date2:  # One has date, other doesn't
            confidence += 0.1
        
        # Check location consistency
        loc1 = (entry1.get('location') or '').lower()
        loc2 = (entry2.get('location') or '').lower()
        if loc1 and loc2:
            if loc1 == loc2:
                confidence += 0.2
            elif any(word in loc2 for word in loc1.split()) or any(word in loc1 for word in loc2.split()):
                confidence += 0.1
        
        # Check content continuation patterns
        
        # 1. First document ends incomplete
        if re.search(r'[a-z,;]\s*$', content1) or content1.endswith('...'):
            confidence += 0.3
        
        # 2. Second document starts mid-sentence or continues
        if re.search(r'^[a-z]', content2) or content2.startswith('and ') or content2.startswith('but '):
            confidence += 0.3
        
        # 3. Page markers
        if re.search(r'Page\s+\d+|^\d+\.\s*$|\(-?\d+-?\)|^-\d+-', content1, re.IGNORECASE):
            confidence += 0.2
        
        # 4. Same document type
        type1, conf1 = self.identify_document_type(content1)
        type2, conf2 = self.identify_document_type(content2)
        if type1 == type2 and type1 != 'unknown':
            confidence += 0.2
        
        # 5. Content similarity (same topic/characters)
        # Extract key words and names
        words1 = set(re.findall(r'\b[A-Z][a-z]+\b', content1))  # Proper nouns
        words2 = set(re.findall(r'\b[A-Z][a-z]+\b', content2))
        if words1 and words2:
            overlap = len(words1.intersection(words2)) / len(words1.union(words2))
            confidence += overlap * 0.2
        
        return confidence >= 0.5, confidence
    
    def combine_entries(self, entries: List[Dict]) -> str:
        """Combine multiple entries into a single coherent document"""
        if not entries:
            return ""
        
        if len(entries) == 1:
            return entries[0].get('content', '')
        
        combined_content = []
        
        for i, entry in enumerate(entries):
            content = entry.get('content', '').strip()
            if not content:
                continue
            
            # Clean up content for combination
            
            # Remove page numbers and markers at start
            content = re.sub(r'^(?:Page\s+)?\d+\.?\s*', '', content, flags=re.IGNORECASE)
            content = re.sub(r'^-?\d+-?\s*', '', content)
            content = re.sub(r'^\(\d+\)\s*', '', content)
            
            # Handle continuation from previous page
            if i > 0 and combined_content:
                last_content = combined_content[-1]
                
                # If previous ends incomplete and this starts lowercase, join them
                if (re.search(r'[a-z,;]\s*$', last_content) and 
                    re.search(r'^[a-z]', content)):
                    
                    # Remove the last entry and combine
                    combined_content[-1] = last_content.rstrip() + ' ' + content
                    continue
                
                # If this starts with connecting words, join
                if re.search(r'^(?:and|but|however|therefore|thus|so|in|of|the|that|which)\s+', content, re.IGNORECASE):
                    combined_content[-1] = last_content.rstrip() + ' ' + content
                    continue
            
            # Add paragraph break if this is a new section
            if combined_content and not re.search(r'^[a-z]', content):
                combined_content.append(content)
            else:
                combined_content.append(content)
        
        # Join with appropriate spacing
        result = '\n\n'.join(combined_content)
        
        # Clean up the result
        result = re.sub(r'\n\s*\n\s*\n+', '\n\n', result)  # Max 2 consecutive newlines
        result = re.sub(r'\s+', ' ', result)  # Multiple spaces to single
        result = result.strip()
        
        return result
    
    def create_document_groups(self, entries: List[Dict]) -> List[DocumentGroup]:
        """Create groups of related documents"""
        if not entries:
            return []
        
        # Sort entries by page number for processing
        sorted_entries = sorted(entries, key=lambda x: x.get('page_number', 0))
        
        groups = []
        used_indices = set()
        
        for i, entry in enumerate(sorted_entries):
            if i in used_indices:
                continue
            
            content = entry.get('content', '').strip()
            if not content or len(content) < 20:  # Skip very short entries
                continue
            
            # Start a new group
            group_entries = [entry]
            group_indices = {i}
            
            # Look for continuations
            for j in range(i + 1, min(i + 10, len(sorted_entries))):  # Look ahead up to 10 entries
                if j in used_indices:
                    continue
                
                next_entry = sorted_entries[j]
                
                # Check if this entry continues the current group
                is_cont, confidence = self.is_continuation(group_entries[-1], next_entry)
                
                if is_cont and confidence > 0.5:
                    group_entries.append(next_entry)
                    group_indices.add(j)
                elif len(group_entries) > 1:
                    # Stop looking if we have a multi-entry group and find a non-continuation
                    break
            
            # Mark used indices
            used_indices.update(group_indices)
            
            # Determine document type
            all_content = ' '.join(e.get('content', '') for e in group_entries)
            doc_type, type_confidence = self.identify_document_type(all_content)
            
            # Create combined content
            combined_content = self.combine_entries(group_entries)
            
            # Get best date and location
            best_date = None
            best_location = None
            date_inferred = True
            
            for e in group_entries:
                if e.get('date_entry') and not best_date:
                    best_date = e['date_entry']
                    date_inferred = e.get('date_inferred', False)
                if e.get('location') and not best_location:
                    best_location = e['location']
            
            # Create title
            title = self.create_document_title(doc_type, combined_content, best_location, best_date)
            
            # Create group
            group = DocumentGroup(
                id=f"doc_{entry.get('page_number', i)}_{doc_type}",
                document_type=doc_type,
                title=title,
                date_entry=best_date,
                location=best_location,
                entries=group_entries,
                combined_content=combined_content,
                is_complete=self.is_document_complete(doc_type, combined_content),
                confidence=type_confidence,
                date_inferred=date_inferred
            )
            
            groups.append(group)
        
        return groups
    
    def create_document_title(self, doc_type: str, content: str, location: str, date: str) -> str:
        """Create an appropriate title for the document"""
        
        if doc_type == 'letter':
            # Extract recipient or sender
            recipient_match = re.search(r'Dear\s+((?:Mr|Mrs|Miss|Dr|Professor)\s+\w+)', content, re.IGNORECASE)
            if recipient_match:
                return f"Letter to {recipient_match.group(1)}"
            
            sender_match = re.search(r'Yours\s+(?:sincerely|truly),?\s*([A-Z]\.\s*[A-Z]\.\s*\w+)', content, re.IGNORECASE)
            if sender_match:
                return f"Letter from {sender_match.group(1)}"
            
            return "Personal Letter"
        
        elif doc_type == 'telegram':
            # Extract destination or origin
            dest_match = re.search(r'^([A-Z]+),?\s+([A-Z]+\.?\s+\d+)', content, re.MULTILINE)
            if dest_match:
                return f"Telegram from {dest_match.group(1)}"
            
            return "Telegram"
        
        elif doc_type == 'report':
            # Extract report subject
            subject_match = re.search(r'^((?:GENERAL|POLITICAL|ECONOMIC|TECHNICAL)\s+(?:SITUATION|REPORT|ANALYSIS))', content, re.IGNORECASE | re.MULTILINE)
            if subject_match:
                return subject_match.group(1).title()
            
            return "Business Report"
        
        elif doc_type == 'list':
            # Extract list subject
            list_match = re.search(r'^LIST\s+OF\s+(.+)', content, re.IGNORECASE | re.MULTILINE)
            if list_match:
                return f"List of {list_match.group(1).title()}"
            
            places_match = re.search(r'^PLACES\s+VISITED', content, re.IGNORECASE | re.MULTILINE)
            if places_match:
                return "Places Visited"
            
            return "Equipment List"
        
        else:
            # For narrative or unknown, use location or date
            if location:
                return f"Notes from {location}"
            elif date:
                return f"Entry from {date}"
            else:
                return "Logbook Entry"
    
    def is_document_complete(self, doc_type: str, content: str) -> bool:
        """Check if a document appears to be complete"""
        if not content:
            return False
        
        if doc_type == 'letter':
            # Has both greeting and closing
            has_greeting = bool(re.search(r'Dear\s+\w+', content, re.IGNORECASE))
            has_closing = bool(re.search(r'(?:Yours\s+(?:sincerely|truly)|Sincerely|Best\s+regards)', content, re.IGNORECASE))
            return has_greeting and has_closing
        
        elif doc_type == 'telegram':
            # Ends with sender or stop
            return bool(re.search(r'(?:Stop\.?|[A-Z]{3,})\s*$', content, re.IGNORECASE))
        
        elif doc_type == 'list':
            # Has structured format
            return bool(re.search(r'^\d+\.|^\(\d+\)', content, re.MULTILINE))
        
        else:
            # For others, check if ends with complete sentence
            return bool(re.search(r'[.!?]\s*$', content))
    
    def process_logbook(self, logbook_data: Dict) -> Dict:
        """Process the entire logbook and create combined documents"""
        entries = logbook_data.get('entries', [])
        
        # Create document groups
        document_groups = self.create_document_groups(entries)
        
        # Convert back to entry format
        combined_entries = []
        
        for group in document_groups:
            # Create a combined entry
            combined_entry = {
                'filename': f"combined_{group.id}",
                'page_number': group.entries[0].get('page_number', 0),
                'date_entry': group.date_entry,
                'location': group.location,
                'content': group.combined_content,
                'raw_ocr_text': '',  # Not needed for combined entries
                'confidence_score': group.confidence,
                'processing_method': 'ai_combined',
                'timestamp': datetime.now().isoformat(),
                'date_inferred': group.date_inferred,
                'document_type': group.document_type,
                'document_title': group.title,
                'is_combined': True,
                'is_complete': group.is_complete,
                'source_entries': [entry['filename'] for entry in group.entries],
                'entry_count': len(group.entries)
            }
            
            combined_entries.append(combined_entry)
        
        # Update metadata
        result = logbook_data.copy()
        result['entries'] = combined_entries
        result['metadata']['combined_date'] = datetime.now().isoformat()
        result['metadata']['original_entries'] = len(entries)
        result['metadata']['combined_entries'] = len(combined_entries)
        result['metadata']['documents_combined'] = sum(1 for g in document_groups if len(g.entries) > 1)
        
        return result

def main():
    # Load the cleaned logbook
    script_dir = os.path.dirname(os.path.abspath(__file__))
    logbook_path = os.path.join(script_dir, '..', '..', 'website', 'public', 'data', 'cleaned_logbook.json')
    
    try:
        with open(logbook_path, 'r', encoding='utf-8') as f:
            logbook_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find cleaned logbook at {logbook_path}")
        return
    
    # Create combiner and process
    combiner = DocumentCombiner()
    combined_data = combiner.process_logbook(logbook_data)
    
    # Save combined logbook
    output_path = os.path.join(script_dir, '..', '..', 'website', 'public', 'data', 'combined_logbook.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, indent=2, ensure_ascii=False)
    
    print(f"Combined logbook saved to {output_path}")
    print(f"Original entries: {combined_data['metadata']['original_entries']}")
    print(f"Combined entries: {combined_data['metadata']['combined_entries']}")
    print(f"Documents combined: {combined_data['metadata']['documents_combined']}")

if __name__ == "__main__":
    main() 