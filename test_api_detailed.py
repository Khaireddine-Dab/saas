import urllib.request
import urllib.error
import json

endpoints = [
    '/api/transactions/',
    '/api/transactions/stats/',
    '/api/transactions/successful/',
    '/api/transactions/failed/',
]

print("Testing transactions API endpoints:\n")

for endpoint in endpoints:
    try:
        req = urllib.request.Request(
            f'http://localhost:8000{endpoint}',
            headers={'Authorization': 'Bearer test'}
        )
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read().decode())
        
        if isinstance(data, dict) and 'results' in data:
            print(f"✓ {endpoint}")
            print(f"  Status: {resp.status}")
            print(f"  Results: {data.get('count', 'N/A')} items")
        elif isinstance(data, dict) and 'detail' in data:
            print(f"✓ {endpoint}")
            print(f"  Status: {resp.status}")
            print(f"  Data: {data}")
        else:
            print(f"✓ {endpoint}")
            print(f"  Status: {resp.status}")
            print(f"  Response keys: {list(data.keys())}")
    except urllib.error.HTTPError as e:
        print(f"✗ {endpoint}")
        print(f"  Status: {e.code} ({e.reason})")
        try:
            error_data = json.loads(e.read().decode())
            print(f"  Error: {error_data}")
        except:
            pass
    except Exception as e:
        print(f"✗ {endpoint} - Error: {type(e).__name__}: {e}")
    print()
