#!/usr/bin/env python3
"""
AI-powered logbook cleanup system
Cleans OCR artifacts, fixes formatting, and infers missing dates
"""

import json
import re
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Add the parent directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class LogbookCleaner:
    def __init__(self):
        self.location_to_date_mapping = self._create_location_date_mapping()
        self.known_locations = self._create_known_locations()
        
    def _create_location_date_mapping(self) -> Dict[str, str]:
        """Create a mapping of locations to approximate dates based on Ernest's journey"""
        return {
            # Journey route based on historical context
            "chicago": "1933-01",
            "new york": "1933-01", 
            "southampton": "1933-01-28",
            "london": "1933-01-29",
            "england": "1933-02",
            "liverpool": "1933-02",
            "portugal": "1933-02",
            "lisbon": "1933-02",
            "spain": "1933-02",
            "france": "1933-03",
            "paris": "1933-03",
            "switzerland": "1933-03",
            "germany": "1933-03",
            "berlin": "1933-03",
            "poland": "1933-04",
            "russia": "1933-04",
            "moscow": "1933-04",
            "egypt": "1933-04",
            "cairo": "1933-04",
            "suez": "1933-04",
            "india": "1933-05",
            "bombay": "1933-05",
            "calcutta": "1933-05",
            "burma": "1933-05",
            "rangoon": "1933-05",
            "straits settlements": "1933-05",
            "singapore": "1933-05",
            "kuala lumpur": "1933-05",
            "penang": "1933-05",
            "china": "1933-06",
            "shanghai": "1933-06",
            "hong kong": "1933-06",
            "hongkong": "1933-06",
            "nanking": "1933-06",
            "peking": "1933-06",
            "tientsin": "1933-06",
            "japan": "1933-07",
            "tokyo": "1933-07",
            "yokohama": "1933-07",
            "philippines": "1933-08",
            "manila": "1933-08",
            "hawaii": "1933-09",
            "honolulu": "1933-09",
            "pacific": "1933-09",
            "san francisco": "1933-09",
            "california": "1933-09",
            "united states": "1933-09",
            "america": "1933-09"
        }
    
    def _create_known_locations(self) -> List[str]:
        """Create a list of known locations from the journey"""
        return [
            "Chicago", "New York", "Southampton", "London", "England", "Liverpool", 
            "Portugal", "Lisbon", "Spain", "France", "Paris", "Switzerland", 
            "Germany", "Berlin", "Poland", "Russia", "Moscow", "Egypt", "Cairo", 
            "Suez", "India", "Bombay", "Calcutta", "Burma", "Rangoon", 
            "Straits Settlements", "Singapore", "Kuala Lumpur", "Penang", 
            "China", "Shanghai", "Hong Kong", "Nanking", "Peking", "Tientsin", 
            "Japan", "Tokyo", "Yokohama", "Philippines", "Manila", "Hawaii", 
            "Honolulu", "San Francisco", "California", "Antwerp", "Melbourne House"
        ]
    
    def clean_text(self, text: str) -> str:
        """Clean OCR artifacts and improve text quality"""
        if not text:
            return ""
            
        # Remove common OCR artifacts
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)\[\]\{\}\"\'\$\%\&\@\#\*\+\=\<\>\/\\\|\_\~\`\^]', '', text)
        
        # Fix common OCR errors
        ocr_fixes = {
            r'\bI\b(?=\s+[a-z])': 'I',  # Standalone I
            r'\bto-morrow\b': 'tomorrow',
            r'\bto-day\b': 'today',
            r'\bto-night\b': 'tonight',
            r'\bper cent\b': 'percent',
            r'\bper-cent\b': 'percent',
            r'\bfavour\b': 'favor',
            r'\bfavourable\b': 'favorable',
            r'\bcolour\b': 'color',
            r'\bhonour\b': 'honor',
            r'\bcentre\b': 'center',
            r'\btheatre\b': 'theater',
            r'\bconneotor\b': 'connector',
            r'\bsele otor\b': 'selector',
            r'\boffereing\b': 'offering',
            r'\bpreceeding\b': 'preceding',
            r'\bregretable\b': 'regrettable',
            r'\btravelling\b': 'traveling',
            r'\bneighbouring\b': 'neighboring',
            r'\bRumours\b': 'Rumors',
            r'\brumours\b': 'rumors',
            r'\bManchukoa\b': 'Manchukuo',
            r'\bTokio\b': 'Tokyo',
            r'\bAutomatio\b': 'Automatic',
            r'\bspecially\b': 'especially',
            r'\bover-estimated\b': 'overestimated',
            r'\bover-burdened\b': 'overburdened',
            r'\bG\.\$': 'G.$',  # Currency formatting
            r'\bU\.\s*S\.\s*A\.': 'U.S.A.',
            r'\bW\.\s*C\.\s*2\.': 'W.C.2.',
            r'\bP\.\s*A\.\s*X\.': 'P.A.X.',
            r'\bHSB\/EMO\b': 'HSB/EMO',
            r'\b\d+\s+[A-Z]\s+\d+\b': '',  # Remove random number-letter-number patterns
            r'\bdan\s+t\b': '',  # Remove OCR artifacts
            r'\b[A-Z]{1,2}\s+\d+\s+[A-Z]\s*\b': '',  # Remove random codes
            r'\b\d+\s+[A-Z]\s+\d+\s+[A-Z]\s*\b': '',  # Remove more random codes
            r'\bContext:\s*$': '',  # Remove trailing "Context:"
            r'\bOriginal:\s*IMG_\d+\.png\s*$': '',  # Remove trailing image references
            r'\bConfidence:\s*\d+%\s*$': '',  # Remove confidence scores
        }
        
        for pattern, replacement in ocr_fixes.items():
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
        # Fix spacing issues
        text = re.sub(r'\s+', ' ', text)  # Multiple spaces to single
        text = re.sub(r'\s+([,.!?;:])', r'\1', text)  # Remove space before punctuation
        text = re.sub(r'([,.!?;:])\s*([A-Z])', r'\1 \2', text)  # Ensure space after punctuation
        text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # Add space between camelCase
        
        # Fix paragraph breaks
        text = re.sub(r'\n\s*\n', '\n\n', text)  # Standardize paragraph breaks
        text = re.sub(r'\n([A-Z])', r'\n\n\1', text)  # Add paragraph break before new sentences
        
        # Remove standalone numbers and letters at the beginning of lines
        text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*[A-Z]\s*$', '', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*[A-Z]\d+\s*$', '', text, flags=re.MULTILINE)
        
        # Clean up final text
        text = text.strip()
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)  # Max 2 consecutive newlines
        
        return text
    
    def infer_date_from_content(self, content: str, location: str) -> Optional[str]:
        """Infer date from content and location"""
        if not content:
            return None
            
        # Look for explicit date patterns in content
        date_patterns = [
            r'(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)[,\s]+1933)',
            r'((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?[,\s]+1933)',
            r'(\d{1,2}\/\d{1,2}\/1933)',
            r'(1933[-\/]\d{1,2}[-\/]\d{1,2})',
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                date_str = match.group(1)
                # Convert to standardized format
                try:
                    # Try different parsing approaches
                    for fmt in ['%d %B, %Y', '%B %d, %Y', '%m/%d/%Y', '%Y-%m-%d']:
                        try:
                            dt = datetime.strptime(date_str.replace(',', ''), fmt)
                            return dt.strftime('%Y-%m-%d')
                        except ValueError:
                            continue
                except:
                    pass
        
        # If no explicit date found, use location mapping
        if location:
            location_lower = location.lower()
            for loc, date in self.location_to_date_mapping.items():
                if loc in location_lower:
                    return date
        
        # Look for location clues in content
        content_lower = content.lower()
        for loc, date in self.location_to_date_mapping.items():
            if loc in content_lower:
                return date
        
        # Look for sequential clues
        if 'arrived in japan' in content_lower and 'tenth of july' in content_lower:
            return '1933-07-10'
        
        if 'february' in content_lower and 'london' in content_lower:
            return '1933-02-08'
            
        if 'january' in content_lower and ('chicago' in content_lower or 'harris' in content_lower):
            return '1933-01-30'
        
        return None
    
    def extract_location_from_content(self, content: str) -> Optional[str]:
        """Extract location from content"""
        if not content:
            return None
            
        # Look for location patterns
        location_patterns = [
            r'(?:in|at|from|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)[,\s]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)',
            r'I\s+(?:am|was|arrived)\s+(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        ]
        
        for pattern in location_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                if match in self.known_locations:
                    return match
        
        # Check for known locations in content
        for location in self.known_locations:
            if location.lower() in content.lower():
                return location
        
        return None
    
    def clean_entry(self, entry: Dict) -> Dict:
        """Clean a single logbook entry"""
        cleaned_entry = entry.copy()
        
        # Clean the content
        if entry.get('content'):
            cleaned_entry['content'] = self.clean_text(entry['content'])
        
        # Clean the raw_ocr_text
        if entry.get('raw_ocr_text'):
            cleaned_entry['raw_ocr_text'] = self.clean_text(entry['raw_ocr_text'])
        
        # Clean and standardize location
        location = entry.get('location')
        if location:
            cleaned_entry['location'] = self.clean_text(location)
        else:
            # Try to extract location from content
            extracted_location = self.extract_location_from_content(entry.get('content', ''))
            if extracted_location:
                cleaned_entry['location'] = extracted_location
        
        # Infer or clean date
        date_entry = entry.get('date_entry')
        if not date_entry:
            # Try to infer date from content and location
            inferred_date = self.infer_date_from_content(
                entry.get('content', ''), 
                cleaned_entry.get('location', '')
            )
            if inferred_date:
                cleaned_entry['date_entry'] = inferred_date
                cleaned_entry['date_inferred'] = True
        else:
            cleaned_entry['date_inferred'] = False
        
        return cleaned_entry
    
    def clean_logbook(self, logbook_data: Dict) -> Dict:
        """Clean the entire logbook"""
        cleaned_data = logbook_data.copy()
        
        # Clean each entry
        cleaned_entries = []
        for entry in logbook_data.get('entries', []):
            cleaned_entry = self.clean_entry(entry)
            cleaned_entries.append(cleaned_entry)
        
        cleaned_data['entries'] = cleaned_entries
        
        # Update metadata
        cleaned_data['metadata']['cleaned_date'] = datetime.now().isoformat()
        cleaned_data['metadata']['cleaned_entries'] = len(cleaned_entries)
        
        return cleaned_data

def main():
    # Load the original logbook
    script_dir = os.path.dirname(os.path.abspath(__file__))
    logbook_path = os.path.join(script_dir, '..', '..', 'website', 'public', 'data', 'complete_logbook.json')
    
    try:
        with open(logbook_path, 'r', encoding='utf-8') as f:
            logbook_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find logbook at {logbook_path}")
        return
    
    # Create cleaner and process
    cleaner = LogbookCleaner()
    cleaned_data = cleaner.clean_logbook(logbook_data)
    
    # Save cleaned logbook
    output_path = os.path.join(script_dir, '..', '..', 'website', 'public', 'data', 'cleaned_logbook.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
    
    print(f"Cleaned logbook saved to {output_path}")
    print(f"Processed {len(cleaned_data['entries'])} entries")
    
    # Print some statistics
    inferred_dates = sum(1 for entry in cleaned_data['entries'] if entry.get('date_inferred'))
    print(f"Inferred dates for {inferred_dates} entries")

if __name__ == "__main__":
    main() 