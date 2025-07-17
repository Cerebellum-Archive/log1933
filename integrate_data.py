#!/usr/bin/env python3
"""
Integration script to copy digitized logbook data to the website
"""

import json
import shutil
from pathlib import Path

def integrate_digitized_data():
    """Copy digitized data to website public directory"""
    
    # Source and destination paths
    source_dir = Path("digitized_output")
    website_data_dir = Path("website/public/data")
    
    # Create data directory if it doesn't exist
    website_data_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy the complete logbook JSON
    source_json = source_dir / "complete_logbook.json"
    dest_json = website_data_dir / "complete_logbook.json"
    
    if source_json.exists():
        shutil.copy2(source_json, dest_json)
        print(f"✅ Copied {source_json} to {dest_json}")
        
        # Load and display stats
        with open(source_json, 'r') as f:
            data = json.load(f)
        
        print(f"📊 Data integrated:")
        print(f"   • Total entries: {data['metadata']['total_entries']}")
        print(f"   • Success rate: {data['metadata']['success_rate']}%")
        print(f"   • Average confidence: {data['metadata']['average_confidence']:.3f}")
        
        # Copy processing reports
        for report_file in ["processing_summary.txt", "processing_report.json"]:
            source_file = source_dir / report_file
            dest_file = website_data_dir / report_file
            if source_file.exists():
                shutil.copy2(source_file, dest_file)
                print(f"✅ Copied {report_file}")
        
        print(f"\n🌐 Website data ready at: {website_data_dir.absolute()}")
        print(f"🚀 Next steps:")
        print(f"   1. cd website")
        print(f"   2. vercel --prod")
        print(f"   3. Visit https://log1933.vercel.app/logbook")
        
    else:
        print(f"❌ Source file not found: {source_json}")
        print("Please run the digitization process first: python digitize_logbook.py")

if __name__ == "__main__":
    integrate_digitized_data() 