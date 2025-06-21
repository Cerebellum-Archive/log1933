"""
PDF Aggregator

This module provides functionality to combine multiple images into a single PDF document.
It's designed for creating comprehensive PDFs from Ernest K Gann's 1933 logbook images
with proper ordering and formatting.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import re
import img2pdf
from PIL import Image
from typing import List, Optional, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PDFAggregator:
    """
    A class to handle PDF creation from multiple images.
    
    This aggregator combines images from various formats into a single PDF document,
    maintaining proper ordering and ensuring compatibility with OCR tools.
    """
    
    def __init__(self, input_dir: str = "data/png", output_file: str = "output/EKG_1933_Logbook.pdf"):
        """
        Initialize the PDF aggregator.
        
        Args:
            input_dir (str): Directory containing images to combine
            output_file (str): Path for the output PDF file
        """
        self.input_dir = input_dir
        self.output_file = output_file
        self._ensure_directories()
    
    def _ensure_directories(self) -> None:
        """Ensure input and output directories exist."""
        os.makedirs(self.input_dir, exist_ok=True)
        os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
    
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
    
    def validate_image(self, image_path: str) -> bool:
        """
        Validate that an image file can be processed.
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            bool: True if image is valid, False otherwise
        """
        try:
            with Image.open(image_path) as img:
                # Check if image can be opened
                img.verify()
            return True
        except Exception as e:
            logger.error(f"Invalid image file {image_path}: {e}")
            return False
    
    def prepare_image_for_pdf(self, image_path: str) -> Optional[str]:
        """
        Prepare an image for PDF conversion by ensuring proper format.
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            Optional[str]: Path to prepared image, or None if preparation failed
        """
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGB')
                
                # Create temporary file for converted image
                temp_path = image_path.replace('.png', '_temp.png').replace('.jpg', '_temp.jpg')
                img.save(temp_path, "PNG")
                
                return temp_path
                
        except Exception as e:
            logger.error(f"Error preparing image {image_path}: {e}")
            return None
    
    def get_image_files(self, extensions: List[str] = None) -> List[str]:
        """
        Get list of image files from the input directory.
        
        Args:
            extensions (List[str]): List of file extensions to include
            
        Returns:
            List[str]: List of image file paths
        """
        if extensions is None:
            extensions = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']
        
        image_files = []
        for file in os.listdir(self.input_dir):
            if any(file.lower().endswith(ext) for ext in extensions):
                image_path = os.path.join(self.input_dir, file)
                if self.validate_image(image_path):
                    image_files.append(image_path)
        
        # Sort files numerically
        image_files = self.sort_files_numerically(image_files)
        
        return image_files
    
    def create_pdf_from_images(self, image_paths: List[str], cleanup_temp: bool = True) -> Dict:
        """
        Create a PDF from a list of image paths.
        
        Args:
            image_paths (List[str]): List of image file paths
            cleanup_temp (bool): Whether to clean up temporary files
            
        Returns:
            Dict: PDF creation statistics
        """
        if not image_paths:
            logger.warning("No valid images found for PDF creation")
            return {
                'success': False,
                'error': 'No valid images found',
                'total_images': 0,
                'processed_images': 0
            }
        
        logger.info(f"Creating PDF from {len(image_paths)} images")
        
        # Prepare images for PDF conversion
        prepared_images = []
        temp_files = []
        
        for image_path in image_paths:
            prepared_path = self.prepare_image_for_pdf(image_path)
            if prepared_path:
                prepared_images.append(prepared_path)
                if prepared_path != image_path:
                    temp_files.append(prepared_path)
            else:
                logger.warning(f"Skipping invalid image: {image_path}")
        
        if not prepared_images:
            logger.error("No valid images could be prepared for PDF creation")
            return {
                'success': False,
                'error': 'No valid images could be prepared',
                'total_images': len(image_paths),
                'processed_images': 0
            }
        
        # Create PDF
        try:
            with open(self.output_file, "wb") as f:
                f.write(img2pdf.convert(prepared_images))
            
            logger.info(f"PDF created successfully: {self.output_file}")
            
            # Clean up temporary files
            if cleanup_temp:
                for temp_file in temp_files:
                    try:
                        os.remove(temp_file)
                    except Exception as e:
                        logger.warning(f"Could not remove temporary file {temp_file}: {e}")
            
            stats = {
                'success': True,
                'output_file': self.output_file,
                'total_images': len(image_paths),
                'processed_images': len(prepared_images),
                'file_size': os.path.getsize(self.output_file) if os.path.exists(self.output_file) else 0
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error creating PDF: {e}")
            
            # Clean up temporary files on error
            if cleanup_temp:
                for temp_file in temp_files:
                    try:
                        os.remove(temp_file)
                    except Exception:
                        pass
            
            return {
                'success': False,
                'error': str(e),
                'total_images': len(image_paths),
                'processed_images': len(prepared_images)
            }
    
    def batch_create_pdf(self, extensions: List[str] = None) -> Dict:
        """
        Create PDF from all images in the input directory.
        
        Args:
            extensions (List[str]): List of file extensions to include
            
        Returns:
            Dict: Batch processing statistics
        """
        # Get image files
        image_files = self.get_image_files(extensions)
        
        if not image_files:
            logger.warning("No image files found in input directory")
            return {
                'success': False,
                'error': 'No image files found',
                'total_images': 0,
                'processed_images': 0
            }
        
        logger.info(f"Found {len(image_files)} images to process")
        
        # Create PDF
        return self.create_pdf_from_images(image_files)
    
    def get_pdf_stats(self) -> Dict:
        """
        Get statistics about the PDF creation status.
        
        Returns:
            Dict: Statistics including file counts and PDF status
        """
        image_files = self.get_image_files()
        
        # Check if output PDF exists
        pdf_exists = os.path.exists(self.output_file)
        pdf_size = 0
        
        if pdf_exists:
            try:
                pdf_size = os.path.getsize(self.output_file)
            except Exception:
                pass
        
        return {
            'input_images_count': len(image_files),
            'pdf_exists': pdf_exists,
            'pdf_size': pdf_size,
            'processing_rate': 1.0 if pdf_exists and image_files else 0.0
        }
    
    def create_chapter_pdfs(self, output_dir: str = "output") -> Dict:
        """
        Create individual PDFs for each chapter/section.
        
        Args:
            output_dir (str): Directory to save chapter PDFs
            
        Returns:
            Dict: Chapter PDF creation statistics
        """
        # Get all image files
        all_images = self.get_image_files()
        
        if not all_images:
            logger.warning("No images found for chapter PDF creation")
            return {'chapters_created': 0, 'error': 'No images found'}
        
        # Group images by chapter (assuming naming convention)
        chapters = {}
        for image_path in all_images:
            filename = os.path.basename(image_path)
            # Extract chapter number from filename
            match = re.search(r'(\d+)', filename)
            if match:
                chapter_num = int(match.group(1))
                if chapter_num not in chapters:
                    chapters[chapter_num] = []
                chapters[chapter_num].append(image_path)
        
        # Create PDF for each chapter
        os.makedirs(output_dir, exist_ok=True)
        chapters_created = 0
        
        for chapter_num, chapter_images in chapters.items():
            # Sort images within chapter
            chapter_images = self.sort_files_numerically(chapter_images)
            
            # Create chapter PDF
            chapter_pdf = os.path.join(output_dir, f"chapter_{chapter_num:03d}.pdf")
            
            # Create temporary aggregator for this chapter
            temp_aggregator = PDFAggregator(
                input_dir="",  # Not used for this operation
                output_file=chapter_pdf
            )
            
            stats = temp_aggregator.create_pdf_from_images(chapter_images)
            
            if stats['success']:
                chapters_created += 1
                logger.info(f"Created chapter PDF: {chapter_pdf}")
            else:
                logger.error(f"Failed to create chapter PDF {chapter_pdf}: {stats.get('error', 'Unknown error')}")
        
        return {
            'chapters_created': chapters_created,
            'total_chapters': len(chapters),
            'output_directory': output_dir
        }


def main():
    """Main function to run the PDF aggregator."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Create PDF from multiple images")
    parser.add_argument("--input-dir", default="data/png", help="Input directory containing images")
    parser.add_argument("--output-file", default="output/EKG_1933_Logbook.pdf", help="Output PDF file")
    parser.add_argument("--extensions", nargs="+", default=[".png", ".jpg", ".jpeg"], help="Image extensions to include")
    parser.add_argument("--create-chapters", action="store_true", help="Create individual chapter PDFs")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Initialize aggregator
    aggregator = PDFAggregator(args.input_dir, args.output_file)
    
    if args.test:
        # Test mode - just show stats
        stats = aggregator.get_pdf_stats()
        print(f"PDF Aggregation Statistics:")
        print(f"  Input images found: {stats['input_images_count']}")
        print(f"  PDF exists: {stats['pdf_exists']}")
        if stats['pdf_exists']:
            print(f"  PDF size: {stats['pdf_size']} bytes")
        print(f"  Processing rate: {stats['processing_rate']:.2%}")
    else:
        # Create PDF
        stats = aggregator.batch_create_pdf(args.extensions)
        
        if stats['success']:
            print(f"PDF creation completed:")
            print(f"  Output file: {stats['output_file']}")
            print(f"  Total images: {stats['total_images']}")
            print(f"  Processed images: {stats['processed_images']}")
            print(f"  File size: {stats['file_size']} bytes")
        else:
            print(f"PDF creation failed: {stats.get('error', 'Unknown error')}")
        
        if args.create_chapters:
            chapter_stats = aggregator.create_chapter_pdfs()
            print(f"Chapter PDFs:")
            print(f"  Chapters created: {chapter_stats['chapters_created']}")
            print(f"  Total chapters: {chapter_stats['total_chapters']}")
            print(f"  Output directory: {chapter_stats['output_directory']}")


if __name__ == "__main__":
    main() 