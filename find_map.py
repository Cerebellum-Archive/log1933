#!/usr/bin/env python3
"""
Find and capture the map section by scrolling through the page
"""

import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def find_and_capture_map(url):
    """Find the map by scrolling and take a screenshot of that section"""
    driver = None
    try:
        driver = setup_driver()
        print(f"📱 Navigating to: {url}")
        driver.get(url)
        
        # Wait for initial load
        time.sleep(5)
        
        # Get page dimensions
        total_height = driver.execute_script("return document.body.scrollHeight")
        viewport_height = driver.execute_script("return window.innerHeight")
        
        print(f"📏 Page: {total_height}px total, {viewport_height}px viewport")
        print("🔍 Searching for map section...")
        
        # Scroll through page in chunks to find map
        current_scroll = 0
        scroll_step = viewport_height
        
        while current_scroll < min(total_height, 10000):  # Limit to first 10k pixels
            # Scroll to position
            driver.execute_script(f"window.scrollTo(0, {current_scroll});")
            time.sleep(1)
            
            # Check for map elements in current view
            map_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='leaflet'], [id*='map']")
            
            if map_elements:
                print(f"🗺️  Found map at scroll position {current_scroll}px!")
                
                # Check if map is actually visible
                visible_maps = []
                for elem in map_elements:
                    if elem.is_displayed():
                        location = elem.location
                        size = elem.size
                        visible_maps.append({
                            'location': location,
                            'size': size,
                            'classes': elem.get_attribute('class')
                        })
                        print(f"   Visible map: {size['width']}x{size['height']} at ({location['x']}, {location['y']})")
                
                if visible_maps:
                    # Take screenshot of this section
                    screenshot_name = f"map_found_at_{current_scroll}.png"
                    driver.save_screenshot(screenshot_name)
                    print(f"📸 Map screenshot saved: {screenshot_name}")
                    
                    return {
                        "success": True,
                        "screenshot": screenshot_name,
                        "scroll_position": current_scroll,
                        "maps_found": len(visible_maps),
                        "map_details": visible_maps
                    }
            
            current_scroll += scroll_step
            
            # Show progress
            progress = min(100, (current_scroll / 10000) * 100)
            print(f"   Searched {progress:.1f}% of page...")
        
        print("❌ No visible map found in scanned area")
        return {"success": False, "error": "Map not found in visible area"}
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"success": False, "error": str(e)}
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python find_map.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    result = find_and_capture_map(url)
    
    print(f"\n📊 Map search result:")
    if result["success"]:
        print(f"✅ Found map at scroll position {result['scroll_position']}px")
        print(f"📸 Screenshot: {result['screenshot']}")
        print(f"🗺️  Maps found: {result['maps_found']}")
    else:
        print(f"❌ {result['error']}") 