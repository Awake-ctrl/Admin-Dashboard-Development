# insert_dummy_data.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from datetime import datetime, date

def create_tables():
    """Create all tables if they don't exist"""
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

def insert_dummy_data():
    db = SessionLocal()
    
    try:
        # First, create tables if they don't exist
        create_tables()

        # Check if data already exists to avoid duplicates
        existing_users = db.query(models.User).count()
        if existing_users > 0:
            print(f"Database already contains {existing_users} users. Skipping data insertion.")
            return

        # Insert dummy users
        users = [
            models.User(
                id='user_001',
                name='Arjun Patel',
                email='arjun.patel@email.com',
                phone='+91 9876543210',
                exam_type='JEE',
                subscription_status='active',
                subscription_plan='JEE Main + Advanced',
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
                exam_type='NEET',
                subscription_status='active',
                subscription_plan='NEET Premium',
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
                exam_type='UPSC',
                subscription_status='expired',
                subscription_plan='UPSC Comprehensive',
                join_date=date(2023, 12, 10),
                last_active=date(2024, 8, 10),
                total_study_hours=312,
                tests_attempted=67,
                average_score=72.0,
                current_rank=245,
                account_status='suspended',
                deletion_requested=False
            ),
            models.User(
                id='user_004',
                name='Sneha Gupta',
                email='sneha.gupta@email.com',
                phone='+91 9876543213',
                exam_type='CAT',
                subscription_status='cancelled',
                subscription_plan='CAT Complete',
                join_date=date(2024, 3, 5),
                last_active=date(2024, 7, 25),
                total_study_hours=156,
                tests_attempted=28,
                average_score=81.0,
                current_rank=None,
                account_status='deletion_requested',
                deletion_requested=True,
                deletion_request_date=date(2024, 8, 15),
                deletion_reason='Privacy concerns and switching platforms'
            ),
            models.User(
                id='user_005',
                name='Amit Singh',
                email='amit.singh@email.com',
                phone='+91 9876543214',
                exam_type='GATE',
                subscription_status='active',
                subscription_plan='GATE Advanced',
                join_date=date(2024, 4, 12),
                last_active=date(2024, 8, 20),
                total_study_hours=278,
                tests_attempted=45,
                average_score=79.5,
                current_rank=112,
                account_status='active',
                deletion_requested=False
            ),
            models.User(
                id='user_006',
                name='Neha Verma',
                email='neha.verma@email.com',
                phone='+91 9876543215',
                exam_type='JEE',
                subscription_status='trial',
                subscription_plan='JEE Trial',
                join_date=date(2024, 7, 1),
                last_active=date(2024, 8, 19),
                total_study_hours=89,
                tests_attempted=15,
                average_score=65.0,
                current_rank=None,
                account_status='active',
                deletion_requested=False
            ),
            models.User(
                id='user_007',
                name='Rahul Mehta',
                email='rahul.mehta@email.com',
                phone='+91 9876543216',
                exam_type='NEET',
                subscription_status='active',
                subscription_plan='NEET Standard',
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
                exam_type='UPSC',
                subscription_status='expired',
                subscription_plan='UPSC Premium',
                join_date=date(2023, 11, 15),
                last_active=date(2024, 7, 30),
                total_study_hours=345,
                tests_attempted=72,
                average_score=68.0,
                current_rank=289,
                account_status='inactive',
                deletion_requested=False
            )
        ]

        db.add_all(users)
        db.commit()
        print(f"Inserted {len(users)} users")

        # Insert account deletion requests
        deletion_requests = [
            models.AccountDeletionRequest(
                id='del_001',
                user_id='user_004',
                user_name='Sneha Gupta',
                email='sneha.gupta@email.com',
                request_date=datetime(2024, 8, 15, 10, 30, 0),
                reason='Privacy concerns and switching platforms',
                data_to_delete=['Profile Data', 'Study History', 'Test Results', 'Subscription Data', 'Payment History'],
                data_to_retain=['Aggregated Analytics (anonymized)', 'Financial Records (legal requirement)'],
                status='pending_review',
                estimated_deletion_date=datetime(2024, 8, 25, 0, 0, 0)
            ),
            models.AccountDeletionRequest(
                id='del_002',
                user_id='user_005',
                user_name='Amit Singh',
                email='amit.singh@email.com',
                request_date=datetime(2024, 8, 10, 14, 20, 0),
                reason='Completed exam, no longer need the platform',
                data_to_delete=['Profile Data', 'Study History', 'Test Results'],
                data_to_retain=['Aggregated Analytics (anonymized)'],
                status='approved',
                estimated_deletion_date=datetime(2024, 8, 20, 0, 0, 0),
                reviewed_by='admin_001',
                approved_date=datetime(2024, 8, 12, 9, 0, 0)
            ),
            models.AccountDeletionRequest(
                id='del_003',
                user_id='user_008',
                user_name='Anjali Reddy',
                email='anjali.reddy@email.com',
                request_date=datetime(2024, 8, 18, 16, 45, 0),
                reason='Dissatisfied with course content and teaching methodology',
                data_to_delete=['Profile Data', 'Study History', 'Test Results', 'Progress Data'],
                data_to_retain=['Financial Records (legal requirement)', 'Aggregated Analytics'],
                status='pending_review',
                estimated_deletion_date=datetime(2024, 8, 28, 0, 0, 0)
            )
        ]

        db.add_all(deletion_requests)
        db.commit()
        print(f"Inserted {len(deletion_requests)} deletion requests")

        print("Dummy data inserted successfully!")

        # Print summary
        total_users = db.query(models.User).count()
        active_users = db.query(models.User).filter(models.User.account_status == 'active').count()
        pending_deletions = db.query(models.AccountDeletionRequest).filter(
            models.AccountDeletionRequest.status == 'pending_review'
        ).count()

        print(f"\nSummary:")
        print(f"Total Users: {total_users}")
        print(f"Active Users: {active_users}")
        print(f"Pending Deletion Requests: {pending_deletions}")

    except Exception as e:
        print(f"Error inserting dummy data: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    insert_dummy_data()