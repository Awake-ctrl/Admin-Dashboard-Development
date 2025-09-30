from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    max_text = Column(Integer, default=0)
    max_image = Column(Integer, default=0)
    max_audio = Column(Integer, default=0)
    max_expand = Column(Integer, default=0)
    max_with_history = Column(Integer, default=0)
    price = Column(Integer, default=0)
    timedelta = Column(Integer, default=2592000)
    subscribers = Column(Integer, default=0)
    revenue = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # REMOVE THIS RELATIONSHIP - it's causing the error
    # transactions = relationship("Transaction", back_populates="plan")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    user_name = Column(String(100))
    plan_name = Column(String(50))
    type = Column(String(20))
    amount = Column(Integer)
    status = Column(String(20))
    date = Column(DateTime, default=datetime.utcnow)
    order_id = Column(String(100), unique=True)
    payment_gateway_id = Column(String(100))
    
    # REMOVE THIS RELATIONSHIP - it's causing the error
    # plan = relationship("SubscriptionPlan", back_populates="transactions")

class RefundRequest(Base):
    __tablename__ = "refund_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    user_name = Column(String(100))
    plan_name = Column(String(50))
    amount = Column(Integer)
    reason = Column(Text)
    status = Column(String(20), default="pending")
    request_date = Column(DateTime, default=datetime.utcnow)
    processed_date = Column(DateTime)
    processed_by = Column(String(100))

# Your existing models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    exam_type = Column(String(50))
    subscription_status = Column(String(20))
    subscription_plan = Column(String(100))
    join_date = Column(Date)
    last_active = Column(Date)
    total_study_hours = Column(Integer, default=0)
    tests_attempted = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    current_rank = Column(Integer)
    account_status = Column(String(20), default="active")
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
    data_to_delete = Column(JSON)
    data_to_retain = Column(JSON)
    status = Column(String(20), default="pending_review")
    estimated_deletion_date = Column(DateTime)
    reviewed_by = Column(String(100))
    approved_date = Column(DateTime)

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    age = Column(Integer)
    grade = Column(String(10))
    enrollment_date = Column(Date)
    
    grades = relationship("Grade", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    instructor = Column(String(100))
    credits = Column(Integer)
    
    grades = relationship("Grade", back_populates="course")

class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    grade = Column(Float)
    semester = Column(String(20))
    
    student = relationship("Student", back_populates="grades")
    course = relationship("Course", back_populates="grades")