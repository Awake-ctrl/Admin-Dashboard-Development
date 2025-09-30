from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from datetime import datetime, date  # Make sure this import exists
import uuid
from sqlalchemy import func  # Add this import for aggregate functions

from database import SessionLocal, engine, Base
import models
import schemas
from services.revenue_service import RevenueService
# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Edu Dashboard API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Edu Dashboard API is running"}

# Add to existing main.py
# User endpoints
@app.get("/users/", response_model=List[schemas.User])
def get_users(
    skip: int = 0, 
    limit: int = 100, 
    account_status: Optional[str] = None,
    exam_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.User)
    
    if account_status and account_status != "all":
        query = query.filter(models.User.account_status == account_status)
    
    if exam_type and exam_type != "all":
        query = query.filter(models.User.exam_type == exam_type)
    
    users = query.offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Generate user ID
    user_id = f"user_{str(uuid.uuid4())[:8]}"
    
    db_user = models.User(
        id=user_id,
        **user.dict()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: str, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Account Deletion Request endpoints
@app.get("/account-deletion-requests/", response_model=List[schemas.AccountDeletionRequest])
def get_deletion_requests(
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.AccountDeletionRequest)
    
    if status:
        query = query.filter(models.AccountDeletionRequest.status == status)
    
    requests = query.offset(skip).limit(limit).all()
    return requests

@app.post("/account-deletion-requests/", response_model=schemas.AccountDeletionRequest)
def create_deletion_request(
    request: schemas.AccountDeletionRequestCreate, 
    db: Session = Depends(get_db)
):
    # Generate request ID
    request_id = f"del_{str(uuid.uuid4())[:8]}"
    
    db_request = models.AccountDeletionRequest(
        id=request_id,
        **request.dict()
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request
# Add this to your main.py in the account deletion request endpoints section
@app.delete("/account-deletion-requests/{request_id}")
def delete_deletion_request(request_id: str, db: Session = Depends(get_db)):
    deletion_request = db.query(models.AccountDeletionRequest).filter(models.AccountDeletionRequest.id == request_id).first()
    if deletion_request is None:
        raise HTTPException(status_code=404, detail="Deletion request not found")
    
    db.delete(deletion_request)
    db.commit()
    return {"message": "Deletion request removed successfully"}

@app.put("/account-deletion-requests/{request_id}", response_model=schemas.AccountDeletionRequest)
def update_deletion_request(
    request_id: str, 
    request: schemas.AccountDeletionRequestUpdate, 
    db: Session = Depends(get_db)
):
    db_request = db.query(models.AccountDeletionRequest).filter(models.AccountDeletionRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Deletion request not found")
    
    for field, value in request.dict(exclude_unset=True).items():
        setattr(db_request, field, value)
    
    db.commit()
    db.refresh(db_request)
    return db_request

# Analytics endpoints
@app.get("/analytics/user-stats")
def get_user_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.account_status == "active").count()
    deletion_requests = db.query(models.AccountDeletionRequest).filter(
        models.AccountDeletionRequest.status == "pending_review"
    ).count()
    
    # Mock monthly churn calculation
    monthly_churn = 2.3
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "deletion_requests": deletion_requests,
        "monthly_churn": monthly_churn
    }

@app.get("/analytics/user-demographics")
def get_user_demographics(db: Session = Depends(get_db)):
    # Get users by exam type
    exam_types = db.query(models.User.exam_type).distinct().all()
    total_users = db.query(models.User).count()
    
    demographics = []
    for exam_type in exam_types:
        if exam_type[0]:  # Check if exam_type is not None
            count = db.query(models.User).filter(models.User.exam_type == exam_type[0]).count()
            percentage = (count / total_users * 100) if total_users > 0 else 0
            demographics.append({
                "exam_type": exam_type[0],
                "count": count,
                "percentage": round(percentage, 1)
            })
    
    return {"demographics": demographics}

@app.get("/analytics/subscription-stats")
def get_subscription_stats(db: Session = Depends(get_db)):
    subscription_statuses = db.query(models.User.subscription_status).distinct().all()
    total_users = db.query(models.User).count()
    
    stats = []
    for status in subscription_statuses:
        if status[0]:  # Check if subscription_status is not None
            count = db.query(models.User).filter(models.User.subscription_status == status[0]).count()
            percentage = (count / total_users * 100) if total_users > 0 else 0
            stats.append({
                "status": status[0],
                "count": count,
                "percentage": round(percentage, 1)
            })
    
    return {"subscription_stats": stats}

# Add to existing main.py
# Subscription Plan endpoints
@app.get("/subscription-plans/", response_model=List[schemas.SubscriptionPlan])
def get_subscription_plans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    plans = db.query(models.SubscriptionPlan).offset(skip).limit(limit).all()
    return plans

@app.get("/subscription-plans/{plan_id}", response_model=schemas.SubscriptionPlan)
def get_subscription_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    return plan

@app.post("/subscription-plans/", response_model=schemas.SubscriptionPlan)
def create_subscription_plan(plan: schemas.SubscriptionPlanCreate, db: Session = Depends(get_db)):
    # Check if plan with same name already exists
    existing_plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.name == plan.name).first()
    if existing_plan:
        raise HTTPException(status_code=400, detail="Subscription plan with this name already exists")
    
    db_plan = models.SubscriptionPlan(**plan.dict())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@app.put("/subscription-plans/{plan_id}", response_model=schemas.SubscriptionPlan)
