"""
HEIC to PNG/JPEG Converter

This module provides functionality to convert HEIC image files to PNG or JPEG format.
It's specifically designed for processing Ernest K Gann's 1933 logbook images.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import pyheif
from PIL import Image
from typing import Optional, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HEICConverter:
    """
    A class to handle HEIC image conversion to various formats.
    
    This converter is specifically designed for processing historical documents
    and preserves image quality while ensuring compatibility with OCR tools.
    """
    
    def __init__(self, input_dir: str = "data/heic", output_dir: str = "data/png"):
        """
        Initialize the HEIC converter.
        
        Args:
            input_dir (str): Directory containing HEIC files
            output_dir (str): Directory to save converted files
        """
        self.input_dir = input_dir
        self.output_dir = output_dir
        self._ensure_directories()
    
    def _ensure_directories(self) -> None:
        """Ensure input and output directories exist."""
        os.makedirs(self.input_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
    
    def convert_single_file(self, heic_file_path: str, output_format: str = "PNG") -> Optional[str]:
        """
        Convert a single HEIC file to the specified format.
        
        Args:
            heic_file_path (str): Path to the HEIC file
            output_format (str): Output format ("PNG" or "JPEG")
            
        Returns:
            Optional[str]: Path to the converted file, or None if conversion failed
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
            
            # Convert to RGB if necessary for JPEG
            if output_format.upper() == "JPEG" and image.mode in ('RGBA', 'LA'):
                image = image.convert('RGB')
            
            # Generate output filename
            base_name = os.path.splitext(os.path.basename(heic_file_path))[0]
            output_filename = f"{base_name}.{output_format.lower()}"
            output_path = os.path.join(self.output_dir, output_filename)
            
            # Save the converted image
            image.save(output_path, format=output_format)
            logger.info(f"Converted {heic_file_path} to {output_path}")
            
            return output_path
            
        except Exception as e:
            logger.error(f"Error converting {heic_file_path}: {e}")
            return None
    
    def batch_convert(self, output_format: str = "PNG", recursive: bool = True) -> list:
        """
        Convert all HEIC files in the input directory.
        
        Args:
            output_format (str): Output format ("PNG" or "JPEG")
            recursive (bool): Whether to search subdirectories recursively
            
        Returns:
            list: List of successfully converted file paths
        """
        converted_files = []
        
        if recursive:
            # Walk through all subdirectories
            for root, dirs, files in os.walk(self.input_dir):
                for file in files:
                    if file.lower().endswith('.heic'):
                        heic_path = os.path.join(root, file)
                        converted_path = self.convert_single_file(heic_path, output_format)
                        if converted_path:
                            converted_files.append(converted_path)
        else:
            # Process only files in the input directory
            for file in os.listdir(self.input_dir):
                if file.lower().endswith('.heic'):
                    heic_path = os.path.join(self.input_dir, file)
                    converted_path = self.convert_single_file(heic_path, output_format)
                    if converted_path:
                        converted_files.append(converted_path)
        
        logger.info(f"Successfully converted {len(converted_files)} files")
        return converted_files
    
    def get_conversion_stats(self) -> dict:
        """
        Get statistics about the conversion process.
        
        Returns:
            dict: Statistics including file counts and sizes
        """
        heic_files = []
        converted_files = []
        
        # Count HEIC files
        for root, dirs, files in os.walk(self.input_dir):
            for file in files:
                if file.lower().endswith('.heic'):
                    heic_files.append(os.path.join(root, file))
        
        # Count converted files
        for root, dirs, files in os.walk(self.output_dir):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    converted_files.append(os.path.join(root, file))
        
        return {
            'heic_files_count': len(heic_files),
            'converted_files_count': len(converted_files),
            'conversion_rate': len(converted_files) / len(heic_files) if heic_files else 0
        }


def main():
    """Main function to run the HEIC converter."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Convert HEIC files to PNG/JPEG format")
    parser.add_argument("--input-dir", default="data/heic", help="Input directory containing HEIC files")
    parser.add_argument("--output-dir", default="data/png", help="Output directory for converted files")
    parser.add_argument("--format", choices=["PNG", "JPEG"], default="PNG", help="Output format")
    parser.add_argument("--recursive", action="store_true", help="Search subdirectories recursively")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Initialize converter
    converter = HEICConverter(args.input_dir, args.output_dir)
    
    if args.test:
        # Test mode - just show stats
        stats = converter.get_conversion_stats()
        print(f"Conversion Statistics:")
        print(f"  HEIC files found: {stats['heic_files_count']}")
        print(f"  Converted files: {stats['converted_files_count']}")
        print(f"  Conversion rate: {stats['conversion_rate']:.2%}")
    else:
        # Run conversion
        converted_files = converter.batch_convert(args.format, args.recursive)
        print(f"Conversion completed. {len(converted_files)} files converted.")


if __name__ == "__main__":
    main() 