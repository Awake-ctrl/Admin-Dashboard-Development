# complete_init.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import uuid
from datetime import datetime, date, timedelta
from sqlalchemy import text
def reset_database():
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


def insert_exam_data(db):
    """Insert exam data"""
    print("Creating exams...")
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
        exam = models.Exam(**exam_data)
        db.add(exam)
        created_exams.append(exam)
        print(f"✓ Created exam: {exam.display_name}")
    
    db.commit()
    return created_exams

def insert_subject_data(db, exams):
    """Insert subject data"""
    print("\nCreating subjects...")
    subjects_data = {
        "jee": [
            {"name": "Physics", "description": "Physics for JEE preparation"},
            {"name": "Chemistry", "description": "Chemistry for JEE preparation"}, 
            {"name": "Mathematics", "description": "Mathematics for JEE preparation"}
        ],
        "neet": [
            {"name": "Physics", "description": "Physics for NEET preparation"},
            {"name": "Chemistry", "description": "Chemistry for NEET preparation"}, 
            {"name": "Biology", "description": "Biology for NEET preparation"}
        ],
        "cat": [
            {"name": "Quantitative Aptitude", "description": "Quantitative Aptitude for CAT"},
            {"name": "Verbal Ability", "description": "Verbal Ability for CAT"},
            {"name": "Data Interpretation", "description": "Data Interpretation for CAT"},
            {"name": "Logical Reasoning", "description": "Logical Reasoning for CAT"}
        ],
        "upsc": [
            {"name": "History", "description": "History for UPSC preparation"},
            {"name": "Geography", "description": "Geography for UPSC preparation"},
            {"name": "Polity", "description": "Polity for UPSC preparation"},
            {"name": "Economics", "description": "Economics for UPSC preparation"}
        ]
    }
    
    created_subjects = []
    for exam_name, subject_list in subjects_data.items():
        exam = next((e for e in exams if e.name == exam_name), None)
        if exam:
            for subject_data in subject_list:
                subject = models.Subject(
                    name=subject_data["name"],
                    description=subject_data["description"],
                    exam_id=exam.id
                )
                db.add(subject)
                created_subjects.append(subject)
                print(f"✓ Created subject: {subject.name} for {exam.display_name}")
    
    db.commit()
    return created_subjects

def insert_course_data(db, exams, subjects):
    """Insert course data"""
    print("\nCreating courses...")
    
    courses_data = [
        {
            "title": "JEE Main & Advanced Complete Course",
            "description": "Comprehensive preparation course for JEE Main and Advanced covering all subjects with expert faculty",
            "exam_type": "jee",
            "instructor": "Dr. Priya Sharma",
            "price": 12999.0,
            "duration": "12 months",
            "enrolled_students": 350,
            "completion_rate": 68.5,
            "rating": 4.7,
            "status": "published",
            "exam_id": next((e.id for e in exams if e.name == "jee"), None)
        },
        {
            "title": "NEET Medical Super Course",
            "description": "Complete NEET preparation with focus on Biology, Chemistry and Physics by top medical professionals",
            "exam_type": "neet", 
            "instructor": "Dr. Rajesh Kumar",
            "price": 14999.0,
            "duration": "14 months",
            "enrolled_students": 280,
            "completion_rate": 72.3,
            "rating": 4.8,
            "status": "published",
            "exam_id": next((e.id for e in exams if e.name == "neet"), None)
        },
        {
            "title": "CAT MBA Complete Preparation",
            "description": "Full CAT preparation course covering Quantitative Aptitude, Verbal Ability, and Logical Reasoning",
            "exam_type": "cat",
            "instructor": "Prof. Anita Desai", 
            "price": 8999.0,
            "duration": "8 months",
            "enrolled_students": 190,
            "completion_rate": 65.2,
            "rating": 4.5,
            "status": "published",
            "exam_id": next((e.id for e in exams if e.name == "cat"), None)
        },
        {
            "title": "UPSC Civil Services Foundation",
            "description": "Complete UPSC preparation with comprehensive coverage of all subjects and current affairs",
            "exam_type": "upsc",
            "instructor": "Dr. Vikram Singh",
            "price": 19999.0,
            "duration": "18 months",
            "enrolled_students": 420,
            "completion_rate": 58.7,
            "rating": 4.6,
            "status": "published",
            "exam_id": next((e.id for e in exams if e.name == "upsc"), None)
        },
        {
            "title": "GATE Engineering 2025",
            "description": "GATE preparation for engineering graduates with technical subject specialization",
            "exam_type": "gate",
            "instructor": "Prof. Suresh Gupta",
            "price": 10999.0,
            "duration": "10 months",
            "enrolled_students": 150,
            "completion_rate": 71.8,
            "rating": 4.4,
            "status": "published",
            "exam_id": next((e.id for e in exams if e.name == "gate"), None)
        },
        {
            "title": "Banking Exams Master Course",
            "description": "Complete preparation for banking and SSC examinations with focus on aptitude and reasoning",
            "exam_type": "other_govt_exam",
            "instructor": "Ms. Ritu Agarwal",
            "price": 6999.0,
            "duration": "6 months",
            "enrolled_students": 310,
            "completion_rate": 74.2,
            "rating": 4.3,
            "status": "published",
            "exam_id": next((e.id for e in exams if e.name == "other_govt_exam"), None)
        }
    ]
    
    created_courses = []
    for course_data in courses_data:
        course = models.Course(**course_data)
        db.add(course)
        created_courses.append(course)
        print(f"✓ Created course: {course.title}")
    
    db.commit()
    return created_courses

