#!/usr/bin/env python3
"""
Generate AI images for missing journey locations using Google Gemini Imagen
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
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Only the missing journey locations
MISSING_LOCATIONS = [
    {
        "id": "hawaii",
        "date": "January 1933",
        "location": "Honolulu, Hawaii",
        "description": "First stop in the Pacific",
        "prompt": "1933 Honolulu harbor with vintage seaplanes, Diamond Head crater in background, palm trees, traditional Hawaiian architecture, pre-war Pacific atmosphere, golden hour lighting, historical aviation scene, tropical paradise"
    },
    {
        "id": "philippines",
        "date": "April 1933",
        "location": "Manila, Philippines",
        "description": "Island adventures in the Pacific",
        "prompt": "1933 Manila Bay with vintage aircraft on water, tropical colonial Spanish architecture, palm trees, Intramuros fortress walls, pre-war Philippines atmosphere, historical aviation, Southeast Asian tropical setting"
    },
    {
        "id": "middle_east",
        "date": "July 1933",
        "location": "Baghdad, Iraq",
        "description": "Ancient lands and modern aviation",
        "prompt": "1933 Baghdad with vintage aircraft, Middle Eastern Islamic architecture, Tigris River, date palm trees, desert landscape, historical aviation, Arabian atmosphere, ancient Mesopotamian setting, golden desert light"
    },
    {
        "id": "egypt",
        "date": "August 1933",
        "location": "Cairo, Egypt",
        "description": "Land of the Pharaohs",
        "prompt": "1933 Cairo with vintage seaplane on Nile River, Great Pyramids of Giza in background, ancient Egyptian architecture, desert aviation, historical atmosphere, golden sand, palm trees, majestic ancient monuments"
    },
    {
        "id": "africa",
        "date": "September 1933",
        "location": "Nairobi, Kenya",
        "description": "African safari and adventure",
        "prompt": "1933 Nairobi with vintage aircraft on savanna airstrip, African acacia trees, Mount Kenya in distance, colonial architecture, wildlife silhouettes, historical aviation, safari atmosphere, golden African sunset, East African highlands"
    }
]

def generate_image_gemini(prompt, filename):
    """Generate image using Google Gemini Imagen API"""
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key={GOOGLE_API_KEY}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": {
                "text": prompt
            },
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
                
                print(f"✅ Generated: {output_path}")
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
                
                print(f"✅ Generated: {output_path}")
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
    """Generate missing journey images"""
    print("🌍 Generating Missing AI Images for Ernest K. Gann's 1933 Journey")
    print("=" * 70)
    
    # Check which API keys are available
    if GOOGLE_API_KEY:
        print("✅ Google Gemini API key found (primary)")
    if OPENAI_API_KEY:
        print("✅ OpenAI API key found (fallback)")
    
    print(f"📁 Output directory: {OUTPUT_DIR}")
    
    # Check which images are actually missing
    missing_to_generate = []
    for location in MISSING_LOCATIONS:
        filename = f"{location['id']}.jpg"
        output_path = OUTPUT_DIR / filename
        
        if output_path.exists():
            print(f"⏭️  Skipping {filename} (already exists)")
        else:
            missing_to_generate.append(location)
    
    if not missing_to_generate:
        print("\n🎉 All images already exist! No generation needed.")
        return
    
    print(f"\n🎯 Need to generate {len(missing_to_generate)} missing images:")
    for loc in missing_to_generate:
        print(f"   - {loc['id']}.jpg ({loc['location']})")
    
    print()
    
    success_count = 0
    total_count = len(missing_to_generate)
    
    for location in missing_to_generate:
        filename = f"{location['id']}.jpg"
        
        print(f"🗺️  {location['date']} - {location['location']}")
        
        # Try Gemini first, then OpenAI as fallback
        success = False
        if GOOGLE_API_KEY:
            success = generate_image_gemini(location['prompt'], filename)
        
        if not success and OPENAI_API_KEY:
            print("   🔄 Falling back to OpenAI...")
            success = generate_image_openai(location['prompt'], filename)
        
        if success:
            success_count += 1
        else:
            print(f"   ❌ Failed to generate {filename}")
        
        print()
        
        # Rate limiting - be nice to the APIs
        if location != missing_to_generate[-1]:  # Don't wait after the last one
            print("   ⏱️  Waiting 3 seconds before next generation...")
            time.sleep(3)
    
    print("=" * 70)
    print(f"🎉 Generated {success_count}/{total_count} missing images successfully")
    
    if success_count > 0:
        print(f"📁 New images saved to: {OUTPUT_DIR}")
        print()
        print("Next steps:")
        print("1. Run optimization: python optimize_journey_images.py")
        print("2. Commit and push: git add website/public/images/journey/ && git commit -m 'Add missing journey location images' && git push")
        print("3. Check the website to see all locations!")
    else:
        print("❌ No images were generated. Check your API keys and try again.")

if __name__ == "__main__":
    main() 