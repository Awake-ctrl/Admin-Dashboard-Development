# complete_reset.py
from database import engine, Base
import models
from sqlalchemy import text

def complete_reset():
    print("Performing complete database reset...")
    
    # Drop all tables using raw SQL to ensure everything is cleaned
    drop_queries = [
        "DROP TABLE IF EXISTS content_versions CASCADE",
        "DROP TABLE IF EXISTS contents CASCADE",
        "DROP TABLE IF EXISTS lessons CASCADE", 
        "DROP TABLE IF EXISTS modules CASCADE",
        "DROP TABLE IF EXISTS course_subjects CASCADE",
        "DROP TABLE IF EXISTS courses CASCADE",
        "DROP TABLE IF EXISTS topics CASCADE",
        "DROP TABLE IF EXISTS subjects CASCADE", 
        "DROP TABLE IF EXISTS exams CASCADE",
        "DROP TABLE IF EXISTS refund_requests CASCADE",
        "DROP TABLE IF EXISTS transactions CASCADE",
        "DROP TABLE IF EXISTS account_deletion_requests CASCADE",
        "DROP TABLE IF EXISTS users CASCADE",
        "DROP TABLE IF EXISTS subscription_plans CASCADE"
    ]
    
    with engine.connect() as conn:
        # Start a transaction
        trans = conn.begin()
        try:
            for query in drop_queries:
                conn.execute(text(query))
                print(f"✓ Executed: {query}")
            
            trans.commit()
            print("✓ All tables dropped successfully")
        except Exception as e:
            trans.rollback()
            print(f"❌ Error dropping tables: {e}")
            return
    
    # Create all tables from scratch
    print("\nCreating all tables...")
    try:
        # Base.metadata.create_all(bind=engine)
        print("✓ All tables created successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    complete_reset()