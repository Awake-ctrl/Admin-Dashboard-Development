# debug_routes.py
import requests
import json

def check_routes():
    base_url = "http://localhost:8000"
    
    # Test all account-related endpoints
    endpoints = [
        "/api/account/profile/user_123456",
        "/api/account/password/user_123456", 
        "/api/account/notification-settings/user_123456",
        "/api/account/subscription/user_123456"
    ]
    
    print("🔍 Checking endpoint availability:")
    print("=" * 50)
    
    for endpoint in endpoints:
        try:
            # First check OPTIONS
            options_response = requests.options(f"{base_url}{endpoint}")
            print(f"OPTIONS {endpoint}: {options_response.status_code}")
            
            # Then check if endpoint exists with GET
            get_response = requests.get(f"{base_url}{endpoint}")
            print(f"GET {endpoint}: {get_response.status_code}")
            
        except Exception as e:
            print(f"❌ Error checking {endpoint}: {e}")
        
        print("-" * 30)

if __name__ == "__main__":
    check_routes()