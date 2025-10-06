from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas

# User CRUD
def get_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    account_status: Optional[str] = None,
    exam_type: Optional[str] = None
):
    query = db.query(models.User)
    
    if account_status and account_status != "all":
        query = query.filter(models.User.account_status == account_status)
    
    if exam_type and exam_type != "all":
        query = query.filter(models.User.exam_type == exam_type)
    
    return query.offset(skip).limit(limit).all()

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, user: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        for field, value in user.dict(exclude_unset=True).items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user

# Account Deletion Request CRUD
def get_deletion_requests(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None
):
    query = db.query(models.AccountDeletionRequest)
    
    if status:
        query = query.filter(models.AccountDeletionRequest.status == status)
    
    return query.offset(skip).limit(limit).all()

def create_deletion_request(db: Session, request: schemas.AccountDeletionRequestCreate):
    db_request = models.AccountDeletionRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def update_deletion_request(db: Session, request_id: str, request: schemas.AccountDeletionRequestUpdate):
    db_request = db.query(models.AccountDeletionRequest).filter(models.AccountDeletionRequest.id == request_id).first()
    if db_request:
        for field, value in request.dict(exclude_unset=True).items():
            setattr(db_request, field, value)
        db.commit()
        db.refresh(db_request)
    return db_request

# Subscription Plan CRUD
def get_subscription_plans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SubscriptionPlan).offset(skip).limit(limit).all()

def get_subscription_plan(db: Session, plan_id: int):
    return db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()

def create_subscription_plan(db: Session, plan: schemas.SubscriptionPlanCreate):
    db_plan = models.SubscriptionPlan(**plan.dict())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def update_subscription_plan(db: Session, plan_id: int, plan: schemas.SubscriptionPlanUpdate):
    db_plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if db_plan:
        for field, value in plan.dict(exclude_unset=True).items():
            setattr(db_plan, field, value)
        db.commit()
        db.refresh(db_plan)
    return db_plan

# Transaction CRUD
def get_transactions(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None
):
    query = db.query(models.Transaction)
    
    if status:
        query = query.filter(models.Transaction.status == status)
    
    return query.order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def update_transaction(db: Session, transaction_id: int, transaction: schemas.TransactionUpdate):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction:
        for field, value in transaction.dict(exclude_unset=True).items():
            setattr(db_transaction, field, value)
        db.commit()
        db.refresh(db_transaction)
    return db_transaction

# Refund Request CRUD
def get_refund_requests(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None
):
    query = db.query(models.RefundRequest)
    
    if status:
        query = query.filter(models.RefundRequest.status == status)
    
    return query.offset(skip).limit(limit).all()

def create_refund_request(db: Session, refund_request: schemas.RefundRequestCreate):
    db_refund_request = models.RefundRequest(**refund_request.dict())
    db.add(db_refund_request)
    db.commit()
    db.refresh(db_refund_request)
    return db_refund_request

def update_refund_request(db: Session, request_id: int, refund_request: schemas.RefundRequestUpdate):
    db_refund_request = db.query(models.RefundRequest).filter(models.RefundRequest.id == request_id).first()
    if db_refund_request:
        for field, value in refund_request.dict(exclude_unset=True).items():
            setattr(db_refund_request, field, value)
        db.commit()
        db.refresh(db_refund_request)
    return db_refund_request

# Exam CRUD
def get_exams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Exam).offset(skip).limit(limit).all()

def get_exam(db: Session, exam_id: int):
    return db.query(models.Exam).filter(models.Exam.id == exam_id).first()

def get_exam_by_name(db: Session, name: str):
    return db.query(models.Exam).filter(models.Exam.name == name).first()

def create_exam(db: Session, exam: schemas.ExamCreate):
    db_exam = models.Exam(**exam.dict())
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

# Subject CRUD
def get_subjects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Subject).offset(skip).limit(limit).all()

def get_subject(db: Session, subject_id: int):
    return db.query(models.Subject).filter(models.Subject.id == subject_id).first()

def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

# Topic CRUD
def get_topics(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Topic).offset(skip).limit(limit).all()

def get_topic(db: Session, topic_id: int):
    return db.query(models.Topic).filter(models.Topic.id == topic_id).first()

def create_topic(db: Session, topic: schemas.TopicCreate):
    db_topic = models.Topic(**topic.dict())
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    
    # Update subject topics count
    subject = db.query(models.Subject).filter(models.Subject.id == topic.subject_id).first()
    if subject:
        subject.topics_count = db.query(models.Topic).filter(
            models.Topic.subject_id == topic.subject_id
        ).count()
        db.commit()
    
    return db_topic

