#!/usr/bin/env python3
"""
Progress Monitor for Ernest K. Gann 1933 Logbook Digitization
============================================================

This script monitors the ongoing digitization process and provides
real-time statistics and progress updates.
"""

import os
import json
import time
from pathlib import Path
from datetime import datetime
import re

def count_files_in_directory(directory, pattern="*.png"):
    """Count files matching pattern in directory."""
    path = Path(directory)
    if not path.exists():
        return 0
    return len(list(path.glob(pattern)))

def parse_log_file(log_file="digitization.log"):
    """Parse the log file to extract progress information."""
    if not os.path.exists(log_file):
        return None
    
    stats = {
        "processed_files": 0,
        "failed_files": 0,
        "tesseract_wins": 0,
        "google_vision_wins": 0,
        "openai_vision_wins": 0,
        "current_file": None,
        "last_update": None,
        "errors": []
    }
    
    try:
        with open(log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line in lines:
            # Count completed files
            if "Completed" in line and "Method:" in line:
                stats["processed_files"] += 1
                
                # Extract method
                if "Method: tesseract" in line:
                    stats["tesseract_wins"] += 1
                elif "Method: google_vision" in line:
                    stats["google_vision_wins"] += 1
                elif "Method: openai_vision" in line:
                    stats["openai_vision_wins"] += 1
            
            # Count failures
            elif "Failed to process" in line:
                stats["failed_files"] += 1
                stats["errors"].append(line.strip())
            
            # Track current file being processed
            elif "Processing png/" in line:
                match = re.search(r'Processing png/([^/]+\.png)', line)
                if match:
                    stats["current_file"] = match.group(1)
            
            # Get last timestamp
            if line.strip():
                timestamp_match = re.match(r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', line)
                if timestamp_match:
                    stats["last_update"] = timestamp_match.group(1)
    
    except Exception as e:
        print(f"Error reading log file: {e}")
        return None
    
    return stats

def get_output_stats():
    """Get statistics from output directory."""
    output_dir = Path("digitized_output")
    if not output_dir.exists():
        return {"json_files": 0, "txt_files": 0}
    
    json_files = len(list(output_dir.glob("*.json"))) - 1  # Exclude complete_logbook.json
    txt_files = len(list(output_dir.glob("*.txt")))
    
    return {"json_files": json_files, "txt_files": txt_files}

def display_progress():
    """Display current progress and statistics."""
    print("\n" + "="*60)
    print("🛩️  ERNEST K. GANN 1933 LOGBOOK DIGITIZATION MONITOR")
    print("="*60)
    
    # Count total files to process
    total_files = count_files_in_directory("png", "*.png")
    print(f"📁 Total PNG files: {total_files}")
    
    # Parse log file
    log_stats = parse_log_file()
    if not log_stats:
        print("❌ No log file found or unable to read. Process may not be running.")
        return
    
    # Get output statistics
    output_stats = get_output_stats()
    
    # Calculate progress
    processed = log_stats["processed_files"]
    failed = log_stats["failed_files"]
    completed_files = output_stats["json_files"]
    
    if total_files > 0:
        progress_percent = (processed / total_files) * 100
        print(f"📊 Progress: {processed}/{total_files} ({progress_percent:.1f}%)")
    else:
        print(f"📊 Progress: {processed} files processed")
    
    # Display current status
    if log_stats["current_file"]:
        print(f"🔄 Currently processing: {log_stats['current_file']}")
    
    if log_stats["last_update"]:
        print(f"⏰ Last update: {log_stats['last_update']}")
    
    print()
    
    # AI Method Performance
    print("🤖 AI METHOD PERFORMANCE:")
    print("-" * 30)
    total_successful = log_stats["tesseract_wins"] + log_stats["google_vision_wins"] + log_stats["openai_vision_wins"]
    
    if total_successful > 0:
        print(f"Tesseract OCR:     {log_stats['tesseract_wins']} ({log_stats['tesseract_wins']/total_successful*100:.1f}%)")
        print(f"Google Vision:     {log_stats['google_vision_wins']} ({log_stats['google_vision_wins']/total_successful*100:.1f}%)")
        print(f"OpenAI Vision:     {log_stats['openai_vision_wins']} ({log_stats['openai_vision_wins']/total_successful*100:.1f}%)")
    else:
        print("No completed files yet...")
    
    print()
    
    # File Status
    print("📄 FILE STATUS:")
    print("-" * 20)
    print(f"✅ Successfully processed: {processed}")
    print(f"💾 JSON files created: {output_stats['json_files']}")
    print(f"📝 Text files created: {output_stats['txt_files']}")
    
    if failed > 0:
        print(f"❌ Failed files: {failed}")
        print("\n🚨 RECENT ERRORS:")
        for error in log_stats["errors"][-3:]:  # Show last 3 errors
            print(f"   • {error}")
    else:
        print(f"❌ Failed files: 0")
    
    # Estimate completion time
    if processed > 0 and total_files > 0:
        remaining = total_files - processed
        if remaining > 0:
            # Rough estimate: 25 seconds per file
            estimated_minutes = (remaining * 25) / 60
            print(f"\n⏱️  Estimated time remaining: {estimated_minutes:.0f} minutes")
    
    print("\n" + "="*60)

def main():
    """Main monitoring function."""
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--watch":
        # Continuous monitoring mode
        print("Starting continuous monitoring... (Press Ctrl+C to stop)")
        try:
            while True:
                os.system('clear' if os.name == 'posix' else 'cls')  # Clear screen
                display_progress()
                time.sleep(10)  # Update every 10 seconds
        except KeyboardInterrupt:
            print("\n👋 Monitoring stopped.")
    else:
        # Single check mode
        display_progress()
        print("\n💡 Use 'python monitor_progress.py --watch' for continuous monitoring")

if __name__ == "__main__":
    main() 