"""
Basic OCR Processor

This module provides basic OCR functionality using Tesseract to extract text from images.
It's designed for processing Ernest K Gann's 1933 logbook images with proper error handling
and logging.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import pytesseract
from PIL import Image
from typing import List, Optional, Dict
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BasicOCRProcessor:
    """
    A class to handle basic OCR processing of images.
    
    This processor uses Tesseract OCR to extract text from various image formats
    and provides utilities for batch processing and text cleaning.
    """
    
    def __init__(self, input_dir: str = "data/png", output_dir: str = "data/text_output"):
        """
        Initialize the OCR processor.
        
        Args:
            input_dir (str): Directory containing images to process
            output_dir (str): Directory to save extracted text files
        """
        self.input_dir = input_dir
        self.output_dir = output_dir
        self._ensure_directories()
        self._validate_tesseract()
    
    def _ensure_directories(self) -> None:
        """Ensure input and output directories exist."""
        os.makedirs(self.input_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
    
    def _validate_tesseract(self) -> None:
        """Validate that Tesseract is properly installed and accessible."""
        try:
            version = pytesseract.get_tesseract_version()
            logger.info(f"Tesseract version: {version}")
        except Exception as e:
            logger.error(f"Tesseract not found or not accessible: {e}")
            raise RuntimeError("Tesseract OCR is required but not found. Please install it.")
    
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
    
    def process_single_image(self, image_path: str, output_filename: Optional[str] = None) -> bool:
        """
        Process a single image and save the extracted text.
        
        Args:
            image_path (str): Path to the image file
            output_filename (Optional[str]): Custom output filename
            
        Returns:
            bool: True if processing successful, False otherwise
        """
        # Extract text
        text = self.extract_text_from_image(image_path)
        
        if text is None:
            return False
        
        # Generate output filename
        if output_filename is None:
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            output_filename = f"{base_name}.txt"
        
        output_path = os.path.join(self.output_dir, output_filename)
        
        # Save extracted text
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(text)
            logger.info(f"Text saved to {output_path}")
            return True
        except Exception as e:
            logger.error(f"Error saving text to {output_path}: {e}")
            return False
    
    def batch_process(self, image_extensions: List[str] = None) -> Dict:
        """
        Process all images in the input directory.
        
        Args:
            image_extensions (List[str]): List of image extensions to process
            
        Returns:
            Dict: Processing statistics
        """
        if image_extensions is None:
            image_extensions = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']
        
        # Get list of image files
        image_files = []
        for file in os.listdir(self.input_dir):
            if any(file.lower().endswith(ext) for ext in image_extensions):
                image_files.append(file)
        
        # Sort files numerically
        image_files = self.sort_files_numerically(image_files)
        
        logger.info(f"Found {len(image_files)} images to process")
        
        # Process each image
        processed_count = 0
        error_count = 0
        processed_files = []
        
        for image_file in image_files:
            image_path = os.path.join(self.input_dir, image_file)
            logger.info(f"Processing: {image_file}")
            
            if self.process_single_image(image_path):
                processed_count += 1
                processed_files.append(image_file)
            else:
                error_count += 1
        
        stats = {
            'total_files': len(image_files),
            'processed_count': processed_count,
            'error_count': error_count,
            'success_rate': processed_count / len(image_files) if image_files else 0,
            'processed_files': processed_files
        }
        
        logger.info(f"Batch processing completed: {processed_count}/{len(image_files)} files processed successfully")
        return stats
    
    def get_ocr_stats(self) -> Dict:
        """
        Get statistics about the OCR processing status.
        
        Returns:
            Dict: Statistics including file counts and processing status
        """
        input_files = []
        output_files = []
        
        # Count input files
        for file in os.listdir(self.input_dir):
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                input_files.append(file)
        
        # Count output files
        if os.path.exists(self.output_dir):
            for file in os.listdir(self.output_dir):
                if file.lower().endswith('.txt'):
                    output_files.append(file)
        
        return {
            'input_files_count': len(input_files),
            'output_files_count': len(output_files),
            'processing_rate': len(output_files) / len(input_files) if input_files else 0
        }


def main():
    """Main function to run the basic OCR processor."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Extract text from images using OCR")
    parser.add_argument("--input-dir", default="data/png", help="Input directory containing images")
    parser.add_argument("--output-dir", default="data/text_output", help="Output directory for text files")
    parser.add_argument("--lang", default="eng", help="Language code for OCR")
    parser.add_argument("--single-file", help="Process a single image file")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Initialize processor
    processor = BasicOCRProcessor(args.input_dir, args.output_dir)
    
    if args.test:
        # Test mode - just show stats
        stats = processor.get_ocr_stats()
        print(f"OCR Statistics:")
        print(f"  Input files found: {stats['input_files_count']}")
        print(f"  Output files: {stats['output_files_count']}")
        print(f"  Processing rate: {stats['processing_rate']:.2%}")
    elif args.single_file:
        # Process single file
        success = processor.process_single_image(args.single_file)
        if success:
            print(f"Successfully processed {args.single_file}")
        else:
            print(f"Failed to process {args.single_file}")
    else:
        # Run batch processing
        stats = processor.batch_process()
        print(f"OCR processing completed:")
        print(f"  Total files: {stats['total_files']}")
        print(f"  Processed: {stats['processed_count']}")
        print(f"  Errors: {stats['error_count']}")
        print(f"  Success rate: {stats['success_rate']:.2%}")


if __name__ == "__main__":
    main() 