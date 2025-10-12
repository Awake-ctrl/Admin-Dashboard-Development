# insert_subscription_data.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from datetime import datetime, timedelta

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
        existing_plans = db.query(models.SubscriptionPlan).count()
        if existing_plans > 0:
            print(f"Database already contains {existing_plans} subscription plans. Skipping data insertion.")
            return

        # Insert subscription plans
        subscription_plans = [
            models.SubscriptionPlan(
                name="free",
                max_text=10,
                max_image=2,
                max_audio=1,
                max_expand=5,
                max_with_history=3,
                price=0,
                timedelta=2592000,
                subscribers=1250,
                revenue=0,
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
                timedelta=2592000,
                subscribers=450,
                revenue=134550,
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
                timedelta=2592000,
                subscribers=180,
                revenue=107820,
                is_active=True
            )
        ]

        db.add_all(subscription_plans)
        db.commit()
        print(f"Inserted {len(subscription_plans)} subscription plans")
        free_plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.name == "free").first()
        basic_plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.name == "basic").first()
        premium_plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.name == "premium").first()

        # Insert transactions
        transactions = [
            models.Transaction(
                user_id="user_001",
                user_name="John Doe",
                plan_name="premium",
                #plan_id=premium_plan.id,
                type="razorpay",
                amount=599,
                status="captured",
                date=datetime(2025, 1, 14, 10, 30, 0),
                order_id="order_12345",
                payment_gateway_id="pay_12345"
            ),
            models.Transaction(
                user_id="user_002",
                user_name="Jane Smith",
                plan_name="basic",
                #plan_id=basic_plan.id,
                type="google",
                amount=299,
                status="captured",
                date=datetime(2025, 1, 14, 9, 15, 0),
                order_id="google_67890",
                payment_gateway_id="google_pay_67890"
            ),
            models.Transaction(
                user_id="user_003",
                user_name="Mike Johnson",
                plan_name="premium",
                #plan_id=premium_plan.id,
                
                type="razorpay",
                amount=599,
                status="failed",
                date=datetime(2025, 1, 14, 8, 45, 0),
                order_id="order_54321",
                payment_gateway_id="pay_54321"
            ),
            models.Transaction(
                user_id="user_004",
                user_name="Sarah Wilson",
                plan_name="premium",
                #plan_id=premium_plan.id,
                
                type="razorpay",
                amount=599,
                status="captured",
                date=datetime(2025, 1, 13, 14, 20, 0),
                order_id="order_98765",
                payment_gateway_id="pay_98765"
            ),
            models.Transaction(
                user_id="user_005",
                user_name="David Brown",
                plan_name="basic",
                #plan_id=basic_plan.id,
                
                type="google",
                amount=299,
                status="captured",
                date=datetime(2025, 1, 12, 11, 30, 0),
                order_id="google_54321",
                payment_gateway_id="google_pay_54321"
            )
        ]

        db.add_all(transactions)
        db.commit()
        print(f"Inserted {len(transactions)} transactions")

        # Insert refund requests
        refund_requests = [
            models.RefundRequest(
                user_id="user_004",
                user_name="Sarah Wilson",
                plan_name="premium",
                #plan_id=premium_plan.id,
                
                amount=599,
                reason="Not satisfied with features",
                status="pending",
                request_date=datetime(2025, 1, 13, 14, 20, 0)
            ),
            models.RefundRequest(
                user_id="user_005",
                user_name="David Brown",
                plan_name="basic",
                #plan_id=basic_plan.id,
                
                amount=299,
                reason="Accidental purchase",
                status="processed",
                request_date=datetime(2025, 1, 12, 11, 30, 0),
                processed_date=datetime(2025, 1, 12, 16, 0, 0),
                processed_by="admin_001"
            ),
            models.RefundRequest(
                user_id="user_006",
                user_name="Emma Davis",
                plan_name="premium",
                #plan_id=premium_plan.id,
                
                amount=599,
                reason="Found better alternative",
                status="pending",
                request_date=datetime(2025, 1, 14, 16, 45, 0)
            )
        ]

        db.add_all(refund_requests)
        db.commit()
        print(f"Inserted {len(refund_requests)} refund requests")

        print("Subscription dummy data inserted successfully!")

        # Print summary
        total_plans = db.query(models.SubscriptionPlan).count()
        total_transactions = db.query(models.Transaction).count()
        total_refunds = db.query(models.RefundRequest).count()
        pending_refunds = db.query(models.RefundRequest).filter(models.RefundRequest.status == "pending").count()

        print(f"\nSummary:")
        print(f"Total Plans: {total_plans}")
        print(f"Total Transactions: {total_transactions}")
        print(f"Total Refund Requests: {total_refunds}")
        print(f"Pending Refund Requests: {pending_refunds}")

    except Exception as e:
        print(f"Error inserting dummy data: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    insert_dummy_data()