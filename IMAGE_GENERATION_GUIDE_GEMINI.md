# AI Image Generation Guide - Gemini + DALL-E

Generate historically accurate AI images using Google Gemini (cheaper) with DALL-E 3 fallback.

## Prerequisites

1. **Google API Key** (recommended) - Get from https://makersuite.google.com/app/apikey
2. **OpenAI API Key** (optional fallback) - Get from https://platform.openai.com/api-keys
3. **Python 3.8+**
4. **Required packages**: `pip install -r requirements_images_gemini.txt`

## Step-by-Step Instructions

### 1. Set up your environment

```bash
# Install dependencies
pip install -r requirements_images_gemini.txt

# Set your Google API key (primary)
export GOOGLE_API_KEY="your-google-api-key-here"

# Set your OpenAI API key (fallback, optional)
export OPENAI_API_KEY="your-openai-api-key-here"
```

### 2. Run the hybrid generation script

```bash
cd log1933
python generate_journey_images_gemini.py
```

## Cost Comparison

| API | Cost per 1024x1024 | 12 Images | Quality |
|-----|-------------------|-----------|---------|
| **Gemini Imagen** | $0.020 | **$0.24** | Very Good |
| **DALL-E 3** | $0.040 | $0.48 | Excellent |
| **Hybrid** | Mixed | **~$0.30** | Best of both |

## Advantages of Gemini for Historical Images

✅ **50% cheaper** than DALL-E 3  
✅ **Google Workspace integration** - easier billing  
✅ **Better historical accuracy** - less content filtering  
✅ **More flexible** with 1930s period content  
✅ **Faster generation** - typically 20-30 seconds  

## Strategy: Gemini First, DALL-E Fallback

The script will:
1. **Try Gemini first** (cheaper, good quality)
2. **Fallback to DALL-E** if Gemini fails
3. **Report which API was used** for each image
4. **Calculate total cost** based on actual usage

## Sample Output