def update_subscription_plan(plan_id: int, plan: schemas.SubscriptionPlanUpdate, db: Session = Depends(get_db)):
    db_plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if db_plan is None:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    for field, value in plan.dict(exclude_unset=True).items():
        setattr(db_plan, field, value)
    
    db_plan.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_plan)
    return db_plan

@app.delete("/subscription-plans/{plan_id}")
def delete_subscription_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Subscription plan deleted successfully"}

# Transaction endpoints
@app.get("/transactions/", response_model=List[schemas.Transaction])
def get_transactions(
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Transaction)
    
    if status:
        query = query.filter(models.Transaction.status == status)
    
    transactions = query.order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions

# Update transaction endpoints to handle revenue updates
@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    # Update revenue stats
    RevenueService.update_all_plans_revenue(db)
    
    return db_transaction

@app.put("/transactions/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(transaction_id: int, transaction: schemas.TransactionUpdate, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    old_status = db_transaction.status
    
    for field, value in transaction.dict(exclude_unset=True).items():
        setattr(db_transaction, field, value)
    
    db.commit()
    db.refresh(db_transaction)
    
    # Update revenue if status changed
    if 'status' in transaction.dict(exclude_unset=True):
        RevenueService.handle_transaction_status_change(db, transaction_id, old_status, transaction.status)
    
    return db_transaction

# Update refund processing to affect revenue
@app.put("/refund-requests/{request_id}", response_model=schemas.RefundRequest)
def update_refund_request(request_id: int, refund_request: schemas.RefundRequestUpdate, db: Session = Depends(get_db)):
    db_refund_request = db.query(models.RefundRequest).filter(models.RefundRequest.id == request_id).first()
    if db_refund_request is None:
        raise HTTPException(status_code=404, detail="Refund request not found")
    
    old_status = db_refund_request.status
    
    for field, value in refund_request.dict(exclude_unset=True).items():
        setattr(db_refund_request, field, value)
    
    if refund_request.status in ["approved", "rejected", "processed"]:
        db_refund_request.processed_date = datetime.utcnow()
        db_refund_request.processed_by = "admin"
    
    db.commit()
    db.refresh(db_refund_request)
    
    # If refund is approved, update related transaction and revenue
    if refund_request.status == "approved" and old_status != "approved":
        # Find and update the related transaction
        transaction = db.query(models.Transaction).filter(
            models.Transaction.user_id == db_refund_request.user_id,
            models.Transaction.plan_name == db_refund_request.plan_name,
            models.Transaction.amount == db_refund_request.amount,
            models.Transaction.status == "captured"
        ).first()
        
        if transaction:
            transaction.status = "refunded"
            db.commit()
            RevenueService.update_all_plans_revenue(db)
    
    return db_refund_request

# Analytics endpoint
@app.get("/analytics/subscription-stats")
def get_subscription_stats(db: Session = Depends(get_db)):
    return RevenueService.get_subscription_stats(db)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)