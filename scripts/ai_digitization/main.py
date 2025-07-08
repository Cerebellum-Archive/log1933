#!/usr/bin/env python3
"""
Ernest K. Gann 1933 Logbook AI Digitization Pipeline
=====================================================

This script processes PNG images of Ernest K. Gann's 1933 logbook pages
and extracts text using multiple AI services with intelligent fallbacks.

Features:
- Multiple OCR engines (Tesseract, Google Vision API, OpenAI Vision)
- AI text improvement with GPT-4
- Batch processing with progress tracking
- Quality scoring and validation
- Output formats: JSON, TXT, and structured data for website integration
"""

import os
import json
import logging
import argparse
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
import asyncio
import aiohttp

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

from PIL import Image
import pytesseract
from spellchecker import SpellChecker
import openai
from openai import AsyncOpenAI

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('digitization.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class LogbookEntry:
    """Structure for a digitized logbook entry."""
    filename: str
    page_number: Optional[int]
    date_entry: Optional[str]
    location: Optional[str]
    content: str
    raw_ocr_text: str
    confidence_score: float
    processing_method: str
    timestamp: str
    
class AIDigitizer:
    """Main digitization class with multiple AI backends."""
    
    def __init__(self, openai_api_key: str, google_credentials_path: Optional[str] = None):
        self.openai_client = AsyncOpenAI(api_key=openai_api_key)
        self.spell_checker = SpellChecker()
        
        # Initialize Google Vision if credentials provided
        self.google_vision = None
        if google_credentials_path and os.path.exists(google_credentials_path):
            try:
                from google.cloud import vision
                os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = google_credentials_path
                self.google_vision = vision.ImageAnnotatorClient()
                logger.info("Google Vision API initialized")
            except ImportError:
                logger.warning("Google Cloud Vision not available, install with: pip install google-cloud-vision")
    
    async def extract_text_tesseract(self, image_path: str) -> Tuple[str, float]:
        """Extract text using Tesseract OCR."""
        try:
            img = Image.open(image_path)
            # Optimize image for OCR
            img = img.convert('L')  # Convert to grayscale
            text = pytesseract.image_to_string(img, config='--psm 6')
            
            # Calculate confidence based on spelling accuracy
            words = text.split()
            if not words:
                return "", 0.0
            
            misspelled = self.spell_checker.unknown(words)
            confidence = max(0.0, 1.0 - (len(misspelled) / len(words)))
            
            return text.strip(), confidence
        except Exception as e:
            logger.error(f"Tesseract OCR failed for {image_path}: {e}")
            return "", 0.0
    
    async def extract_text_google_vision(self, image_path: str) -> Tuple[str, float]:
        """Extract text using Google Cloud Vision API."""
        if not self.google_vision:
            return "", 0.0
        
        try:
            with open(image_path, 'rb') as image_file:
                content = image_file.read()
            
            # Use the current Google Vision API syntax
            from google.cloud import vision
            image = vision.Image(content=content)
            response = self.google_vision.text_detection(image=image)
            
            if response.text_annotations:
                text = response.text_annotations[0].description
                # Google Vision provides inherent confidence
                confidence = min(1.0, len(text) / 100)  # Rough confidence based on text length
                return text.strip(), confidence
            
            return "", 0.0
        except Exception as e:
            logger.error(f"Google Vision failed for {image_path}: {e}")
            return "", 0.0
    
    async def extract_text_openai_vision(self, image_path: str) -> Tuple[str, float]:
        """Extract text using OpenAI GPT-4 Vision."""
        try:
            with open(image_path, 'rb') as image_file:
                import base64
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text", 
                                "text": "Extract all text from this handwritten logbook page. Preserve the original layout and any dates, locations, or special notations. Return only the extracted text without commentary."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=1000
            )
            
            text = response.choices[0].message.content
            # OpenAI Vision typically has high accuracy for clear images
            confidence = 0.85 if len(text) > 50 else 0.6
            return text.strip(), confidence
        except Exception as e:
            logger.error(f"OpenAI Vision failed for {image_path}: {e}")
            return "", 0.0
    
    async def improve_text_with_gpt4(self, text: str, context: str = "") -> str:
        """Enhance extracted text using GPT-4."""
        try:
            system_prompt = """You are an expert at transcribing and improving handwritten logbook entries from 1933. 
            Your task is to clean up OCR text while preserving the original meaning and historical authenticity.
            
            Guidelines:
            - Correct obvious spelling errors and OCR mistakes
            - Preserve period-appropriate language and terminology
            - Maintain original dates, locations, and proper nouns
            - Fill in obvious gaps but mark uncertain additions with [?]
            - Keep the original structure and formatting
            - This is Ernest K. Gann's world tour logbook from 1933"""
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Raw OCR text to improve:\n\n{text}\n\nContext: {context}"}
                ],
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"GPT-4 improvement failed: {e}")
            return text
    
    async def extract_metadata(self, improved_text: str) -> Dict[str, Optional[str]]:
        """Extract structured metadata from improved text."""
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system", 
                        "content": """Extract structured information from this 1933 logbook entry. 
                        Return ONLY a valid JSON object with these exact keys: date_entry, location, weather, activities, people_mentioned. 
                        Use null for missing information. Do not include any explanations or additional text."""
                    },
                    {"role": "user", "content": f"Extract metadata from this logbook entry:\n\n{improved_text}"}
                ],
                temperature=0.1
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Try to extract JSON from the response if it contains extra text
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_text = json_match.group(0)
            else:
                json_text = response_text
            
            return json.loads(json_text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed: {e}. Response was: {response_text[:200]}...")
            return {"date_entry": None, "location": None, "weather": None, "activities": None, "people_mentioned": None}
        except Exception as e:
            logger.error(f"Metadata extraction failed: {e}")
            return {"date_entry": None, "location": None, "weather": None, "activities": None, "people_mentioned": None}
    
    async def process_image(self, image_path: str) -> LogbookEntry:
        """Process a single image through the complete pipeline."""
        logger.info(f"Processing {image_path}")
        
        # Try multiple OCR methods and pick the best result
        methods = [
            ("tesseract", self.extract_text_tesseract),
            ("google_vision", self.extract_text_google_vision),
            ("openai_vision", self.extract_text_openai_vision)
        ]
        
        best_text = ""
        best_confidence = 0.0
        best_method = "none"
        
        for method_name, method_func in methods:
            text, confidence = await method_func(image_path)
            logger.info(f"{method_name}: confidence={confidence:.2f}, length={len(text)}")
            
            if confidence > best_confidence:
                best_text = text
                best_confidence = confidence
                best_method = method_name
        
        # Improve the best result with GPT-4
        improved_text = await self.improve_text_with_gpt4(best_text)
        
        # Extract metadata
        metadata = await self.extract_metadata(improved_text)
        
        # Create logbook entry
        entry = LogbookEntry(
            filename=Path(image_path).name,
            page_number=self._extract_page_number(Path(image_path).name),
            date_entry=metadata.get('date_entry'),
            location=metadata.get('location'),
            content=improved_text,
            raw_ocr_text=best_text,
            confidence_score=best_confidence,
            processing_method=best_method,
            timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"Completed {image_path} - Method: {best_method}, Confidence: {best_confidence:.2f}")
        return entry
    
    def _extract_page_number(self, filename: str) -> Optional[int]:
        """Extract page number from filename if possible."""
        import re
        match = re.search(r'(\d+)', filename)
        return int(match.group(1)) if match else None

async def main():
    """Main processing function."""
    parser = argparse.ArgumentParser(description="Digitize Ernest K. Gann 1933 Logbook")
    parser.add_argument("--input-dir", default="png", help="Input directory with PNG files")
    parser.add_argument("--output-dir", default="digitized_output", help="Output directory")
    parser.add_argument("--openai-key", help="OpenAI API key (or set OPENAI_API_KEY env var)")
    parser.add_argument("--google-credentials", help="Path to Google Cloud credentials JSON")
    parser.add_argument("--max-files", type=int, help="Maximum number of files to process")
    
    args = parser.parse_args()
    
    # Get OpenAI API key - try argument, then environment variable
    openai_key = args.openai_key or os.getenv("OPENAI_API_KEY")
    if not openai_key:
        logger.error("OpenAI API key required. Set OPENAI_API_KEY env var or use --openai-key")
        logger.error("To set up credentials, see: credentials/README.md")
        return
    
    # Get Google credentials path from environment if not specified
    google_credentials = args.google_credentials or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    # Initialize digitizer
    digitizer = AIDigitizer(openai_key, google_credentials)
    
    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)
    
    # Get PNG files
    input_dir = Path(args.input_dir)
    png_files = list(input_dir.glob("*.png"))
    
    if args.max_files:
        png_files = png_files[:args.max_files]
    
    # Initialize tracking variables
    start_time = datetime.now()
    entries = []
    failed_files = []
    processing_stats = {
        "tesseract": 0,
        "google_vision": 0,
        "openai_vision": 0,
        "failed": 0
    }
    confidence_scores = []
    
    logger.info(f"Starting processing of {len(png_files)} PNG files at {start_time}")
    logger.info(f"Output directory: {output_dir.absolute()}")
    
    # Process files
    for i, png_file in enumerate(png_files, 1):
        logger.info(f"Progress: {i}/{len(png_files)} ({i/len(png_files)*100:.1f}%)")
        try:
            entry = await digitizer.process_image(str(png_file))
            entries.append(entry)
            
            # Update statistics
            processing_stats[entry.processing_method] += 1
            confidence_scores.append(entry.confidence_score)
            
            # Save individual entry
            entry_file = output_dir / f"{entry.filename.replace('.png', '.json')}"
            with open(entry_file, 'w', encoding='utf-8') as f:
                json.dump(asdict(entry), f, indent=2, ensure_ascii=False)
            
            # Save text version
            text_file = output_dir / f"{entry.filename.replace('.png', '.txt')}"
            with open(text_file, 'w', encoding='utf-8') as f:
                f.write(entry.content)
                
        except Exception as e:
            error_msg = f"Failed to process {png_file}: {e}"
            logger.error(error_msg)
            failed_files.append({
                "filename": png_file.name,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            })
            processing_stats["failed"] += 1
    
    # Calculate final statistics
    end_time = datetime.now()
    total_time = end_time - start_time
    successful_files = len(entries)
    total_files = len(png_files)
    success_rate = (successful_files / total_files * 100) if total_files > 0 else 0
    avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
    
    # Create comprehensive report
    report = {
        "processing_summary": {
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "total_processing_time": str(total_time),
            "total_files_attempted": total_files,
            "successful_files": successful_files,
            "failed_files": len(failed_files),
            "success_rate_percent": round(success_rate, 2),
            "average_confidence_score": round(avg_confidence, 3)
        },
        "method_statistics": processing_stats,
        "confidence_distribution": {
            "min": min(confidence_scores) if confidence_scores else 0,
            "max": max(confidence_scores) if confidence_scores else 0,
            "average": round(avg_confidence, 3),
            "high_confidence_files": len([c for c in confidence_scores if c >= 0.9]),
            "medium_confidence_files": len([c for c in confidence_scores if 0.7 <= c < 0.9]),
            "low_confidence_files": len([c for c in confidence_scores if c < 0.7])
        },
        "failed_files": failed_files
    }
    
    # Save processing report
    report_file = output_dir / "processing_report.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    # Save failed files list
    if failed_files:
        failed_file = output_dir / "failed_files.json"
        with open(failed_file, 'w', encoding='utf-8') as f:
            json.dump(failed_files, f, indent=2, ensure_ascii=False)
        
        # Also create a simple text list
        failed_txt = output_dir / "failed_files.txt"
        with open(failed_txt, 'w', encoding='utf-8') as f:
            f.write("Failed Files List\n")
            f.write("================\n\n")
            for fail in failed_files:
                f.write(f"{fail['filename']}: {fail['error']}\n")
    
    # Save complete dataset
    complete_data = {
        "metadata": {
            "total_entries": successful_files,
            "processing_date": end_time.isoformat(),
            "source": "Ernest K. Gann 1933 World Tour Logbook",
            "processing_stats": processing_stats,
            "success_rate": success_rate,
            "average_confidence": avg_confidence
        },
        "entries": [asdict(entry) for entry in entries]
    }
    
    with open(output_dir / "complete_logbook.json", 'w', encoding='utf-8') as f:
        json.dump(complete_data, f, indent=2, ensure_ascii=False)
    
    # Generate detailed summary log
    summary_log = output_dir / "processing_summary.txt"
    with open(summary_log, 'w', encoding='utf-8') as f:
        f.write("ERNEST K. GANN 1933 LOGBOOK DIGITIZATION REPORT\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Processing completed: {end_time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Total processing time: {total_time}\n")
        f.write(f"Files processed: {successful_files}/{total_files} ({success_rate:.1f}% success)\n\n")
        
        f.write("AI METHOD PERFORMANCE:\n")
        f.write("-" * 25 + "\n")
        for method, count in processing_stats.items():
            if method != "failed":
                percentage = (count / successful_files * 100) if successful_files > 0 else 0
                f.write(f"{method.replace('_', ' ').title()}: {count} files ({percentage:.1f}%)\n")
        f.write(f"Failed: {processing_stats['failed']} files\n\n")
        
        f.write("CONFIDENCE SCORE ANALYSIS:\n")
        f.write("-" * 30 + "\n")
        f.write(f"Average confidence: {avg_confidence:.3f}\n")
        f.write(f"High confidence (≥0.9): {report['confidence_distribution']['high_confidence_files']} files\n")
        f.write(f"Medium confidence (0.7-0.9): {report['confidence_distribution']['medium_confidence_files']} files\n")
        f.write(f"Low confidence (<0.7): {report['confidence_distribution']['low_confidence_files']} files\n\n")
        
        if failed_files:
            f.write("FAILED FILES:\n")
            f.write("-" * 15 + "\n")
            for fail in failed_files:
                f.write(f"• {fail['filename']}: {fail['error']}\n")
        else:
            f.write("✅ ALL FILES PROCESSED SUCCESSFULLY!\n")
    
    # Log final summary
    logger.info(f"\n" + "="*60)
    logger.info(f"PROCESSING COMPLETE!")
    logger.info(f"="*60)
    logger.info(f"Total time: {total_time}")
    logger.info(f"Success rate: {successful_files}/{total_files} ({success_rate:.1f}%)")
    logger.info(f"Average confidence: {avg_confidence:.3f}")
    logger.info(f"Primary method: {max(processing_stats, key=lambda k: processing_stats[k] if k != 'failed' else 0)}")
    
    if failed_files:
        logger.warning(f"Failed files: {len(failed_files)}")
        logger.info(f"See failed_files.txt for details")
    
    logger.info(f"Output files:")
    logger.info(f"  • Master dataset: complete_logbook.json")
    logger.info(f"  • Processing report: processing_report.json")
    logger.info(f"  • Summary: processing_summary.txt")
    logger.info(f"  • Individual files: {successful_files} JSON + TXT files")
    logger.info(f"Output directory: {output_dir.absolute()}")
    logger.info(f"="*60)

if __name__ == "__main__":
    asyncio.run(main()) 