# Course CRUD
def get_courses(db: Session, skip: int = 0, limit: int = 100, exam_type: Optional[str] = None):
    query = db.query(models.Course)
    if exam_type:
        query = query.filter(models.Course.exam_type == exam_type)
    return query.offset(skip).limit(limit).all()

def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

# Course CRUD - Fix create_course function
def create_course(db: Session, course: schemas.CourseCreate):
    # Extract subject_ids if provided
    course_data = course.dict()
    subject_ids = course_data.pop('subject_ids', None)
    
    db_course = models.Course(**course_data)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    # Add subjects if provided
    if subject_ids:
        for subject_id in subject_ids:
            subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
            if subject:
                db_course.subjects.append(subject)
        db.commit()
        db.refresh(db_course)
    
    return db_course

def update_course(db: Session, course_id: int, course: schemas.CourseUpdate):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course:
        # Extract subject_ids if provided
        course_data = course.dict(exclude_unset=True)
        subject_ids = course_data.pop('subject_ids', None)
        
        for field, value in course_data.items():
            setattr(db_course, field, value)
        
        # Update subjects if provided
        if subject_ids is not None:
            db_course.subjects = []
            for subject_id in subject_ids:
                subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
                if subject:
                    db_course.subjects.append(subject)
        
        db.commit()
        db.refresh(db_course)
    return db_course

# Module CRUD
def get_modules(db: Session, skip: int = 0, limit: int = 100, course_id: Optional[int] = None):
    query = db.query(models.Module)
    if course_id:
        query = query.filter(models.Module.course_id == course_id)
    return query.offset(skip).limit(limit).all()

def get_module(db: Session, module_id: int):
    return db.query(models.Module).filter(models.Module.id == module_id).first()

def create_module(db: Session, module: schemas.ModuleCreate):
    db_module = models.Module(**module.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

def update_module(db: Session, module_id: int, module: schemas.ModuleCreate):
    db_module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if db_module:
        for field, value in module.dict(exclude_unset=True).items():
            setattr(db_module, field, value)
        db.commit()
        db.refresh(db_module)
    return db_module

# Content CRUD
def get_contents(db: Session, skip: int = 0, limit: int = 100, content_type: Optional[str] = None, course_id: Optional[int] = None, status: Optional[str] = None):
    query = db.query(models.Content)
    if content_type:
        query = query.filter(models.Content.content_type == content_type)
    if course_id:
        query = query.filter(models.Content.course_id == course_id)
    if status:
        query = query.filter(models.Content.status == status)
    return query.offset(skip).limit(limit).all()

def get_content(db: Session, content_id: int):
    return db.query(models.Content).filter(models.Content.id == content_id).first()
def create_content(db: Session, content: schemas.ContentCreate):
    db_content = models.Content(**content.dict())
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

def update_content(db: Session, content_id: int, content: schemas.ContentUpdate):
    db_content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if db_content:
        update_data = content.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_content, field, value)
        db.commit()
        db.refresh(db_content)
    return db_content

def delete_content(db: Session, content_id: int):
    db_content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if db_content:
        db.delete(db_content)
        db.commit()
    return db_content

def increment_download_count(db: Session, content_id: int):
    content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if content:
        content.downloads += 1
        db.commit()
        db.refresh(content)
    return content

# Content Version CRUD
def create_content_version(db: Session, content_version: schemas.ContentVersionCreate):
    db_version = models.ContentVersion(**content_version.dict())
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version

def get_content_versions(db: Session, content_id: int):
    return db.query(models.ContentVersion).filter(
        models.ContentVersion.content_id == content_id
    ).order_by(models.ContentVersion.created_at.desc()).all()

# Stats functions
def get_content_stats(db: Session):
    total_content = db.query(models.Content).count()
    total_documents = db.query(models.Content).filter(
        models.Content.content_type == "document"
    ).count()
    total_videos = db.query(models.Content).filter(
        models.Content.content_type == "video"
    ).count()
    total_quizzes = db.query(models.Content).filter(
        models.Content.content_type == "quiz"
    ).count()
    total_images = db.query(models.Content).filter(
        models.Content.content_type == "image"
    ).count()
    
    # Calculate storage used (this would normally come from actual file sizes)
    storage_used = "3.2 GB"  # Placeholder
    
    return {
        "total_content": total_content,
        "total_documents": total_documents,
        "total_videos": total_videos,
        "total_quizzes": total_quizzes,
        "total_images": total_images,
        "storage_used": storage_used
    }
    
def get_deletion_request(db: Session, request_id: str):
    return db.query(models.AccountDeletionRequest).filter(models.AccountDeletionRequest.id == request_id).first()