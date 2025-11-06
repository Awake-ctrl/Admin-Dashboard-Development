# test_direct.py
import requests

def test_direct():
    base_url = "http://localhost:8000"
    
    print("🧪 TESTING DIRECT ENDPOINTS")
    print("=" * 40)
    
    # Test 1: GET Profile
    print("1. Testing GET profile...")
    try:
        response = requests.get(f"{base_url}/api/account/profile/user_123456")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: PUT Profile
    print("\n2. Testing PUT profile...")
    profile_data = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "test@test.com"
    }
    try:
        response = requests.put(
            f"{base_url}/api/account/profile/user_123456",
            json=profile_data
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: PUT Password
    print("\n3. Testing PUT password...")
    password_data = {
        "currentPassword": "oldpass",
        "newPassword": "newpass",
        "confirmPassword": "newpass"
    }
    try:
        response = requests.put(
            f"{base_url}/api/account/password/user_123456",
            json=password_data
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_direct()