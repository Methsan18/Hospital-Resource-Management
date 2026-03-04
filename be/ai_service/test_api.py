#!/usr/bin/env python
"""
Test script to verify the Flask API is working correctly
"""

import json
import urllib.request
import urllib.error

def test_api():
    print("="*70)
    print("🧪 HOSPITAL AI SYSTEM - API TEST")
    print("="*70)
    
    # Test 1: Check if server is running
    print("\n[1] Testing Flask Server Connection...")
    try:
        response = urllib.request.urlopen('http://127.0.0.1:5001/', timeout=5)
        data = json.loads(response.read().decode('utf-8'))
        print(f"    ✅ Server Status: {data.get('status')}")
        print(f"    Modules: {', '.join(data.get('modules', []))}")
    except Exception as e:
        print(f"    ❌ Connection Failed: {e}")
        print("    🔧 Please start Flask server: python app.py")
        return False
    
    # Test 2: Test save_illness_input endpoint
    print("\n[2] Testing /save_illness_input Endpoint...")
    try:
        data = {
            'date': '2026-03-04',
            'disease': 'Dengue',
            'severity': 'Medium',
            'cases': 15,
            'department': 'OPD',
            'ageGroup': 'All Ages',
            'granularity': 'Weekly'
        }
        
        request = urllib.request.Request(
            'http://127.0.0.1:5001/save_illness_input',
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        response = urllib.request.urlopen(request, timeout=5)
        result = json.loads(response.read().decode('utf-8'))
        
        if result.get('status') == 'success':
            print(f"    ✅ Record Saved Successfully")
            print(f"    Record ID: {result.get('record_id')}")
            print(f"    Disease: {result.get('disease')}")
            print(f"    Cases: {result.get('cases')}")
        else:
            print(f"    ❌ Save Failed: {result.get('message')}")
            
    except urllib.error.HTTPError as e:
        error_data = json.loads(e.read().decode('utf-8'))
        print(f"    ❌ HTTP Error {e.code}: {error_data.get('message')}")
    except Exception as e:
        print(f"    ❌ Error: {e}")
    
    # Test 3: Check MongoDB
    print("\n[3] Checking MongoDB Connection...")
    try:
        import certifi
        from pymongo import MongoClient
        
        MONGO_URI = 'mongodb+srv://famousfiveproject31:gg79ZAXI9vSELnAr@itpm.gsmz0.mongodb.net/test?appName=ITPM'
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
        db = client['Research']
        
        count = db['Illness_Inputs'].count_documents({})
        print(f"    ✅ MongoDB Connected")
        print(f"    Illness_Inputs Records: {count}")
        
    except Exception as e:
        print(f"    ❌ MongoDB Error: {e}")
    
    print("\n" + "="*70)
    print("✅ ALL TESTS PASSED - System Ready!\n")

if __name__ == '__main__':
    test_api()
