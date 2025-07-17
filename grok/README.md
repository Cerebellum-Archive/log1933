# Grok API Scripts

This directory contains all Grok API related scripts and utilities for the Ernest K. Gann 1933 Logbook Project.

## 📁 Files

- **`test_grok.py`** - Simple API connection test
- **`grok_example.py`** - Full logbook analysis example  
- **`setup_grok_api.py`** - Interactive setup script
- **`GROK_SETUP_NOTES.md`** - Quick reference and troubleshooting

## 🚀 Usage

### Quick Test
```bash
cd grok
python test_grok.py
```

### Analyze Logbook
```bash
cd grok  
python grok_example.py
```

### Setup (if needed)
```bash
cd grok
python setup_grok_api.py
```

## 🔧 Configuration

- **API Key**: Stored in `../.env` (parent directory)
- **Model**: Configurable in each script via `GROK_MODEL` variable
- **Data**: Reads from `../full_text_from_png.txt`

## 📋 Current Status

- ✅ **Grok 3**: Working perfectly
- ⚠️ **Grok 4**: Available but returning empty responses (xAI issue)
- ✅ **API Key**: Configured and secured

## 🔄 Model Switching

To switch models, edit the `GROK_MODEL` variable in any script:

```python
GROK_MODEL = "grok-3"        # Current (working)
GROK_MODEL = "grok-4-0709"   # When available  
GROK_MODEL = "grok-3-fast"   # Faster responses
``` 