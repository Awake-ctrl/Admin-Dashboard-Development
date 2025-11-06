# simple_debug.py - No external dependencies
import urllib.request
import urllib.error
import json

def check_endpoints():
    base_url = "http://localhost:8000"
    
    endpoints = [
        "/api/account/profile/user_123456",
        "/api/account/password/user_123456",
        "/api/account/notification-settings/user_123456",
        "/debug/all-routes"
    ]
    
    print("🔍 Checking Endpoints (Simple Version)")
    print("=" * 50)
    
    for endpoint in endpoints:
        full_url = base_url + endpoint
        print(f"\nTesting: {endpoint}")
        
        # Test GET request
        try:
            req = urllib.request.Request(
                full_url,
                method='GET',
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req) as response:
                print(f"  ✅ GET: {response.status}")
                if endpoint == "/debug/all-routes":
                    data = json.loads(response.read().decode())
                    print(f"  📊 Routes count: {data.get('all_routes_count', 'N/A')}")
        except urllib.error.HTTPError as e:
            print(f"  ❌ GET: {e.code} {e.reason}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test OPTIONS request
        try:
            req = urllib.request.Request(
                full_url,
                method='OPTIONS',
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req) as response:
                print(f"  ✅ OPTIONS: {response.status}")
        except urllib.error.HTTPError as e:
            print(f"  ❌ OPTIONS: {e.code} {e.reason}")
        except Exception as e:
            print(f"  ❌ Error: {e}")

if __name__ == "__main__":
    check_endpoints()