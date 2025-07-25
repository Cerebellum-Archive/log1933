#!/usr/bin/env python3
"""
Enhanced browser automation tool - Better than MCP browser tools!
Usage: python enhanced_browser.py <action> <url> [options]
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
from webdriver_manager.chrome import ChromeDriverManager

def setup_driver(headless=True, window_size="1920,1080"):
    """Setup Chrome driver with optimal settings"""
    chrome_options = Options()
    if headless:
        chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument(f"--window-size={window_size}")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-web-security")
    
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def take_screenshot(url, output_file="screenshot.png", wait_time=3):
    """Take a screenshot of a webpage"""
    driver = None
    try:
        driver = setup_driver()
        print(f"📱 Navigating to: {url}")
        driver.get(url)
        
        # Wait for page to load
        time.sleep(wait_time)
        
        # Take screenshot
        driver.save_screenshot(output_file)
        
        # Get page info
        title = driver.title
        current_url = driver.current_url
        
        print(f"📸 Screenshot saved: {output_file}")
        print(f"📄 Page title: {title}")
        print(f"🔗 Current URL: {current_url}")
        
        return {
            "success": True,
            "screenshot": output_file,
            "title": title,
            "url": current_url
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"success": False, "error": str(e)}
    finally:
        if driver:
            driver.quit()

def extract_content(url, selector=None):
    """Extract text content from a webpage"""
    driver = None
    try:
        driver = setup_driver()
        print(f"📱 Navigating to: {url}")
        driver.get(url)
        time.sleep(3)
        
        if selector:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
            content = [elem.text for elem in elements]
        else:
            content = driver.find_element(By.TAG_NAME, "body").text
        
        title = driver.title
        
        result = {
            "success": True,
            "title": title,
            "url": url,
            "content": content
        }
        
        print(f"📄 Extracted content from: {title}")
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"success": False, "error": str(e)}
    finally:
        if driver:
            driver.quit()

def get_page_info(url):
    """Get comprehensive page information"""
    driver = None
    try:
        driver = setup_driver()
        print(f"📱 Analyzing: {url}")
        driver.get(url)
        time.sleep(3)
        
        info = {
            "success": True,
            "title": driver.title,
            "url": driver.current_url,
            "page_source_length": len(driver.page_source),
            "links": len(driver.find_elements(By.TAG_NAME, "a")),
            "images": len(driver.find_elements(By.TAG_NAME, "img")),
            "forms": len(driver.find_elements(By.TAG_NAME, "form")),
            "scripts": len(driver.find_elements(By.TAG_NAME, "script"))
        }
        
        print(f"📊 Page analysis complete:")
        print(f"   Title: {info['title']}")
        print(f"   Links: {info['links']}")
        print(f"   Images: {info['images']}")
        print(f"   Forms: {info['forms']}")
        
        return info
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"success": False, "error": str(e)}
    finally:
        if driver:
            driver.quit()

def main():
    if len(sys.argv) < 3:
        print("Usage:")
        print("  python enhanced_browser.py screenshot <url> [filename]")
        print("  python enhanced_browser.py extract <url> [selector]")
        print("  python enhanced_browser.py info <url>")
        print("\nExamples:")
        print("  python enhanced_browser.py screenshot https://example.com")
        print("  python enhanced_browser.py extract https://example.com 'h1'")
        print("  python enhanced_browser.py info https://example.com")
        sys.exit(1)
    
    action = sys.argv[1].lower()
    url = sys.argv[2]
    
    if action == "screenshot":
        filename = sys.argv[3] if len(sys.argv) > 3 else "screenshot.png"
        result = take_screenshot(url, filename)
    elif action == "extract":
        selector = sys.argv[3] if len(sys.argv) > 3 else None
        result = extract_content(url, selector)
        if result["success"]:
            print(f"Content: {result['content']}")
    elif action == "info":
        result = get_page_info(url)
        if result["success"]:
            print(json.dumps(result, indent=2))
    else:
        print(f"Unknown action: {action}")
        sys.exit(1)

if __name__ == "__main__":
    main() 