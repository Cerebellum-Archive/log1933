#!/usr/bin/env python3
"""
Simple browser automation for taking screenshots
Usage: python browser_screenshot.py <url> [output_filename]
"""

import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def take_screenshot(url, output_file="screenshot.png"):
    """Take a screenshot of a webpage"""
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in background
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    try:
        # Setup driver
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        print(f"📱 Navigating to: {url}")
        driver.get(url)
        
        # Wait for page to load
        time.sleep(3)
        
        # Take screenshot
        driver.save_screenshot(output_file)
        print(f"📸 Screenshot saved: {output_file}")
        
        # Get page title and basic info
        title = driver.title
        print(f"📄 Page title: {title}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
        
    finally:
        if 'driver' in locals():
            driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python browser_screenshot.py <url> [output_filename]")
        sys.exit(1)
    
    url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "screenshot.png"
    
    take_screenshot(url, output_file) 