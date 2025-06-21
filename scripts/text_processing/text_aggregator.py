"""
Text Aggregator

This module provides functionality to aggregate multiple text files into a single
document. It's designed for combining OCR-extracted text from Ernest K Gann's
1933 logbook into a cohesive narrative.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import re
from typing import List, Optional, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TextAggregator:
    """
    A class to handle text aggregation and organization.
    
    This aggregator combines multiple text files into a single document,
    maintaining proper ordering and formatting for historical documents.
    """
    
    def __init__(self, input_dir: str = "data/text_output", output_file: str = "output/full_text.txt"):
        """
        Initialize the text aggregator.
        
        Args:
            input_dir (str): Directory containing text files to aggregate
            output_file (str): Path for the output aggregated text file
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
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize text content.
        
        Args:
            text (str): Raw text to clean
            
        Returns:
            str: Cleaned text
        """
        # Replace double newline characters with a single newline
        text = text.replace('\n\n', '\n')
        
        # Use a regular expression to replace multiple spaces with a single space
        text = re.sub(' +', ' ', text)
        
        # Remove excessive line breaks
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    def read_text_file(self, file_path: str) -> Optional[str]:
        """
        Read text content from a file.
        
        Args:
            file_path (str): Path to the text file
            
        Returns:
            Optional[str]: File content, or None if reading failed
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            return None
    
    def aggregate_text_files(self, separator: str = '\n\n') -> Dict:
        """
        Aggregate all text files in the input directory.
        
        Args:
            separator (str): Separator to use between files
            
        Returns:
            Dict: Aggregation statistics
        """
        # Get list of text files
        text_files = []
        for file in os.listdir(self.input_dir):
            if file.lower().endswith('.txt'):
                text_files.append(file)
        
        if not text_files:
            logger.warning("No text files found in input directory")
            return {
                'total_files': 0,
                'processed_files': 0,
                'error_count': 0,
                'total_characters': 0,
                'output_file': self.output_file
            }
        
        # Sort files numerically
        text_files = self.sort_files_numerically(text_files)
        logger.info(f"Found {len(text_files)} text files to aggregate")
        
        # Process each file
        aggregated_text = ''
        processed_count = 0
        error_count = 0
        total_characters = 0
        
        for text_file in text_files:
            file_path = os.path.join(self.input_dir, text_file)
            logger.info(f"Processing: {text_file}")
            
            # Read and clean text
            text_content = self.read_text_file(file_path)
            
            if text_content is not None:
                # Clean the text
                cleaned_text = self.clean_text(text_content)
                
                # Add to aggregated text
                if aggregated_text:
                    aggregated_text += separator + cleaned_text
                else:
                    aggregated_text = cleaned_text
                
                processed_count += 1
                total_characters += len(cleaned_text)
                logger.info(f"Added {len(cleaned_text)} characters from {text_file}")
            else:
                error_count += 1
        
        # Save aggregated text
        try:
            with open(self.output_file, 'w', encoding='utf-8') as f:
                f.write(aggregated_text)
            logger.info(f"Aggregated text saved to {self.output_file}")
        except Exception as e:
            logger.error(f"Error saving aggregated text: {e}")
            error_count += 1
        
        stats = {
            'total_files': len(text_files),
            'processed_files': processed_count,
            'error_count': error_count,
            'total_characters': total_characters,
            'output_file': self.output_file,
            'success_rate': processed_count / len(text_files) if text_files else 0
        }
        
        logger.info(f"Text aggregation completed: {processed_count}/{len(text_files)} files processed successfully")
        return stats
    
    def get_aggregation_stats(self) -> Dict:
        """
        Get statistics about the text aggregation status.
        
        Returns:
            Dict: Statistics including file counts and processing status
        """
        input_files = []
        
        # Count input files
        if os.path.exists(self.input_dir):
            for file in os.listdir(self.input_dir):
                if file.lower().endswith('.txt'):
                    input_files.append(file)
        
        # Check if output file exists
        output_exists = os.path.exists(self.output_file)
        output_size = 0
        
        if output_exists:
            try:
                output_size = os.path.getsize(self.output_file)
            except Exception:
                pass
        
        return {
            'input_files_count': len(input_files),
            'output_file_exists': output_exists,
            'output_file_size': output_size,
            'processing_rate': 1.0 if output_exists and input_files else 0.0
        }
    
    def create_chapter_breakdown(self, output_dir: str = "output") -> Dict:
        """
        Create individual chapter files from the aggregated text.
        
        Args:
            output_dir (str): Directory to save chapter files
            
        Returns:
            Dict: Chapter breakdown statistics
        """
        # Read aggregated text
        if not os.path.exists(self.output_file):
            logger.error("Aggregated text file not found")
            return {'chapters_created': 0, 'error': 'No aggregated text file'}
        
        try:
            with open(self.output_file, 'r', encoding='utf-8') as f:
                full_text = f.read()
        except Exception as e:
            logger.error(f"Error reading aggregated text: {e}")
            return {'chapters_created': 0, 'error': str(e)}
        
        # Split into chapters (assuming each file is a chapter)
        text_files = []
        for file in os.listdir(self.input_dir):
            if file.lower().endswith('.txt'):
                text_files.append(file)
        
        text_files = self.sort_files_numerically(text_files)
        
        # Create chapter files
        os.makedirs(output_dir, exist_ok=True)
        chapters_created = 0
        
        for i, text_file in enumerate(text_files, 1):
            file_path = os.path.join(self.input_dir, text_file)
            text_content = self.read_text_file(file_path)
            
            if text_content is not None:
                cleaned_text = self.clean_text(text_content)
                chapter_filename = f"chapter_{i:03d}_{os.path.splitext(text_file)[0]}.txt"
                chapter_path = os.path.join(output_dir, chapter_filename)
                
                try:
                    with open(chapter_path, 'w', encoding='utf-8') as f:
                        f.write(cleaned_text)
                    chapters_created += 1
                    logger.info(f"Created chapter file: {chapter_filename}")
                except Exception as e:
                    logger.error(f"Error creating chapter file {chapter_filename}: {e}")
        
        return {
            'chapters_created': chapters_created,
            'total_chapters': len(text_files),
            'output_directory': output_dir
        }