def insert_user_data(db):
    """Insert user data with realistic analytics data"""
    print("\nCreating users...")
    
    users = [
        models.User(
            id='user_001',
            name='Arjun Patel',
            email='arjun.patel@email.com',
            phone='+91 9876543210',
            exam_type='jee',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2024, 1, 15),
            last_active=date(2024, 8, 19),
            total_study_hours=245,
            tests_attempted=42,
            average_score=78.0,
            current_rank=156,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_002',
            name='Priya Sharma',
            email='priya.sharma@email.com',
            phone='+91 9876543211',
            exam_type='neet',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2024, 2, 20),
            last_active=date(2024, 8, 18),
            total_study_hours=189,
            tests_attempted=38,
            average_score=85.0,
            current_rank=89,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_003',
            name='Rajesh Kumar',
            email='rajesh.kumar@email.com',
            phone='+91 9876543212',
            exam_type='upsc',
            subscription_status='active',
            subscription_plan='basic',
            join_date=date(2023, 12, 10),
            last_active=date(2024, 8, 10),
            total_study_hours=312,
            tests_attempted=67,
            average_score=72.0,
            current_rank=245,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_004',
            name='Sneha Gupta',
            email='sneha.gupta@email.com',
            phone='+91 9876543213',
            exam_type='cat',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2024, 3, 5),
            last_active=date(2024, 8, 17),
            total_study_hours=156,
            tests_attempted=28,
            average_score=81.0,
            current_rank=112,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_005',
            name='Amit Singh',
            email='amit.singh@email.com',
            phone='+91 9876543214',
            exam_type='gate',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2024, 4, 12),
            last_active=date(2024, 8, 20),
            total_study_hours=278,
            tests_attempted=45,
            average_score=79.5,
            current_rank=98,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_006',
            name='Neha Verma',
            email='neha.verma@email.com',
            phone='+91 9876543215',
            exam_type='jee',
            subscription_status='active',
            subscription_plan='basic',
            join_date=date(2024, 7, 1),
            last_active=date(2024, 8, 19),
            total_study_hours=89,
            tests_attempted=15,
            average_score=65.0,
            current_rank=289,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_007',
            name='Rahul Mehta',
            email='rahul.mehta@email.com',
            phone='+91 9876543216',
            exam_type='neet',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2024, 3, 20),
            last_active=date(2024, 8, 17),
            total_study_hours=201,
            tests_attempted=36,
            average_score=82.5,
            current_rank=134,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_008',
            name='Anjali Reddy',
            email='anjali.reddy@email.com',
            phone='+91 9876543217',
            exam_type='upsc',
            subscription_status='inactive',
            subscription_plan='basic',
            join_date=date(2023, 11, 15),
            last_active=date(2024, 8, 16),
            total_study_hours=345,
            tests_attempted=72,
            average_score=68.0,
            current_rank=178,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_009',
            name='Vikram Joshi',
            email='vikram.joshi@email.com',
            phone='+91 9876543218',
            exam_type='other_govt_exam',
            subscription_status='active',
            subscription_plan='basic',
            join_date=date(2024, 5, 10),
            last_active=date(2024, 8, 15),
            total_study_hours=167,
            tests_attempted=31,
            average_score=74.0,
            current_rank=156,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_010',
            name='Pooja Desai',
            email='pooja.desai@email.com',
            phone='+91 9876543219',
            exam_type='cat',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2025, 10, 12),
            last_active=date(2025, 10, 14),
            total_study_hours=134,
            tests_attempted=24,
            average_score=76.5,
            current_rank=145,
            account_status='active',
            deletion_requested=False
        ),
        # Additional users for better analytics
        models.User(
            id='user_011',
            name='Karan Malhotra',
            email='karan.malhotra@email.com',
            phone='+91 9876543220',
            exam_type='jee',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2024, 2, 5),
            last_active=date(2024, 8, 19),
            total_study_hours=198,
            tests_attempted=35,
            average_score=80.5,
            current_rank=120,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_012',
            name='Sunita Iyer',
            email='sunita.iyer@email.com',
            phone='+91 9876543221',
            exam_type='neet',
            subscription_status='active',
            subscription_plan='basic',
            join_date=date(2024, 1, 25),
            last_active=date(2024, 7, 15),
            total_study_hours=145,
            tests_attempted=22,
            average_score=78.0,
            current_rank=210,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_013',
            name='Rohit Nair',
            email='rohit.nair@email.com',
            phone='+91 9876543222',
            exam_type='upsc',
            subscription_status='active',
            subscription_plan='premium',
            join_date=date(2024, 3, 15),
            last_active=date(2024, 8, 20),
            total_study_hours=267,
            tests_attempted=48,
            average_score=75.5,
            current_rank=165,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_014',
            name='Meera Krishnan',
            email='meera.krishnan@email.com',
            phone='+91 9876543223',
            exam_type='cat',
            subscription_status='active',
            subscription_plan='basic',
            join_date=date(2024, 4, 8),
            last_active=date(2024, 8, 18),
            total_study_hours=123,
            tests_attempted=19,
            average_score=69.0,
            current_rank=195,
            account_status='active',
            deletion_requested=False
        ),
        models.User(
            id='user_015',
            name='Deepak Rao',
            email='deepak.rao@email.com',
            phone='+91 9876543224',
            exam_type='gate',
            subscription_status='inactive',
            subscription_plan='basic',
            join_date=date(2024, 5, 20),
            last_active=date(2024, 7, 30),
            total_study_hours=89,
            tests_attempted=14,
            average_score=71.5,
            current_rank=230,
            account_status='active',
            deletion_requested=False
        )
    ]

    db.add_all(users)
    db.commit()
    print(f"✓ Inserted {len(users)} users")
    return users
