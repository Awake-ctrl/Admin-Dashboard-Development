# models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Table, Date,JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from typing import   List,Optional
from pydantic import BaseModel, EmailStr,Field
import json
from sqlalchemy import TypeDecorator, Text

from datetime import datetime
from enum import Enum

# Association table for course subjects
# course_subjects = Table(
#     'course_subjects',
#     Base.metadata,
#     Column('course_id', Integer, ForeignKey('courses.id')),
#     Column('subject_id', Integer, ForeignKey('subjects.id'))
# )

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    exam_type = Column(String(50), nullable=True)
    
    # Updated subscription fields
    subscription_status = Column(String(50), default="inactive")  # active, inactive, expired
    subscription_plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=True)  # New field
    subscription_plan = Column(String(50), nullable=True)  # Keep for backward compatibility
    
    # New subscription tracking fields
    subscription_start_date = Column(DateTime(timezone=True), nullable=True)
    subscription_end_date = Column(DateTime(timezone=True), nullable=True)
    subscribed_courses = Column(JSON, default=[])  # List of course IDs user has access to
    
    join_date = Column(Date, nullable=True)
    last_active = Column(Date, nullable=True)
    total_study_hours = Column(Integer, default=0)
    tests_attempted = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    current_rank = Column(Integer, nullable=True)
    account_status = Column(String(20), default="active")
    deletion_requested = Column(Boolean, default=False)
    deletion_request_date = Column(Date, nullable=True)
    deletion_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")
    account_deletion_requests = relationship("AccountDeletionRequest", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    refund_requests = relationship("RefundRequest", back_populates="user", cascade="all, delete-orphan")
    user_courses = relationship("UserCourse", back_populates="user", cascade="all, delete-orphan")
    
    # New relationship for subscription plan
    subscription_plan_rel = relationship("SubscriptionPlan")

class AccountDeletionRequest(Base):
    __tablename__ = "account_deletion_requests"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id",ondelete="CASCADE"), nullable=False)
    user_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    request_date = Column(DateTime(timezone=True), server_default=func.now())
    reason = Column(Text, nullable=False)
    data_to_delete = Column(Text)
    data_to_retain = Column(Text)
    status = Column(String(50), default="pending_review")
    estimated_deletion_date = Column(DateTime(timezone=True), nullable=True)
    reviewed_by = Column(String(100), nullable=True)
    approved_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="account_deletion_requests")

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slogan = Column(String, nullable=True)
    original_price = Column(Integer, default=0)  # Original price for discount display
    offer_price = Column(Integer, default=0)     # Actual selling price
    courses = Column(JSON, default=[])           # List of course IDs included in this plan
    type = Column(String, default="single")      # "single" or "bundle"
    duration_months = Column(Integer, default=1) # Subscription duration in months
    features = Column(JSON, default=[])          # List of features/benefits
    is_popular = Column(Boolean, default=False)  # Mark as popular plan
    is_active = Column(Boolean, default=True)
    subscribers = Column(Integer, default=0)
    revenue = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    transactions = relationship("Transaction", back_populates="subscription_plan")
    refund_requests = relationship("RefundRequest", back_populates="subscription_plan")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    user_name = Column(String)
    
    # Foreign key to subscription plan
    subscription_plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=True)
    plan_name = Column(String)  # Keep for backward compatibility
    
    type = Column(String)  # razorpay, google, apple, etc.
    amount = Column(Integer)
    status = Column(String)  # captured, failed, pending, refunded
    date = Column(DateTime, default=datetime.utcnow)
    order_id = Column(String, unique=True, index=True)
    payment_gateway_id = Column(String, nullable=True)
    
    # New fields for course-based subscriptions
    courses = Column(JSON, default=[])  # Courses included in this transaction
    duration_months = Column(Integer, default=1)  # Subscription duration
    valid_until = Column(DateTime, nullable=True)  # Subscription expiry
    
    # Relationships
    subscription_plan = relationship("SubscriptionPlan", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    
    
class RefundRequest(Base):
    __tablename__ = "refund_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    user_name = Column(String)
    
    # Foreign key to subscription plan
    subscription_plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=True)
    plan_name = Column(String)
    
    amount = Column(Integer)
    reason = Column(String)
    status = Column(String)  # pending, processed, rejected
    request_date = Column(DateTime, default=datetime.utcnow)
    processed_date = Column(DateTime, nullable=True)
    processed_by = Column(String, nullable=True)
    
    # Relationships
    subscription_plan = relationship("SubscriptionPlan", back_populates="refund_requests")
    user = relationship("User", back_populates="refund_requests")


class Exam(Base):
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    display_name = Column(String(100))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    # subjects = relationship("Subject", back_populates="exam")
    courses = relationship("Course", back_populates="exam")


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    exam_type = Column(String(100))
    instructor = Column(String(100))
    price = Column(Float, default=0.0)
    duration = Column(String(100))
    enrolled_students = Column(Integer, default=0)
    completion_rate = Column(Float, default=0.0)
    rating = Column(Float, default=0.0)
    status = Column(String(20), default="draft")
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    exam = relationship("Exam", back_populates="courses")
    modules = relationship("Module", back_populates="course")
    contents = relationship("Content", back_populates="course")
    user_courses = relationship("UserCourse", back_populates="course")

