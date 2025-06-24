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
            
            image = self.google_vision.types.Image(content=content)
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
                model="gpt-4-vision-preview",
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
                model="gpt-4-turbo-preview",
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
                model="gpt-4-turbo-preview",
                messages=[
                    {
                        "role": "system", 
                        "content": "Extract structured information from this 1933 logbook entry. Return JSON with keys: date_entry, location, weather, activities, people_mentioned. Use null for missing information."
                    },
                    {"role": "user", "content": improved_text}
                ],
                temperature=0.1
            )
            
            return json.loads(response.choices[0].message.content)
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
    
    # Get OpenAI API key
    openai_key = args.openai_key or os.getenv("OPENAI_API_KEY")
    if not openai_key:
        logger.error("OpenAI API key required. Set OPENAI_API_KEY env var or use --openai-key")
        return
    
    # Initialize digitizer
    digitizer = AIDigitizer(openai_key, args.google_credentials)
    
    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)
    
    # Get PNG files
    input_dir = Path(args.input_dir)
    png_files = list(input_dir.glob("*.png"))
    
    if args.max_files:
        png_files = png_files[:args.max_files]
    
    logger.info(f"Processing {len(png_files)} PNG files")
    
    # Process files
    entries = []
    for i, png_file in enumerate(png_files, 1):
        logger.info(f"Progress: {i}/{len(png_files)}")
        try:
            entry = await digitizer.process_image(str(png_file))
            entries.append(entry)
            
            # Save individual entry
            entry_file = output_dir / f"{entry.filename.replace('.png', '.json')}"
            with open(entry_file, 'w', encoding='utf-8') as f:
                json.dump(asdict(entry), f, indent=2, ensure_ascii=False)
            
            # Save text version
            text_file = output_dir / f"{entry.filename.replace('.png', '.txt')}"
            with open(text_file, 'w', encoding='utf-8') as f:
                f.write(entry.content)
                
        except Exception as e:
            logger.error(f"Failed to process {png_file}: {e}")
    
    # Save complete dataset
    complete_data = {
        "metadata": {
            "total_entries": len(entries),
            "processing_date": datetime.now().isoformat(),
            "source": "Ernest K. Gann 1933 World Tour Logbook"
        },
        "entries": [asdict(entry) for entry in entries]
    }
    
    with open(output_dir / "complete_logbook.json", 'w', encoding='utf-8') as f:
        json.dump(complete_data, f, indent=2, ensure_ascii=False)
    
    # Generate summary
    logger.info(f"\nProcessing complete!")
    logger.info(f"Total entries: {len(entries)}")
    logger.info(f"Average confidence: {sum(e.confidence_score for e in entries) / len(entries):.2f}")
    logger.info(f"Output directory: {output_dir}")

if __name__ == "__main__":
    asyncio.run(main()) 