#!/usr/bin/env python3
"""
Setup script for Ernest K. Gann 1933 Logbook credentials.
This script helps you configure API keys and credentials securely.
"""

import os
import shutil
from pathlib import Path

def main():
    print("🔐 Ernest K. Gann 1933 Logbook - Credentials Setup")
    print("=" * 55)
    
    # Check if .env already exists
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env file already exists")
        response = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if response != 'y':
            print("Setup cancelled. Edit .env manually if needed.")
            return
    
    # Copy template
    template_file = Path("credentials/env.example")
    if not template_file.exists():
        print("❌ Template file not found: credentials/env.example")
        print("Make sure you're running this from the project root directory.")
        return
    
    # Copy the template
    shutil.copy(template_file, env_file)
    print(f"✅ Created .env file from template")
    
    # Interactive setup
    print("\n🔑 Let's set up your API keys:")
    print("(Press Enter to skip any optional keys)")
    
    # OpenAI API Key
    print("\n1. OpenAI API Key (Required)")
    print("   Get it from: https://platform.openai.com/api-keys")
    print("   Format should be: sk-...")
    openai_key = input("   Enter your OpenAI API key: ").strip()
    
    if openai_key:
        # Read current .env content
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Replace the placeholder
        content = content.replace('your_openai_api_key_here', openai_key)
        
        # Write back
        with open(env_file, 'w') as f:
            f.write(content)
        
        print("   ✅ OpenAI API key saved")
    else:
        print("   ⚠️  Skipped - you'll need to add this manually later")
    
    # Google Cloud Vision (optional)
    print("\n2. Google Cloud Vision (Optional)")
    print("   This provides better OCR accuracy but requires setup")
    use_google = input("   Do you want to set up Google Cloud Vision? (y/N): ").strip().lower()
    
    if use_google == 'y':
        print("   📋 To set up Google Cloud Vision:")
        print("   1. Go to: https://cloud.google.com/vision/docs/setup")
        print("   2. Create a project and enable the Vision API")
        print("   3. Create a service account and download the JSON key")
        print("   4. Save the JSON file as: credentials/google-cloud-vision.json")
        print("   5. The path is already configured in your .env file")
    
    # Set file permissions
    os.chmod(env_file, 0o600)  # Read/write for owner only
    
    print(f"\n🎉 Setup complete!")
    print(f"📁 Your .env file has been created with secure permissions")
    print(f"🔒 File permissions set to 600 (owner read/write only)")
    
    print(f"\n📝 Next steps:")
    print(f"1. Test your setup: python digitize_logbook.py")
    print(f"2. Read the documentation: credentials/README.md")
    print(f"3. Start digitizing: choose option 1 for testing")
    
    # Test the setup
    print(f"\n🧪 Testing your setup...")
    
    # Load the .env file
    from dotenv import load_dotenv
    load_dotenv()
    
    # Check OpenAI key
    test_key = os.getenv("OPENAI_API_KEY")
    if test_key and test_key.startswith("sk-"):
        print("✅ OpenAI API key format looks correct")
    elif test_key and test_key != "your_openai_api_key_here":
        print("⚠️  OpenAI API key found but format looks unusual")
    else:
        print("❌ OpenAI API key not found or not set")
    
    # Check Google credentials
    google_creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if google_creds and Path(google_creds).exists():
        print("✅ Google Cloud credentials file found")
    elif google_creds:
        print("⚠️  Google Cloud credentials path set but file not found")
    else:
        print("ℹ️  Google Cloud credentials not configured (optional)")
    
    print(f"\n🚀 Ready to digitize! Run: python digitize_logbook.py")

if __name__ == "__main__":
    main() 