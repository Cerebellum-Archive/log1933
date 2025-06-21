# Ernest K Gann Logbook 1933 - Setup Guide

This guide will help you set up the Ernest K Gann Digital Archive project for local development and processing.

## Prerequisites

### System Requirements
- **Operating System**: macOS, Linux, or Windows
- **Python**: 3.8 or higher
- **Memory**: At least 4GB RAM (8GB recommended for large document processing)
- **Storage**: At least 2GB free space for processing

### Required System Dependencies

#### macOS
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install system dependencies
brew install tesseract ghostscript
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-eng ghostscript
```

#### Windows
1. Download and install Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
2. Download and install Ghostscript from: https://www.ghostscript.com/download/gsdnld.html
3. Add both to your system PATH

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd log1933
```

### 2. Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Verify Installation
```bash
# Test Tesseract installation
python -c "import pytesseract; print('Tesseract version:', pytesseract.get_tesseract_version())"

# Test other dependencies
python -c "import PIL, pyheif, img2pdf; print('All dependencies installed successfully')"
```

## Configuration

### Environment Variables (Optional)
Create a `.env` file in the project root for API keys:
```bash
# OpenAI API key for AI enhancement features
OPENAI_API_KEY=your_openai_api_key_here
```

### Directory Structure Setup
The project expects the following directory structure:
```
log1933/
├── data/
│   ├── heic/          # Original HEIC files
│   ├── jpeg/          # JPEG converted files
│   ├── png/           # PNG converted files
│   └── text_output/   # Extracted text files
├── output/            # Generated PDFs and final documents
└── scripts/           # Processing scripts
```

## Usage Examples

### Basic Workflow

1. **Convert HEIC files to PNG**:
```bash
python scripts/converters/heic_converter.py --input-dir data/heic --output-dir data/png
```

2. **Extract text using OCR**:
```bash
python scripts/ocr/basic_ocr.py --input-dir data/png --output-dir data/text_output
```

3. **Aggregate text files**:
```bash
python scripts/text_processing/text_aggregator.py --input-dir data/text_output --output-file output/full_text.txt
```

4. **Create final PDF**:
```bash
python scripts/aggregation/pdf_aggregator.py --input-dir data/png --output-file output/EKG_1933_Logbook.pdf
```

### Advanced Workflow with AI Enhancement

1. **Smart OCR with AI enhancement**:
```bash
python scripts/ocr/smart_ocr.py --input-dir data/png --output-dir data/text_output --threshold 0.9
```

2. **Spell check and correct text**:
```bash
python scripts/text_processing/spell_checker.py --input-dir data/text_output --output-dir output --batch
```

### Testing

Run tests to verify everything is working:
```bash
# Test HEIC conversion
python scripts/converters/heic_converter.py --test

# Test OCR processing
python scripts/ocr/basic_ocr.py --test

# Test PDF aggregation
python scripts/aggregation/pdf_aggregator.py --test
```

## Troubleshooting

### Common Issues

#### Tesseract Not Found
**Error**: `TesseractNotFoundError: tesseract is not installed or it's not in your PATH`

**Solution**:
- Ensure Tesseract is installed: `brew install tesseract` (macOS) or `sudo apt-get install tesseract-ocr` (Ubuntu)
- Verify installation: `tesseract --version`
- Add to PATH if necessary

#### HEIC Conversion Issues
**Error**: `ModuleNotFoundError: No module named 'pyheif'`

**Solution**:
- Install pyheif: `pip install pyheif`
- On macOS, you may need: `brew install libheif`

#### Memory Issues
**Error**: `MemoryError` during large file processing

**Solution**:
- Process files in smaller batches
- Increase system memory
- Use lower resolution images

#### OpenAI API Issues
**Error**: `openai.error.AuthenticationError`

**Solution**:
- Verify your API key is correct
- Ensure you have sufficient API credits
- Check API key permissions

### Performance Optimization

#### For Large Document Sets
1. **Process in batches**: Use smaller input directories
2. **Use SSD storage**: Faster I/O for large files
3. **Increase memory**: 8GB+ RAM recommended
4. **Parallel processing**: Process multiple files simultaneously

#### For Better OCR Accuracy
1. **Image preprocessing**: Ensure high-quality scans
2. **Proper lighting**: Good contrast in original images
3. **Consistent orientation**: Align all images properly
4. **Use smart OCR**: Enable AI enhancement features

## Development

### Adding New Scripts
1. Place new scripts in appropriate subdirectories under `scripts/`
2. Follow the established naming conventions
3. Include proper documentation and error handling
4. Add new dependencies to `requirements.txt`

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Include docstrings for all functions
- Add logging for debugging

### Testing
```bash
# Run basic tests
python -m pytest tests/

# Run with coverage
python -m pytest --cov=scripts tests/
```

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the script documentation
3. Open an issue in the repository
4. Check the logs for detailed error messages

## License

This project is dedicated to preserving the legacy of Ernest K Gann and is available for educational and historical research purposes. 