def insert_new_subscription_plans(db, courses):
    """Insert new format subscription plans"""
    print("\nCreating new format subscription plans...")
    
    # Get course IDs for different plans
    jee_course = next((c for c in courses if c.exam_type == "jee"), None)
    neet_course = next((c for c in courses if c.exam_type == "neet"), None)
    cat_course = next((c for c in courses if c.exam_type == "cat"), None)
    upsc_course = next((c for c in courses if c.exam_type == "upsc"), None)
    gate_course = next((c for c in courses if c.exam_type == "gate"), None)
    banking_course = next((c for c in courses if c.exam_type == "other_govt_exam"), None)
    
    all_course_ids = [c.id for c in courses]
    
    new_subscription_plans = [
        # Free Plan
        models.SubscriptionPlan(
            name="free_trial",
            slogan="Start your learning journey for free",
            original_price=999,
            offer_price=0,
            courses=[jee_course.id] if jee_course else [],
            type="single",
            duration_months=1,
            features=[
                "Basic Text Queries",
                "Limited Practice Tests",
                "Community Support"
            ],
            is_popular=False,
            is_active=True,
            subscribers=1250,
            revenue=0
        ),
        # Single Course Plans
        models.SubscriptionPlan(
            name="jee_pro",
            slogan="Ace JEE with expert guidance and comprehensive materials",
            original_price=14999,
            offer_price=9999,
            courses=[jee_course.id] if jee_course else [],
            type="single",
            duration_months=12,
            features=[
                "Unlimited Text Queries",
                "Unlimited Image Queries",
                "Priority Support",
                "Download Content",
                "Certificate of Completion",
                "Live Doubt Sessions"
            ],
            is_popular=True,
            is_active=True,
            subscribers=180,
            revenue=1799820
        ),
        models.SubscriptionPlan(
            name="neet_medical",
            slogan="Complete NEET preparation with top medical professionals",
            original_price=16999,
            offer_price=11999,
            courses=[neet_course.id] if neet_course else [],
            type="single",
            duration_months=12,
            features=[
                "Unlimited Text Queries",
                "Unlimited Image Queries",
                "Priority Support",
                "Download Content",
                "Certificate of Completion",
                "Personalized Study Plan"
            ],
            is_popular=False,
            is_active=True,
            subscribers=150,
            revenue=1799850
        ),
        # Bundle Plans
        models.SubscriptionPlan(
            name="engineering_bundle",
            slogan="Complete preparation for all engineering entrance exams",
            original_price=29999,
            offer_price=19999,
            courses=[c.id for c in courses if c.exam_type in ["jee", "gate"]] if courses else [],
            type="bundle",
            duration_months=12,
            features=[
                "Unlimited All Queries",
                "24/7 Priority Support",
                "Download All Content",
                "Advanced Certificates",
                "Live Doubt Sessions",
                "Personalized Study Plan",
                "Mobile App Access"
            ],
            is_popular=True,
            is_active=True,
            subscribers=85,
            revenue=1699915
        ),
        models.SubscriptionPlan(
            name="all_courses_pro",
            slogan="Access to all courses with premium features",
            original_price=49999,
            offer_price=29999,
            courses=all_course_ids,
            type="bundle",
            duration_months=12,
            features=[
                "Unlimited All Queries",
                "24/7 Priority Support",
                "Download All Content",
                "Advanced Certificates",
                "Live Doubt Sessions",
                "Personalized Study Plan",
                "Mobile App Access",
                "Early Access to New Features",
                "Dedicated Account Manager"
            ],
            is_popular=False,
            is_active=True,
            subscribers=45,
            revenue=1349955
        ),
        # Short-term Plans
        models.SubscriptionPlan(
            name="cat_fast_track",
            slogan="3-month intensive CAT preparation",
            original_price=7999,
            offer_price=4999,
            courses=[cat_course.id] if cat_course else [],
            type="single",
            duration_months=3,
            features=[
                "Unlimited Text Queries",
                "Practice Tests",
                "Download Content",
                "Certificate of Completion"
            ],
            is_popular=False,
            is_active=True,
            subscribers=120,
            revenue=599880
        )
    ]
    
    # First, mark old plans as inactive if they exist
    try:
        db.query(models.SubscriptionPlan).update({"is_active": False})
        print("✓ Marked old plans as inactive")
    except:
        print("✓ No old plans to deactivate")
    
    # Add new plans
    db.add_all(new_subscription_plans)
    db.commit()
    print(f"✓ Inserted {len(new_subscription_plans)} new format subscription plans")
    return new_subscription_plans
