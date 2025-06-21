# Ernest K Gann Logbook 1933 - Digital Archive

A comprehensive digital archive and processing pipeline for Ernest K Gann's 1933 logbook, featuring advanced OCR, text processing, and document conversion capabilities.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/License-Educational-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/yourusername/log1933)

## 📖 About Ernest K Gann

Ernest K Gann (1910-1991) was an American novelist and aviator whose works captured the romance and danger of early commercial aviation. His 1933 logbook contains valuable historical aviation records and personal accounts from the early days of commercial aviation. This project digitizes and preserves these documents for future generations.

## 🎯 Project Overview

This repository contains tools and scripts for:
- Converting various image formats (HEIC, JPEG, PNG) to PDF
- Advanced OCR processing with AI-powered text enhancement
- Text aggregation and spell checking with aviation terminology
- Document organization and archival

## 📁 Repository Structure

```
log1933/
├── scripts/                    # Python processing scripts
│   ├── converters/            # Image format conversion tools
│   │   ├── heic_converter.py  # HEIC to PNG/JPEG converter
│   │   └── format_converter.py # Multi-format image converter
│   ├── ocr/                   # OCR and text extraction tools
│   │   ├── basic_ocr.py       # Basic Tesseract OCR
│   │   └── smart_ocr.py       # AI-enhanced OCR with GPT
│   ├── text_processing/       # Text cleaning and enhancement
│   │   ├── text_aggregator.py # Text file aggregation
│   │   └── spell_checker.py   # Aviation-specific spell checking
│   ├── aggregation/           # Document aggregation tools
│   │   └── pdf_aggregator.py  # PDF creation from images
│   └── setup.py               # Automated project setup
├── data/                      # Data directories (empty in repo)
│   ├── heic/                  # Original HEIC files (add your files here)
│   ├── jpeg/                  # JPEG converted files
│   ├── png/                   # PNG converted files
│   └── text_output/           # Extracted text files
├── output/                    # Generated PDFs and final documents
├── docs/                      # Documentation and metadata
│   ├── SETUP.md              # Detailed setup guide
│   └── PROJECT_METADATA.md   # Historical context and project info
├── requirements.txt           # Python dependencies
├── .gitignore                # Git ignore rules
└── sample_logbook_entry.txt  # Sample content for demonstration
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Required system dependencies:
  - Tesseract OCR
  - Ghostscript (for PDF processing)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/log1933.git
cd log1933
```

2. **Run the automated setup:**
```bash
python scripts/setup.py
```

3. **Manual installation (if needed):**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install system dependencies
# macOS:
brew install tesseract ghostscript

# Ubuntu/Debian:
sudo apt-get install tesseract-ocr ghostscript

# Windows: Download from official websites
```

### Environment Setup

Create a `.env` file for API keys (optional, for AI enhancement features):
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## 📋 Usage Examples

### Basic Workflow

1. **Place your HEIC images in `data/heic/`**

2. **Convert HEIC files to PNG:**
```bash
python scripts/converters/heic_converter.py
```

3. **Extract text using OCR:**
```bash
python scripts/ocr/basic_ocr.py
```

4. **Aggregate text files:**
```bash
python scripts/text_processing/text_aggregator.py
```

5. **Create final PDF:**
```bash
python scripts/aggregation/pdf_aggregator.py
```

### Advanced Workflow with AI Enhancement

1. **Smart OCR with AI enhancement:**
```bash
python scripts/ocr/smart_ocr.py --threshold 0.9
```

2. **Spell check and correct text:**
```bash
python scripts/text_processing/spell_checker.py --batch
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

## 🔧 Configuration

### Directory Structure Setup

The scripts expect the following directory structure:
- `data/heic/` - Original HEIC files (add your files here)
- `data/jpeg/` - JPEG files (auto-generated)
- `data/png/` - PNG files (auto-generated)
- `data/text_output/` - Extracted text files (auto-generated)
- `output/` - Final PDFs and documents (auto-generated)

### File Naming Convention

Files should be named with numeric identifiers for proper ordering:
- `page_001.heic`
- `page_002.heic`
- etc.

## 📊 Output Files

- **`EKG_1933_Logbook.pdf`** - Final aggregated PDF
- **`full_text_from_png.txt`** - Complete extracted text
- **`EKG_Logbook_1933.txt`** - Spell-checked and cleaned text

## 🤖 AI Enhancement Features

### OpenAI Integration
- GPT-4 powered text refinement
- Context-aware error correction
- Historical aviation terminology preservation

### Spell Checking
- Multi-language support
- Aviation-specific terminology handling
- Confidence scoring for corrections

## 🛠️ Development

### Adding New Scripts

1. Place scripts in appropriate subdirectories under `scripts/`
2. Follow the established naming conventions
3. Include proper documentation and error handling
4. Add to the requirements.txt if new dependencies are needed

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Include docstrings for all functions
- Add logging for debugging

## 📈 Future Development (Phase 2)

Planned features for the website deployment:
- Interactive web interface for document browsing
- Search functionality across the logbook
- Timeline visualization of aviation events
- Integration with aviation history databases
- Mobile-responsive design
- User authentication and access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper documentation
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is dedicated to preserving the legacy of Ernest K Gann and is available for educational and historical research purposes.

## 🙏 Acknowledgments

- Ernest K Gann family for preserving these historical documents
- Open source OCR and AI communities
- Aviation historians and researchers

## 📞 Contact

For questions about the technical implementation or historical content, please open an issue in this repository.

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed installation and configuration
- [Project Metadata](docs/PROJECT_METADATA.md) - Historical context and project information

---

*"The sky is not the limit, it's just the beginning." - Ernest K Gann* 