#!/usr/bin/env python3
"""
Ernest K. Gann 1933 Logbook AI Digitization - Quick Start Script
================================================================

This script orchestrates a sophisticated AI pipeline to digitize Ernest K. Gann's
handwritten 1933 world tour logbook using multiple complementary technologies.
"""

import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv

def display_pipeline_info():
    """Display detailed information about the AI digitization pipeline."""
    print("🤖 AI DIGITIZATION PIPELINE")
    print("=" * 50)
    print("This system uses THREE AI engines working together:")
    print()
    print("1️⃣  TESSERACT OCR (Local)")
    print("   • Traditional OCR engine")
    print("   • Good for printed text")
    print("   • Confidence: Usually 0.6-0.8 for handwriting")
    print()
    print("2️⃣  GOOGLE VISION API (Cloud)")
    print("   • Advanced machine learning OCR")
    print("   • Excellent for handwritten text")
    print("   • Confidence: Often 0.9-1.0 for clear images")
    print("   • FREE: 1,000 images/month")
    print()
    print("3️⃣  OPENAI GPT-4o VISION (Cloud)")
    print("   • Latest multimodal AI model")
    print("   • Understands context and layout")
    print("   • Confidence: Typically 0.8-0.9")
    print("   • Cost: ~$0.03-0.05 per image")
    print()
    print("🧠 INTELLIGENT SELECTION:")
    print("   • System tests all three engines")
    print("   • Automatically picks the BEST result")
    print("   • GPT-4o then improves the text")
    print("   • Extracts metadata (dates, locations)")
    print()

def display_input_info(png_dir, png_files):
    """Display detailed information about input files."""
    print("📁 INPUT FILES ANALYSIS")
    print("=" * 50)
    print(f"Directory: {png_dir.absolute()}")
    print(f"Total PNG files found: {len(png_files)}")
    
    if png_files:
        # Calculate file sizes
        total_size = sum(f.stat().st_size for f in png_files)
        avg_size = total_size / len(png_files)
        
        print(f"Total size: {total_size / (1024*1024):.1f} MB")
        print(f"Average file size: {avg_size / (1024*1024):.1f} MB")
        
        # Show sample files
        print(f"\nSample files:")
        for i, f in enumerate(png_files[:5]):
            size_mb = f.stat().st_size / (1024*1024)
            print(f"   • {f.name} ({size_mb:.1f} MB)")
        
        if len(png_files) > 5:
            print(f"   ... and {len(png_files) - 5} more files")
        
        # Estimate processing time and cost
        print(f"\n⏱️  PROCESSING ESTIMATES:")
        print(f"   • Time per file: ~20-30 seconds")
        print(f"   • Total estimated time: {len(png_files) * 25 / 60:.0f} minutes")
        print(f"   • OpenAI cost estimate: ${len(png_files) * 0.04:.2f}")
        print(f"   • Google Vision: FREE (under 1,000/month)")
    print()

def display_output_info(output_dir):
    """Display detailed information about output structure."""
    print("📄 OUTPUT FILES & STRUCTURE")
    print("=" * 50)
    print(f"Main output directory: {output_dir.absolute()}")
    print()
    print("For each processed image, you'll get:")
    print("├── Individual Files:")
    print("│   ├── IMG_XXXX.json    (Complete structured data)")
    print("│   └── IMG_XXXX.txt     (Clean readable text)")
    print("├── Master Dataset:")
    print("│   └── complete_logbook.json (All entries combined)")
    print("└── Processing Log:")
    print("    └── digitization.log (Detailed processing info)")
    print()
    print("📊 JSON STRUCTURE (each file contains):")
    print("   • filename: Original PNG filename")
    print("   • page_number: Extracted from filename")
    print("   • date_entry: AI-extracted date (e.g., '1933-01-14')")
    print("   • location: AI-extracted location")
    print("   • content: Clean, improved text")
    print("   • raw_ocr_text: Original OCR output")
    print("   • confidence_score: Quality rating (0.0-1.0)")
    print("   • processing_method: Which AI won (tesseract/google_vision/openai_vision)")
    print("   • timestamp: When processed")
    print()

