from database import SessionLocal
import models
from datetime import date

def create_sample_data():
    db = SessionLocal()
    
    try:
        # Create sample students
        students = [
            models.Student(
                name="John Smith",
                email="john.smith@example.com",
                age=16,
                grade="10th",
                enrollment_date=date(2023, 9, 1)
            ),
            models.Student(
                name="Emma Johnson",
                email="emma.johnson@example.com",
                age=17,
                grade="11th",
                enrollment_date=date(2022, 9, 1)
            ),
            models.Student(
                name="Michael Brown",
                email="michael.brown@example.com",
                age=15,
                grade="9th",
                enrollment_date=date(2024, 9, 1)
            )
        ]
        
        # Create sample courses
        courses = [
            models.Course(
                name="Mathematics",
                description="Advanced Mathematics Course",
                instructor="Dr. Wilson",
                credits=4
            ),
            models.Course(
                name="Physics",
                description="Physics Fundamentals",
                instructor="Dr. Garcia",
                credits=3
            ),
            models.Course(
                name="English Literature",
                description="Classic and Modern Literature",
                instructor="Prof. Davis",
                credits=3
            )
        ]
        
        # Add to database
        db.add_all(students)
        db.add_all(courses)
        db.commit()
        
        # Refresh to get IDs
        for student in students:
            db.refresh(student)
        for course in courses:
            db.refresh(course)
        
        # Create sample grades
        grades = [
            models.Grade(student_id=1, course_id=1, grade=85.5, semester="Fall 2024"),
            models.Grade(student_id=1, course_id=2, grade=92.0, semester="Fall 2024"),
            models.Grade(student_id=2, course_id=1, grade=78.0, semester="Fall 2024"),
            models.Grade(student_id=2, course_id=3, grade=88.5, semester="Fall 2024"),
            models.Grade(student_id=3, course_id=2, grade=95.0, semester="Fall 2024"),
        ]
        
        db.add_all(grades)
        db.commit()
        
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()