def create_user_course_subscriptions(db, users, courses):
    """Create subscriptions linking users to courses"""
    print("\nCreating user course subscriptions...")
    
    # Define which users should subscribe to which courses based on exam type
    subscriptions = [
        # JEE Users
        (users[0], courses[0]),  # Arjun Patel - JEE Course
        (users[5], courses[0]),  # Neha Verma - JEE Course
        (users[10], courses[0]), # Karan Malhotra - JEE Course
        
        # NEET Users  
        (users[1], courses[1]),  # Priya Sharma - NEET Course
        (users[6], courses[1]),  # Rahul Mehta - NEET Course
        (users[11], courses[1]), # Sunita Iyer - NEET Course
        
        # CAT Users
        (users[3], courses[2]),  # Sneha Gupta - CAT Course
        (users[9], courses[2]),  # Pooja Desai - CAT Course
        (users[13], courses[2]), # Meera Krishnan - CAT Course
        
        # UPSC Users
        (users[2], courses[3]),  # Rajesh Kumar - UPSC Course
        (users[7], courses[3]),  # Anjali Reddy - UPSC Course
        (users[12], courses[3]), # Rohit Nair - UPSC Course
        
        # GATE Users
        (users[4], courses[4]),  # Amit Singh - GATE Course
        (users[14], courses[4]), # Deepak Rao - GATE Course
        
        # Banking/Govt Exam Users
        (users[8], courses[5]),  # Vikram Joshi - Banking Course
    ]
    
    subscription_count = 0
    for user, course in subscriptions:
        # Create user course subscription
        user_course = models.UserCourse(
            user_id=user.id,
            course_id=course.id,
            enrollment_date=date(2024, 8, 1),
            progress=60 + subscription_count * 3,  # Varying progress
            last_accessed=date(2024, 8, 19),
            completion_status='in_progress'
        )
        db.add(user_course)
        subscription_count += 1
        print(f"✓ {user.name} subscribed to {course.title}")
    
    db.commit()
    print(f"✓ Created {subscription_count} course subscriptions")

def insert_subscription_plans(db):
    """Insert subscription plans"""
    print("\nCreating subscription plans...")
    
    subscription_plans = [
        models.SubscriptionPlan(
            name="free",
            max_text=10,
            max_image=2,
            max_audio=1,
            max_expand=5,
            max_with_history=3,
            price=0,
            timedelta=2592000,  # 30 days
          
            is_active=True
        ),
        models.SubscriptionPlan(
            name="basic",
            max_text=100,
            max_image=20,
            max_audio=10,
            max_expand=50,
            max_with_history=30,
            price=299,
            timedelta=2592000,  # 30 days
           
            is_active=True
        ),
        models.SubscriptionPlan(
            name="premium",
            max_text=500,
            max_image=100,
            max_audio=50,
            max_expand=200,
            max_with_history=150,
            price=599,
            timedelta=2592000,  # 30 days
           
            is_active=True
        )
    ]

    db.add_all(subscription_plans)
    db.commit()
    print(f"✓ Inserted {len(subscription_plans)} subscription plans")
    return subscription_plans

