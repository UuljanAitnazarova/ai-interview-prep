from sqlalchemy import text
from db.session import engine

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Connection successful!", result.scalar())
except Exception as e:
    print("❌ Connection failed:", e)
