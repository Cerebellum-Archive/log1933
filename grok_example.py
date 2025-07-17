#!/usr/bin/env python3
"""
Example script for using Grok API with the Ernest K. Gann 1933 Logbook Project
"""

import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_grok_client():
    """Initialize Grok API client"""
    api_key = os.getenv('GROK_API_KEY')
    base_url = os.getenv('GROK_BASE_URL', 'https://api.x.ai/v1')
    
    if not api_key:
        raise ValueError("GROK_API_KEY not found in environment variables")
    
    return OpenAI(api_key=api_key, base_url=base_url)

def analyze_logbook_text(text, client=None):
    """Use Grok to analyze logbook text"""
    if client is None:
        client = init_grok_client()
    
    prompt = f"""
    Analyze this text from Ernest K. Gann's 1933 world tour logbook. 
    Please identify:
    1. Key locations mentioned
    2. Important people or contacts
    3. Business activities described
    4. Cultural observations
    5. Any technical details about aviation/travel
    
    Text to analyze:
    {text}
    """
    
    response = client.chat.completions.create(
        model="grok-3",  # Updated to working model
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
        temperature=0.7
    )
    
    return response.choices[0].message.content

def summarize_logbook_section(text, client=None):
    """Create a concise summary of a logbook section"""
    if client is None:
        client = init_grok_client()
    
    prompt = f"""
    Create a concise summary (2-3 sentences) of this excerpt from Ernest Gann's 1933 world tour logbook:
    
    {text}
    """
    
    response = client.chat.completions.create(
        model="grok-3",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.5
    )
    
    return response.choices[0].message.content

def main():
    """Example usage with actual logbook content"""
    try:
        client = init_grok_client()
        
        # Load some actual logbook text from the project
        try:
            with open("full_text_from_png.txt", "r") as f:
                # Read first 2000 characters for analysis
                sample_text = f.read(2000)
        except FileNotFoundError:
            # Fallback sample text
            sample_text = """
            I am at present on the threshold of a world tour....just like that, 
            you see, I say "World Tour". As a matter of fact I am not terribly 
            excited. I have business to do along the way and naturally I have no 
            intentions of neglecting the purely entertaining points of such a trip.
            I have been stamped, instructed, advised, criticized, envied, pitied, 
            inoculated, vaccinated, and remonstrated with, until I am now but a 
            shadow of my former robust self.
            """
        
        print("🤖 Analyzing logbook text with Grok...")
        print("="*60)
        
        # Create summary
        print("📝 SUMMARY:")
        summary = summarize_logbook_section(sample_text, client)
        print(summary)
        print()
        
        # Detailed analysis  
        print("📊 DETAILED ANALYSIS:")
        analysis = analyze_logbook_text(sample_text, client)
        print(analysis)
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 