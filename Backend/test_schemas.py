# test_schemas.py
from schemas import Course, User, Exam

def test_schemas():
    # Test creating instances
    course_data = {
        "name": "Test Course",
        "description": "Test Description", 
        "instructor": "Test Instructor",
        "credits": 3
    }
    
    course = Course(**course_data)
    print("✓ Course schema works")
    
    user_data = {
        "id": "test_001",
        "name": "Test User",
        "email": "test@example.com"
    }
    
    user = User(**user_data)
    print("✓ User schema works")
    
    exam_data = {
        "id": 1,
        "name": "test",
        "display_name": "Test Exam"
    }
    
    exam = Exam(**exam_data)
    print("✓ Exam schema works")
    
    print("All schemas are working correctly!")

if __name__ == "__main__":
    test_schemas()