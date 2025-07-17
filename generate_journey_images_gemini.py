#!/usr/bin/env python3
"""
Generate AI images for Ernest K. Gann's 1933 journey locations using Google Gemini Imagen
Falls back to OpenAI DALL-E 3 if Gemini fails
"""

import os
import requests
import json
from pathlib import Path
import time
import base64

# Configuration
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not GOOGLE_API_KEY and not OPENAI_API_KEY:
    print("❌ Please set GOOGLE_API_KEY or OPENAI_API_KEY environment variable")
    print("   Get Google API key: https://makersuite.google.com/app/apikey")
    print("   Get OpenAI API key: https://platform.openai.com/api-keys")
    exit(1)

OUTPUT_DIR = Path("website/public/images/journey")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Journey locations with historically accurate prompts
JOURNEY_LOCATIONS = [
    {
        "filename": "chicago-1933.jpg",
        "location": "Chicago, Illinois",
        "date": "January 1933",
        "prompt": "A historically accurate black and white photograph from January 1933 showing Chicago's downtown business district during the Great Depression. Art Deco skyscrapers including the Chicago Board of Trade Building, vintage 1930s Chrysler and Ford automobiles parked on snowy Michigan Avenue, businessmen in long wool overcoats and fedora hats walking past the Illinois Bell Telephone Company building. Snow-covered streets, vintage streetlights, people in period clothing, documentary photography style, high contrast, winter atmosphere, no modern elements."
    },
    {
        "filename": "nyc-departure-1933.jpg",
        "location": "New York City",
        "date": "February 1933",
        "prompt": "A historically accurate black and white photograph from February 1933 showing New York harbor with the RMS Aquitania ocean liner ready for departure to Europe. Young passengers in 1930s clothing boarding the steamship, vintage leather suitcases and steamer trunks being loaded by porters, the pre-war Manhattan skyline in the background with the Chrysler Building prominent. Sepia tones, documentary photography style, sense of adventure and departure, no modern elements."
    },
    {
        "filename": "london-1933.jpg",
        "location": "London, England", 
        "date": "March 1933",
        "prompt": "A historically accurate black and white photograph from March 1933 showing a London street scene near the General Post Office. Classic red K2 telephone boxes, AEC Regent double-decker buses, Big Ben visible through the London fog, businessmen in bowler hats and Chesterfield coats, Victorian and Edwardian architecture. The scene shows the British Post Office telephone network era during the reign of King George V. Foggy London atmosphere, high contrast, documentary photography style, no modern elements."
    },
    {
        "filename": "paris-1933.jpg",
        "location": "Paris, France",
        "date": "April 1933",
        "prompt": "A historically accurate black and white photograph from April 1933 showing a Parisian street scene near the Champs-Élysées. The Eiffel Tower visible in the distance, vintage Citroën and Peugeot automobiles, sidewalk cafes with people in 1930s fashion drinking coffee, Haussmanian architecture with wrought iron balconies, telephone lines visible overhead. Spring in Paris, romantic lighting, high contrast, documentary photography style, no modern elements."
    },
    {
        "filename": "berlin-1933.jpg",
        "location": "Berlin, Germany",
        "date": "May 1933",
        "prompt": "A historically accurate black and white photograph from May 1933 showing Berlin during the early Nazi period. Weimar Republic era architecture around Potsdamer Platz, vintage German Mercedes and BMW automobiles, people in 1930s clothing walking past the German telephone exchange building, early Nazi flags visible but not prominent, telephone infrastructure visible, a sense of technological advancement mixed with political tension. Documentary photography style, high contrast, urban atmosphere, historically sensitive, no modern elements."
    },
    {
        "filename": "moscow-1933.jpg",
        "location": "Moscow, Soviet Union",
        "date": "June 1933",
        "prompt": "A historically accurate black and white photograph from June 1933 showing Moscow during Stalin's first Five-Year Plan. Red Square with St. Basil's Cathedral and the Kremlin walls, vintage Soviet GAZ automobiles, people in 1930s Soviet clothing and winter coats, telephone infrastructure of the Communist state, Soviet constructivist architecture. Cold, imposing atmosphere, high contrast, documentary photography style, historically accurate, no modern elements."
    },
    {
        "filename": "tokyo-1933.jpg",
        "location": "Tokyo, Japan",
        "date": "July 1933",
        "prompt": "A historically accurate black and white photograph from July 1933 showing Tokyo during the pre-war Showa period. Traditional Japanese architecture with curved roofs mixed with modern Western-style buildings, vintage Japanese Datsun automobiles and rickshaws, people in both traditional kimono and Western 1930s dress, telephone poles and lines visible, cherry blossom trees. Summer atmosphere, high contrast, documentary photography style, cultural blend, no modern elements."
    },
    {
        "filename": "shanghai-1933.jpg",
        "location": "Shanghai, China",
        "date": "August 1933",
        "prompt": "A historically accurate black and white photograph from August 1933 showing Shanghai's International Settlement along the Bund waterfront. Mix of Art Deco Western architecture and traditional Chinese buildings, vintage cars and traditional rickshaws, people in both traditional Chinese qipao and Western 1930s clothing, telephone infrastructure of the international port city, the Huangpu River with period ships. Bustling atmosphere, high contrast, documentary photography style, cultural diversity, no modern elements."
    },
    {
        "filename": "hongkong-1933.jpg",
        "location": "Hong Kong",
        "date": "September 1933",
        "prompt": "A historically accurate black and white photograph from September 1933 showing Hong Kong's Victoria Harbor during British colonial rule. Victoria Harbor with vintage steamships and junks, British colonial architecture with verandas, mix of Chinese people in traditional dress and British colonials in tropical suits, telephone infrastructure of the crown colony, the Peak tram visible. Tropical atmosphere, high contrast, documentary photography style, colonial period, no modern elements."
    },
    {
        "filename": "singapore-1933.jpg",
        "location": "Singapore",
        "date": "October 1933",
        "prompt": "A historically accurate black and white photograph from October 1933 showing Singapore during British colonial rule. Colonial architecture with wide verandas and shutters, tropical setting with palm trees, vintage cars and rickshaws, diverse population of Chinese, Malay, and British people in period clothing, telephone exchange building visible, the Singapore River with traditional boats. Humid tropical atmosphere, high contrast, documentary photography style, multicultural colonial society, no modern elements."
    },
    {
        "filename": "bombay-1933.jpg",
        "location": "Bombay, India",
        "date": "November 1933",
        "prompt": "A historically accurate black and white photograph from November 1933 showing Bombay during the British Raj. Victorian Gothic architecture including the Gateway of India, vintage Indian Morris and British Austin automobiles, people in both traditional Indian dress (saris, dhotis) and Western 1930s clothing, telephone infrastructure of colonial India, the Arabian Sea waterfront. Colonial atmosphere, high contrast, documentary photography style, British Raj period, no modern elements."
    },
    {
        "filename": "return-america-1933.jpg",
        "location": "Return to America",
        "date": "December 1933",
        "prompt": "A historically accurate black and white photograph from December 1933 showing an ocean liner approaching New York harbor. Passengers on the ship's deck looking toward the Statue of Liberty, vintage leather luggage, people in 1930s winter clothing and overcoats, sense of homecoming after a long journey around the world, the Manhattan skyline in the background. High contrast, documentary photography style, emotional atmosphere of return, no modern elements."
    }
]

