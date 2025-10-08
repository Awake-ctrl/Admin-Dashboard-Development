# test_db.py
from database import SessionLocal, engine

def test_connection():
    try:
        db = SessionLocal()
        result = db.execute("SELECT version();")
        version = result.fetchone()
        print(f"Database connected successfully!")
        print(f"PostgreSQL version: {version[0]}")
        db.close()
    except Exception as e:
        print(f"Database connection failed: {e}")

if __name__ == "__main__":
    test_connection()