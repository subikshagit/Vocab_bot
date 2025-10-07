from dotenv import load_dotenv
import psycopg2, os

load_dotenv(override=True)
print(os.getenv('SUPABASE_DB_NAME'))

def build_dsn():
    host = os.getenv('SUPABASE_DB_HOST', default=None)
    print(host)
    if host:
        name = os.getenv('SUPABASE_DB_NAME')
        user = os.getenv('SUPABASE_DB_USER')
        pwd = os.getenv('SUPABASE_DB_PASSWORD')
        port = os.getenv('SUPABASE_DB_PORT', default='5432')
        dsn = f"postgresql://{user}:{pwd}@{host}:{port}/{name}"
        print(f"Using SUPABASE_* DSN -> {host}:{port}")
        return dsn
    else:
        dsn = os.getenv('DATABASE_URL', default=None)
        if dsn:
            print("Using DATABASE_URL")
            return dsn
        raise SystemExit("DATABASE_URL or SUPABASE_* vars are missing.")

try:
    dsn = build_dsn()
    conn = psycopg2.connect(dsn, sslmode='require')
    print('✅ Database connection successful!')
    conn.close()
except Exception as e:
    print('❌ Connection failed:', e)  