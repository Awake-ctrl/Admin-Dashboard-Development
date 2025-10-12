# schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, date

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
    data_to_delete: Optional[str] = None
    data_to_retain: Optional[str] = None
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
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Subscription Plan Schemas
class SubscriptionPlanBase(BaseModel):
    name: str
    max_text: int = 0
    max_image: int = 0
    max_audio: int = 0
    max_expand: int = 0
    max_with_history: int = 0
    price: int = 0
    timedelta: int = 2592000
    subscribers: int = 0
    revenue: int = 0
    is_active: bool = True

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlanUpdate(BaseModel):
    name: Optional[str] = None
    max_text: Optional[int] = None
    max_image: Optional[int] = None
    max_audio: Optional[int] = None
    max_expand: Optional[int] = None
    max_with_history: Optional[int] = None
    price: Optional[int] = None
    timedelta: Optional[int] = None
    subscribers: Optional[int] = None
    revenue: Optional[int] = None
    is_active: Optional[bool] = None

class SubscriptionPlan(SubscriptionPlanBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    user_id: str
    user_name: str
    plan_name: str
    plan_id: Optional[int] = None
    type: str
    amount: int
    status: str
    order_id: str
    payment_gateway_id: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    status: Optional[str] = None
    payment_gateway_id: Optional[str] = None

class Transaction(TransactionBase):
    id: int
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

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
    created_at: datetime
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

# Course Schemas
class CourseBase(BaseModel):
    title: str
    credits: int = 0
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

class CourseCreate(BaseModel):
    title: str
    credits: int = 0
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
    subject_ids: Optional[List[int]] = None  # Add this field

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
    subject_ids: Optional[List[int]] = None  # Add this field

class Course(CourseBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True

class CourseWithDetails(Course):
    exam: Optional[Exam] = None
    modules: List["Module"] = []
    user_courses: List["UserCourse"] = []

    class Config:
        from_attributes = True


# Module Schemas
class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: int
    order_index: int = 0
    duration: str
    lessons_count: int = 0

class ModuleCreate(ModuleBase):
    pass
class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    course_id: Optional[int] = None
    order_index: Optional[int] = None
    duration: Optional[str] = None
    lessons_count: Optional[int] = None

class Module(ModuleBase):
    id: int
    created_at: datetime

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
    file_path: str
    file_size: str
    downloads: int = 0
    status: str = "draft"
    version: str = "1.0"
    author: str
    topic_id: Optional[int] = None
    course_id: Optional[int] = None

class ContentCreate(ContentBase):
    pass

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    version: Optional[str] = None
    downloads: Optional[int] = None

class Content(ContentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Content Version Schemas
class ContentVersionBase(BaseModel):
    content_id: int
    version: str
    changes: str
    file_path: str
    file_size: str

class ContentVersionCreate(ContentVersionBase):
    pass

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
    
# Update forward references
CourseWithDetails.update_forward_refs()