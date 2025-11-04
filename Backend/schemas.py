# schemas.py
from pydantic import BaseModel, EmailStr,validator
from typing import List, Optional, Dict, Any,Union
from datetime import datetime, date
from enum import Enum

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    exam_type: Optional[str] = None
    subscription_status: Optional[str] = None
    subscription_plan: Optional[str] = None
    join_date: Optional[date] = None
    last_active: Optional[date] = None
    total_study_hours: int = 0
    tests_attempted: int = 0
    average_score: float = 0.0
    current_rank: Optional[int] = None
    account_status: str = "active"

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    exam_type: Optional[str] = None
    subscription_status: Optional[str] = None
    subscription_plan: Optional[str] = None
    last_active: Optional[date] = None
    total_study_hours: Optional[int] = None
    tests_attempted: Optional[int] = None
    average_score: Optional[float] = None
    current_rank: Optional[int] = None
    account_status: Optional[str] = None

class User(UserBase):
    id: str
    deletion_requested: bool = False
    deletion_request_date: Optional[date] = None
    deletion_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Account Deletion Request Schemas
class AccountDeletionRequestBase(BaseModel):
    user_id: str
    user_name: str
    email: EmailStr
    reason: str
    data_to_delete: Optional[Union[str, List[str]]] = None  # Accept both string and array
    data_to_retain: Optional[Union[str, List[str]]] = None  # Accept both string and array
    status: str = "pending_review"
    estimated_deletion_date: Optional[datetime] = None

class AccountDeletionRequestCreate(AccountDeletionRequestBase):
    pass

class AccountDeletionRequestUpdate(BaseModel):
    status: Optional[str] = None
    reviewed_by: Optional[str] = None
    approved_date: Optional[datetime] = None
    estimated_deletion_date: Optional[datetime] = None

class AccountDeletionRequest(AccountDeletionRequestBase):
    id: str
    request_date: datetime
    created_at: Optional[datetime]=None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Subscription Plan Schemas
class SubscriptionPlanBase(BaseModel):
    name: str
    slogan: Optional[str] = None
    original_price: int
    offer_price: int
    courses: List[int] = []
    type: str = "single"  # "single" or "bundle"
    duration_months: int = 1
    features: List[str] = []
    is_popular: bool = False
    is_active: bool = True
class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlanUpdate(BaseModel):
    name: Optional[str] = None
    slogan: Optional[str] = None
    original_price: Optional[int] = None
    offer_price: Optional[int] = None
    courses: Optional[List[int]] = None
    type: Optional[str] = None
    duration_months: Optional[int] = None
    features: Optional[List[str]] = None
    is_popular: Optional[bool] = None
    is_active: Optional[bool] = None

class SubscriptionPlan(SubscriptionPlanBase):
    id: int
    subscribers: int = 0
    revenue: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    user_id: str
    user_name: str
    subscription_plan_id: Optional[int] = None
    plan_name: str
    type: str
    amount: int
    status: str
    date: datetime
    order_id: str
    payment_gateway_id: Optional[str] = None
    courses: List[int] = []
    duration_months: int = 1
    valid_until: Optional[datetime] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    status: Optional[str] = None
    payment_gateway_id: Optional[str] = None

# class Transaction(TransactionBase):
#     id: int
#     date: datetime
#     created_at: datetime

#     class Config:
#         from_attributes = True

# Refund Request Schemas
class RefundRequestBase(BaseModel):
    user_id: str
    user_name: str
    plan_name: str
    amount: int
    reason: str
    status: str = "pending"

class RefundRequestCreate(RefundRequestBase):
    pass

class RefundRequestUpdate(BaseModel):
    status: Optional[str] = None
    processed_by: Optional[str] = None
    processed_date: Optional[datetime] = None

class RefundRequest(RefundRequestBase):
    id: int
    request_date: datetime
    processed_date: Optional[datetime] = None
    processed_by: Optional[str] = None
    # created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Exam Schemas
class ExamBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None

class ExamCreate(ExamBase):
    pass
