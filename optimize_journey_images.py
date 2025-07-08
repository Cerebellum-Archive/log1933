#!/usr/bin/env python3
"""
Optimize journey images for web display
Reduces file sizes and resizes for better web performance
"""

from PIL import Image
import os
from pathlib import Path

def optimize_image(input_path, output_path, max_width=800, quality=85):
    """
    Optimize an image for web display
    - Resize to max_width while maintaining aspect ratio
    - Compress with specified quality
    - Convert to RGB if needed
    """
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (handles RGBA, etc.)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Calculate new dimensions
            width, height = img.size
            if width > max_width:
                new_width = max_width
                new_height = int((height * new_width) / width)
                img = img.resize((new_width, new_height), Image.Lanczos)
            
            # Save with optimization
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            # Get file sizes
            original_size = os.path.getsize(input_path) / 1024 / 1024  # MB
            new_size = os.path.getsize(output_path) / 1024 / 1024  # MB
            
            print(f"✅ {input_path.name}: {original_size:.1f}MB → {new_size:.1f}MB ({new_size/original_size*100:.0f}%)")
            return True
            
    except Exception as e:
        print(f"❌ Error optimizing {input_path}: {e}")
        return False

def main():
    """Optimize all journey images"""
    input_dir = Path("website/public/images/journey")
    
    if not input_dir.exists():
        print(f"❌ Directory not found: {input_dir}")
        return
    
    print("🖼️  Optimizing journey images for web...")
    print("=" * 50)
    
    total_original = 0
    total_optimized = 0
    count = 0
    
    for img_file in input_dir.glob("*.jpg"):
        if "optimized" in img_file.name:
            continue  # Skip already optimized files
            
        original_size = os.path.getsize(img_file) / 1024 / 1024
        total_original += original_size
        
        # Create optimized filename
        optimized_name = img_file.stem + "_optimized.jpg"
        optimized_path = input_dir / optimized_name
        
        if optimize_image(img_file, optimized_path):
            optimized_size = os.path.getsize(optimized_path) / 1024 / 1024
            total_optimized += optimized_size
            count += 1
            
            # Replace original with optimized
            img_file.unlink()  # Delete original
            optimized_path.rename(img_file)  # Rename optimized to original name
    
    print("=" * 50)
    print(f"🎉 Optimized {count} images")
    print(f"📊 Total size: {total_original:.1f}MB → {total_optimized:.1f}MB")
    print(f"💾 Space saved: {total_original - total_optimized:.1f}MB ({(1-total_optimized/total_original)*100:.0f}%)")

if __name__ == "__main__":
    main() 