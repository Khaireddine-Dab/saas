import psycopg
import sys

project_id = "lxpwsazvkslrhfjfyzuh"
password = "WKHNSsLChHMt8cgZ"
user = f"postgres.{project_id}"
db_name = "postgres"
port = 6543

regions = [
    "eu-west-1", "eu-central-1", "eu-west-3", "eu-west-2", "eu-north-1", "eu-central-2",
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "ap-southeast-1", "ap-northeast-1", "ca-central-1", "sa-east-1"
]
prefixes = ["aws-0", "aws-1"]

print(f"Starting diagnosis for project {project_id}...")

for region in regions:
    for prefix in prefixes:
        host = f"{prefix}-{region}.pooler.supabase.com"
        print(f"Testing {host}...", end=" ", flush=True)
        try:
            conn = psycopg.connect(
                conninfo=f"host={host} port={port} dbname={db_name} user={user} password={password} connect_timeout=5"
            )
            print("SUCCESS!")
            conn.close()
            sys.exit(0)
        except Exception as e:
            err = str(e).strip()
            if "Tenant or user not found" in err:
                print("FAILED (Tenant not found)")
            elif "timeout" in err:
                print("FAILED (Timeout)")
            else:
                print(f"FAILED ({err})")

print("\nAll tested regional poolers failed.")
