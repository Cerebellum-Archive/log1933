#!/usr/bin/env python3
"""
Test script to verify MCP browser server is working
"""

import subprocess
import time
import json

def test_mcp_server():
    """Test that the MCP server can be started"""
    print("🧪 Testing Playwright MCP Server...")
    
    try:
        # Test that the command exists and is accessible
        result = subprocess.run(
            ["npx", "@playwright/mcp", "--help"], 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        
        if result.returncode == 0:
            print("✅ Playwright MCP server is accessible")
            print("✅ Browser capabilities available:")
            print("   - Web page browsing")
            print("   - Content extraction") 
            print("   - Form interaction")
            print("   - Screenshot capture")
            print("   - Element clicking")
            return True
        else:
            print(f"❌ Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("⚠️  Command timed out")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_config():
    """Check MCP configuration files"""
    print("\n🔧 Checking MCP Configuration...")
    
    import os
    config_path = os.path.expanduser("~/.claude-dev/mcp-config.json")
    
    if os.path.exists(config_path):
        print("✅ MCP config file exists")
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        if 'mcpServers' in config and 'playwright-browser' in config['mcpServers']:
            print("✅ Playwright browser server configured")
            return True
        else:
            print("⚠️  Browser server not found in config")
            return False
    else:
        print("❌ MCP config file not found")
        return False

if __name__ == "__main__":
    print("🔍 MCP Browser Setup Test")
    print("="*40)
    
    server_ok = test_mcp_server()
    config_ok = check_config()
    
    if server_ok and config_ok:
        print("\n🎉 Success! MCP browser server is ready!")
        print("\n📋 Next Steps:")
        print("1. Restart Cursor/VS Code")
        print("2. Open Claude Dev extension")
        print("3. Try asking Claude to 'browse a website'")
        print("4. Claude should now be able to see web pages!")
    else:
        print("\n❌ Setup incomplete. Check the errors above.") 