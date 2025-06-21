#!/usr/bin/env python3
"""
Setup Script for Ernest K Gann Digital Archive Project

This script automates the initial setup of the project environment,
including directory creation, dependency checking, and configuration.

Author: Ernest K Gann Digital Archive Project
Date: 2024
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ProjectSetup:
    """Handles the setup and configuration of the Ernest K Gann project."""
    
    def __init__(self):
        """Initialize the setup process."""
        self.project_root = Path.cwd()
        self.required_dirs = [
            'data/heic',
            'data/jpeg', 
            'data/png',
            'data/text_output',
            'output',
            'docs',
            'scripts/converters',
            'scripts/ocr',
            'scripts/text_processing',
            'scripts/aggregation'
        ]
        
        self.required_files = [
            'requirements.txt',
            'README.md',
            '.gitignore'
        ]
    
    def check_python_version(self) -> bool:
        """Check if Python version meets requirements."""
        if sys.version_info < (3, 8):
            logger.error("Python 3.8 or higher is required")
            return False
        
        logger.info(f"Python version: {sys.version}")
        return True
    
    def check_system_dependencies(self) -> bool:
        """Check if required system dependencies are installed."""
        dependencies = {
            'tesseract': 'tesseract --version',
            'ghostscript': 'gs --version'
        }
        
        missing_deps = []
        
        for dep, command in dependencies.items():
            try:
                result = subprocess.run(command.split(), capture_output=True, text=True)
                if result.returncode == 0:
                    logger.info(f"✓ {dep} is installed")
                else:
                    missing_deps.append(dep)
            except FileNotFoundError:
                missing_deps.append(dep)
        
        if missing_deps:
            logger.warning(f"Missing system dependencies: {', '.join(missing_deps)}")
            logger.info("Please install missing dependencies:")
            logger.info("  macOS: brew install tesseract ghostscript")
            logger.info("  Ubuntu: sudo apt-get install tesseract-ocr ghostscript")
            logger.info("  Windows: Download from official websites")
            return False
        
        return True
    
    def create_directories(self) -> bool:
        """Create required project directories."""
        logger.info("Creating project directories...")
        
        for dir_path in self.required_dirs:
            full_path = self.project_root / dir_path
            try:
                full_path.mkdir(parents=True, exist_ok=True)
                logger.info(f"✓ Created directory: {dir_path}")
            except Exception as e:
                logger.error(f"Failed to create directory {dir_path}: {e}")
                return False
        
        return True
    
    def check_required_files(self) -> bool:
        """Check if required project files exist."""
        logger.info("Checking required project files...")
        
        missing_files = []
        for file_path in self.required_files:
            if not (self.project_root / file_path).exists():
                missing_files.append(file_path)
            else:
                logger.info(f"✓ Found file: {file_path}")
        
        if missing_files:
            logger.warning(f"Missing required files: {', '.join(missing_files)}")
            return False
        
        return True
    
    def install_python_dependencies(self) -> bool:
        """Install Python dependencies from requirements.txt."""
        logger.info("Installing Python dependencies...")
        
        try:
            result = subprocess.run([
                sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✓ Python dependencies installed successfully")
                return True
            else:
                logger.error(f"Failed to install dependencies: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Error installing dependencies: {e}")
            return False
    
    def create_env_file(self) -> bool:
        """Create .env file template if it doesn't exist."""
        env_file = self.project_root / '.env'
        
        if env_file.exists():
            logger.info("✓ .env file already exists")
            return True
        
        try:
            with open(env_file, 'w') as f:
                f.write("# Ernest K Gann Digital Archive - Environment Variables\n")
                f.write("# Add your API keys and configuration here\n\n")
                f.write("# OpenAI API key for AI enhancement features\n")
                f.write("# OPENAI_API_KEY=your_openai_api_key_here\n\n")
                f.write("# Add other environment variables as needed\n")
            
            logger.info("✓ Created .env file template")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create .env file: {e}")
            return False
    
    def test_installation(self) -> bool:
        """Test the installation by importing key modules."""
        logger.info("Testing installation...")
        
        test_modules = [
            'PIL',
            'pytesseract', 
            'pyheif',
            'img2pdf',
            'spellchecker'
        ]
        
        failed_modules = []
        
        for module in test_modules:
            try:
                __import__(module)
                logger.info(f"✓ {module} imported successfully")
            except ImportError as e:
                failed_modules.append(module)
                logger.error(f"✗ Failed to import {module}: {e}")
        
        if failed_modules:
            logger.error(f"Failed to import modules: {', '.join(failed_modules)}")
            return False
        
        return True
    
    def run_quick_tests(self) -> bool:
        """Run quick tests to verify functionality."""
        logger.info("Running quick functionality tests...")
        
        # Test Tesseract
        try:
            import pytesseract
            version = pytesseract.get_tesseract_version()
            logger.info(f"✓ Tesseract version: {version}")
        except Exception as e:
            logger.error(f"✗ Tesseract test failed: {e}")
            return False
        
        # Test image processing
        try:
            from PIL import Image
            # Create a simple test image
            test_img = Image.new('RGB', (100, 100), color='white')
            test_img.save('test_image.png')
            
            # Test OCR on the image
            text = pytesseract.image_to_string(test_img)
            logger.info("✓ OCR test completed")
            
            # Clean up
            os.remove('test_image.png')
            
        except Exception as e:
            logger.error(f"✗ Image processing test failed: {e}")
            return False
        
        return True
    
    def print_next_steps(self):
        """Print next steps for the user."""
        logger.info("\n" + "="*50)
        logger.info("SETUP COMPLETED SUCCESSFULLY!")
        logger.info("="*50)
        logger.info("\nNext steps:")
        logger.info("1. Place your HEIC image files in the 'data/heic/' directory")
        logger.info("2. Run the conversion workflow:")
        logger.info("   python scripts/converters/heic_converter.py")
        logger.info("   python scripts/ocr/basic_ocr.py")
        logger.info("   python scripts/text_processing/text_aggregator.py")
        logger.info("   python scripts/aggregation/pdf_aggregator.py")
        logger.info("\n3. For AI enhancement, add your OpenAI API key to .env file")
        logger.info("4. Check docs/SETUP.md for detailed usage instructions")
        logger.info("\nHappy processing!")
    
    def run_setup(self) -> bool:
        """Run the complete setup process."""
        logger.info("Starting Ernest K Gann Digital Archive setup...")
        
        # Check Python version
        if not self.check_python_version():
            return False
        
        # Check system dependencies
        if not self.check_system_dependencies():
            logger.warning("Continuing setup, but some features may not work")
        
        # Create directories
        if not self.create_directories():
            return False
        
        # Check required files
        if not self.check_required_files():
            return False
        
        # Install Python dependencies
        if not self.install_python_dependencies():
            return False
        
        # Create .env file
        if not self.create_env_file():
            return False
        
        # Test installation
        if not self.test_installation():
            return False
        
        # Run quick tests
        if not self.run_quick_tests():
            logger.warning("Some tests failed, but setup completed")
        
        # Print next steps
        self.print_next_steps()
        
        return True


def main():
    """Main function to run the setup."""
    setup = ProjectSetup()
    
    try:
        success = setup.run_setup()
        if success:
            logger.info("Setup completed successfully!")
            sys.exit(0)
        else:
            logger.error("Setup failed!")
            sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Setup interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error during setup: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 