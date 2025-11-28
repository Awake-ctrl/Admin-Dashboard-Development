from database import engine, SessionLocal
from models import Base, Feature

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if features already exist
        existing_features = db.query(Feature).count()
        if existing_features == 0:
            # Create default features
            default_features = [
                Feature(
                    name="Unlimited Text Queries",
                    description="Access to unlimited text-based queries and responses",
                    # category="general"
                ),
                Feature(
                    name="Unlimited Image Queries",
                    description="Ability to upload and query images",
                    # category="premium"
                ),
                Feature(
                    name="Unlimited Audio Queries",
                    description="Voice input and audio processing capabilities",
                    # category="premium"
                ),
                Feature(
                    name="Priority Support",
                    description="Faster response times from support team",
                    # category="support"
                ),
                Feature(
                    name="Download Content",
                    description="Download study materials and resources",
                    # category="access"
                ),
            ]
            
            db.add_all(default_features)
            db.commit()
            print("Default features created successfully!")
        else:
            print("Features already exist in database.")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()