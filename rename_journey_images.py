#!/usr/bin/env python3
"""
Rename journey images to match what the website expects
"""

import os
from pathlib import Path

def main():
    """Rename journey images to match website expectations"""
    input_dir = Path("website/public/images/journey")
    
    if not input_dir.exists():
        print(f"❌ Directory not found: {input_dir}")
        return
    
    # Mapping of current filenames to expected filenames
    rename_mapping = {
        "nyc-departure-1933.jpg": "departure.jpg",
        "hawaii-1933.jpg": "hawaii.jpg", 
        "tokyo-1933.jpg": "japan.jpg",
        "shanghai-1933.jpg": "china.jpg",
        "manila-1933.jpg": "philippines.jpg",
        "singapore-1933.jpg": "singapore.jpg",
        "bombay-1933.jpg": "india.jpg",  # Bombay = Calcutta area
        "bangkok-1933.jpg": "middle_east.jpg",  # If you have this
        "cairo-1933.jpg": "egypt.jpg",   # If you have this
        "nairobi-1933.jpg": "africa.jpg", # If you have this
        "london-1933.jpg": "europe.jpg",
        "return-america-1933.jpg": "return.jpg",
        "chicago-1933.jpg": "return.jpg",  # Use Chicago as return image if needed
        "paris-1933.jpg": "europe.jpg",   # Paris can be Europe
        "berlin-1933.jpg": "europe.jpg",  # Berlin can be Europe backup
        "moscow-1933.jpg": "europe.jpg",  # Moscow can be Europe backup
        "hongkong-1933.jpg": "china.jpg", # Hong Kong = China area
    }
    
    print("🔄 Renaming journey images to match website expectations...")
    print("=" * 60)
    
    renamed_count = 0
    
    # Get list of current files
    current_files = list(input_dir.glob("*.jpg"))
    print(f"📁 Found {len(current_files)} current files")
    
    # Keep track of which target names we've used
    used_targets = set()
    
    for current_file in current_files:
        current_name = current_file.name
        
        if current_name in rename_mapping:
            target_name = rename_mapping[current_name]
            target_path = input_dir / target_name
            
            # Skip if we've already used this target name
            if target_name in used_targets:
                print(f"⚠️  Skipping {current_name} → {target_name} (target already exists)")
                continue
                
            # Skip if target already exists
            if target_path.exists():
                print(f"⚠️  Skipping {current_name} → {target_name} (target file exists)")
                continue
            
            try:
                current_file.rename(target_path)
                print(f"✅ Renamed: {current_name} → {target_name}")
                used_targets.add(target_name)
                renamed_count += 1
            except Exception as e:
                print(f"❌ Error renaming {current_name}: {e}")
        else:
            print(f"⚠️  No mapping for: {current_name}")
    
    print("=" * 60)
    print(f"🎉 Renamed {renamed_count} images")
    
    # Check what we have now
    final_files = list(input_dir.glob("*.jpg"))
    print(f"📁 Final file count: {len(final_files)}")
    
    # List expected files vs actual files
    expected_files = [
        "departure.jpg", "hawaii.jpg", "japan.jpg", "china.jpg", 
        "philippines.jpg", "singapore.jpg", "india.jpg", "middle_east.jpg",
        "egypt.jpg", "africa.jpg", "europe.jpg", "return.jpg"
    ]
    
    print("\n📋 Expected vs Actual:")
    for expected in expected_files:
        expected_path = input_dir / expected
        status = "✅" if expected_path.exists() else "❌"
        print(f"  {status} {expected}")
    
    print(f"\n✅ Renaming complete! Now run the optimization:")
    print("   python optimize_journey_images.py")

if __name__ == "__main__":
    main() 