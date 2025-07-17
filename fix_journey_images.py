#!/usr/bin/env python3
"""
Fix journey images - create placeholders for missing ones and clean up duplicates
"""

from PIL import Image, ImageDraw, ImageFont
import os
from pathlib import Path

def create_placeholder_image(output_path, location_name, width=800, height=600):
    """Create a placeholder image for missing locations"""
    try:
        # Create a gradient background
        img = Image.new('RGB', (width, height), color='#1e293b')  # slate-800
        draw = ImageDraw.Draw(img)
        
        # Create gradient effect
        for y in range(height):
            color_val = int(30 + (y / height) * 50)  # Gradient from dark to lighter
            draw.line([(0, y), (width, y)], fill=(color_val, color_val + 20, color_val + 40))
        
        # Add text
        try:
            # Try to use a built-in font
            font_size = 48
            font = ImageFont.load_default()
        except:
            font = None
        
        # Add location text
        text = f"{location_name}\n(Coming Soon)"
        
        # Get text size and center it
        if font:
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
        else:
            text_width = len(text) * 10  # Rough estimate
            text_height = 20
        
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        # Add text with outline for visibility
        outline_color = '#000000'
        text_color = '#ffffff'
        
        # Draw outline
        for dx, dy in [(-2,-2), (-2,2), (2,-2), (2,2)]:
            draw.text((x+dx, y+dy), text, font=font, fill=outline_color, align='center')
        
        # Draw main text
        draw.text((x, y), text, font=font, fill=text_color, align='center')
        
        # Save the image
        img.save(output_path, 'JPEG', quality=90)
        print(f"✅ Created placeholder: {output_path.name}")
        return True
        
    except Exception as e:
        print(f"❌ Error creating placeholder {output_path}: {e}")
        return False

def main():
    """Fix journey images"""
    input_dir = Path("website/public/images/journey")
    
    if not input_dir.exists():
        input_dir.mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {input_dir}")
    
    print("🔧 Fixing journey images...")
    print("=" * 50)
    
    # Expected images and their display names
    expected_images = {
        "departure.jpg": "San Francisco Departure",
        "hawaii.jpg": "Hawaii", 
        "japan.jpg": "Tokyo, Japan",
        "china.jpg": "Shanghai, China",
        "philippines.jpg": "Manila, Philippines",
        "singapore.jpg": "Singapore",
        "india.jpg": "Calcutta, India",
        "middle_east.jpg": "Baghdad, Iraq",
        "egypt.jpg": "Cairo, Egypt",
        "africa.jpg": "Nairobi, Kenya",
        "europe.jpg": "London, England",
        "return.jpg": "New York Return"
    }
    
    # Check which images exist and create missing ones
    created_count = 0
    
    for filename, display_name in expected_images.items():
        image_path = input_dir / filename
        
        if image_path.exists():
            print(f"✅ Exists: {filename}")
        else:
            if create_placeholder_image(image_path, display_name):
                created_count += 1
    
    # Clean up duplicate files
    print(f"\n🧹 Cleaning up duplicate files...")
    cleanup_files = [
        "london-1933.jpg",
        "berlin-1933.jpg", 
        "chicago-1933.jpg",
        "hongkong-1933.jpg",
        "paris-1933.jpg"
    ]
    
    cleaned_count = 0
    for cleanup_file in cleanup_files:
        cleanup_path = input_dir / cleanup_file
        if cleanup_path.exists():
            cleanup_path.unlink()
            print(f"🗑️  Removed: {cleanup_file}")
            cleaned_count += 1
    
    print("=" * 50)
    print(f"🎉 Created {created_count} placeholder images")
    print(f"🧹 Cleaned up {cleaned_count} duplicate files")
    
    # List final files
    final_files = list(input_dir.glob("*.jpg"))
    print(f"📁 Final image count: {len(final_files)}")
    
    print(f"\n✅ Journey images fixed! Now run optimization:")
    print("   python optimize_journey_images.py")

if __name__ == "__main__":
    main() 