def display_website_integration():
    """Display information about website integration."""
    print("🌐 WEBSITE INTEGRATION")
    print("=" * 50)
    print("The digitized data integrates with your Next.js website:")
    print(f"   • Website URL: https://log1933.vercel.app")
    print(f"   • Data location: website/public/data/")
    print(f"   • Search functionality: Full-text search")
    print(f"   • Interactive timeline: Chronological navigation")
    print(f"   • Modal viewers: Detailed entry display")
    print()

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    print("🛩️  ERNEST K. GANN 1933 LOGBOOK")
    print("    AI-Powered Historical Document Digitization")
    print("=" * 60)
    print()
    
    # Display pipeline information
    display_pipeline_info()
    
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ SETUP REQUIRED: OpenAI API key not found!")
        print("=" * 50)
        print("Please configure your API key:")
        print("1. Edit the .env file in this directory")
        print("2. Add: OPENAI_API_KEY=your-key-here")
        print("3. Or set environment variable:")
        print("   export OPENAI_API_KEY='your-key-here'")
        print()
        print("💡 Get your API key at: https://platform.openai.com/api-keys")
        return
    
    # Check Google Vision credentials
    google_creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if google_creds and os.path.exists(google_creds):
        print("✅ Google Vision API: Configured")
    else:
        print("⚠️  Google Vision API: Not configured (will use Tesseract + OpenAI only)")
    print("✅ OpenAI API: Configured")
    print()
    
    # Check if PNG directory exists
    png_dir = Path("png")
    if not png_dir.exists():
        print("❌ INPUT ERROR: PNG directory not found!")
        print("=" * 50)
        print(f"Expected location: {png_dir.absolute()}")
        print("Please ensure your PNG files are in the 'png' directory")
        print()
        print("Directory structure should be:")
        print("log1933/")
        print("├── png/")
        print("│   ├── IMG_4270.png")
        print("│   ├── IMG_4271.png")
        print("│   └── ... (your logbook images)")
        print("└── digitize_logbook.py")
        return
    
    png_files = list(png_dir.glob("*.png"))
    if len(png_files) == 0:
        print("❌ No PNG files found in the png directory")
        print(f"Directory exists but is empty: {png_dir.absolute()}")
        return
    
    # Display input file analysis
    display_input_info(png_dir, png_files)
    
    # Create output directory
    output_dir = Path("digitized_output")
    output_dir.mkdir(exist_ok=True)
    
    # Display output information
    display_output_info(output_dir)
    
    # Display website integration info
    display_website_integration()
    
    # Processing options
    print("🚀 PROCESSING OPTIONS")
    print("=" * 50)
    print("1. 🧪 Test Mode (1 file)")
    print("   • Process single file for testing")
    print("   • Time: ~30 seconds")
    print("   • Cost: ~$0.04")
    print("   • Perfect for validating setup")
    print()
    print("2. 🌟 Full Processing (all files)")
    print(f"   • Process all {len(png_files)} files")
    print(f"   • Time: ~{len(png_files) * 25 / 60:.0f} minutes")
    print(f"   • Cost: ~${len(png_files) * 0.04:.2f}")
    print("   • Complete historical digitization")
    print()
    print("3. 📊 Monitor Progress")
    print("   • View processing status")
    print("   • Check completion statistics")
    print("   • Monitor for errors")
    print()
    
    choice = input("Choose option (1, 2, or 3): ").strip()
    
    # Build command - use the virtual environment Python
    venv_python = Path("venv/bin/python")
    if venv_python.exists():
        python_cmd = str(venv_python)
    else:
        python_cmd = sys.executable
    
    if choice == "1":
        # Test mode
        cmd = [python_cmd, "scripts/ai_digitization/main.py", "--max-files", "1"]
        print("\n🧪 STARTING TEST MODE")
        print("=" * 30)
        print("Processing 1 file to validate the system...")
        
    elif choice == "2":
        # Full processing
        cmd = [python_cmd, "scripts/ai_digitization/main.py"]
        print(f"\n🌟 STARTING FULL PROCESSING")
        print("=" * 35)
        print(f"Processing all {len(png_files)} files...")
        print("This will take some time - you can monitor progress in the logs.")
        
    elif choice == "3":
        # Monitor progress
        cmd = [python_cmd, "monitor_progress.py"]
        print("\n📊 STARTING PROGRESS MONITOR")
        print("=" * 35)
        print("Monitoring digitization progress...")
        
    else:
        print("❌ Invalid choice. Please run the script again and choose 1, 2, or 3.")
        return
    
    print()
    print("🔄 AI Pipeline Status:")
    print("   1. Loading images...")
    print("   2. Running OCR engines...")
    print("   3. Selecting best results...")
    print("   4. Improving text with GPT-4o...")
    print("   5. Extracting metadata...")
    print("   6. Saving structured data...")
    print()
    
    # Run the digitization
    try:
        result = subprocess.run(cmd, check=True, capture_output=False)
        
        print()
        print("🎉 PROCESSING COMPLETE!")
        print("=" * 40)
        print("✅ All files processed successfully")
        print(f"📁 Output location: {output_dir.absolute()}")
        print(f"📄 Master dataset: {output_dir}/complete_logbook.json")
        print(f"📋 Processing log: digitization.log")
        print()
        print("🌐 NEXT STEPS:")
        print("   • Review the digitized text files")
        print("   • Check the JSON data structure")
        print("   • Integrate with your website")
        print("   • Share Ernest K. Gann's historic journey!")
        
    except subprocess.CalledProcessError as e:
        print()
        print("❌ PROCESSING ERROR")
        print("=" * 30)
        print(f"Error: {e}")
        print("Check digitization.log for detailed error information")
        print()
        print("💡 Common solutions:")
        print("   • Verify API keys are correct")
        print("   • Check internet connection")
        print("   • Ensure PNG files are readable")
        print("   • Try test mode first (option 1)")
        
    except KeyboardInterrupt:
        print()
        print("⏹️  PROCESSING INTERRUPTED")
        print("=" * 35)
        print("Process stopped by user")
        print("Partial results may be available in the output directory")
        
    except FileNotFoundError:
        print()
        print("❌ SCRIPT NOT FOUND")
        print("=" * 30)
        print("Could not find the main digitization script.")
        print("Expected location: scripts/ai_digitization/main.py")
        print()
        print("💡 Please ensure the AI digitization scripts are properly installed.")

if __name__ == "__main__":
    main() 