# Add this to your complete_init.py

def insert_transaction_data(db, users, courses,subscription_plans):
    """Insert transaction data with proper subscription plan relationships"""
    print("\nCreating transactions with subscription plan relationships...")
    
    # Map plan names to IDs
    plan_name_to_id = {plan.name: plan.id for plan in subscription_plans}
    
    transactions = [
        # JEE Pro transactions
        models.Transaction(
            user_id=users[0].id,
            user_name=users[0].name,
            subscription_plan_id=plan_name_to_id["jee_pro"],
            plan_name="jee_pro",
            type="razorpay",
            amount=9999,
            status="captured",
            date=datetime(2024, 1, 14, 10, 30, 0),
            order_id="order_jee_001",
            payment_gateway_id="pay_jee_001",
            courses=[next((c.id for c in courses if c.exam_type == "jee"), None)],
            duration_months=12,
            valid_until=datetime(2025, 1, 14, 10, 30, 0)
        ),
        
        # Engineering Bundle transactions
        models.Transaction(
            user_id=users[4].id,
            user_name=users[4].name,
            subscription_plan_id=plan_name_to_id["engineering_bundle"],
            plan_name="engineering_bundle",
            type="google",
            amount=19999,
            status="captured",
            date=datetime(2024, 2, 20, 9, 15, 0),
            order_id="order_eng_001",
            payment_gateway_id="google_pay_eng_001",
            courses=[c.id for c in courses if c.exam_type in ["jee", "gate"]],
            duration_months=12,
            valid_until=datetime(2025, 2, 20, 9, 15, 0)
        ),
        
        # NEET Medical transactions
        models.Transaction(
            user_id=users[1].id,
            user_name=users[1].name,
            subscription_plan_id=plan_name_to_id["neet_medical"],
            plan_name="neet_medical",
            type="razorpay",
            amount=11999,
            status="captured",
            date=datetime(2024, 3, 5, 14, 20, 0),
            order_id="order_neet_001",
            payment_gateway_id="pay_neet_001",
            courses=[next((c.id for c in courses if c.exam_type == "neet"), None)],
            duration_months=12,
            valid_until=datetime(2025, 3, 5, 14, 20, 0)
        ),
        
        # All Courses Pro transactions
        models.Transaction(
            user_id=users[12].id,
            user_name=users[12].name,
            subscription_plan_id=plan_name_to_id["all_courses_pro"],
            plan_name="all_courses_pro",
            type="razorpay",
            amount=29999,
            status="captured",
            date=datetime(2024, 4, 15, 16, 45, 0),
            order_id="order_all_001",
            payment_gateway_id="pay_all_001",
            courses=[c.id for c in courses],
            duration_months=12,
            valid_until=datetime(2025, 4, 15, 16, 45, 0)
        ),
        
        # CAT Fast Track transactions
        models.Transaction(
            user_id=users[3].id,
            user_name=users[3].name,
            subscription_plan_id=plan_name_to_id["cat_fast_track"],
            plan_name="cat_fast_track",
            type="google",
            amount=4999,
            status="captured",
            date=datetime(2024, 5, 10, 13, 20, 0),
            order_id="order_cat_001",
            payment_gateway_id="google_pay_cat_001",
            courses=[next((c.id for c in courses if c.exam_type == "cat"), None)],
            duration_months=3,
            valid_until=datetime(2024, 8, 10, 13, 20, 0)
        ),
        
        # Failed transaction
        models.Transaction(
            user_id=users[5].id,
            user_name=users[5].name,
            subscription_plan_id=plan_name_to_id["jee_pro"],
            plan_name="jee_pro",
            type="razorpay",
            amount=9999,
            status="failed",
            date=datetime(2024, 6, 1, 12, 0, 0),
            order_id="order_failed_001",
            payment_gateway_id="pay_failed_001"
        ),
        
        # Refunded transaction
        models.Transaction(
            user_id=users[7].id,
            user_name=users[7].name,
            subscription_plan_id=plan_name_to_id["engineering_bundle"],
            plan_name="engineering_bundle",
            type="razorpay",
            amount=19999,
            status="refunded",
            date=datetime(2024, 7, 1, 14, 30, 0),
            order_id="order_refund_001",
            payment_gateway_id="pay_refund_001",
            courses=[c.id for c in courses if c.exam_type in ["jee", "gate"]],
            duration_months=12
        )
    ]

    db.add_all(transactions)
    db.commit()
    print(f"✓ Inserted {len(transactions)} transactions with subscription plan relationships")
    
    # Update user subscriptions based on successful transactions
    update_user_subscriptions(db, users, transactions)