class Module(Base):
    __tablename__ = "modules"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order_index = Column(Integer, default=1)
    duration = Column(String(50), nullable=True)  # "8 hours"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="modules")
    contents = relationship("Content", back_populates="module")

# class Lesson(Base):
#     __tablename__ = "lessons"
    
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String(200), index=True)
#     description = Column(Text)
#     module_id = Column(Integer, ForeignKey("modules.id"))
#     order_index = Column(Integer, default=0)
#     duration = Column(String(50))
#     content_type = Column(String(50))
#     content_url = Column(String(500))
#     is_published = Column(Boolean, default=False)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     # Relationships
#     module = relationship("Module", back_populates="lessons")

class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    description = Column(Text)
    content_type = Column(String(50))  # video, document, quiz, image
    file_path = Column(String(500), nullable=True)
    file_size = Column(String(50), nullable=True)
    duration = Column(String(50), nullable=True)  # for videos: "45 min"
    author = Column(String, nullable=True)  
    downloads = Column(Integer, default=0)
    
    status = Column(String(20), default="draft")  # draft, published, archived
    version = Column(String(20), default="1.0")
    course_id = Column(Integer, ForeignKey("courses.id"))
    module_id = Column(Integer, ForeignKey("modules.id"))
    questions = Column(JSON, nullable=True)  # For quiz content
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="contents")
    module = relationship("Module", back_populates="contents")
    versions = relationship("ContentVersion", back_populates="content")
class ContentVersion(Base):
    __tablename__ = "content_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"))
    version_number = Column(String(20))
    changelog = Column(Text)
    file_path = Column(String(500), nullable=True)
    file_size = Column(String(50), nullable=True)
    duration = Column(String(50), nullable=True)
    status = Column(String(20), default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    content = relationship("Content", back_populates="versions")
# Add these to your schemas.py if they don't exist
class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructor: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    status: Optional[str] = None
    enrolled_students: Optional[int] = None
    completion_rate: Optional[float] = None
    rating: Optional[float] = None
class UserCourse(Base):
    __tablename__ = "user_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    enrollment_date = Column(Date, nullable=False)
    progress = Column(Integer, default=0)
    last_accessed = Column(Date)
    completion_status = Column(String(20), default="not_started")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="user_courses")
    course = relationship("Course", back_populates="user_courses")
    
    
class UserActivity(Base):
    __tablename__ = "user_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_date = Column(Date, nullable=False)
    activity_type = Column(String(50))  # 'study', 'test', 'login', etc.
    duration_minutes = Column(Integer, default=0)
    score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="activities")

# Add to User model:


role_permissions = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', String, ForeignKey('roles.id',ondelete="CASCADE")),
    Column('permission_id', String, ForeignKey('permissions.id',ondelete="CASCADE"))
)

# Association table for user roles
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', String, ForeignKey('users.id',ondelete="CASCADE")),
    Column('role_id', String, ForeignKey('roles.id')),
    Column('assigned_at', DateTime, default=func.now()),
    Column('assigned_by', String)
)

class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    category = Column(String, nullable=False)



class JSONEncodedList(TypeDecorator):
    """Represents a list as a json-encoded string."""
    
    impl = Text
    
    def process_bind_param(self, value, dialect):
        if value is not None:
            value = json.dumps(value)
        return value
    
    def process_result_value(self, value, dialect):
        if value is not None:
            value = json.loads(value)
        return value

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    level = Column(Integer, nullable=False, default=1)
    is_active = Column(Boolean, default=True)
    is_system = Column(Boolean, default=False)
    
    # Use custom JSON type for permissions
    permissions = Column(JSONEncodedList, default=list)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
class RoleAssignmentHistory(Base):
    __tablename__ = "role_assignment_history"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(String, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False)  # assigned, updated, removed
    assigned_by = Column(String, nullable=False)
    timestamp = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User")
    role = relationship("Role")

# Add these to your existing models.py file, after the SQLAlchemy models

# Pydantic Models for Roles


class RoleAction(str, Enum):
    ASSIGNED = "assigned"
    UPDATED = "updated"
    REMOVED = "removed"

class PermissionCategory(str, Enum):
    USER_MANAGEMENT = "user_management"
    CONTENT_MANAGEMENT = "content_management"
    COURSE_MANAGEMENT = "course_management"
    ANALYTICS = "analytics"
    SYSTEM = "system"

class PermissionBase(BaseModel):
    id: str
    name: str
    description: str
    category: PermissionCategory

class RoleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    level: int = Field(..., ge=1, le=10)
    permissions: List[str] = Field(default_factory=list)

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    level: Optional[int] = Field(None, ge=1, le=10)
    permissions: Optional[List[str]] = None
    is_active: Optional[bool] = None
    # class Config:
    #     # This ensures that when we call dict(), it respects our exclusion rules
    #     extra = 'forbid'

class RoleResponse(RoleBase):
    id: str
    user_count: int
    is_active: bool
    is_system: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RoleAssignmentBase(BaseModel):
    user_id: str
    role_id: str
    assigned_by: str

class RoleAssignmentCreate(RoleAssignmentBase):
    pass

class RoleAssignmentResponse(BaseModel):
    id: str
    user: dict
    role: str
    action: RoleAction
    date: datetime
    assigned_by: str

    class Config:
        from_attributes = True

class BulkRoleAssignment(BaseModel):
    user_ids: List[str]
    role_id: str
    assigned_by: str