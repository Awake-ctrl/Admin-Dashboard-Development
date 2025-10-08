# check_database.py
from database import engine
from sqlalchemy import text

def check_database():
    print("Checking database structure...")
    
    with engine.connect() as conn:
        # Check if courses table exists and its columns
        try:
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'courses'
                ORDER BY ordinal_position;
            """))
            columns = result.fetchall()
            
            print("\nColumns in 'courses' table:")
            if columns:
                for col in columns:
                    print(f"  {col[0]} ({col[1]}) - Nullable: {col[2]}")
            else:
                print("  No columns found - table might not exist")
                
        except Exception as e:
            print(f"Error checking courses table: {e}")
        
        # List all tables
        try:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            tables = result.fetchall()
            
            print("\nAll tables in database:")
            for table in tables:
                print(f"  {table[0]}")
                
        except Exception as e:
            print(f"Error listing tables: {e}")

if __name__ == "__main__":
    check_database()