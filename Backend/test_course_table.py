# test_course_table.py
from database import SessionLocal, engine
import models

def test_course_table():
    print("Testing course table...")
    
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Try to create a course
        course = models.Course(
            title="Test Course",
            description="Test Description",
            exam_type="jee",
            instructor="Test Instructor",
            price=100.0,
            duration="1 month",
            exam_id=1
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        print("✓ Successfully created test course")
        
        # Try to query it
        found_course = db.query(models.Course).filter(models.Course.title == "Test Course").first()
        if found_course:
            print(f"✓ Successfully queried course: {found_course.title}")
        else:
            print("❌ Could not find the test course")
            
        # Clean up
        db.delete(found_course)
        db.commit()
        print("✓ Cleaned up test course")
        
    except Exception as e:
        print(f"❌ Error with course table: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_course_table()