class ImageGenerator:
    def __init__(self):
        self.google_api_key = GOOGLE_API_KEY
        self.openai_api_key = OPENAI_API_KEY
        
    def generate_with_gemini(self, prompt, filename):
        """Generate image using Google Gemini Imagen"""
        
        if not self.google_api_key:
            return False, "No Google API key"
            
        print(f"🟢 Trying Gemini for: {filename}")
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key={self.google_api_key}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": prompt,
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_ONLY_HIGH"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT", 
                    "threshold": "BLOCK_ONLY_HIGH"
                }
            ],
            "generationConfig": {
                "aspectRatio": "1:1",
                "negativePrompt": "modern cars, smartphones, contemporary clothing, modern buildings, color photography, digital effects"
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=60)
            
            if response.status_code != 200:
                print(f"❌ Gemini API Error: {response.status_code} - {response.text}")
                return False, f"API Error: {response.status_code}"
                
            result = response.json()
            
            if 'candidates' not in result or len(result['candidates']) == 0:
                print(f"❌ Gemini: No image generated")
                return False, "No image generated"
                
            # Get base64 image data
            image_data = result['candidates'][0]['image']['data']
            image_bytes = base64.b64decode(image_data)
            
            # Save image
            output_path = OUTPUT_DIR / filename
            with open(output_path, 'wb') as f:
                f.write(image_bytes)
                
            print(f"✅ Gemini saved: {output_path}")
            return True, "Success"
            
        except Exception as e:
            print(f"❌ Gemini error: {e}")
            return False, str(e)
    
    def generate_with_dalle(self, prompt, filename):
        """Generate image using OpenAI DALL-E 3"""
        
        if not self.openai_api_key:
            return False, "No OpenAI API key"
            
        print(f"🔵 Trying DALL-E for: {filename}")
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.openai_api_key}"
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
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=data,
                timeout=60
            )
            
            if response.status_code != 200:
                print(f"❌ DALL-E API Error: {response.status_code} - {response.text}")
                return False, f"API Error: {response.status_code}"
                
            result = response.json()
            image_url = result['data'][0]['url']
            
            # Download image
            img_response = requests.get(image_url, timeout=30)
            if img_response.status_code == 200:
                output_path = OUTPUT_DIR / filename
                with open(output_path, 'wb') as f:
                    f.write(img_response.content)
                print(f"✅ DALL-E saved: {output_path}")
                return True, "Success"
            else:
                return False, f"Download failed: {img_response.status_code}"
                
        except Exception as e:
            print(f"❌ DALL-E error: {e}")
            return False, str(e)
    
    def generate_image(self, prompt, filename):
        """Generate image with fallback: Gemini -> DALL-E"""
        
        # Try Gemini first (cheaper)
        success, error = self.generate_with_gemini(prompt, filename)
        if success:
            return True
            
        print(f"⚠️  Gemini failed ({error}), trying DALL-E...")
        
        # Fallback to DALL-E
        success, error = self.generate_with_dalle(prompt, filename)
        if success:
            return True
            
        print(f"❌ Both APIs failed for {filename}")
        return False

