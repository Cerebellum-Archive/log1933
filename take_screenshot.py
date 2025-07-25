#!/usr/bin/env python3
"""
Script to take a screenshot of the logbook timeline page
"""
import os
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def take_screenshot():
    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    try:
        # Initialize the driver
        driver = webdriver.Chrome(options=chrome_options)
        
        # Navigate to the timeline page
        url = "https://log1933.vercel.app/logbook/timeline"
        print(f"Navigating to: {url}")
        driver.get(url)
        
        # Wait for the page to load
        wait = WebDriverWait(driver, 10)
        
        # Wait for some key elements to load (adjust selectors as needed)
        try:
            # Wait for either the map or main content to load
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3)  # Additional wait for map and dynamic content
        except:
            print("Page elements may not have loaded completely, but proceeding with screenshot")
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"logbook_timeline_screenshot_{timestamp}.png"
        filepath = os.path.join(os.getcwd(), filename)
        
        # Take screenshot
        driver.save_screenshot(filepath)
        print(f"Screenshot saved to: {filepath}")
        
        return filepath
        
    except Exception as e:
        print(f"Error taking screenshot: {e}")
        return None
    
    finally:
        if 'driver' in locals():
            driver.quit()

if __name__ == "__main__":
    screenshot_path = take_screenshot()
    if screenshot_path:
        print(f"Success! Screenshot saved at: {screenshot_path}")
    else:
        print("Failed to take screenshot")