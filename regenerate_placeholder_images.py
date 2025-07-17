#!/usr/bin/env python3
"""
Regenerate the placeholder images with real AI-generated images
"""

import os
import requests
import json
from pathlib import Path
import time
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not GOOGLE_API_KEY and not OPENAI_API_KEY:
    print("❌ Please add GOOGLE_API_KEY or OPENAI_API_KEY to your .env file")
    exit(1)

OUTPUT_DIR = Path("website/public/images/journey")

# Images that are currently placeholders (small file sizes)
PLACEHOLDER_IMAGES = [
    {
        "id": "hawaii",
        "location": "Honolulu, Hawaii",
        "prompt": "1933 Honolulu harbor with vintage seaplanes landing on water, Diamond Head crater in background, palm trees swaying, traditional Hawaiian architecture, pre-war Pacific atmosphere, golden hour lighting, historical aviation scene, tropical paradise, clear blue waters"
    },
    {
        "id": "philippines", 
        "location": "Manila, Philippines",
        "prompt": "1933 Manila Bay with vintage aircraft on water, Spanish colonial architecture of Intramuros, palm trees, fortress walls, pre-war Philippines atmosphere, historical aviation, Southeast Asian tropical setting, golden sunset over Manila Bay"
    },
    {
        "id": "middle_east",
        "location": "Baghdad, Iraq", 
        "prompt": "1933 Baghdad with vintage aircraft, Middle Eastern Islamic architecture, Tigris River flowing through city, date palm trees, desert landscape, historical aviation, Arabian atmosphere, ancient Mesopotamian setting, golden desert light, minarets and domes"
    },
    {
        "id": "egypt",
        "location": "Cairo, Egypt",
        "prompt": "1933 Cairo with vintage seaplane on Nile River, Great Pyramids of Giza prominently in background, ancient Egyptian architecture, desert aviation, historical atmosphere, golden sand, palm trees, majestic ancient monuments, sphinx visible"
    },
    {
        "id": "africa",
        "location": "Nairobi, Kenya", 
        "prompt": "1933 Nairobi with vintage aircraft on savanna airstrip, African acacia trees, Mount Kenya in distance, colonial architecture, giraffe and elephant silhouettes, historical aviation, safari atmosphere, golden African sunset, East African highlands"
    }
]

def generate_image_gemini(prompt, filename):
    """Generate image using Google Gemini Imagen API"""
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key={GOOGLE_API_KEY}"
        
        headers = {"Content-Type": "application/json"}
        
        data = {
            "prompt": {"text": prompt},
            "generationConfig": {
                "sampleCount": 1,
                "includeRaiFiltering": False,
                "includeOriginalPrompt": False
            }
        }
        
        print(f"🎨 Generating with Gemini: {filename}")
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                image_data = result['candidates'][0]['image']['data']
                image_bytes = base64.b64decode(image_data)
                
                output_path = OUTPUT_DIR / filename
                with open(output_path, 'wb') as f:
                    f.write(image_bytes)
                
                # Check file size to confirm it's not a placeholder
                file_size = os.path.getsize(output_path) / 1024  # KB
                print(f"✅ Generated: {output_path} ({file_size:.0f}KB)")
                return True
            else:
                print(f"❌ No image generated: {result}")
                return False
        else:
            print(f"❌ Gemini API error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error generating with Gemini: {str(e)}")
        return False

def generate_image_openai(prompt, filename):
    """Generate image using OpenAI DALL-E 3 API (fallback)"""
    try:
        url = "https://api.openai.com/v1/images/generations"
        
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "dall-e-3",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024",
            "quality": "standard"
        }
        
        print(f"🎨 Generating with OpenAI (fallback): {filename}")
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            image_url = result['data'][0]['url']
            
            # Download the image
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                output_path = OUTPUT_DIR / filename
                with open(output_path, 'wb') as f:
                    f.write(image_response.content)
                
                file_size = os.path.getsize(output_path) / 1024  # KB
                print(f"✅ Generated: {output_path} ({file_size:.0f}KB)")
                return True
            else:
                print(f"❌ Failed to download image")
                return False
        else:
            print(f"❌ OpenAI API error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error generating with OpenAI: {str(e)}")
        return False

def main():
    """Regenerate placeholder images with real AI images"""
    print("🔄 Regenerating Placeholder Images with Real AI Images")
    print("=" * 60)
    
    if GOOGLE_API_KEY:
        print("✅ Google Gemini API key found (primary)")
    if OPENAI_API_KEY:
        print("✅ OpenAI API key found (fallback)")
    
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print()
    
    success_count = 0
    total_count = len(PLACEHOLDER_IMAGES)
    
    for image_info in PLACEHOLDER_IMAGES:
        filename = f"{image_info['id']}.jpg"
        
        print(f"🗺️  {image_info['location']}")
        print(f"    Replacing placeholder: {filename}")
        
        # Try Gemini first, then OpenAI as fallback
        success = False
        if GOOGLE_API_KEY:
            success = generate_image_gemini(image_info['prompt'], filename)
        
        if not success and OPENAI_API_KEY:
            print("   🔄 Falling back to OpenAI...")
            success = generate_image_openai(image_info['prompt'], filename)
        
        if success:
            success_count += 1
        else:
            print(f"   ❌ Failed to generate {filename}")
        
        print()
        
        # Rate limiting - be nice to the APIs
        if image_info != PLACEHOLDER_IMAGES[-1]:
            print("   ⏱️  Waiting 3 seconds...")
            time.sleep(3)
    
    print("=" * 60)
    print(f"🎉 Successfully regenerated {success_count}/{total_count} images")
    
    if success_count > 0:
        print()
        print("Next steps:")
        print("1. python optimize_journey_images.py")  
        print("2. git add website/public/images/journey/")
        print("3. git commit -m 'Replace placeholder images with AI-generated ones'")
        print("4. git push")

if __name__ == "__main__":
    main() 