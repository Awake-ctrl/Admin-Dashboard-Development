# init_course_data.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import uuid
from datetime import datetime, date

def init_db():
    print("Creating tables if they don't exist...")
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("Creating exams...")
        # Create exams
        exams_data = [
            {"name": "jee", "display_name": "JEE Main & Advanced", "description": "Engineering entrance exam"},
            {"name": "neet", "display_name": "NEET", "description": "Medical entrance exam"},
            {"name": "cat", "display_name": "CAT", "description": "Management entrance exam"},
            {"name": "upsc", "display_name": "UPSC", "description": "Civil services exam"},
            {"name": "gate", "display_name": "GATE", "description": "Graduate aptitude test"},
            {"name": "other_govt_exam", "display_name": "Other Govt Exams", "description": "Other government exams"},
        ]
        
        created_exams = []
        for exam_data in exams_data:
            existing_exam = db.query(models.Exam).filter(models.Exam.name == exam_data["name"]).first()
            if not existing_exam:
                exam = models.Exam(**exam_data)
                db.add(exam)
                db.commit()
                db.refresh(exam)
                created_exams.append(exam)
                print(f"✓ Created exam: {exam.display_name}")
            else:
                created_exams.append(existing_exam)
                print(f"✓ Exam already exists: {existing_exam.display_name}")

        # Create subjects for JEE
        print("\nCreating subjects...")
        jee_subjects = [
            {"name": "Physics", "description": "Physics for JEE preparation"},
            {"name": "Chemistry", "description": "Chemistry for JEE preparation"}, 
            {"name": "Mathematics", "description": "Mathematics for JEE preparation"}
        ]
        
        created_subjects = []
        jee_exam = next((exam for exam in created_exams if exam.name == "jee"), None)
        if jee_exam:
            for subject_data in jee_subjects:
                existing_subject = db.query(models.Subject).filter(
                    models.Subject.name == subject_data["name"],
                    models.Subject.exam_id == jee_exam.id
                ).first()
                
                if not existing_subject:
                    subject = models.Subject(
                        name=subject_data["name"],
                        description=subject_data["description"],
                        exam_id=jee_exam.id
                    )
                    db.add(subject)
                    db.commit()
                    db.refresh(subject)
                    created_subjects.append(subject)
                    print(f"✓ Created subject: {subject.name}")
                else:
                    created_subjects.append(existing_subject)
                    print(f"✓ Subject already exists: {existing_subject.name}")

        # Create sample course
        print("\nCreating sample course...")
        if jee_exam:
            existing_course = db.query(models.Course).filter(
                models.Course.title == "JEE Main & Advanced Preparation"
            ).first()
            
            if not existing_course:
                course = models.Course(
                    title="JEE Main & Advanced Preparation",
                    description="Complete preparation course for Joint Entrance Examination",
                    exam_type="jee",
                    instructor="Dr. Priya Sharma",
                    price=299.0,
                    duration="12 months",
                    exam_id=jee_exam.id
                )
                db.add(course)
                db.commit()
                db.refresh(course)
                print(f"✓ Created course: {course.title}")
            else:
                course = existing_course
                print(f"✓ Course already exists: {course.title}")

        # Create some sample content
        print("\nCreating sample content...")
        if 'course' in locals():
            content_items = [
                {
                    "title": "JEE Physics - Mechanics Study Guide",
                    "description": "Complete study guide for Mechanics in JEE Physics",
                    "content_type": "document",
                    "file_path": "/documents/mechanics_guide.pdf",
                    "file_size": "4.2 MB",
                    "author": "Dr. Priya Sharma",
                    "course_id": course.id
                },
                {
                    "title": "Organic Chemistry Basics - Video Lecture",
                    "description": "Video lecture covering basic organic chemistry concepts",
                    "content_type": "video", 
                    "file_path": "/videos/organic_chemistry.mp4",
                    "file_size": "85.6 MB",
                    "author": "Dr. Rajesh Kumar",
                    "course_id": course.id
                }
            ]
            
            for content_data in content_items:
                existing_content = db.query(models.Content).filter(
                    models.Content.title == content_data["title"]
                ).first()
                
                if not existing_content:
                    content = models.Content(**content_data)
                    db.add(content)
                    db.commit()
                    db.refresh(content)
                    print(f"✓ Created content: {content.title}")
                else:
                    print(f"✓ Content already exists: {existing_content.title}")

        # Create sample users
        print("\nCreating sample users...")
        users_data = [
            {
                "name": "Aarav Sharma",
                "email": "aarav.sharma@example.com",
                "phone": "+91-9876543210",
                "exam_type": "jee",
                "subscription_status": "active",
                "subscription_plan": "premium",
                "join_date": date(2024, 1, 15),
                "last_active": date(2024, 12, 19),
                "total_study_hours": 156,
                "tests_attempted": 24,
                "average_score": 78.5,
                "current_rank": 45,
                "account_status": "active"
            },
            {
                "name": "Priya Patel", 
                "email": "priya.patel@example.com",
                "phone": "+91-9876543211",
                "exam_type": "neet",
                "subscription_status": "active",
                "subscription_plan": "basic",
                "join_date": date(2024, 2, 20),
                "last_active": date(2024, 12, 18), 
                "total_study_hours": 189,
                "tests_attempted": 31,
                "average_score": 82.1,
                "current_rank": 23,
                "account_status": "active"
            }
        ]
        
        for user_data in users_data:
            existing_user = db.query(models.User).filter(
                models.User.email == user_data["email"]
            ).first()
            
            if not existing_user:
                user_id = f"user_{str(uuid.uuid4())[:8]}"
                user = models.User(id=user_id, **user_data)
                db.add(user)
                db.commit()
                db.refresh(user)
                print(f"✓ Created user: {user.name}")
            else:
                print(f"✓ User already exists: {existing_user.name}")

        # Create subscription plans
        print("\nCreating subscription plans...")
        plans_data = [
            {
                "name": "Basic Plan",
                "max_text": 100,
                "max_image": 50,
                "max_audio": 25,
                "max_expand": 10,
                "max_with_history": 5,
                "price": 299,
                "subscribers": 150,
                "revenue": 44850,
                "is_active": True
            },
            {
                "name": "Premium Plan",
                "max_text": 500,
                "max_image": 250,
                "max_audio": 100,
                "max_expand": 50,
                "max_with_history": 25,
                "price": 599,
                "subscribers": 89,
                "revenue": 53311,
                "is_active": True
            }
        ]
        
        for plan_data in plans_data:
            existing_plan = db.query(models.SubscriptionPlan).filter(
                models.SubscriptionPlan.name == plan_data["name"]
            ).first()
            
            if not existing_plan:
                plan = models.SubscriptionPlan(**plan_data)
                db.add(plan)
                db.commit()
                db.refresh(plan)
                print(f"✓ Created subscription plan: {plan.name}")
            else:
                print(f"✓ Subscription plan already exists: {existing_plan.name}")
        
        print("\n" + "="*50)
        print("✅ Database initialized successfully!")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()