def main():
    """Main function to run the text aggregator."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Aggregate text files into a single document")
    parser.add_argument("--input-dir", default="data/text_output", help="Input directory containing text files")
    parser.add_argument("--output-file", default="output/full_text.txt", help="Output file for aggregated text")
    parser.add_argument("--separator", default="\n\n", help="Separator between files")
    parser.add_argument("--create-chapters", action="store_true", help="Create individual chapter files")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Initialize aggregator
    aggregator = TextAggregator(args.input_dir, args.output_file)
    
    if args.test:
        # Test mode - just show stats
        stats = aggregator.get_aggregation_stats()
        print(f"Text Aggregation Statistics:")
        print(f"  Input files found: {stats['input_files_count']}")
        print(f"  Output file exists: {stats['output_file_exists']}")
        if stats['output_file_exists']:
            print(f"  Output file size: {stats['output_file_size']} bytes")
        print(f"  Processing rate: {stats['processing_rate']:.2%}")
    else:
        # Run aggregation
        stats = aggregator.aggregate_text_files(args.separator)
        print(f"Text aggregation completed:")
        print(f"  Total files: {stats['total_files']}")
        print(f"  Processed: {stats['processed_files']}")
        print(f"  Errors: {stats['error_count']}")
        print(f"  Total characters: {stats['total_characters']}")
        print(f"  Success rate: {stats['success_rate']:.2%}")
        print(f"  Output file: {stats['output_file']}")
        
        if args.create_chapters:
            chapter_stats = aggregator.create_chapter_breakdown()
            print(f"Chapter breakdown:")
            print(f"  Chapters created: {chapter_stats['chapters_created']}")
            print(f"  Total chapters: {chapter_stats['total_chapters']}")
            print(f"  Output directory: {chapter_stats['output_directory']}")


if __name__ == "__main__":
    main() 