def update_user_subscriptions(db, users, transactions):
    """Update user subscription status based on transactions"""
    print("\nUpdating user subscription status...")
    
    # Group successful transactions by user
    user_successful_tx = {}
    for tx in transactions:
        if tx.status == "captured":
            if tx.user_id not in user_successful_tx:
                user_successful_tx[tx.user_id] = []
            user_successful_tx[tx.user_id].append(tx)
    
    # Update user subscription data
    for user_id, user_txs in user_successful_tx.items():
        # Get the latest transaction
        latest_tx = max(user_txs, key=lambda x: x.date)
        user = next((u for u in users if u.id == user_id), None)
        
        if user:
            user.subscription_status = "active"
            user.subscription_plan_id = latest_tx.subscription_plan_id
            user.subscription_plan_name = latest_tx.plan_name
            user.subscription_start_date = latest_tx.date
            user.subscription_end_date = latest_tx.valid_until
            user.subscribed_courses = latest_tx.courses
            
            print(f"✓ Updated subscription for {user.name}: {latest_tx.plan_name}")
    
    db.commit()

def insert_course_content_data(db, courses):
    """Insert course modules and content"""
    print("\nCreating course modules and content...")
    
    # Create modules for each course
    modules_data = {
        courses[0].id: [  # JEE Course
            {"title": "Physics Fundamentals", "description": "Basic concepts of Physics", "order_index": 1, "duration": "8 hours"},
            {"title": "Chemistry Basics", "description": "Foundation of Chemistry", "order_index": 2, "duration": "6 hours"},
            {"title": "Mathematics Core", "description": "Essential Mathematics topics", "order_index": 3, "duration": "10 hours"}
        ],
        courses[1].id: [  # NEET Course
            {"title": "Biology Fundamentals", "description": "Basic Biology concepts", "order_index": 1, "duration": "12 hours"},
            {"title": "Physics for NEET", "description": "Physics tailored for NEET", "order_index": 2, "duration": "7 hours"},
            {"title": "Chemistry for NEET", "description": "Chemistry for medical entrance", "order_index": 3, "duration": "8 hours"}
        ],
        courses[2].id: [  # CAT Course
            {"title": "Quantitative Aptitude", "description": "Math and calculation skills", "order_index": 1, "duration": "15 hours"},
            {"title": "Verbal Ability", "description": "English language skills", "order_index": 2, "duration": "12 hours"},
            {"title": "Logical Reasoning", "description": "Analytical thinking", "order_index": 3, "duration": "10 hours"}
        ]
    }
    
    for course_id, module_list in modules_data.items():
        for module_data in module_list:
            module = models.Module(
                title=module_data["title"],
                description=module_data["description"],
                course_id=course_id,
                order_index=module_data["order_index"],
                duration=module_data["duration"]
            )
            db.add(module)
            print(f"✓ Created module: {module.title}")
    
    db.commit()

def insert_content_data(db, courses, subjects):
    """Insert content data for analytics"""
    print("\nCreating content data...")
    
    contents = [
        models.Content(
            title="JEE Physics Formula Sheet",
            description="Complete formula sheet for JEE Physics",
            content_type="pdf",
            file_path="/content/jee/physics_formulas.pdf",
            file_size="2.5 MB",
            downloads=245,
            status="published",
            version="1.0",
            author="Dr. Priya Sharma",
            course_id=courses[0].id
        ),
        models.Content(
            title="NEET Biology Diagrams",
            description="Important diagrams for NEET Biology",
            content_type="pdf",
            file_path="/content/neet/biology_diagrams.pdf",
            file_size="3.1 MB",
            downloads=189,
            status="published",
            version="1.0",
            author="Dr. Rajesh Kumar",
            course_id=courses[1].id
        ),
        models.Content(
            title="CAT Quantitative Tricks",
            description="Shortcut methods for CAT quantitative",
            content_type="video",
            file_path="/content/cat/quant_tricks.mp4",
            file_size="45.2 MB",
            downloads=156,
            status="published",
            version="1.0",
            author="Prof. Anita Desai",
            course_id=courses[2].id
        ),
        models.Content(
            title="UPSC Current Affairs",
            description="Monthly current affairs compilation",
            content_type="pdf",
            file_path="/content/upsc/current_affairs.pdf",
            file_size="4.2 MB",
            downloads=312,
            status="published",
            version="1.0",
            author="Dr. Vikram Singh",
            course_id=courses[3].id
        ),
        models.Content(
            title="GATE Technical Notes",
            description="Technical subject notes for GATE",
            content_type="pdf",
            file_path="/content/gate/technical_notes.pdf",
            file_size="5.1 MB",
            downloads=134,
            status="published",
            version="1.0",
            author="Prof. Suresh Gupta",
            course_id=courses[4].id
        ),
        models.Content(
            title="Banking Aptitude Practice",
            description="Practice questions for banking exams",
            content_type="pdf",
            file_path="/content/banking/aptitude_practice.pdf",
            file_size="2.8 MB",
            downloads=278,
            status="published",
            version="1.0",
            author="Ms. Ritu Agarwal",
            course_id=courses[5].id
        )
    ]
    
    db.add_all(contents)
    db.commit()
    print(f"✓ Inserted {len(contents)} content items")

