# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Ernest K. Gann 1933 Logbook Digital Archive - a comprehensive AI-powered digitization system for preserving and presenting Ernest K. Gann's handwritten aviation logbook from his 1933 world tour. The project combines advanced OCR, multiple AI services, and a modern web interface to make historical aviation documents accessible.

## Architecture

The system consists of three main components:

1. **AI Digitization Pipeline** (`scripts/ai_digitization/main.py`) - Multi-engine OCR system using Tesseract, Google Vision API, and OpenAI GPT-4 Vision
2. **Data Processing Scripts** - Collection of utilities for image conversion, text aggregation, and data integration
3. **Web Application** (`website/`) - Next.js application deployed on Vercel for interactive browsing

## Key Commands

### Python Environment Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### Core Processing Commands
```bash
# Main digitization pipeline (processes PNG images through AI pipeline)
python digitize_logbook.py

# Monitor processing progress in real-time
python monitor_progress.py --watch

# Integrate processed data into website
python integrate_data.py
```

### Website Development
```bash
cd website
npm install
npm run dev      # Development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint code quality check
```

### Image Processing Utilities
```bash
# Convert HEIC to PNG format
python heic_to_png.py

# Convert directories of images
python convert_pics.py

# Aggregate PDFs from multiple images
python agg_heic_to_pdf.py
python agg_jpeg_to_pdf.py
python agg_png_to_pdf.py
```

## Data Flow Architecture

The digitization pipeline follows this flow:
1. **Input**: Raw HEIC/PNG images in `heic/` and `png/` directories
2. **Processing**: Multi-engine OCR extraction via `scripts/ai_digitization/main.py`
3. **Enhancement**: GPT-4 text improvement and metadata extraction
4. **Output**: Structured JSON and TXT files in `digitized_output/`
5. **Integration**: Data copied to `website/public/data/` for web access
6. **Presentation**: Next.js web application serves interactive interface

## File Structure Insights

- `digitized_output/` contains the final processed results with 194 logbook entries
- `scripts/` directory contains modular processing tools organized by function (OCR, converters, aggregation, etc.)
- `credentials/` handles API key management for Google Vision and OpenAI services
- `website/src/app/` follows Next.js 14 app router structure with TypeScript
- Multiple image format directories (`heic/`, `jpeg/`, `png/`) support various input sources

## Key Dependencies

**Python Stack:**
- `openai>=1.0.0` - GPT-4 Vision and text enhancement
- `pytesseract>=0.3.10` - Traditional OCR engine
- `Pillow>=9.0.0` - Image processing
- `python-dotenv>=1.0.0` - Environment variable management

**Node.js Stack:**
- `next@14.2.3` - React framework with app router
- `typescript@^5` - Type safety
- `tailwindcss@^3.4.1` - Styling framework
- `leaflet@^1.9.4` - Interactive maps for journey visualization

## Environment Configuration

The system requires API credentials:
- `OPENAI_API_KEY` - For GPT-4 text enhancement
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to Google Vision API JSON key file

Credentials are managed via `.env` file in root directory and `credentials/` subdirectory.

## Processing Status

The main digitization is complete with 194 pages processed at 99.9% average accuracy. The system successfully extracted text from handwritten logbook pages using intelligent fallback between multiple OCR engines, with Google Vision API handling 95.4% of successful extractions.

## Deployment

The website is deployed to Vercel with automatic builds from the main branch. To deploy:
```bash
cd website
vercel --prod
```

The live site is available at https://log1933.vercel.app