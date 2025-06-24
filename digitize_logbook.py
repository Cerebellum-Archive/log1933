#!/usr/bin/env python3
"""
Quick start script for Ernest K. Gann 1933 Logbook digitization.
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    print("🛩️  Ernest K. Gann 1933 Logbook AI Digitization")
    print("=" * 50)
    
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OpenAI API key not found!")
        print("Please set your OpenAI API key:")
        print("export OPENAI_API_KEY='your-key-here'")
        print("\nOr run with: python digitize_logbook.py --openai-key YOUR_KEY")
        return
    
    # Check if PNG directory exists
    png_dir = Path("png")
    if not png_dir.exists():
        print(f"❌ PNG directory not found: {png_dir}")
        print("Make sure your PNG files are in the 'png' directory")
        return
    
    png_files = list(png_dir.glob("*.png"))
    print(f"📁 Found {len(png_files)} PNG files to process")
    
    if len(png_files) == 0:
        print("❌ No PNG files found in the png directory")
        return
    
    # Create output directory
    output_dir = Path("digitized_output")
    output_dir.mkdir(exist_ok=True)
    
    print(f"📝 Output will be saved to: {output_dir}")
    print(f"🚀 Starting digitization process...")
    print()
    
    # Ask user about processing options
    print("Options:")
    print("1. Process a few files for testing (5 files)")
    print("2. Process all files")
    
    choice = input("Choose option (1 or 2): ").strip()
    
    # Build command
    cmd = [sys.executable, "scripts/ai_digitization/main.py"]
    
    if choice == "1":
        cmd.extend(["--max-files", "5"])
        print("🧪 Running test mode (5 files)...")
    else:
        print("🚀 Processing all files...")
    
    # Run the digitization
    try:
        subprocess.run(cmd, check=True)
        print()
        print("✅ Digitization complete!")
        print(f"📁 Check the output in: {output_dir}")
        print(f"📄 Complete dataset: {output_dir}/complete_logbook.json")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Digitization failed: {e}")
    except KeyboardInterrupt:
        print("\n⏹️  Process interrupted by user")

if __name__ == "__main__":
    main() 