#!/usr/bin/env python3
"""
Generate AI images for Ernest K. Gann's 1933 journey locations
Run this script locally to generate images, then commit them to the repo
"""

import os
import requests
import json
from pathlib import Path
import time

# Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("❌ Please set OPENAI_API_KEY environment variable")
    exit(1)

OUTPUT_DIR = Path("website/public/images/journey")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Journey locations with historically accurate prompts
JOURNEY_LOCATIONS = [
    {
        "filename": "chicago-1933.jpg",
        "location": "Chicago, Illinois",
        "date": "January 1933",
        "prompt": "A historically accurate photograph from January 1933 showing Chicago's downtown business district. Art Deco skyscrapers, vintage 1930s automobiles parked on snowy streets, businessmen in long coats and fedoras walking past a telephone company building. The scene captures the Great Depression era with a mix of prosperity and hardship. Sepia tones, documentary photography style, winter atmosphere, no modern elements."
    },
    {
        "filename": "nyc-departure-1933.jpg",
        "location": "New York City",
        "date": "February 1933",
        "prompt": "A historically accurate photograph from February 1933 showing New York harbor with a large ocean liner ready for departure. Young passengers in 1930s clothing boarding the steamship, vintage luggage being loaded, the Manhattan skyline in the background with pre-war architecture. Sepia tones, documentary photography style, sense of adventure and departure, no modern elements."
    },
    {
        "filename": "london-1933.jpg",
        "location": "London, England", 
        "date": "March 1933",
        "prompt": "A historically accurate photograph from March 1933 showing a London street scene. Red telephone boxes, double-decker buses, Big Ben visible in the misty background, businessmen in bowler hats and long coats, Victorian and Edwardian architecture. The scene shows the British Post Office telephone network era. Foggy London atmosphere, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "paris-1933.jpg",
        "location": "Paris, France",
        "date": "April 1933",
        "prompt": "A historically accurate photograph from April 1933 showing a Parisian street scene. The Eiffel Tower visible in the distance, vintage French automobiles, sidewalk cafes with people in 1930s fashion, Haussmanian architecture, telephone lines visible overhead. Spring in Paris, romantic lighting, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "berlin-1933.jpg",
        "location": "Berlin, Germany",
        "date": "May 1933",
        "prompt": "A historically accurate photograph from May 1933 showing Berlin during the Weimar Republic era. German architecture, vintage German automobiles, people in 1930s clothing, telephone infrastructure visible, a sense of technological advancement mixed with political tension. Documentary photography style, sepia tones, urban atmosphere, no modern elements."
    },
    {
        "filename": "moscow-1933.jpg",
        "location": "Moscow, Soviet Union",
        "date": "June 1933",
        "prompt": "A historically accurate photograph from June 1933 showing Moscow during the early Soviet era. Red Square with traditional Russian architecture, vintage Soviet vehicles, people in winter coats despite the season, telephone infrastructure of the Communist state. Cold, imposing atmosphere, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "tokyo-1933.jpg",
        "location": "Tokyo, Japan",
        "date": "July 1933",
        "prompt": "A historically accurate photograph from July 1933 showing Tokyo during the pre-war Showa period. Traditional Japanese architecture mixed with modern Western-style buildings, vintage Japanese automobiles, people in both kimono and Western dress, telephone poles and lines visible. Summer atmosphere, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "shanghai-1933.jpg",
        "location": "Shanghai, China",
        "date": "August 1933",
        "prompt": "A historically accurate photograph from August 1933 showing Shanghai's International Settlement. Mix of Eastern and Western architecture, the Bund waterfront, vintage cars and rickshaws, people in both traditional Chinese and Western clothing, telephone infrastructure of the international port city. Bustling atmosphere, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "hongkong-1933.jpg",
        "location": "Hong Kong",
        "date": "September 1933",
        "prompt": "A historically accurate photograph from September 1933 showing Hong Kong harbor during British colonial rule. Victoria Harbor with vintage ships, British colonial architecture, mix of Chinese and Western people, telephone infrastructure of the crown colony. Tropical atmosphere, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "singapore-1933.jpg",
        "location": "Singapore",
        "date": "October 1933",
        "prompt": "A historically accurate photograph from October 1933 showing Singapore during British colonial rule. Colonial architecture, tropical setting, vintage cars, diverse population of Chinese, Malay, and British people, telephone exchange building visible. Humid tropical atmosphere, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "bombay-1933.jpg",
        "location": "Bombay, India",
        "date": "November 1933",
        "prompt": "A historically accurate photograph from November 1933 showing Bombay during the British Raj. Victorian Gothic architecture, vintage Indian vehicles and British cars, people in both traditional Indian dress and Western clothing, telephone infrastructure of colonial India. Colonial atmosphere, sepia tones, documentary photography style, no modern elements."
    },
    {
        "filename": "return-america-1933.jpg",
        "location": "Return to America",
        "date": "December 1933",
        "prompt": "A historically accurate photograph from December 1933 showing an ocean liner approaching New York harbor. Passengers on deck looking toward the Statue of Liberty, vintage luggage, people in 1930s winter clothing, sense of homecoming after a long journey. Sepia tones, documentary photography style, emotional atmosphere, no modern elements."
    }
]

def generate_image(prompt, filename):
    """Generate a single image using OpenAI DALL-E 3"""
    
    print(f"🎨 Generating: {filename}")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    data = {
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "standard",
        "style": "natural"
    }
    
    try:
        # Generate image
        response = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers=headers,
            json=data,
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return False
            
        result = response.json()
        image_url = result['data'][0]['url']
        
        # Download image
        img_response = requests.get(image_url, timeout=30)
        if img_response.status_code == 200:
            output_path = OUTPUT_DIR / filename
            with open(output_path, 'wb') as f:
                f.write(img_response.content)
            print(f"✅ Saved: {output_path}")
            return True
        else:
            print(f"❌ Failed to download image: {img_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error generating {filename}: {e}")
        return False

def main():
    print("🚀 Starting AI image generation for Ernest K. Gann's 1933 journey")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print(f"🖼️  Generating {len(JOURNEY_LOCATIONS)} images")
    print("⏱️  This will take several minutes...")
    print()
    
    successful = 0
    failed = 0
    
    for i, location in enumerate(JOURNEY_LOCATIONS, 1):
        print(f"[{i}/{len(JOURNEY_LOCATIONS)}] {location['location']} - {location['date']}")
        
        # Check if image already exists
        output_path = OUTPUT_DIR / location['filename']
        if output_path.exists():
            print(f"⏭️  Skipping (already exists): {location['filename']}")
            successful += 1
            continue
            
        # Generate image
        if generate_image(location['prompt'], location['filename']):
            successful += 1
        else:
            failed += 1
            
        # Rate limiting - wait between requests
        if i < len(JOURNEY_LOCATIONS):
            print("⏳ Waiting 10 seconds (rate limiting)...")
            time.sleep(10)
        
        print()
    
    print("🎉 Generation complete!")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"📁 Images saved to: {OUTPUT_DIR}")
    
    if successful > 0:
        print("\n📋 Next steps:")
        print("1. Review the generated images")
        print("2. Commit them to your repository:")
        print("   git add website/public/images/journey/")
        print("   git commit -m 'Add AI-generated journey images'")
        print("   git push")

if __name__ == "__main__":
    main() 