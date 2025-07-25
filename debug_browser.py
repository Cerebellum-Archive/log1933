#!/usr/bin/env python3
"""
Debug browser script - captures console errors and JavaScript issues
"""

import sys
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager

def setup_debug_driver():
    """Setup Chrome driver with debug logging enabled"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--enable-logging")
    chrome_options.add_argument("--log-level=0")
    chrome_options.add_argument("--verbose")
    
    # Enable console log capture
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
    
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def debug_map_loading(url, output_file="debug_screenshot.png"):
    """Debug map loading with console error capture"""
    driver = None
    try:
        driver = setup_debug_driver()
        print(f"🔍 Debug navigating to: {url}")
        driver.get(url)
        
        # Wait longer for JavaScript to load
        print("⏳ Waiting for page to fully load...")
        time.sleep(8)
        
        # Check for loading indicators
        try:
            loading_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Loading')]")
            if loading_elements:
                print(f"⚠️  Found {len(loading_elements)} loading indicators still present")
                for elem in loading_elements:
                    print(f"   Loading text: {elem.text}")
        except:
            pass
        
        # Check for map-related elements
        map_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='map'], [id*='map'], [class*='leaflet']")
        print(f"🗺️  Found {len(map_elements)} map-related elements")
        
        # Check for error elements
        error_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'error') or contains(text(), 'Error') or contains(text(), 'failed')]")
        if error_elements:
            print(f"❌ Found {len(error_elements)} potential error messages:")
            for elem in error_elements:
                print(f"   Error: {elem.text}")
        
        # Capture console logs
        print("📝 Capturing console logs...")
        logs = driver.get_log('browser')
        console_errors = []
        for log in logs:
            if log['level'] in ['SEVERE', 'WARNING']:
                console_errors.append(log)
                print(f"🚨 Console {log['level']}: {log['message']}")
        
        # Execute JavaScript to check for map object
        try:
            map_status = driver.execute_script("""
                const mapContainer = document.querySelector('[class*="map"], [id*="map"]');
                const leafletMap = window.L ? 'Leaflet loaded' : 'Leaflet not found';
                const reactErrors = window.__REACT_ERROR_OVERLAY__ ? 'React errors present' : 'No React errors';
                return {
                    mapContainer: mapContainer ? mapContainer.className : 'No map container found',
                    leafletStatus: leafletMap,
                    reactStatus: reactErrors,
                    windowError: window.lastError || 'No window errors'
                };
            """)
            print(f"🔧 JavaScript debug info:")
            for key, value in map_status.items():
                print(f"   {key}: {value}")
        except Exception as e:
            print(f"❌ JavaScript execution failed: {e}")
        
        # Take screenshot
        driver.save_screenshot(output_file)
        print(f"📸 Debug screenshot saved: {output_file}")
        
        return {
            "success": True,
            "console_errors": console_errors,
            "map_elements_found": len(map_elements),
            "loading_indicators": len(loading_elements) if 'loading_elements' in locals() else 0,
            "error_messages": len(error_elements),
            "screenshot": output_file
        }
        
    except Exception as e:
        print(f"❌ Debug error: {e}")
        return {"success": False, "error": str(e)}
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python debug_browser.py <url> [output_file]")
        sys.exit(1)
    
    url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "debug_screenshot.png"
    
    result = debug_map_loading(url, output_file)
    print(f"\n📊 Debug Summary:")
    print(json.dumps(result, indent=2)) 