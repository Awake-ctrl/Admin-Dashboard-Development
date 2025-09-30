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

class ActivityStats(BaseModel):
    level: str
    count: int
    percentage: float