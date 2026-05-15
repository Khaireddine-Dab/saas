import urllib.request
import urllib.error

try:
    req = urllib.request.Request(
        'http://localhost:8000/api/transactions/',
        headers={'Authorization': 'Bearer test'}
    )
    resp = urllib.request.urlopen(req)
    print(f'Status: {resp.status}')
    print(f'Content-Type: {resp.headers.get("Content-Type")}')
except urllib.error.HTTPError as e:
    print(f'HTTP Error {e.code}: {e.reason}')
    print(f'Response body: {e.read().decode()[:200]}')
except Exception as e:
    print(f'Error: {type(e).__name__}: {e}')