class ExamUpdate(BaseModel):
    name: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
class Exam(ExamBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    exam_id: int
    topics_count: int = 0

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    exam_id: Optional[int] = None
    topics_count: Optional[int] = None
# Topic Schemas
class TopicBase(BaseModel):
    name: str
    description: Optional[str] = None
    subject_id: int
    user_count: int = 0
    order_index: int = 0
    is_active: bool = True

class TopicCreate(TopicBase):
    pass
class TopicUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    subject_id: Optional[int] = None
    user_count: Optional[int] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None
class Topic(TopicBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------------------------------
# Base Schema (shared attributes)
# ----------------------------------------
class CourseBase(BaseModel):
    title: str
    # credits: int = 0  # Added to match model
    description: Optional[str] = None
    exam_type: str
    instructor: str
    price: float = 0.0
    duration: str
    enrolled_students: int = 0
    completion_rate: float = 0.0
    rating: float = 0.0
    status: str = "draft"
    exam_id: Optional[int] = None
# ----------------------------------------
# Create Schema
# ----------------------------------------
class CourseCreate(CourseBase):
    pass
    # subject_ids: Optional[List[int]] = None

# ----------------------------------------
# Update Schema
# ----------------------------------------
class CourseUpdate(BaseModel):
    title: Optional[str] = None
    credits: Optional[int] = None  # Added
    description: Optional[str] = None
    instructor: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    status: Optional[str] = None
    enrolled_students: Optional[int] = None
    completion_rate: Optional[float] = None
    rating: Optional[float] = None
    subject_ids: Optional[List[int]] = None

# ----------------------------------------
# Response Schema
# ----------------------------------------
class Course(CourseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None  # Can be None if not updated yet

    class Config:
        from_attributes = True  # Tells Pydantic to accept ORM models

class CourseWithDetails(Course):
    exam: Optional[Exam] = None
    modules: List["Module"] = []
    user_courses: List["UserCourse"] = []

    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order_index: Optional[int] = 1
    duration: Optional[str] = None

class ModuleCreate(ModuleBase):
    course_id: int

class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None
    duration: Optional[str] = None

class Module(ModuleBase):
    id: int
    course_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Lesson Schemas
class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    module_id: int
    order_index: int = 0
    duration: str
    content_type: str
    content_url: str
    is_published: bool = False

class LessonCreate(LessonBase):
    pass

class Lesson(LessonBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Content Schemas
class ContentBase(BaseModel):
    title: str
    description: Optional[str] = None
    content_type: str
    file_path: Optional[str] = None  # Changed from file_path to file_url
    file_size: Optional[str] = None
    duration: Optional[str] = None  # Added
    downloads: int = 0
    status: str = "draft"
    version: str = "1.0"
    author: Optional[str] = None  # Added
    module_id: Optional[int] = None  # Added
    course_id: Optional[int] = None  # Added
    questions: Optional[List[Dict[str, Any]]] = None  # Added for quizzes

class ContentCreate(ContentBase):
    pass
class ContentResponse(ContentBase):
    class Config:
        from_attributes = True
class ContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content_type: Optional[str] = None
    file_path: Optional[str] = None
    file_size: Optional[str] = None
    duration: Optional[str] = None
    status: Optional[str] = None
    version: Optional[str] = None
    downloads: Optional[int] = None
    author: Optional[str] = None
    questions: Optional[List[Dict[str, Any]]] = None
class Content(ContentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Content Version Schemas
class ContentVersionBase(BaseModel):
    content_id: int
    version_number: str  # Changed from version to version_number
    changelog: Optional[str] = None  # Changed from changes to changelog
    file_path: Optional[str] = None
    file_size: Optional[str] = None
    duration: Optional[str] = None  # Added
    status: str = "draft"  # Added
    author: Optional[str] = None  # Added

class ContentVersionCreate(ContentVersionBase):
    pass
class ContentVersionUpdate(BaseModel):
    version_number: Optional[str] = None
    changelog: Optional[str] = None
    file_path: Optional[str] = None
    file_size: Optional[str] = None
    duration: Optional[str] = None
    status: Optional[str] = None


class ContentVersion(ContentVersionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# User Course Schemas
class UserCourseBase(BaseModel):
    user_id: str
    course_id: int
    enrollment_date: date
    progress: int = 0
    last_accessed: Optional[date] = None
    completion_status: str = "not_started"

class UserCourseCreate(UserCourseBase):
    pass

class UserCourseUpdate(BaseModel):
    progress: Optional[int] = None
    last_accessed: Optional[date] = None
    completion_status: Optional[str] = None

class UserCourse(UserCourseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Stats Schemas
class CourseStats(BaseModel):
    total_courses: int
    total_students: int
    average_completion_rate: float
    total_revenue: float
    popular_courses: List[Course]

class ContentStats(BaseModel):
    total_content: int
    total_downloads: int
    storage_used: str
    content_by_type: List[Dict[str, Any]]

class UserStats(BaseModel):
    total_users: int
    active_users: int
    new_users_today: int

class SubscriptionStats(BaseModel):
    total_revenue: int
    active_subscriptions: int

class SubscriptionAnalytics(BaseModel):
    total_revenue: int
    total_subscribers: int
    conversion_rate: float
    churn_rate: float
    active_plans: int
    monthly_recurring_revenue: int


# Add to your schemas.py file

class LeaderboardBase(BaseModel):
    user_id: str
    user_name: str
    email: EmailStr
    score: int
    rank: int
    exam: str
    avatar: Optional[str] = None
    questions_attempted: int
    questions_correct: int
    accuracy: float
    streak: int
    last_active: str
    preferred_subject: str

class Leaderboard(LeaderboardBase):
    id: int

    class Config:
        from_attributes = True

# Achievement schemas
class AchievementBase(BaseModel):
    user_id: str
    user_name: str
    score: Optional[float] = None
    study_hours: Optional[int] = None
    tests_attempted: Optional[int] = None
    exam_type: Optional[str] = None

class Achievement(AchievementBase):
    id: int

    class Config:
        from_attributes = True

# Leaderboard stats schema
class LeaderboardStats(BaseModel):
    total_users: int
    average_score: float
    average_study_hours: float
    total_tests_attempted: int
    exam_distribution: List[Dict[str, Any]]
    top_performers: List[Dict[str, Any]]

class AchievementStats(BaseModel):
    high_scorers: List[Dict[str, Any]]
    most_dedicated: List[Dict[str, Any]]
    most_tests: List[Dict[str, Any]]
    consistent_performers: List[Dict[str, Any]]
    
    
class CourseSubscriptionPlanBase(BaseModel):
    name: str
    description: str
    price: int
    duration_days: int
    max_courses: int
    course_categories: List[str]
    features: List[str]
    is_active: bool = True

class CourseSubscriptionPlanCreate(CourseSubscriptionPlanBase):
    pass

class CourseSubscriptionPlan(CourseSubscriptionPlanBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserCourseSubscriptionBase(BaseModel):
    user_id: int
    plan_id: int
    auto_renew: bool = True

class UserCourseSubscriptionCreate(UserCourseSubscriptionBase):
    pass

class UserCourseSubscription(UserCourseSubscriptionBase):
    id: int
    starts_at: datetime
    expires_at: datetime
    status: str
    created_at: datetime
    plan: CourseSubscriptionPlan
    
    class Config:
        from_attributes = True
# Add these to your existing schemas.py

class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    password: str
    confirm_password: str
    agree_terms: bool
    subscribe_newsletter: bool = False

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

    @validator('agree_terms')
    def terms_must_be_accepted(cls, v):
        if not v:
            raise ValueError('You must accept the terms and conditions')
        return v

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    organization: Optional[str]
    role: Optional[str]
    is_active: bool
    email_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    email: EmailStr
    new_password: str
    confirm_password: str

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v
# Update forward references
CourseWithDetails.update_forward_refs()