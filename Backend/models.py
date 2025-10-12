# models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Table, Date
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
course_subjects = Table(
    'course_subjects',
    Base.metadata,
    Column('course_id', Integer, ForeignKey('courses.id')),
    Column('subject_id', Integer, ForeignKey('subjects.id'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    exam_type = Column(String(50), nullable=True)
    subscription_status = Column(String(50), nullable=True)
    subscription_plan = Column(String(50), nullable=True)
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
    activities = relationship("UserActivity", back_populates="user")
    # Relationships
    account_deletion_requests = relationship("AccountDeletionRequest", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    refund_requests = relationship("RefundRequest", back_populates="user")
    user_courses = relationship("UserCourse", back_populates="user")

class AccountDeletionRequest(Base):
    __tablename__ = "account_deletion_requests"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
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
    name = Column(String(100), unique=True, nullable=False)
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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    transactions = relationship("Transaction", back_populates="subscription_plan")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user_name = Column(String(100), nullable=False)
    plan_name = Column(String(100), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=True)
    type = Column(String(50), nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False)
    order_id = Column(String(100), unique=True, nullable=False)
    payment_gateway_id = Column(String(100), nullable=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="transactions")
    subscription_plan = relationship("SubscriptionPlan", back_populates="transactions")

class RefundRequest(Base):
    __tablename__ = "refund_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user_name = Column(String(100), nullable=False)
    plan_name = Column(String(100), nullable=False)
    amount = Column(Integer, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="pending")
    request_date = Column(DateTime(timezone=True), server_default=func.now())
    processed_date = Column(DateTime(timezone=True), nullable=True)
    processed_by = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
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
    subjects = relationship("Subject", back_populates="exam")
    courses = relationship("Course", back_populates="exam")

class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(Text)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    topics_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    exam = relationship("Exam", back_populates="subjects")
    topics = relationship("Topic", back_populates="subject")
    courses = relationship("Course", secondary=course_subjects, back_populates="subjects")

class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True)
    description = Column(Text)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    user_count = Column(Integer, default=0)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    subject = relationship("Subject", back_populates="topics")
    contents = relationship("Content", back_populates="topic")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    credits = Column(Integer, default=0)
    description = Column(Text)
    exam_type = Column(String(50))
    instructor = Column(String(100))
    price = Column(Float, default=0.0)
    duration = Column(String(50))
    enrolled_students = Column(Integer, default=0)
    completion_rate = Column(Float, default=0.0)
    rating = Column(Float, default=0.0)
    status = Column(String(20), default="draft")
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    exam_id = Column(Integer, ForeignKey("exams.id"))

    # Relationships
    exam = relationship("Exam", back_populates="courses")
    subjects = relationship("Subject", secondary=course_subjects, back_populates="courses")
    modules = relationship("Module", back_populates="course")
    contents = relationship("Content", back_populates="course")
    user_courses = relationship("UserCourse", back_populates="course")

class Module(Base):
    __tablename__ = "modules"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    description = Column(Text)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order_index = Column(Integer, default=0)
    duration = Column(String(50))
    lessons_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module")

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    description = Column(Text)
    module_id = Column(Integer, ForeignKey("modules.id"))
    order_index = Column(Integer, default=0)
    duration = Column(String(50))
    content_type = Column(String(50))
    content_url = Column(String(500))
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    module = relationship("Module", back_populates="lessons")

class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    description = Column(Text)
    content_type = Column(String(50))
    file_path = Column(String(500))
    file_size = Column(String(50))
    downloads = Column(Integer, default=0)
    status = Column(String(20), default="draft")
    version = Column(String(20), default="1.0")
    author = Column(String(100))
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    topic = relationship("Topic", back_populates="contents")
    course = relationship("Course", back_populates="contents")
    versions = relationship("ContentVersion", back_populates="content")

class ContentVersion(Base):
    __tablename__ = "content_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"))
    version = Column(String(20))
    changes = Column(Text)
    file_path = Column(String(500))
    file_size = Column(String(50))
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
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
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
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
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
    Column('role_id', String, ForeignKey('roles.id')),
    Column('permission_id', String, ForeignKey('permissions.id'))
)

# Association table for user roles
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', String, ForeignKey('users.id')),
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
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role_id = Column(String, ForeignKey("roles.id"), nullable=False)
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