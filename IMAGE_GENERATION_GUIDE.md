# AI Image Generation Guide

This guide explains how to generate historically accurate AI images for Ernest K. Gann's 1933 journey locations.

## Prerequisites

1. **OpenAI API Key** - Get one from https://platform.openai.com/api-keys
2. **Python 3.8+** - Make sure you have Python installed
3. **Required packages** - Install with: `pip install -r requirements_images.txt`

## Step-by-Step Instructions

### 1. Set up your environment

```bash
# Install dependencies
pip install -r requirements_images.txt

# Set your OpenAI API key (replace with your actual key)
export OPENAI_API_KEY="sk-your-api-key-here"
```

### 2. Run the generation script

```bash
cd log1933
python generate_journey_images.py
```

### 3. What happens during generation

- **12 images** will be generated (one for each journey location)
- Each image takes about **30-60 seconds** to generate
- **10-second delays** between requests (rate limiting)
- **Total time**: ~15-20 minutes
- **Cost**: ~$0.04 per image = **~$0.50 total**

### 4. Generated images

Images will be saved to: 