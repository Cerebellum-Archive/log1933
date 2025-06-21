"""
Smart OCR Processor with AI Enhancement

This module provides advanced OCR processing with AI-powered text enhancement,
spell checking, and quality assessment. It's designed for processing Ernest K Gann's
1933 logbook images with high accuracy and contextual understanding.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import pytesseract
from PIL import Image
from spellchecker import SpellChecker
import openai
from typing import List, Optional, Dict, Tuple
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SmartOCRProcessor:
    """
    A class to handle smart OCR processing with AI enhancement.
    
    This processor combines Tesseract OCR with spell checking and AI-powered
    text refinement to achieve high-quality text extraction from historical documents.
    """
    
    def __init__(self, input_dir: str = "data/png", output_dir: str = "data/text_output"):
        """
        Initialize the smart OCR processor.
        
        Args:
            input_dir (str): Directory containing images to process
            output_dir (str): Directory to save extracted text files
        """
        self.input_dir = input_dir
        self.output_dir = output_dir
        self.spell_checker = SpellChecker()
        self._ensure_directories()
        self._validate_dependencies()
        self._setup_openai()
    
    def _ensure_directories(self) -> None:
        """Ensure input and output directories exist."""
        os.makedirs(self.input_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
    
    def _validate_dependencies(self) -> None:
        """Validate that all required dependencies are available."""
        try:
            version = pytesseract.get_tesseract_version()
            logger.info(f"Tesseract version: {version}")
        except Exception as e:
            logger.error(f"Tesseract not found: {e}")
            raise RuntimeError("Tesseract OCR is required but not found.")
    
    def _setup_openai(self) -> None:
        """Setup OpenAI API configuration."""
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            openai.api_key = api_key
            logger.info("OpenAI API configured")
        else:
            logger.warning("OpenAI API key not found. AI enhancement will be disabled.")
    
    def extract_text_from_image(self, image_path: str, lang: str = 'eng') -> Optional[str]:
        """
        Extract text from a single image using Tesseract OCR.
        
        Args:
            image_path (str): Path to the image file
            lang (str): Language code for OCR (default: 'eng')
            
        Returns:
            Optional[str]: Extracted text, or None if extraction failed
        """
        try:
            # Open and preprocess the image
            image = Image.open(image_path)
            
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'LA'):
                image = image.convert('RGB')
            
            # Perform OCR
            text = pytesseract.image_to_string(image, lang=lang)
            
            # Basic text cleaning
            text = self._clean_text(text)
            
            logger.info(f"Successfully extracted text from {image_path}")
            return text
            
        except Exception as e:
            logger.error(f"Error extracting text from {image_path}: {e}")
            return None
    
    def _clean_text(self, text: str) -> str:
        """
        Clean and normalize extracted text.
        
        Args:
            text (str): Raw extracted text
            
        Returns:
            str: Cleaned text
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove leading/trailing whitespace
        text = text.strip()
        
        # Normalize line breaks
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        
        return text
    
    def correct_spelling(self, text: str) -> str:
        """
        Correct spelling errors in the text using the spell checker.
        
        Args:
            text (str): Text to correct
            
        Returns:
            str: Corrected text
        """
        words = text.split()
        corrected_words = []
        
        for word in words:
            # Skip words with numbers or special characters
            if re.search(r'[0-9]', word) or not word.isalpha():
                corrected_words.append(word)
                continue
            
            # Get correction
            correction = self.spell_checker.correction(word)
            corrected_words.append(correction if correction else word)
        
        return ' '.join(corrected_words)
    
    def calculate_spelling_accuracy(self, text: str) -> float:
        """
        Calculate the proportion of correctly spelled words in the text.
        
        Args:
            text (str): Text to analyze
            
        Returns:
            float: Accuracy score between 0 and 1
        """
        words = text.split()
        if not words:
            return 0.0
        
        misspelled = self.spell_checker.unknown(words)
        correct_count = len(words) - len(misspelled)
        return correct_count / len(words)
    
    def improve_text_with_gpt(self, text: str, context: str = "aviation logbook") -> Optional[str]:
        """
        Use OpenAI GPT to refine and improve the OCR text.
        
        Args:
            text (str): Text to improve
            context (str): Context for the text (e.g., "aviation logbook")
            
        Returns:
            Optional[str]: Improved text, or None if API call failed
        """
        if not openai.api_key:
            logger.warning("OpenAI API not configured, skipping GPT enhancement")
            return text
        
        try:
            prompt = f"""Please refine the following text from a {context}. 
            Correct errors, improve clarity, and fill in any missing information while 
            preserving the original meaning and historical context:
            
            {text}"""
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert in historical document transcription and aviation terminology."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )
            
            improved_text = response['choices'][0]['message']['content'].strip()
            logger.info("GPT enhancement completed successfully")
            return improved_text
            
        except Exception as e:
            logger.error(f"Error during OpenAI API call: {e}")
            return text  # Return original text if API call fails
    
    def process_image_with_quality_check(self, image_path: str, threshold: float = 0.9) -> Tuple[bool, str, float]:
        """
        Process an image with quality assessment and enhancement.
        
        Args:
            image_path (str): Path to the image file
            threshold (float): Minimum spelling accuracy threshold for GPT enhancement
            
        Returns:
            Tuple[bool, str, float]: (success, processed_text, accuracy_score)
        """
        # Extract text
        text = self.extract_text_from_image(image_path)
        if text is None:
            return False, "", 0.0
        
        # Correct spelling
        corrected_text = self.correct_spelling(text)
        
        # Calculate accuracy
        accuracy = self.calculate_spelling_accuracy(corrected_text)
        logger.info(f"Spelling accuracy: {accuracy:.2%}")
        
        # Enhance with GPT if accuracy is above threshold
        if accuracy >= threshold and openai.api_key:
            improved_text = self.improve_text_with_gpt(corrected_text)
            return True, improved_text, accuracy
        else:
            return True, corrected_text, accuracy
    
    def sort_files_numerically(self, file_list: List[str]) -> List[str]:
        """
        Sort files based on numeric parts in their filenames.
        
        Args:
            file_list (List[str]): List of filenames to sort
            
        Returns:
            List[str]: Sorted list of filenames
        """
        def extract_number(filename):
            match = re.search(r'(\d+)', filename)
            return int(match.group(1)) if match else 0
        
        return sorted(file_list, key=extract_number)
    
    def batch_process(self, threshold: float = 0.9) -> Dict:
        """
        Process all images in the input directory with quality assessment.
        
        Args:
            threshold (float): Minimum spelling accuracy threshold for GPT enhancement
            
        Returns:
            Dict: Processing statistics
        """
        # Get list of image files
        image_files = []
        for file in os.listdir(self.input_dir):
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                image_files.append(file)
        
        # Sort files numerically
        image_files = self.sort_files_numerically(image_files)
        
        logger.info(f"Found {len(image_files)} images to process")
        
        # Process each image
        processed_count = 0
        error_count = 0
        gpt_enhanced_count = 0
        total_accuracy = 0.0
        processed_files = []
        
        for image_file in image_files:
            image_path = os.path.join(self.input_dir, image_file)
            logger.info(f"Processing: {image_file}")
            
            success, text, accuracy = self.process_image_with_quality_check(image_path, threshold)
            
            if success:
                # Save processed text
                output_filename = f"{os.path.splitext(image_file)[0]}.txt"
                output_path = os.path.join(self.output_dir, output_filename)
                
                try:
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(text)
                    
                    processed_count += 1
                    total_accuracy += accuracy
                    processed_files.append(image_file)
                    
                    if accuracy >= threshold and openai.api_key:
                        gpt_enhanced_count += 1
                        logger.info(f"GPT enhanced: {image_file}")
                    else:
                        logger.info(f"Basic processing: {image_file}")
                        
                except Exception as e:
                    logger.error(f"Error saving text for {image_file}: {e}")
                    error_count += 1
            else:
                error_count += 1
        
        avg_accuracy = total_accuracy / processed_count if processed_count > 0 else 0.0
        
        stats = {
            'total_files': len(image_files),
            'processed_count': processed_count,
            'error_count': error_count,
            'gpt_enhanced_count': gpt_enhanced_count,
            'average_accuracy': avg_accuracy,
            'success_rate': processed_count / len(image_files) if image_files else 0,
            'processed_files': processed_files
        }
        
        logger.info(f"Smart OCR processing completed: {processed_count}/{len(image_files)} files processed successfully")
        return stats