def insert_account_deletion_requests(db, users):
    """Insert account deletion requests for analytics"""
    print("\nCreating account deletion requests...")
    
    deletion_requests = [
        models.AccountDeletionRequest(
            id="del_001",
            user_id=users[11].id,
            user_name=users[11].name,
            email=users[11].email,
            reason="Found another platform",
            data_to_delete="All personal data and study history",
            data_to_retain="Payment records for accounting",
            status="pending_review",
            estimated_deletion_date=datetime(2024, 9, 1),
            request_date=datetime(2024, 8, 15)
        ),
        models.AccountDeletionRequest(
            id="del_002",
            user_id=users[14].id,
            user_name=users[14].name,
            email=users[14].email,
            reason="Completed my exam preparation",
            data_to_delete="Study progress and test results",
            data_to_retain="Certificate of completion",
            status="approved",
            reviewed_by="admin",
            approved_date=datetime(2024, 8, 10),
            estimated_deletion_date=datetime(2024, 8, 20),
            request_date=datetime(2024, 8, 5)
        )
    ]
    
    db.add_all(deletion_requests)
    db.commit()
    print(f"✓ Inserted {len(deletion_requests)} account deletion requests")

def insert_refund_requests(db, users):
    """Insert refund requests for analytics"""
    print("\nCreating refund requests...")
    
    refund_requests = [
        models.RefundRequest(
            user_id=users[7].id,
            user_name=users[7].name,
            plan_name="basic",
            amount=299,
            reason="Technical issues with the platform",
            status="pending",
            request_date=datetime(2024, 8, 12)
        ),
        models.RefundRequest(
            user_id=users[13].id,
            user_name=users[13].name,
            plan_name="basic",
            amount=299,
            reason="Not satisfied with course content",
            status="approved",
            processed_by="admin",
            processed_date=datetime(2024, 8, 8),
            request_date=datetime(2024, 8, 1)
        )
    ]
    
    db.add_all(refund_requests)
    db.commit()
    print(f"✓ Inserted {len(refund_requests)} refund requests")
from sqlalchemy import text

from sqlalchemy import text

def insert_roles_data(db):
    """Insert roles and permissions data using raw SQL"""
    print("\nCreating roles and permissions...")
    
    # Check if roles table exists and has data
    try:
        existing_roles = db.execute(text("SELECT COUNT(*) FROM roles")).scalar()
        if existing_roles > 0:
            print("✓ Roles already exist, skipping role creation")
            return existing_roles
    except:
        print("✓ Roles table doesn't exist or is empty, creating roles...")
    
    # Insert roles using raw SQL with proper JSON formatting
    roles_data = [
        ("super_admin", "Super Admin", "Full system access with all permissions", 10, True, True, '["all"]'),
        ("admin", "Admin", "Administrative access to most platform features", 8, True, True, '["user_management", "content_management", "course_management", "analytics_view"]'),
        ("teacher", "Teacher", "Access to teaching tools and student management", 6, False, True, '["course_create", "student_view", "assessment_create", "content_create"]'),
        ("content_manager", "Content Manager", "Manages educational content and materials", 5, False, True, '["content_management", "course_edit", "media_upload"]'),
        ("support_staff", "Support Staff", "Customer support and help desk access", 4, False, True, '["support_tickets", "user_view", "feedback_management"]'),
        ("analyst", "Analyst", "Access to analytics and reporting features", 4, False, True, '["analytics_view", "reports_generate", "data_export"]')
    ]
    
    for role_id, name, description, level, is_system, is_active, permissions in roles_data:
        try:
            # Check if role already exists
            existing = db.execute(
                text("SELECT id FROM roles WHERE id = :id"), 
                {"id": role_id}
            ).first()
            
            if not existing:
                db.execute(
                    text("INSERT INTO roles (id, name, description, level, is_system, is_active, permissions, created_at, updated_at) "
                         "VALUES (:id, :name, :description, :level, :is_system, :is_active, :permissions, datetime('now'), datetime('now'))"),
                    {
                        "id": role_id,
                        "name": name,
                        "description": description,
                        "level": level,
                        "is_system": is_system,
                        "is_active": is_active,
                        "permissions": permissions
                    }
                )
                print(f"✓ Created role: {name}")
            else:
                print(f"✓ Role already exists: {name}")
        except Exception as e:
            print(f"❌ Error creating role {name}: {e}")
    
    db.commit()
    
    # Create role assignments
    print("\nCreating role assignments...")
    
    # Get some users
    users = db.query(models.User).limit(5).all()
    
    assignment_count = 0
    if users:
        assignments = [
            (users[0].id, 'teacher', 'system'),
            (users[1].id, 'content_manager', 'system'), 
            (users[2].id, 'support_staff', 'system')
        ]
        
        for user_id, role_id, assigned_by in assignments:
            try:
                db.execute(
                    text("INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_by, assigned_at) VALUES (:user_id, :role_id, :assigned_by, datetime('now'))"),
                    {"user_id": user_id, "role_id": role_id, "assigned_by": assigned_by}
                )
                assignment_count += 1
                print(f"✓ Assigned {role_id} role to user {user_id}")
            except Exception as e:
                print(f"⚠ Could not assign {role_id} role: {e}")
        
        db.commit()
    
    print(f"✓ Created {len(roles_data)} roles and {assignment_count} role assignments")
    return len(roles_data)

