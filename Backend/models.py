from sqlalchemy import Column, Integer, Boolean,DateTime,JSON,String, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

# Add to existing models.py
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    exam_type = Column(String(50))  # JEE, NEET, UPSC, CAT, etc.
    subscription_status = Column(String(20))  # active, expired, cancelled, trial
    subscription_plan = Column(String(100))
    join_date = Column(Date)
    last_active = Column(Date)
    total_study_hours = Column(Integer, default=0)
    tests_attempted = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    current_rank = Column(Integer)
    account_status = Column(String(20), default="active")  # active, suspended, deletion_requested, inactive
    deletion_requested = Column(Boolean, default=False)
    deletion_request_date = Column(Date)
    deletion_reason = Column(Text)

class AccountDeletionRequest(Base):
    __tablename__ = "account_deletion_requests"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    user_name = Column(String(100))
    email = Column(String(100))
    request_date = Column(DateTime)
    reason = Column(Text)
    data_to_delete = Column(JSON)  # List of data types to delete
    data_to_retain = Column(JSON)  # List of data types to retain
    status = Column(String(20), default="pending_review")  # pending_review, approved, processing, completed, rejected
    estimated_deletion_date = Column(DateTime)
    reviewed_by = Column(String(100))
    approved_date = Column(DateTime)