def main():
    print("🚀 Starting AI image generation for Ernest K. Gann's 1933 journey")
    print("🔄 Strategy: Try Gemini first (cheaper), fallback to DALL-E 3")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print(f"🖼️  Generating {len(JOURNEY_LOCATIONS)} images")
    print("⏱️  This will take several minutes...")
    
    if GOOGLE_API_KEY:
        print("✅ Google API key found")
    else:
        print("⚠️  No Google API key - will use DALL-E only")
        
    if OPENAI_API_KEY:
        print("✅ OpenAI API key found")
    else:
        print("⚠️  No OpenAI API key - will use Gemini only")
        
    print()
    
    generator = ImageGenerator()
    successful = 0
    failed = 0
    gemini_count = 0
    dalle_count = 0
    
    for i, location in enumerate(JOURNEY_LOCATIONS, 1):
        print(f"[{i}/{len(JOURNEY_LOCATIONS)}] {location['location']} - {location['date']}")
        
        # Check if image already exists
        output_path = OUTPUT_DIR / location['filename']
        if output_path.exists():
            print(f"⏭️  Skipping (already exists): {location['filename']}")
            successful += 1
            continue
            
        # Generate image
        if generator.generate_image(location['prompt'], location['filename']):
            successful += 1
            # Check which API was used (rough heuristic)
            if GOOGLE_API_KEY:
                gemini_count += 1
            else:
                dalle_count += 1
        else:
            failed += 1
            
        # Rate limiting
        if i < len(JOURNEY_LOCATIONS):
            print("⏳ Waiting 10 seconds (rate limiting)...")
            time.sleep(10)
        
        print()
    
    print("🎉 Generation complete!")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"🟢 Gemini images: ~{gemini_count}")
    print(f"🔵 DALL-E images: ~{dalle_count}")
    print(f"📁 Images saved to: {OUTPUT_DIR}")
    
    # Cost estimation
    estimated_cost = (gemini_count * 0.020) + (dalle_count * 0.040)
    print(f"💰 Estimated cost: ${estimated_cost:.2f}")
    
    if successful > 0:
        print("\n📋 Next steps:")
        print("1. Review the generated images")
        print("2. Commit them to your repository:")
        print("   git add website/public/images/journey/")
        print("   git commit -m 'Add AI-generated journey images'")
        print("   git push")

if __name__ == "__main__":
    main() 