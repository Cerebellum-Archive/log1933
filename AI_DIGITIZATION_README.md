# 🛩️ Ernest K. Gann 1933 Logbook AI Digitization

This system processes PNG images of Ernest K. Gann's handwritten 1933 world tour logbook and extracts text using multiple AI services.

## ✨ Features

- **Multiple OCR Engines**: Tesseract, Google Vision API, OpenAI GPT-4 Vision
- **AI Enhancement**: GPT-4 improves and cleans up extracted text
- **Intelligent Processing**: Automatically selects best OCR result based on confidence
- **Structured Output**: JSON and TXT files with metadata extraction
- **Web Integration**: Ready for display on your Next.js website
- **Batch Processing**: Handle all PNG files automatically

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Install Python dependencies
pip install -r requirements_ai.txt

# Set your OpenAI API key
export OPENAI_API_KEY="your-openai-api-key-here"
```

### 2. Run Digitization

```bash
# Simple start (processes 5 files for testing)
python digitize_logbook.py

# Or run the main script directly
python scripts/ai_digitization/main.py --max-files 5
```

### 3. Process All Files

```bash
# Process all PNG files in the png directory
python scripts/ai_digitization/main.py
```

## 📁 Directory Structure

```
log1933/
├── png/                          # Your PNG logbook images
├── digitized_output/             # AI processing results
│   ├── IMG_4210.json            # Individual page data
│   ├── IMG_4210.txt             # Clean text version
│   └── complete_logbook.json    # Complete dataset
├── scripts/ai_digitization/      # Processing pipeline
└── website/                      # Next.js website
```

## 🔧 Configuration Options

### Command Line Arguments

```bash
python scripts/ai_digitization/main.py \
  --input-dir png \
  --output-dir digitized_output \
  --openai-key YOUR_KEY \
  --max-files 10
```

### Optional: Google Cloud Vision

For better OCR accuracy, add Google Cloud Vision:

```bash
# Install Google Cloud Vision
pip install google-cloud-vision

# Set credentials
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"

# Run with Google Vision
python scripts/ai_digitization/main.py --google-credentials credentials.json
```

## 📊 Output Format

Each processed image generates:

### JSON Output (`IMG_4210.json`)
```json
{
  "filename": "IMG_4210.png",
  "page_number": 4210,
  "date_entry": "March 15, 1933",
  "location": "Paris, France",
  "content": "Enhanced and cleaned text...",
  "raw_ocr_text": "Original OCR output...",
  "confidence_score": 0.87,
  "processing_method": "openai_vision",
  "timestamp": "2024-06-21T20:55:00"
}
```

### Complete Dataset (`complete_logbook.json`)
```json
{
  "metadata": {
    "total_entries": 85,
    "processing_date": "2024-06-21T20:55:00",
    "source": "Ernest K. Gann 1933 World Tour Logbook"
  },
  "entries": [...]
}
```

## 🎯 Processing Methods

The system tries multiple OCR methods and selects the best result:

1. **Tesseract OCR**: Traditional OCR with spell-checking
2. **Google Vision API**: Cloud-based OCR (if configured)
3. **OpenAI GPT-4 Vision**: AI-powered text extraction

All results are then enhanced by GPT-4 for:
- Spelling correction
- Context improvement
- Historical accuracy
- Metadata extraction

## 🌐 Website Integration

The digitized content integrates with your Next.js website:

1. Process images with the AI pipeline
2. Copy `complete_logbook.json` to your website's public folder
3. The logbook page will automatically display the content
4. Features include search, filtering, and detailed views

## 📈 Monitoring Progress

Watch the processing logs:

```bash
# Real-time progress
tail -f digitization.log

# Check completion status
ls -la digitized_output/
```

## 🔍 Quality Control

- **Confidence Scores**: Each entry has an accuracy rating
- **Method Tracking**: Know which OCR method was used
- **Raw Text Backup**: Original OCR output preserved
- **Manual Review**: Easy to spot-check results

## 🛠️ Troubleshooting

### Common Issues

**"OpenAI API key not found"**
```bash
export OPENAI_API_KEY="sk-your-key-here"
```

**"No PNG files found"**
- Ensure PNG files are in the `png/` directory
- Check file permissions

**"Module not found"**
```bash
pip install -r requirements_ai.txt
```

### Performance Tips

- **Start Small**: Use `--max-files 5` for testing
- **Monitor Costs**: OpenAI Vision API has usage costs
- **Batch Processing**: Process during off-peak hours
- **Quality vs Speed**: OpenAI Vision is slower but more accurate

## 💡 Advanced Usage

### Custom Processing
```python
from scripts.ai_digitization.main import AIDigitizer

# Initialize with your API key
digitizer = AIDigitizer("your-openai-key")

# Process single image
entry = await digitizer.process_image("png/IMG_4210.png")
print(f"Extracted: {entry.content}")
```

### Filtering by Confidence
```bash
# Only process high-confidence results
python scripts/ai_digitization/main.py --min-confidence 0.8
```

## 📝 Next Steps

1. **Run Test**: Process 5 files to verify setup
2. **Full Processing**: Run on all PNG files
3. **Website Deploy**: Update your website with results
4. **Quality Review**: Check accuracy and make adjustments
5. **Historical Context**: Add location and date context

## 🤝 Contributing

To improve the digitization:
- Adjust OCR confidence thresholds
- Enhance GPT-4 prompts for historical context
- Add additional OCR backends
- Improve metadata extraction

---

**Ready to digitize history!** 📖✨ 