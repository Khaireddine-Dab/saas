import urllib.request
import urllib.error
import json

endpoints = [
    '/api/transactions/',
    '/api/transactions/stats/',
]

print("Testing transactions API endpoints (NO HEADERS):\n")

for endpoint in endpoints:
    try:
        req = urllib.request.Request(
            f'http://localhost:8000{endpoint}'
        )
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read().decode())
        
        print(f"✓ {endpoint}")
        print(f"  Status: {resp.status}")
        if isinstance(data, dict):
            if 'results' in data:
                print(f"  Transactions: {len(data.get('results', []))} items")
            elif 'total_transactions' in data:
                print(f"  Total: {data.get('total_transactions')} transactions")
            else:
                print(f"  Keys: {list(data.keys())}")
    except urllib.error.HTTPError as e:
        print(f"✗ {endpoint}")
        print(f"  Status: {e.code} ({e.reason})")
    except Exception as e:
        print(f"✗ {endpoint} - Error: {type(e).__name__}: {e}")
    print()