def main():
    """Main initialization function"""
    print("Starting complete database initialization...")
    print("="*60)
    # reset_database()pyr
    db = SessionLocal()
    try:
        # Insert all data
        exams = insert_exam_data(db)
        subjects = insert_subject_data(db, exams)
        courses = insert_course_data(db, exams, subjects)
        users = insert_user_data(db)
        create_user_course_subscriptions(db, users, courses)
        
        # Use new subscription plans instead of old ones
        subscription_plans = insert_new_subscription_plans(db, courses)
        
        # Update transactions to use new plan format with relationships
        insert_transaction_data(db, users,courses, subscription_plans)
        
        insert_course_content_data(db, courses)
        insert_content_data(db, courses, subjects)
        insert_account_deletion_requests(db, users)
        insert_refund_requests(db, users)
        roles_count = insert_roles_data(db)
        
        # Print final summary
        print("\n" + "="*60)
        print("✅ DATABASE INITIALIZATION COMPLETE!")
        print("="*60)
        
        # Get final counts with relationships
        total_users = db.query(models.User).count()
        total_exams = db.query(models.Exam).count()
        total_subjects = db.query(models.Subject).count()
        total_courses = db.query(models.Course).count()
        total_subscriptions = db.query(models.UserCourse).count()
        total_plans = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.is_active == True).count()
        total_transactions = db.query(models.Transaction).count()
        total_active_subscribers = db.query(models.User).filter(models.User.subscription_status == "active").count()
        
        # Get plan performance stats
        plan_stats = db.execute(
            text("""
                SELECT sp.name, COUNT(t.id) as transaction_count, SUM(t.amount) as total_revenue
                FROM subscription_plans sp
                LEFT JOIN transactions t ON sp.id = t.subscription_plan_id AND t.status = 'captured'
                WHERE sp.is_active = true
                GROUP BY sp.id, sp.name
            """)
        ).fetchall()

        print(f"\n📊 DATABASE SUMMARY:")
        print(f"   👥 Users: {total_users}")
        print(f"   📝 Exams: {total_exams}") 
        print(f"   📚 Subjects: {total_subjects}")
        print(f"   🎓 Courses: {total_courses}")
        print(f"   🔗 Course Subscriptions: {total_subscriptions}")
        print(f"   💳 Active Subscription Plans: {total_plans}")
        print(f"   💰 Transactions: {total_transactions}")
        print(f"   ✅ Active Subscribers: {total_active_subscribers}")
        
        print(f"\n📈 Plan Performance:")
        for plan in plan_stats:
            print(f"   • {plan.name}: {plan.transaction_count} sales, ₹{plan.total_revenue or 0} revenue")
        
        print(f"\n🎯 New Subscription Features:")
        print(f"   • Proper foreign key relationships between transactions and plans")
        print(f"   • Course-based pricing with included courses tracking")
        print(f"   • Subscription duration and expiry tracking")
        print(f"   • User subscription status automatically updated")
        print(f"   • Revenue tracking per subscription plan")
        
    except Exception as e:
        print(f"❌ Error during initialization: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()