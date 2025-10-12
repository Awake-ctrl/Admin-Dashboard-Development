# reset_db.py
from database import engine, Base
import models

def reset_database():
    print("Dropping all tables in correct order...")
    
    # Use SQLAlchemy's built-in drop_all which handles dependencies correctly
    Base.metadata.drop_all(bind=engine)
    
    # The line `# print("Creating all tables...")` is a commented-out line of code in the Python
    # script `reset_db.py`. This line was likely used for debugging or informational purposes during
    # development but has been commented out and is not currently being executed when the script runs.
    print("Creating all tables...")
    models.Base.metadata.create_all(bind=engine)
    
    print("Database reset successfully!")

if __name__ == "__main__":
    reset_database()