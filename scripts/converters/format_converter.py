"""
Image Format Converter

This module provides functionality to convert images between various formats (HEIC, JPEG, PNG)
and organize them into a standardized directory structure. It's designed for processing
Ernest K Gann's 1933 logbook images.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import shutil
import pyheif
from PIL import Image
from typing import List, Optional, Tuple
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ImageFormatConverter:
    """
    A class to handle image format conversion and directory organization.
    
    This converter supports HEIC, JPEG, and PNG formats and can organize
    files into a standardized directory structure for further processing.
    """
    
    def __init__(self, source_dir: str = "logbook1933", target_dir: str = "data/jpeg"):
        """
        Initialize the format converter.
        
        Args:
            source_dir (str): Source directory containing mixed format images
            target_dir (str): Target directory for organized JPEG files
        """
        self.source_dir = source_dir
        self.target_dir = target_dir
        self._ensure_directories()
    
    def _ensure_directories(self) -> None:
        """Ensure target directory exists."""
        os.makedirs(self.target_dir, exist_ok=True)
    
    def convert_heic_to_jpeg(self, heic_file_path: str, jpeg_file_path: str) -> bool:
        """
        Convert a single HEIC file to JPEG format.
        
        Args:
            heic_file_path (str): Path to the HEIC file
            jpeg_file_path (str): Path for the output JPEG file
            
        Returns:
            bool: True if conversion successful, False otherwise
        """
        try:
            # Read the HEIC file
            heif_file = pyheif.read(heic_file_path)
            
            # Convert to PIL Image
            image = Image.frombytes(
                heif_file.mode,
                heif_file.size,
                heif_file.data,
                "raw",
                heif_file.mode,
                heif_file.stride,
            )
            
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'LA'):
                image = image.convert('RGB')
            
            # Save as JPEG
            image.save(jpeg_file_path, format="JPEG", quality=95)
            logger.info(f"Converted {heic_file_path} to {jpeg_file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error converting {heic_file_path}: {e}")
            return False
    
    def copy_jpeg_file(self, source_path: str, target_path: str) -> bool:
        """
        Copy a JPEG file to the target directory.
        
        Args:
            source_path (str): Source JPEG file path
            target_path (str): Target JPEG file path
            
        Returns:
            bool: True if copy successful, False otherwise
        """
        try:
            shutil.copy2(source_path, target_path)
            logger.info(f"Copied {source_path} to {target_path}")
            return True
        except Exception as e:
            logger.error(f"Error copying {source_path}: {e}")
            return False
    
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
    
    def process_directory(self, recursive: bool = True) -> dict:
        """
        Process all images in the source directory.
        
        Args:
            recursive (bool): Whether to search subdirectories recursively
            
        Returns:
            dict: Processing statistics
        """
        processed_files = []
        heic_conversions = 0
        jpeg_copies = 0
        errors = 0
        
        if recursive:
            # Walk through all subdirectories
            for root, dirs, files in os.walk(self.source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    
                    if file.lower().endswith('.heic'):
                        # Convert HEIC to JPEG
                        jpeg_filename = os.path.splitext(file)[0] + '.jpg'
                        jpeg_path = os.path.join(self.target_dir, jpeg_filename)
                        
                        if self.convert_heic_to_jpeg(file_path, jpeg_path):
                            processed_files.append(jpeg_path)
                            heic_conversions += 1
                        else:
                            errors += 1
                    
                    elif file.lower().endswith(('.jpg', '.jpeg')):
                        # Copy JPEG files directly
                        jpeg_path = os.path.join(self.target_dir, file)
                        
                        if self.copy_jpeg_file(file_path, jpeg_path):
                            processed_files.append(jpeg_path)
                            jpeg_copies += 1
                        else:
                            errors += 1
        else:
            # Process only files in the source directory
            for file in os.listdir(self.source_dir):
                file_path = os.path.join(self.source_dir, file)
                
                if file.lower().endswith('.heic'):
                    # Convert HEIC to JPEG
                    jpeg_filename = os.path.splitext(file)[0] + '.jpg'
                    jpeg_path = os.path.join(self.target_dir, jpeg_filename)
                    
                    if self.convert_heic_to_jpeg(file_path, jpeg_path):
                        processed_files.append(jpeg_path)
                        heic_conversions += 1
                    else:
                        errors += 1
                
                elif file.lower().endswith(('.jpg', '.jpeg')):
                    # Copy JPEG files directly
                    jpeg_path = os.path.join(self.target_dir, file)
                    
                    if self.copy_jpeg_file(file_path, jpeg_path):
                        processed_files.append(jpeg_path)
                        jpeg_copies += 1
                    else:
                        errors += 1
        
        # Sort processed files numerically
        processed_files = self.sort_files_numerically(processed_files)
        
        stats = {
            'total_processed': len(processed_files),
            'heic_conversions': heic_conversions,
            'jpeg_copies': jpeg_copies,
            'errors': errors,
            'processed_files': processed_files
        }
        
        logger.info(f"Processing completed: {stats['total_processed']} files processed")
        return stats
    
    def get_processing_stats(self) -> dict:
        """
        Get statistics about the processing status.
        
        Returns:
            dict: Statistics including file counts and types
        """
        source_files = []
        target_files = []
        
        # Count source files
        for root, dirs, files in os.walk(self.source_dir):
            for file in files:
                if file.lower().endswith(('.heic', '.jpg', '.jpeg')):
                    source_files.append(os.path.join(root, file))
        
        # Count target files
        if os.path.exists(self.target_dir):
            for file in os.listdir(self.target_dir):
                if file.lower().endswith(('.jpg', '.jpeg')):
                    target_files.append(os.path.join(self.target_dir, file))
        
        return {
            'source_files_count': len(source_files),
            'target_files_count': len(target_files),
            'processing_rate': len(target_files) / len(source_files) if source_files else 0
        }


def main():
    """Main function to run the format converter."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Convert and organize image files")
    parser.add_argument("--source-dir", default="logbook1933", help="Source directory containing images")
    parser.add_argument("--target-dir", default="data/jpeg", help="Target directory for JPEG files")
    parser.add_argument("--recursive", action="store_true", help="Search subdirectories recursively")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Initialize converter
    converter = ImageFormatConverter(args.source_dir, args.target_dir)
    
    if args.test:
        # Test mode - just show stats
        stats = converter.get_processing_stats()
        print(f"Processing Statistics:")
        print(f"  Source files found: {stats['source_files_count']}")
        print(f"  Target files: {stats['target_files_count']}")
        print(f"  Processing rate: {stats['processing_rate']:.2%}")
    else:
        # Run processing
        stats = converter.process_directory(args.recursive)
        print(f"Processing completed:")
        print(f"  Total processed: {stats['total_processed']}")
        print(f"  HEIC conversions: {stats['heic_conversions']}")
        print(f"  JPEG copies: {stats['jpeg_copies']}")
        print(f"  Errors: {stats['errors']}")


if __name__ == "__main__":
    main() 