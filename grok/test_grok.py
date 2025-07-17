#!/usr/bin/env python3
"""
Simple Grok API test script
"""

import os
from openai import OpenAI

# MODEL CONFIGURATION - Easy to change
GROK_MODEL = "grok-3"  # Options: "grok-4-0709", "grok-3", "grok-3-fast", "grok-2-1212"
# Note: grok-4-0709 currently has empty response issues (as of current testing)

# You can either:
# 1. Set environment variables: export GROK_API_KEY="your-key-here"
# 2. Or replace "your-api-key-here" below with your actual key

def test_grok():
    # Try to get API key from environment first
    api_key = os.getenv('GROK_API_KEY', 'your-api-key-here')
    
    if api_key == 'your-api-key-here':
        print("❌ Please set your GROK_API_KEY environment variable or edit this script")
        print("   export GROK_API_KEY='xai-your-actual-key-here'")
        return False
    
    try:
        # Initialize Grok client
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.x.ai/v1"
        )
        
        print("🧪 Testing Grok API connection...")
        
        # Simple test
        response = client.chat.completions.create(
            model=GROK_MODEL,  # Using configurable Grok model
            messages=[
                {"role": "user", "content": "Say 'Hello from Grok!' and nothing else."}
            ],
            max_tokens=10
        )
        
        result = response.choices[0].message.content.strip()
        print(f"✅ Grok response: {result}")
        
        if "hello" in result.lower() and "grok" in result.lower():
            print("🎉 Grok API is working!")
            return True
        else:
            print("⚠️  Unexpected response format")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_grok() 