def main():
    """Main function to run the smart OCR processor."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Smart OCR processing with AI enhancement")
    parser.add_argument("--input-dir", default="data/png", help="Input directory containing images")
    parser.add_argument("--output-dir", default="data/text_output", help="Output directory for text files")
    parser.add_argument("--threshold", type=float, default=0.9, help="Spelling accuracy threshold for GPT enhancement")
    parser.add_argument("--single-file", help="Process a single image file")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Initialize processor
    processor = SmartOCRProcessor(args.input_dir, args.output_dir)
    
    if args.test:
        # Test mode - process a single file if available
        image_files = [f for f in os.listdir(args.input_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        if image_files:
            test_file = os.path.join(args.input_dir, image_files[0])
            success, text, accuracy = processor.process_image_with_quality_check(test_file, args.threshold)
            print(f"Test Results:")
            print(f"  Success: {success}")
            print(f"  Accuracy: {accuracy:.2%}")
            print(f"  Text preview: {text[:200]}...")
        else:
            print("No test files found")
    elif args.single_file:
        # Process single file
        success, text, accuracy = processor.process_image_with_quality_check(args.single_file, args.threshold)
        if success:
            print(f"Successfully processed {args.single_file}")
            print(f"Accuracy: {accuracy:.2%}")
        else:
            print(f"Failed to process {args.single_file}")
    else:
        # Run batch processing
        stats = processor.batch_process(args.threshold)
        print(f"Smart OCR processing completed:")
        print(f"  Total files: {stats['total_files']}")
        print(f"  Processed: {stats['processed_count']}")
        print(f"  Errors: {stats['error_count']}")
        print(f"  GPT enhanced: {stats['gpt_enhanced_count']}")
        print(f"  Average accuracy: {stats['average_accuracy']:.2%}")
        print(f"  Success rate: {stats['success_rate']:.2%}")


if __name__ == "__main__":
    main() 