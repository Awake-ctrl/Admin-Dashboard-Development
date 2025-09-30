# Add to existing schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime, date
# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    exam_type: Optional[str] = None
    subscription_status: Optional[str] = None
    subscription_plan: Optional[str] = None
    join_date: Optional[date] = None
    last_active: Optional[date] = None
    total_study_hours: Optional[int] = 0
    tests_attempted: Optional[int] = 0
    average_score: Optional[float] = 0.0
    current_rank: Optional[int] = None
    account_status: Optional[str] = "active"
    deletion_requested: Optional[bool] = False
    deletion_request_date: Optional[date] = None
    deletion_reason: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
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
    deletion_requested: Optional[bool] = None
    deletion_reason: Optional[str] = None

class User(UserBase):
    id: str
    
    class Config:
        orm_mode = True

# Account Deletion Request schemas
class AccountDeletionRequestBase(BaseModel):
    user_id: str
    user_name: str
    email: str
    request_date: datetime
    reason: str
    data_to_delete: List[str]
    data_to_retain: List[str]
    status: str = "pending_review"
    estimated_deletion_date: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    approved_date: Optional[datetime] = None

class AccountDeletionRequestCreate(AccountDeletionRequestBase):
    pass

class AccountDeletionRequestUpdate(BaseModel):
    status: Optional[str] = None
    reviewed_by: Optional[str] = None
    approved_date: Optional[datetime] = None
    estimated_deletion_date: Optional[datetime] = None

class AccountDeletionRequest(AccountDeletionRequestBase):
    id: str
    
    class Config:
        orm_mode = True

# Analytics schemas
class UserStats(BaseModel):
    total_users: int
    active_users: int
    deletion_requests: int
    monthly_churn: float

class UserDemographics(BaseModel):
    exam_type: str
    count: int
    percentage: float

class SubscriptionStats(BaseModel):
    status: str
    count: int
    percentage: float

# class ActivityStats(BaseModel):
#     level: str
#     count: int
#     percentage: float
    
# Add to existing schemas.py
# Subscription schemas
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
    updated_at: datetime
    
    class Config:
        orm_mode = True

# Transaction schemas
class TransactionBase(BaseModel):
    user_id: str
    user_name: str
    plan_name: str
    plan_id: Optional[int] = None  # Add this
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
    
    class Config:
        orm_mode = True

# Refund Request schemas
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
    
    class Config:
        orm_mode = True

# Analytics schemas
class SubscriptionStats(BaseModel):
    total_revenue: int
    total_subscribers: int
    conversion_rate: float
    churn_rate: float