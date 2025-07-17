"""
Advanced Spell Checker

This module provides advanced spell checking functionality for historical documents.
It's specifically designed for processing Ernest K Gann's 1933 logbook with aviation
terminology and historical context awareness.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import re
from spellchecker import SpellChecker
from typing import List, Dict, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AdvancedSpellChecker:
    """
    A class to handle advanced spell checking with domain-specific knowledge.
    
    This spell checker is designed for historical aviation documents and includes
    custom dictionaries for aviation terminology and historical context.
    """
    
    def __init__(self, custom_words: List[str] = None):
        """
        Initialize the advanced spell checker.
        
        Args:
            custom_words (List[str]): List of custom words to add to dictionary
        """
        self.spell_checker = SpellChecker()
        self._setup_custom_dictionary(custom_words)
        self._setup_aviation_terms()
    
    def _setup_custom_dictionary(self, custom_words: List[str] = None) -> None:
        """
        Setup custom dictionary with domain-specific words.
        
        Args:
            custom_words (List[str]): List of custom words to add
        """
        if custom_words is None:
            custom_words = []
        
        # Add custom words to the spell checker
        for word in custom_words:
            self.spell_checker.word_frequency.load_words([word])
        
        logger.info(f"Added {len(custom_words)} custom words to dictionary")
    
    def _setup_aviation_terms(self) -> None:
        """Setup aviation-specific terminology."""
        aviation_terms = [
            # Aircraft types
            'biplane', 'monoplane', 'airliner', 'fighter', 'bomber', 'transport',
            'seaplane', 'flying_boat', 'amphibian', 'glider', 'helicopter',
            
            # Aviation equipment
            'altimeter', 'airspeed', 'compass', 'gyroscope', 'radio', 'transponder',
            'landing_gear', 'propeller', 'rudder', 'aileron', 'elevator', 'flaps',
            
            # Weather terms
            'ceiling', 'visibility', 'turbulence', 'crosswind', 'headwind', 'tailwind',
            'downdraft', 'updraft', 'icing', 'fog', 'mist', 'overcast',
            
            # Navigation terms
            'heading', 'bearing', 'course', 'waypoint', 'beacon', 'navaid',
            'VOR', 'ILS', 'NDB', 'GPS', 'dead_reckoning',
            
            # Flight operations
            'takeoff', 'landing', 'approach', 'departure', 'cruise', 'climb',
            'descent', 'pattern', 'runway', 'taxiway', 'hangar', 'maintenance',
            
            # Historical aviation terms (1930s)
            'aerodrome', 'aeroplane', 'airship', 'zeppelin', 'biplane', 'monoplane',
            'flying_field', 'air_mail', 'barnstormer', 'wing_walker', 'stunt_pilot',
            
            # Ernest K Gann specific terms
            'gann', 'ernest', 'logbook', 'flight_log', 'pilot_log', 'aviation_log'
        ]
        
        # Add aviation terms to the spell checker
        for term in aviation_terms:
            self.spell_checker.word_frequency.load_words([term])
        
        logger.info(f"Added {len(aviation_terms)} aviation terms to dictionary")
    
    def should_skip_word(self, word: str) -> bool:
        """
        Determine if a word should be skipped during spell checking.
        
        Args:
            word (str): Word to check
            
        Returns:
            bool: True if word should be skipped
        """
        # Skip words with numbers
        if re.search(r'[0-9]', word):
            return True
        
        # Skip words with special characters (except hyphens and apostrophes)
        if re.search(r'[^a-zA-Z\'-]', word):
            return True
        
        # Skip very short words
        if len(word) <= 2:
            return True
        
        # Skip common abbreviations
        abbreviations = ['mph', 'kts', 'ft', 'm', 'km', 'nm', 'alt', 'hdg', 'spd']
        if word.lower() in abbreviations:
            return True
        
        return False
    
    def correct_text(self, text: str, preserve_case: bool = True) -> str:
        """
        Correct spelling errors in text while preserving context.
        
        Args:
            text (str): Text to correct
            preserve_case (bool): Whether to preserve original case
            
        Returns:
            str: Corrected text
        """
        words = text.split()
        corrected_words = []
        
        for word in words:
            if self.should_skip_word(word):
                corrected_words.append(word)
                continue
            
            # Get correction
            correction = self.spell_checker.correction(word)
            
            if correction is not None:
                # Preserve case if requested
                if preserve_case:
                    if word.isupper():
                        correction = correction.upper()
                    elif word.istitle():
                        correction = correction.title()
                    elif word.islower():
                        correction = correction.lower()
                
                corrected_words.append(correction)
            else:
                corrected_words.append(word)
        
        return ' '.join(corrected_words)
    
    def get_misspelled_words(self, text: str) -> List[str]:
        """
        Get list of misspelled words in text.
        
        Args:
            text (str): Text to analyze
            
        Returns:
            List[str]: List of misspelled words
        """
        words = text.split()
        misspelled = []
        
        for word in words:
            if not self.should_skip_word(word):
                if word.lower() in self.spell_checker:
                    continue
                misspelled.append(word)
        
        return misspelled
    
    def calculate_accuracy(self, text: str) -> float:
        """
        Calculate spelling accuracy percentage.
        
        Args:
            text (str): Text to analyze
            
        Returns:
            float: Accuracy score between 0 and 1
        """
        words = text.split()
        if not words:
            return 0.0
        
        checkable_words = [word for word in words if not self.should_skip_word(word)]
        if not checkable_words:
            return 1.0
        
        misspelled = self.get_misspelled_words(text)
        correct_count = len(checkable_words) - len(misspelled)
        
        return correct_count / len(checkable_words)
    
    def process_file(self, input_file: str, output_file: str) -> Dict:
        """
        Process a single text file for spell checking.
        
        Args:
            input_file (str): Path to input text file
            output_file (str): Path to output corrected file
            
        Returns:
            Dict: Processing statistics
        """
        try:
            # Read input file
            with open(input_file, 'r', encoding='utf-8') as f:
                text = f.read()
            
            # Get original statistics
            original_words = text.split()
            original_misspelled = self.get_misspelled_words(text)
            original_accuracy = self.calculate_accuracy(text)
            
            # Correct text
            corrected_text = self.correct_text(text)
            
            # Get corrected statistics
            corrected_words = corrected_text.split()
            corrected_misspelled = self.get_misspelled_words(corrected_text)
            corrected_accuracy = self.calculate_accuracy(corrected_text)
            
            # Save corrected text
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(corrected_text)
            
            stats = {
                'input_file': input_file,
                'output_file': output_file,
                'original_words': len(original_words),
                'original_misspelled': len(original_misspelled),
                'original_accuracy': original_accuracy,
                'corrected_words': len(corrected_words),
                'corrected_misspelled': len(corrected_misspelled),
                'corrected_accuracy': corrected_accuracy,
                'improvement': corrected_accuracy - original_accuracy,
                'words_corrected': len(original_misspelled) - len(corrected_misspelled)
            }
            
            logger.info(f"Processed {input_file}: {stats['words_corrected']} words corrected")
            return stats
            
        except Exception as e:
            logger.error(f"Error processing file {input_file}: {e}")
            return {
                'input_file': input_file,
                'error': str(e),
                'success': False
            }
    
    def batch_process(self, input_dir: str, output_dir: str) -> Dict:
        """
        Process all text files in a directory.
        
        Args:
            input_dir (str): Input directory containing text files
            output_dir (str): Output directory for corrected files
            
        Returns:
            Dict: Batch processing statistics
        """
        os.makedirs(output_dir, exist_ok=True)
        
        # Get list of text files
        text_files = []
        for file in os.listdir(input_dir):
            if file.lower().endswith('.txt'):
                text_files.append(file)
        
        if not text_files:
            logger.warning("No text files found in input directory")
            return {
                'total_files': 0,
                'processed_files': 0,
                'error_count': 0,
                'total_improvement': 0.0
            }
        
        # Process each file
        processed_count = 0
        error_count = 0
        total_improvement = 0.0
        file_stats = []
        
        for text_file in text_files:
            input_path = os.path.join(input_dir, text_file)
            output_path = os.path.join(output_dir, text_file)
            
            stats = self.process_file(input_path, output_path)
            
            if stats.get('success', True):  # Default to True for backward compatibility
                processed_count += 1
                total_improvement += stats.get('improvement', 0.0)
                file_stats.append(stats)
            else:
                error_count += 1
        
        batch_stats = {
            'total_files': len(text_files),
            'processed_files': processed_count,
            'error_count': error_count,
            'total_improvement': total_improvement,
            'average_improvement': total_improvement / processed_count if processed_count > 0 else 0.0,
            'file_stats': file_stats
        }
        
        logger.info(f"Batch processing completed: {processed_count}/{len(text_files)} files processed successfully")
        return batch_stats


def main():
    """Main function to run the spell checker."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Advanced spell checking for historical documents")
    parser.add_argument("--input-file", help="Single input text file to process")
    parser.add_argument("--output-file", help="Output file for corrected text")
    parser.add_argument("--input-dir", default="data/text_output", help="Input directory containing text files")
    parser.add_argument("--output-dir", default="output", help="Output directory for corrected files")
    parser.add_argument("--batch", action="store_true", help="Process all files in input directory")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Initialize spell checker
    spell_checker = AdvancedSpellChecker()
    
    if args.test:
        # Test mode - analyze a sample text
        test_text = "The pilot flew the aeroplane at 5000 feet altitude. The weather was clowdy with poor visibilty."
        misspelled = spell_checker.get_misspelled_words(test_text)
        accuracy = spell_checker.calculate_accuracy(test_text)
        corrected = spell_checker.correct_text(test_text)
        
        print(f"Test Results:")
        print(f"  Original text: {test_text}")
        print(f"  Misspelled words: {misspelled}")
        print(f"  Accuracy: {accuracy:.2%}")
        print(f"  Corrected text: {corrected}")
        
    elif args.input_file:
        # Process single file
        if not args.output_file:
            args.output_file = args.input_file.replace('.txt', '_corrected.txt')
        
        stats = spell_checker.process_file(args.input_file, args.output_file)
        if stats.get('success', True):
            print(f"Spell checking completed:")
            print(f"  Input file: {stats['input_file']}")
            print(f"  Output file: {stats['output_file']}")
            print(f"  Words corrected: {stats['words_corrected']}")
            print(f"  Accuracy improvement: {stats['improvement']:.2%}")
        else:
            print(f"Error processing file: {stats.get('error', 'Unknown error')}")
            
    elif args.batch:
        # Batch processing
        stats = spell_checker.batch_process(args.input_dir, args.output_dir)
        print(f"Batch spell checking completed:")
        print(f"  Total files: {stats['total_files']}")
        print(f"  Processed: {stats['processed_files']}")
        print(f"  Errors: {stats['error_count']}")
        print(f"  Average improvement: {stats['average_improvement']:.2%}")
        
    else:
        print("Please specify --input-file or --batch mode")


if __name__ == "__main__":
    main() 