#!/usr/bin/env python3
"""
Full-page browser screenshot - captures entire page including scrolled content
"""

import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def setup_fullpage_driver():
    """Setup Chrome driver for full-page screenshots"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def take_fullpage_screenshot(url, output_file="fullpage_screenshot.png"):
    """Take a full-page screenshot including all scrolled content"""
    driver = None
    try:
        driver = setup_fullpage_driver()
        print(f"📱 Navigating to: {url}")
        driver.get(url)
        
        # Wait for page to load
        time.sleep(5)
        
        # Get the total page height
        total_height = driver.execute_script("return document.body.scrollHeight")
        viewport_height = driver.execute_script("return window.innerHeight")
        
        print(f"📏 Page dimensions: {total_height}px total height, {viewport_height}px viewport")
        
        # Set window size to capture full page
        driver.set_window_size(1920, total_height)
        time.sleep(2)
        
        # Look for map elements specifically
        map_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='leaflet'], [id*='map']")
        if map_elements:
            print(f"🗺️  Found {len(map_elements)} map elements:")
            for i, elem in enumerate(map_elements):
                location = elem.location
                size = elem.size
                print(f"   Map {i+1}: at ({location['x']}, {location['y']}) size {size['width']}x{size['height']}")
                
                # Try to get map element classes
                classes = elem.get_attribute('class')
                if classes:
                    print(f"   Classes: {classes}")
        
        # Take the full page screenshot
        driver.save_screenshot(output_file)
        print(f"📸 Full-page screenshot saved: {output_file}")
        
        # Get page info
        title = driver.title
        current_url = driver.current_url
        
        return {
            "success": True,
            "screenshot": output_file,
            "title": title,
            "url": current_url,
            "total_height": total_height,
            "map_elements": len(map_elements)
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"success": False, "error": str(e)}
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fullpage_browser.py <url> [output_file]")
        sys.exit(1)
    
    url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "fullpage_screenshot.png"
    
    result = take_fullpage_screenshot(url, output_file)
    print(f"\n📊 Full-page capture result:")
    if result["success"]:
        print(f"✅ Screenshot: {result['screenshot']}")
        print(f"📄 Title: {result['title']}")
        print(f"📏 Height: {result['total_height']}px")
        print(f"🗺️  Map elements: {result['map_elements']}")
    else:
        print(f"❌ Error: {result['error']}") 