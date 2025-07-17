#!/usr/bin/env python3
"""
Setup script for Grok API (xAI) integration
This script helps configure the Grok API for the Ernest K. Gann 1933 Logbook Project
"""

import os
import getpass
from pathlib import Path

def setup_grok_api():
    """Set up Grok API credentials and test connection"""
    
    print("🚀 Setting up Grok API (xAI) for Ernest K. Gann 1933 Logbook Project")
    print("="*60)
    
    # Check if .env already exists
    env_file = Path(".env")
    credentials_dir = Path("credentials")
    
    if not credentials_dir.exists():
        credentials_dir.mkdir(exist_ok=True)
    
    # Get API key securely
    print("\nTo get your Grok API key:")
    print("1. Go to https://console.x.ai/")
    print("2. Sign in with your X (Twitter) account")
    print("3. Navigate to API Keys section")
    print("4. Create a new API key")
    print("5. Copy the key (it starts with 'xai-')")
    print()
    
    api_key = getpass.getpass("Enter your Grok API key (input will be hidden): ").strip()
    
    if not api_key.startswith('xai-'):
        print("⚠️  Warning: Grok API keys typically start with 'xai-'")
        confirm = input("Continue anyway? (y/N): ").strip().lower()
        if confirm != 'y':
            print("Setup cancelled.")
            return False
    
    # Read existing .env or create new one
    env_content = []
    if env_file.exists():
        with open(env_file, 'r') as f:
            env_content = f.readlines()
    
    # Remove existing GROK entries
    env_content = [line for line in env_content if not line.startswith(('GROK_API_KEY=', 'GROK_BASE_URL='))]
    
    # Add Grok configuration
    env_content.append(f"\n# Grok API (xAI)\n")
    env_content.append(f"GROK_API_KEY={api_key}\n")
    env_content.append(f"GROK_BASE_URL=https://api.x.ai/v1\n")
    
    # Write .env file
    with open(env_file, 'w') as f:
        f.writelines(env_content)
    
    # Set permissions (readable only by owner)
    env_file.chmod(0o600)
    
    print("✅ Environment variables saved to .env")
    
    # Test the API connection
    print("\n🧪 Testing Grok API connection...")
    return test_grok_connection(api_key)

def test_grok_connection(api_key):
    """Test the Grok API connection"""
    try:
        from openai import OpenAI
        
        # Initialize Grok client
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.x.ai/v1"
        )
        
        # Test with a simple request
        response = client.chat.completions.create(
            model="grok-beta",
            messages=[
                {"role": "user", "content": "Hello! Can you respond with exactly: 'Grok API connection successful!'"}
            ],
            max_tokens=50
        )
        
        result = response.choices[0].message.content.strip()
        print(f"✅ API Response: {result}")
        
        if "successful" in result.lower():
            print("🎉 Grok API is working correctly!")
            return True
        else:
            print("⚠️  API responded but with unexpected content")
            return False
            
    except ImportError:
        print("❌ OpenAI package not found. Install with: pip install openai")
        return False
    except Exception as e:
        print(f"❌ API test failed: {str(e)}")
        print("\nCommon issues:")
        print("- Check your API key is correct")
        print("- Ensure you have credits in your xAI account")
        print("- Verify your internet connection")
        return False

def create_grok_example():
    """Create an example script showing how to use Grok API"""
    
    example_content = '''#!/usr/bin/env python3
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
        model="grok-beta",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
        temperature=0.7
    )
    
    return response.choices[0].message.content

def main():
    """Example usage"""
    try:
        client = init_grok_client()
        
        # Sample text from the logbook
        sample_text = """
        I am at present on the threshold of a world tour....just like that, 
        you see, I say "World Tour". As a matter of fact I am not terribly 
        excited. I have business to do along the way and naturally I have no 
        intentions of neglecting the purely entertaining points of such a trip.
        """
        
        print("🤖 Analyzing sample logbook text with Grok...")
        analysis = analyze_logbook_text(sample_text, client)
        print("\\n📊 Analysis Results:")
        print("="*50)
        print(analysis)
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
'''
    
    with open("grok_example.py", "w") as f:
        f.write(example_content)
    
    print("📝 Created grok_example.py - example script for using Grok API")

if __name__ == "__main__":
    success = setup_grok_api()
    
    if success:
        create_grok_example()
        print("\n🎯 Next steps:")
        print("1. Run: python grok_example.py")
        print("2. Check the logbook analysis capabilities")
        print("3. Integrate Grok into your existing scripts")
        print("4. Remember: .env file contains your API key - keep it secure!")
    else:
        print("\n🔧 Setup incomplete. Please check your API key and try again.") 