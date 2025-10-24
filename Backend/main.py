from fastapi import FastAPI, Depends, HTTPException, status, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional,Union
import os
from datetime import datetime, date,timedelta
import uuid
from sqlalchemy import func
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Table, Date, func
from database import SessionLocal, engine, Base
import models
import schemas
import crud

from services.revenue_service import RevenueService
from routers import roles
import logging
# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Edu Dashboard API", version="1.0.0")
logger = logging.getLogger(__name__)
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    # allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# In your main.py, add this after creating the tables

# Initialize roles data
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    try:
        # Initialize roles and permissions
        from routers.roles import initialize_roles_data
        initialize_roles_data(db)
    finally:
        db.close()
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
app.include_router(roles.router)
# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Edu Dashboard API is running"}

# Health check with API prefix
@app.get("/api/")
async def api_root():
    return {"message": "Edu Dashboard API is running"}

# ========== USER ENDPOINTS ==========
@app.get("/api/users", response_model=List[schemas.User])
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

@app.get("/api/users/{user_id}", response_model=schemas.User)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ========== COURSE ENDPOINTS ==========
@app.get("/api/courses", response_model=List[schemas.Course])
def get_courses(
    skip: int = 0, 
    limit: int = 100, 
    exam_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    courses = crud.get_courses(db, skip=skip, limit=limit, exam_type=exam_type)
    return courses

@app.get("/api/courses/{course_id}", response_model=schemas.CourseWithDetails)
def get_course(course_id: int, db: Session = Depends(get_db)):
    db_course = crud.get_course(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@app.get("/api/courses/{course_id}/students", response_model=List[schemas.UserCourse])
def get_course_students(course_id: int, db: Session = Depends(get_db)):
    return db.query(models.UserCourse).filter(models.UserCourse.course_id == course_id).all()

@app.get("/api/courses/popular", response_model=List[schemas.Course])
def get_popular_courses(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db)
):
    return db.query(models.Course).order_by(models.Course.enrolled_students.desc()).limit(limit).all()

# ========== SUBJECT ENDPOINTS ==========
@app.get("/api/subjects", response_model=List[schemas.Subject])
def get_subjects(
    exam_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Subject)
    if exam_id:
        query = query.filter(models.Subject.exam_id == exam_id)
    return query.all()

@app.get("/api/subjects/{subject_id}", response_model=schemas.Subject)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject
@app.post("/api/subjects", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    # Check if subject with same name already exists for this exam
    existing_subject = db.query(models.Subject).filter(
        models.Subject.name == subject.name,
        models.Subject.exam_id == subject.exam_id
    ).first()
    if existing_subject:
        raise HTTPException(status_code=400, detail="Subject with this name already exists for this exam")
    
    db_subject = models.Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.put("/api/subjects/{subject_id}", response_model=schemas.Subject)
def update_subject(subject_id: int, subject: schemas.SubjectUpdate, db: Session = Depends(get_db)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    for field, value in subject.dict(exclude_unset=True).items():
        setattr(db_subject, field, value)
    
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.delete("/api/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.delete(subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

# ========== TOPIC ENDPOINTS ==========
@app.get("/api/topics", response_model=List[schemas.Topic])
def get_topics(
    subject_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Topic)
    if subject_id:
        query = query.filter(models.Topic.subject_id == subject_id)
    return query.all()

@app.get("/api/topics/{topic_id}", response_model=schemas.Topic)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic
@app.post("/api/topics", response_model=schemas.Topic)
def create_topic(topic: schemas.TopicCreate, db: Session = Depends(get_db)):
    # Check if topic with same name already exists for this subject
    existing_topic = db.query(models.Topic).filter(
        models.Topic.name == topic.name,
        models.Topic.subject_id == topic.subject_id
    ).first()
    if existing_topic:
        raise HTTPException(status_code=400, detail="Topic with this name already exists for this subject")
    
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

@app.put("/api/topics/{topic_id}", response_model=schemas.Topic)
def update_topic(topic_id: int, topic: schemas.TopicUpdate, db: Session = Depends(get_db)):
    db_topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    for field, value in topic.dict(exclude_unset=True).items():
        setattr(db_topic, field, value)
    
    db.commit()
    db.refresh(db_topic)
    return db_topic

@app.delete("/api/topics/{topic_id}")
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    db.delete(topic)
    db.commit()
    
    # Update subject topics count
    subject = db.query(models.Subject).filter(models.Subject.id == topic.subject_id).first()
    if subject:
        subject.topics_count = db.query(models.Topic).filter(
            models.Topic.subject_id == topic.subject_id
        ).count()
        db.commit()
    
    return {"message": "Topic deleted successfully"}
# ========== EXAM ENDPOINTS ==========
@app.get("/api/exams", response_model=List[schemas.Exam])
def get_exams(db: Session = Depends(get_db)):
    return db.query(models.Exam).all()

@app.get("/api/exams/{exam_id}", response_model=schemas.Exam)
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam
@app.post("/api/exams", response_model=schemas.Exam)
def create_exam(exam: schemas.ExamCreate, db: Session = Depends(get_db)):
    # Check if exam with same name already exists
    existing_exam = db.query(models.Exam).filter(models.Exam.name == exam.name).first()
    if existing_exam:
        raise HTTPException(status_code=400, detail="Exam with this name already exists")
    
    db_exam = models.Exam(**exam.dict())
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

@app.put("/api/exams/{exam_id}", response_model=schemas.Exam)
def update_exam(exam_id: int, exam: schemas.ExamUpdate, db: Session = Depends(get_db)):
    db_exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not db_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    for field, value in exam.dict(exclude_unset=True).items():
        setattr(db_exam, field, value)
    
    db.commit()
    db.refresh(db_exam)
    return db_exam

@app.delete("/api/exams/{exam_id}")
def delete_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    db.delete(exam)
    db.commit()
    return {"message": "Exam deleted successfully"}

# ========== MODULE ENDPOINTS ==========
@app.get("/api/modules", response_model=List[schemas.Module])
def get_modules(
    course_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Module)
    if course_id:
        query = query.filter(models.Module.course_id == course_id)
    return query.order_by(models.Module.order_index).all()

@app.get("/api/modules/{module_id}", response_model=schemas.Module)
def get_module(module_id: int, db: Session = Depends(get_db)):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

# ADD THESE MISSING ENDPOINTS:
@app.post("/api/modules", response_model=schemas.Module)
def create_module(module: schemas.ModuleCreate, db: Session = Depends(get_db)):
    # Check if course exists
    course = db.query(models.Course).filter(models.Course.id == module.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if module with same title already exists in this course
    existing_module = db.query(models.Module).filter(
        models.Module.title == module.title,
        models.Module.course_id == module.course_id
    ).first()
    if existing_module:
        raise HTTPException(status_code=400, detail="Module with this title already exists in this course")
    
    db_module = models.Module(**module.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

@app.put("/api/modules/{module_id}", response_model=schemas.Module)
def update_module(module_id: int, module: schemas.ModuleUpdate, db: Session = Depends(get_db)):
    db_module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not db_module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # If course_id is being updated, check if new course exists
    if module.course_id and module.course_id != db_module.course_id:
        course = db.query(models.Course).filter(models.Course.id == module.course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
    
    # Check for duplicate title if title is being updated
    if module.title and module.title != db_module.title:
        existing_module = db.query(models.Module).filter(
            models.Module.title == module.title,
            models.Module.course_id == module.course_id or db_module.course_id
        ).first()
        if existing_module and existing_module.id != module_id:
            raise HTTPException(status_code=400, detail="Module with this title already exists in this course")
    
    for field, value in module.dict(exclude_unset=True).items():
        setattr(db_module, field, value)
    
    db.commit()
    db.refresh(db_module)
    return db_module

@app.delete("/api/modules/{module_id}")
def delete_module(module_id: int, db: Session = Depends(get_db)):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    db.delete(module)
    db.commit()
    return {"message": "Module deleted successfully"}

# ========== CONTENT ENDPOINTS ==========
@app.get("/api/contents", response_model=List[schemas.Content])
def get_contents(
    content_type: Optional[str] = Query(None),
    course_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    contents = crud.get_contents(
        db, skip=0, limit=100, 
        content_type=content_type, 
        course_id=course_id,
        status=status
    )
    return contents

@app.get("/api/contents/{content_id}", response_model=schemas.Content)
def get_content(content_id: int, db: Session = Depends(get_db)):
    db_content = crud.get_content(db, content_id=content_id)
    if db_content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return db_content

@app.get("api/contents/{content_id}/versions", response_model=List[schemas.ContentVersion])
def get_content_versions(content_id: int, db: Session = Depends(get_db)):
    """Get all versions for a content item"""
    versions = crud.get_content_versions(db, content_id=content_id)
    return versions

@app.post("/api/contents/{content_id}/download")
def increment_download(content_id: int, db: Session = Depends(get_db)):
    db_content = crud.increment_download_count(db, content_id=content_id)
    if db_content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"message": "Download count incremented", "downloads": db_content.downloads}
@app.post("/contents/", response_model=schemas.Content)
def create_content(content: schemas.ContentCreate, db: Session = Depends(get_db)):
    # Remove topic_id if it exists in the incoming data
    content_data = content.dict()
    content_data.pop('topic_id', None)  # Remove topic_id if present
    
    # Ensure required fields are set
    if not content_data.get('file_url'):
        content_data['file_url'] = ""
    if not content_data.get('file_size'):
        content_data['file_size'] = ""
    
    db_content = crud.create_content(db=db, content=content_data)
    return db_content

@app.post("api/contents/{content_id}/versions", response_model=schemas.ContentVersion)
def create_content_version(
    content_id: int, 
    version: schemas.ContentVersionCreate, 
    db: Session = Depends(get_db)
):
    """Create a new version for a content item"""
    try:
        # Check if content exists
        db_content = crud.get_content(db, content_id=content_id)
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found")
        
        # Create the new version
        db_version = crud.create_content_version(db, content_id=content_id, version=version)
        return db_version
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating content version: {str(e)}")
# ========== USER COURSE ENDPOINTS ==========
@app.get("/api/user-courses", response_model=List[schemas.UserCourse])
def get_user_courses(
    user_id: Optional[str] = Query(None),
    course_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.UserCourse)
    if user_id:
        query = query.filter(models.UserCourse.user_id == user_id)
    if course_id:
        query = query.filter(models.UserCourse.course_id == course_id)
    return query.all()

# ========== SUBSCRIPTION PLAN ENDPOINTS ==========
@app.get("/api/subscription-plans", response_model=List[schemas.SubscriptionPlan])
def get_subscription_plans(db: Session = Depends(get_db)):
    plans = db.query(models.SubscriptionPlan).all()
    return plans

@app.get("/api/subscription-plans/{plan_id}", response_model=schemas.SubscriptionPlan)
def get_subscription_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    return plan
# ADD THESE MISSING ENDPOINTS:
@app.post("/api/subscription-plans", response_model=schemas.SubscriptionPlan)
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

@app.put("/api/subscription-plans/{plan_id}", response_model=schemas.SubscriptionPlan)
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

@app.delete("/api/subscription-plans/{plan_id}")
def delete_subscription_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Subscription plan deleted successfully"}
# ========== TRANSACTION ENDPOINTS ==========
@app.get("/api/transactions", response_model=List[schemas.TransactionBase])
def get_transactions(
    status: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Transaction)
    
    if status:
        query = query.filter(models.Transaction.status == status)
    if user_id:
        query = query.filter(models.Transaction.user_id == user_id)
    
    transactions = query.order_by(models.Transaction.date.desc()).all()
    return transactions

@app.get("/api/transactions/{transaction_id}", response_model=schemas.TransactionBase)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

# ========== REFUND REQUEST ENDPOINTS ==========
@app.get("/api/refund-requests", response_model=List[schemas.RefundRequest])
def get_refund_requests(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.RefundRequest)
    
    if status:
        query = query.filter(models.RefundRequest.status == status)
    
    requests = query.all()
    return requests

@app.get("/api/refund-requests/{request_id}", response_model=schemas.RefundRequest)
def get_refund_request(request_id: int, db: Session = Depends(get_db)):
    request = db.query(models.RefundRequest).filter(models.RefundRequest.id == request_id).first()
    if request is None:
        raise HTTPException(status_code=404, detail="Refund request not found")
    return request

# ========== STATS ENDPOINTS ==========
@app.get("/api/stats/courses")
def get_course_stats(db: Session = Depends(get_db)):
    total_courses = db.query(models.Course).count()
    
    # FIXED: Use func.sum directly
    total_students_result = db.query(func.sum(models.Course.enrolled_students)).scalar()
    total_students = total_students_result if total_students_result is not None else 0
    
    # FIXED: Use func.sum directly
    total_revenue_result = db.query(
        func.sum(models.Course.price * models.Course.enrolled_students)
    ).scalar()
    total_revenue = total_revenue_result if total_revenue_result is not None else 0
    
    # FIXED: Use func.avg directly
    avg_completion_rate_result = db.query(func.avg(models.Course.completion_rate)).scalar()
    avg_completion_rate = avg_completion_rate_result if avg_completion_rate_result is not None else 0
    
    # Get popular courses
    popular_courses = db.query(models.Course).order_by(models.Course.enrolled_students.desc()).limit(5).all()
    # total_students=5
    return {
        "total_courses": total_courses,
        "total_students": total_students,
        "total_revenue": total_revenue,
        "average_completion_rate": round(avg_completion_rate, 2),
        "popular_courses": popular_courses
    }
#  Add this debug endpoint to see what's happening
@app.get("/debug/contents")
def debug_contents(db: Session = Depends(get_db)):
    try:
        # Test basic content query
        contents = db.query(models.Content).all()
        return {"total_contents": len(contents), "contents": contents}
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}

# Your current stats/contents endpoint - check this
@app.get("/api/stats/contents", response_model=schemas.ContentStats)
def get_content_stats(db: Session = Depends(get_db)):
    try:
        # Count total content
        total_content = db.query(models.Content).count()
        
        # Sum total downloads - using func.sum directly
        total_downloads_result = db.query(func.sum(models.Content.downloads)).scalar()
        total_downloads = total_downloads_result if total_downloads_result is not None else 0
        
        # Get content by type - using func.count directly
        content_by_type_query = db.query(
            models.Content.content_type,
            func.count(models.Content.id).label('count')
        ).group_by(models.Content.content_type).all()
        
        # Format content by type data
        content_by_type = [{"type": item[0], "count": item[1]} for item in content_by_type_query]
        
        # Calculate actual storage used by summing all file_size values
        storage_used = calculate_total_storage(db)
        
        return {
            "total_content": total_content,
            "total_downloads": total_downloads,
            "storage_used": storage_used,
            "content_by_type": content_by_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching content stats: {str(e)}")

def calculate_total_storage(db: Session) -> str:
    """
    Simplified storage calculation assuming file_size is in MB
    """
    # Get all file_size values that are in MB format
    file_sizes = db.query(models.Content.file_size).filter(
        models.Content.file_size.isnot(None),
        models.Content.file_size.like('%MB%')
    ).all()
    
    total_mb = 0
    
    for file_size_tuple in file_sizes:
        file_size = file_size_tuple[0]
        if file_size:
            try:
                # Extract the number before "MB"
                mb_value = float(file_size.replace('MB', '').strip())
                total_mb += mb_value
            except (ValueError, AttributeError):
                continue
    
    # Convert to appropriate unit
    if total_mb >= 1024:
        return f"{total_mb / 1024:.1f} GB"
    else:
        return f"{total_mb:.1f} MB"
        
@app.get("/api/stats/users")
def get_user_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.account_status == 'active').count()
    
    # Calculate new users today (simplified)
    today = date.today()
    new_users_today = db.query(models.User).filter(models.User.join_date == today).count()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "new_users_today": new_users_today
    }

@app.get("/api/stats/subscriptions")
def get_subscription_stats(db: Session = Depends(get_db)):
    # FIXED: Use func.sum directly, not db.func.sum
    total_revenue_result = db.query(models.Transaction).filter(
        models.Transaction.status == 'captured'
    ).with_entities(func.sum(models.Transaction.amount)).scalar()
    total_revenue = total_revenue_result if total_revenue_result is not None else 0
    
    active_subscriptions = db.query(models.User).filter(
        models.User.subscription_status == 'active'
    ).count()
    
    return {
        "total_revenue": total_revenue,
        "active_subscriptions": active_subscriptions
    }
# ========== ANALYTICS ENDPOINTS ==========
@app.get("/api/analytics/subscription-analytics")
def get_subscription_analytics(db: Session = Depends(get_db)):
    # FIXED: Use func.sum directly
    total_subscribers_result = db.query(func.sum(models.SubscriptionPlan.subscribers)).scalar()
    total_subscribers = total_subscribers_result if total_subscribers_result is not None else 0
    
    # FIXED: Use func.sum directly
    total_revenue_result = db.query(func.sum(models.SubscriptionPlan.revenue)).scalar()
    total_revenue = total_revenue_result if total_revenue_result is not None else 0
    
    active_plans = db.query(models.SubscriptionPlan).filter(
        models.SubscriptionPlan.is_active == True
    ).count()
    
    # Calculate actual metrics based on your data
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.subscription_status == 'active').count()
    
    conversion_rate = (active_users / total_users * 100) if total_users > 0 else 0
    churn_rate = 2.3  # You might want to calculate this based on historical data
    monthly_recurring_revenue = total_revenue // 12
    
    return {
        "total_revenue": total_revenue,
        "total_subscribers": total_subscribers,
        "conversion_rate": round(conversion_rate, 1),
        "churn_rate": churn_rate,
        "active_plans": active_plans,
        "monthly_recurring_revenue": monthly_recurring_revenue
    }
@app.get("/api/analytics/revenue")
def get_revenue_analytics(
    period: str = Query("monthly", regex="^(daily|weekly|monthly)$"),
    db: Session = Depends(get_db)
):
    # Get actual transaction data for revenue analytics
    if period == "monthly":
        # Group transactions by month - FIXED: use func.strftime for SQLite
        monthly_data = db.query(
            func.strftime('%Y-%m', models.Transaction.date).label('month'),
            func.sum(models.Transaction.amount).label('revenue')
        ).filter(
            models.Transaction.status == 'captured'
        ).group_by('month').order_by('month').all()
        
        data = [{"month": item[0], "revenue": item[1] or 0} for item in monthly_data]
    elif period == "weekly":
        # For SQLite, weekly grouping is more complex, so use simplified data
        weekly_data = db.query(
            func.strftime('%Y-%W', models.Transaction.date).label('week'),
            func.sum(models.Transaction.amount).label('revenue')
        ).filter(
            models.Transaction.status == 'captured'
        ).group_by('week').order_by('week').limit(4).all()
        
        data = [{"week": f"Week {i+1}", "revenue": item[1] or 0} for i, item in enumerate(weekly_data)]
    else:  # daily
        # Get last 7 days of data
        daily_data = db.query(
            func.date(models.Transaction.date).label('date'),
            func.sum(models.Transaction.amount).label('revenue')
        ).filter(
            models.Transaction.status == 'captured',
            models.Transaction.date >= datetime.utcnow().date() - timedelta(days=7)
        ).group_by('date').order_by('date').all()
        
        data = [{"date": item[0].strftime('%Y-%m-%d'), "revenue": item[1] or 0} for item in daily_data]
    
    return {"period": period, "data": data}

@app.get("/api/analytics/plan-performance")
def get_plan_performance(db: Session = Depends(get_db)):
    plans = db.query(models.SubscriptionPlan).all()
    performance_data = []
    
    for plan in plans:
        performance_data.append({
            "plan_name": plan.name,
            "subscribers": plan.subscribers,
            "revenue": plan.revenue
        })
    
    return performance_data

# ========== FILE UPLOAD ENDPOINT ==========
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "File uploaded successfully (simulated)"
    }

# ========== KEEP YOUR EXISTING ENDPOINTS (for backward compatibility) ==========
# These endpoints without /api prefix can be removed later
@app.get("/users/", response_model=List[schemas.User])
def get_users_old(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users(skip, limit, None, None, db)

@app.get("/courses/", response_model=List[schemas.Course])
def read_courses_old(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_courses(skip, limit, None, db)

@app.get("/stats/courses/")
def get_course_stats_old(db: Session = Depends(get_db)):
    return get_course_stats(db)

# @app.get("api/stats/contents/")
# def get_content_stats_old(db: Session = Depends(get_db)):
#     return get_content_stats(db)

@app.get("/subscription-plans/", response_model=List[schemas.SubscriptionPlan])
def get_subscription_plans_old(db: Session = Depends(get_db)):
    return get_subscription_plans(db)

# @app.get("/transactions/", response_model=List[schemas.Transaction])
# def get_transactions_old(db: Session = Depends(get_db)):
#     return get_transactions(None, None, db)

# @app.get("/refund-requests/", response_model=List[schemas.RefundRequest])
# def get_refund_requests_old(db: Session = Depends(get_db)):
#     return get_refund_requests(None, db)

# ========== ANALYTICS ENDPOINTS ==========
@app.get("/api/analytics/user-stats")
def get_user_analytics_stats(db: Session = Depends(get_db)):
    # Basic counts
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.account_status == "active").count()
    
    # Get current date info
    today = date.today()
    current_month = today.month
    current_year = today.year
    print(today)
    print(current_month,current_year)
    last_month = current_month - 1 if current_month > 1 else 12
    last_month_year = current_year if current_month > 1 else current_year - 1
    
    # Calculate changes from last month
    # Total users last month
    total_users_last_month = db.query(models.User).filter(
        func.extract('month', models.User.join_date) <= last_month,
        func.extract('year', models.User.join_date) <= last_month_year
    ).count()
    print(total_users,total_users_last_month)
    total_user_this_month=db.query(models.User).filter(
        func.extract('month',models.User.join_date)<=current_month,
        func.extract('year',models.User.join_date)<=current_year,
    ).count()
    total_users_change = total_user_this_month - total_users_last_month
    
    # Active users change (percentage)
    active_users_last_month = db.query(models.User).filter(
        models.User.account_status == "active",
        func.extract('month', models.User.last_active) == last_month,
        func.extract('year', models.User.last_active) == last_month_year
    ).count()
    
    active_users_change = (
        ((active_users - active_users_last_month) / active_users_last_month * 100) 
        if active_users_last_month > 0 else 0
    )
    
    # Monthly churn calculation
    users_left_this_month = db.query(models.User).filter(
        models.User.account_status == 'inactive',
        func.extract('month', models.User.last_active) == current_month,
        func.extract('year', models.User.last_active) == current_year
    ).count()
    
    monthly_churn = (users_left_this_month / total_users * 100) # if total_users > 0 else 0
    
    # Churn change from last month
    users_left_last_month = db.query(models.User).filter(
        models.User.account_status == 'inactive',
        func.extract('month', models.User.last_active) == last_month,
        func.extract('year', models.User.last_active) == last_month_year
    ).count()
    
    churn_last_month = (users_left_last_month / total_users_last_month * 100) #if total_users_last_month > 0 else 0
    churn_change = monthly_churn - churn_last_month
    
    # Deletion requests
    deletion_requests = db.query(models.AccountDeletionRequest).count()
    pending_review_requests = db.query(models.AccountDeletionRequest).filter(
        models.AccountDeletionRequest.status == "pending_review"
    ).count()
    
    # New users today
    new_users_today = db.query(models.User).filter(
        func.date(models.User.join_date) == today
    ).count()
    
    return {
        "total_users": total_users,
        "total_users_change": total_users_change,
        "active_users": active_users,
        "active_users_change": round(active_users_change, 1),
        "deletion_requests": deletion_requests,
        "pending_review_requests": pending_review_requests,
        "monthly_churn": round(monthly_churn, 1),
        "churn_change": round(churn_change, 1),
        "new_users_today": new_users_today
    }
    
@app.get("/api/analytics/user-demographics")
def get_user_demographics(db: Session = Depends(get_db)):
    # Get users by exam type
    exam_types = db.query(models.User.exam_type).distinct().all()
    total_users = db.query(models.User).count()
    print(exam_types)
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
    # print(demographics)
    return {"demographics": demographics}

@app.get("/api/analytics/subscription-stats")
def get_subscription_stats_analytics(db: Session = Depends(get_db)):
    today = date.today()
    current_month_start = today.replace(day=1)
    last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
    
    # 1. TOTAL REVENUE - From actual transactions
    total_revenue_result = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.status == 'captured'
    ).scalar()
    total_revenue = total_revenue_result if total_revenue_result else 0
    
    # Revenue from last month for comparison
    last_month_revenue_result = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.status == 'captured',
        func.extract('month', models.Transaction.date) == last_month_start.month,
        func.extract('year', models.Transaction.date) == last_month_start.year
    ).scalar()
    last_month_revenue = last_month_revenue_result if last_month_revenue_result else 0
    
    # Calculate revenue change percentage
    revenue_change = (
        ((total_revenue - last_month_revenue) / last_month_revenue * 100) 
        if last_month_revenue > 0 else 0
    )

    # 2. ACTIVE SUBSCRIBERS - Users with active subscriptions
    active_subscribers = db.query(models.User).filter(
        models.User.subscription_status == 'active'
    ).count()
    
    # Active subscribers from last month
    active_subscribers_last_month = db.query(models.User).filter(
        models.User.subscription_status == 'active',
        func.extract('month', models.User.last_active) == last_month_start.month,
        func.extract('year', models.User.last_active) == last_month_start.year
    ).count()
    
    # Calculate active subscribers change percentage
    active_subscribers_change = (
        ((active_subscribers - active_subscribers_last_month) / active_subscribers_last_month * 100) 
        if active_subscribers_last_month > 0 else 0
    )

    # 3. CONVERSION RATE - Percentage of total users with active subscriptions
    total_users = db.query(models.User).count()
    conversion_rate = (active_subscribers / total_users * 100) if total_users > 0 else 0
    
    # Conversion rate from last month
    total_users_last_month = db.query(models.User).filter(
        models.User.join_date <= last_month_start
    ).count()
    active_subscribers_last_month_for_conversion = db.query(models.User).filter(
        models.User.subscription_status == 'active',
        models.User.join_date <= last_month_start
    ).count()
    
    conversion_rate_last_month = (
        (active_subscribers_last_month_for_conversion / total_users_last_month * 100) 
        if total_users_last_month > 0 else 0
    )
    
    conversion_rate_change = conversion_rate - conversion_rate_last_month

    # 4. CHURN RATE - Percentage of subscribers who canceled
    # Users who had active subscription last month but not this month
    subscribers_last_month = db.query(models.User).filter(
        models.User.subscription_status == 'active',
        func.extract('month', models.User.last_active) == last_month_start.month,
        func.extract('year', models.User.last_active) == last_month_start.year
    ).count()
    
    subscribers_still_active = db.query(models.User).filter(
        models.User.id.in_(
            db.query(models.User.id).filter(
                models.User.subscription_status == 'active',
                func.extract('month', models.User.last_active) == last_month_start.month,
                func.extract('year', models.User.last_active) == last_month_start.year
            )
        ),
        models.User.subscription_status == 'active',
        models.User.last_active >= current_month_start
    ).count()
    
    churned_subscribers = subscribers_last_month - subscribers_still_active
    churn_rate = (churned_subscribers / subscribers_last_month * 100) if subscribers_last_month > 0 else 0
    
    # Churn rate from previous period for comparison
    two_months_ago_start = (last_month_start - timedelta(days=1)).replace(day=1)
    subscribers_two_months_ago = db.query(models.User).filter(
        models.User.subscription_status == 'active',
        func.extract('month', models.User.last_active) == two_months_ago_start.month,
        func.extract('year', models.User.last_active) == two_months_ago_start.year
    ).count()
    
    subscribers_still_active_previous = db.query(models.User).filter(
        models.User.id.in_(
            db.query(models.User.id).filter(
                models.User.subscription_status == 'active',
                func.extract('month', models.User.last_active) == two_months_ago_start.month,
                func.extract('year', models.User.last_active) == two_months_ago_start.year
            )
        ),
        models.User.subscription_status == 'active',
        models.User.last_active >= last_month_start
    ).count()
    
    churn_rate_last_month = (
        ((subscribers_two_months_ago - subscribers_still_active_previous) / subscribers_two_months_ago * 100) 
        if subscribers_two_months_ago > 0 else 0
    )
    
    churn_rate_change = churn_rate - churn_rate_last_month

    # 5. Additional subscription stats by status (your original functionality)
    subscription_statuses = db.query(models.User.subscription_status).distinct().all()
    status_stats = []
    for status in subscription_statuses:
        if status[0]:
            count = db.query(models.User).filter(models.User.subscription_status == status[0]).count()
            percentage = (count / total_users * 100) if total_users > 0 else 0
            status_stats.append({
                "status": status[0],
                "count": count,
                "percentage": round(percentage, 1)
            })

    return {
        "total_revenue": total_revenue,
        "revenue_change": round(revenue_change, 1),
        "active_subscribers": active_subscribers,
        "active_subscribers_change": round(active_subscribers_change, 1),
        "conversion_rate": round(conversion_rate, 1),
        "conversion_rate_change": round(conversion_rate_change, 1),
        "churn_rate": round(churn_rate, 1),
        "churn_rate_change": round(churn_rate_change, 1),
        "subscription_stats": status_stats
    }

# Also add these legacy endpoints without /api prefix for backward compatibility
@app.get("/analytics/user-stats")
def get_user_stats_legacy(db: Session = Depends(get_db)):
    return get_user_analytics_stats(db)

@app.get("/analytics/user-demographics")
def get_user_demographics_legacy(db: Session = Depends(get_db)):
    return get_user_demographics(db)

@app.get("/analytics/subscription-stats")
def get_subscription_stats_legacy(db: Session = Depends(get_db)):
    return get_subscription_stats_analytics(db)

# ========== ACCOUNT DELETION REQUESTS LEGACY ENDPOINTS ==========
@app.get("/account-deletion-requests/", response_model=List[schemas.AccountDeletionRequest])
def get_deletion_requests_legacy(
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
def create_deletion_request_legacy(
    request: schemas.AccountDeletionRequest, 
    db: Session = Depends(get_db)
):
    # print(f"Received data: {request.dict()}")  # Debug print
    # Generate request ID
    request_id = f"del_{str(uuid.uuid4())[:8]}"
    
    db_request = models.AccountDeletionRequest(
        id=request_id,
        **request.dict()
    )
    print(f"Received data: {request}")  # Debug print
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@app.put("/account-deletion-requests/{request_id}", response_model=schemas.AccountDeletionRequest)
def update_deletion_request_legacy(
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

@app.delete("/account-deletion-requests/{request_id}")
def delete_deletion_request_legacy(request_id: str, db: Session = Depends(get_db)):
    deletion_request = db.query(models.AccountDeletionRequest).filter(models.AccountDeletionRequest.id == request_id).first()
    if deletion_request is None:
        raise HTTPException(status_code=404, detail="Deletion request not found")
    
    db.delete(deletion_request)
    db.commit()
    return {"message": "Deletion request removed successfully"}

# ========== ADDITIONAL LEGACY ENDPOINTS ==========
@app.post("/users/", response_model=schemas.User)
def create_user_legacy(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_id = f"user_{str(uuid.uuid4())[:8]}"
    db_user = models.User(id=user_id, **user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user_legacy(user_id: str, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: str, db: Session = Depends(get_db)):
    """
    Delete a user and all related data using cascade deletion.
    """
    logger.info(f"Attempting to delete user: {user_id}")
    
    # Check if user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    try:
        # Enable foreign keys for SQLite
        db.execute(text("PRAGMA foreign_keys = ON"))
        
        # Verify foreign keys are enabled
        result = db.execute(text("PRAGMA foreign_keys")).fetchone()
        if result and result[0] == 0:
            logger.warning("Foreign keys are not enabled in SQLite")
        
        # Store user info for response
        user_info = {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
        
        logger.info(f"Deleting user: {user_id} and all related data")
        
        # Delete user - this should cascade to all related tables
        db.delete(user)
        db.commit()
        
        # Verify user was deleted
        deleted_user = db.query(models.User).filter(models.User.id == user_id).first()
        if deleted_user:
            raise Exception("User was not deleted successfully")
        
        logger.info(f"Successfully deleted user: {user_id}")
        
        return {
            "message": "User and all related data deleted successfully",
            "deleted_user": user_info
        }
        
    except Exception as e:
        db.rollback()
        error_msg = f"Error deleting user {user_id}: {str(e)}"
        logger.error(error_msg)
        
        # Provide more specific error messages
        if "foreign key constraint" in str(e).lower():
            error_detail = "Cannot delete user due to existing references in other tables. The database cascade may not be properly configured."
        else:
            error_detail = f"Database error: {str(e)}"
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_detail
        )
# Subscription Plan legacy endpoints
@app.post("/subscription-plans/", response_model=schemas.SubscriptionPlan)
def create_subscription_plan_legacy(plan: schemas.SubscriptionPlanCreate, db: Session = Depends(get_db)):
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
def update_subscription_plan_legacy(plan_id: int, plan: schemas.SubscriptionPlanUpdate, db: Session = Depends(get_db)):
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
def delete_subscription_plan_legacy(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Subscription plan deleted successfully"}

# Transaction legacy endpoints
# @app.post("/transactions/", response_model=schemas.TransactionBase)
# def create_transaction_legacy(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
#     db_transaction = models.Transaction(**transaction.dict())
#     db.add(db_transaction)
#     db.commit()
#     db.refresh(db_transaction)
    
#     # Update revenue stats
#     RevenueService.update_all_plans_revenue(db)
    
#     return db_transaction

@app.put("/transactions/{transaction_id}", response_model=schemas.TransactionBase)
def update_transaction_legacy(transaction_id: int, transaction: schemas.TransactionUpdate, db: Session = Depends(get_db)):
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

# Refund Request legacy endpoints
# @app.post("/refund-requests/", response_model=schemas.RefundRequest)
# def create_refund_request_legacy(refund_request: schemas.RefundRequestCreate, db: Session = Depends(get_db)):
#     db_refund_request = models.RefundRequest(**refund_request.dict())
#     db.add(db_refund_request)
#     db.commit()
#     db.refresh(db_refund_request)
#     return db_refund_request

# @app.put("/refund-requests/{request_id}", response_model=schemas.RefundRequest)
# def update_refund_request_legacy(request_id: int, refund_request: schemas.RefundRequestUpdate, db: Session = Depends(get_db)):
#     db_refund_request = db.query(models.RefundRequest).filter(models.RefundRequest.id == request_id).first()
#     if db_refund_request is None:
#         raise HTTPException(status_code=404, detail="Refund request not found")
    
#     old_status = db_refund_request.status
    
#     for field, value in refund_request.dict(exclude_unset=True).items():
#         setattr(db_refund_request, field, value)
    
#     if refund_request.status in ["approved", "rejected", "processed"]:
#         db_refund_request.processed_date = datetime.utcnow()
#         db_refund_request.processed_by = "admin"
    
#     db.commit()
#     db.refresh(db_refund_request)
    
#     # If refund is approved, update related transaction and revenue
#     if refund_request.status == "approved" and old_status != "approved":
#         # Find and update the related transaction
#         transaction = db.query(models.Transaction).filter(
#             models.Transaction.user_id == db_refund_request.user_id,
#             models.Transaction.plan_name == db_refund_request.plan_name,
#             models.Transaction.amount == db_refund_request.amount,
#             models.Transaction.status == "captured"
#         ).first()
        
#         if transaction:
#             transaction.status = "refunded"
#             db.commit()
#             RevenueService.update_all_plans_revenue(db)
    
#     return db_refund_request

# Course legacy endpoints
@app.post("/courses/", response_model=schemas.Course)
def create_course_legacy(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    return crud.create_course(db=db, course=course)

@app.put("/courses/{course_id}", response_model=schemas.Course)
def update_course_legacy(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = crud.update_course(db, course_id=course_id, course=course)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

# Exam legacy endpoints
@app.post("/exams/", response_model=schemas.Exam)
def create_exam_legacy(exam: schemas.ExamCreate, db: Session = Depends(get_db)):
    db_exam = crud.get_exam_by_name(db, name=exam.name)
    if db_exam:
        raise HTTPException(status_code=400, detail="Exam already exists")
    return crud.create_exam(db=db, exam=exam)

# Subject legacy endpoints
@app.post("/subjects/", response_model=schemas.Subject)
def create_subject_legacy(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    return crud.create_subject(db=db, subject=subject)

# Topic legacy endpoints
@app.post("/topics/", response_model=schemas.Topic)
def create_topic_legacy(topic: schemas.TopicCreate, db: Session = Depends(get_db)):
    return crud.create_topic(db=db, topic=topic)

# Module legacy endpoints
@app.post("/modules/", response_model=schemas.Module)
def create_module_legacy(module: schemas.ModuleCreate, db: Session = Depends(get_db)):
    return crud.create_module(db=db, module=module)

@app.put("/modules/{module_id}", response_model=schemas.Module)
def update_module_legacy(module_id: int, module: schemas.ModuleCreate, db: Session = Depends(get_db)):
    db_module = crud.update_module(db, module_id=module_id, module=module)
    if db_module is None:
        raise HTTPException(status_code=404, detail="Module not found")
    return db_module

# Content legacy endpoints
@app.post("/contents/", response_model=schemas.Content)
def create_content_legacy(content: schemas.ContentCreate, db: Session = Depends(get_db)):
    return crud.create_content(db=db, content=content)

@app.put("/contents/{content_id}", response_model=schemas.Content)
def update_content_legacy(content_id: int, content: schemas.ContentCreate, db: Session = Depends(get_db)):
    db_content = crud.update_content(db, content_id=content_id, content=content)
    if db_content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return db_content
# Add this to your main.py file
@app.post("api/contents/{content_id}/versions", response_model=schemas.ContentVersion)
def create_content_version(
    content_id: int, 
    version: schemas.ContentVersionCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a new version for existing content
    """
    try:
        # Check if content exists
        db_content = crud.get_content(db, content_id=content_id)
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found")
        
        # Create the new version
        db_version = crud.create_content_version(db, content_id=content_id, version=version)
        return db_version
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating content version: {str(e)}")
# File upload legacy endpoint
@app.post("/upload/")
async def upload_file_legacy(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "File uploaded successfully (simulated)"
    }
    
# ========== USER ENDPOINTS - ADD MISSING METHODS ==========
@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_id = f"user_{str(uuid.uuid4())[:8]}"
    db_user = models.User(id=user_id, **user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/api/users/{user_id}", response_model=schemas.User)
def update_user(user_id: str, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# ========== COURSE ENDPOINTS - ADD MISSING METHODS ==========
@app.post("/api/courses", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    return crud.create_course(db=db, course=course)

@app.put("/api/courses/{course_id}", response_model=schemas.Course)
def update_course(course_id: int, course: schemas.CourseUpdate, db: Session = Depends(get_db)):
    db_course = crud.update_course(db, course_id=course_id, course=course)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course(db, course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}

# ========== TRANSACTION ENDPOINTS - ADD MISSING METHODS ==========
@app.post("/api/transactions", response_model=schemas.TransactionBase)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    # Update revenue stats
    RevenueService.update_all_plans_revenue(db)
    
    return db_transaction

@app.put("/api/transactions/{transaction_id}", response_model=schemas.TransactionBase)
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

# ========== REFUND REQUEST ENDPOINTS - ADD MISSING METHODS ==========
@app.post("/api/refund-requests", response_model=schemas.RefundRequest)
def create_refund_request(refund_request: schemas.RefundRequestCreate, db: Session = Depends(get_db)):
    db_refund_request = models.RefundRequest(**refund_request.dict())
    db.add(db_refund_request)
    db.commit()
    db.refresh(db_refund_request)
    return db_refund_request

@app.put("/api/refund-requests/{request_id}", response_model=schemas.RefundRequest)
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

# ========== ACCOUNT DELETION REQUEST ENDPOINTS - ADD MISSING METHODS ==========
@app.post("/api/account-deletion-requests", response_model=schemas.AccountDeletionRequest)
def create_account_deletion_request(request: schemas.AccountDeletionRequestCreate, db: Session = Depends(get_db)):
    # Convert arrays to strings if needed
    request_data = request.dict()
    
    if isinstance(request_data.get('data_to_delete'), list):
        request_data['data_to_delete'] = ', '.join(request_data['data_to_delete'])
    
    if isinstance(request_data.get('data_to_retain'), list):
        request_data['data_to_retain'] = ', '.join(request_data['data_to_retain'])
    
    # Generate ID and set request_date
    request_id = f"del_{str(uuid.uuid4())[:8]}"
    db_request = models.AccountDeletionRequest(
        id=request_id,
        request_date=datetime.utcnow(),  # Auto-generate this
        **request_data
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@app.put("/api/account-deletion-requests/{request_id}", response_model=schemas.AccountDeletionRequest)
def update_account_deletion_request(request_id: str, request: schemas.AccountDeletionRequestUpdate, db: Session = Depends(get_db)):
    db_request = db.query(models.AccountDeletionRequest).filter(models.AccountDeletionRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Account deletion request not found")
    
    for field, value in request.dict(exclude_unset=True).items():
        setattr(db_request, field, value)
    
    db.commit()
    db.refresh(db_request)
    return db_request

@app.delete("/api/account-deletion-requests/{request_id}")
def delete_account_deletion_request(request_id: str, db: Session = Depends(get_db)):
    request = db.query(models.AccountDeletionRequest).filter(models.AccountDeletionRequest.id == request_id).first()
    if request is None:
        raise HTTPException(status_code=404, detail="Account deletion request not found")
    
    db.delete(request)
    db.commit()
    return {"message": "Account deletion request deleted successfully"}



# ========== LEADERBOARD ENDPOINTS ==========
@app.get("/api/leaderboard", response_model=List[schemas.Leaderboard])
def get_leaderboard(
    exam_type: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Get leaderboard data with optional exam type filter"""
    query = db.query(models.User)
    
    if exam_type and exam_type != "all":
        query = query.filter(models.User.exam_type == exam_type)
    
    # Get users and calculate scores for leaderboard
    users = query.filter(
        models.User.account_status == "active"
    ).order_by(
        models.User.average_score.desc(),
        models.User.tests_attempted.desc(),
        models.User.total_study_hours.desc()
    ).limit(limit).all()
    
    leaderboard_data = []
    for index, user in enumerate(users):
        # Calculate score based on multiple factors
        score = calculate_user_score(user)
        
        leaderboard_data.append({
            "id": index + 1,
            "user_id": user.id,
            "user_name": user.name,
            "email": user.email,
            "score": score,
            "rank": index + 1,
            "exam": user.exam_type or "general",
            "avatar": "",
            "questions_attempted": user.tests_attempted * 10,  # Estimate
            "questions_correct": calculate_correct_answers(user),
            "accuracy": user.average_score or 0,
            "streak": calculate_user_streak(db, user.id),  # Fixed: Use database for streak
            "last_active": user.last_active.isoformat() if user.last_active else datetime.utcnow().isoformat(),
            "preferred_subject": get_user_preferred_subject(db, user.id)  # Fixed: Use database for subject
        })
    
    return leaderboard_data

# Helper functions for leaderboard calculations
def calculate_user_score(user):
    """Calculate comprehensive user score for leaderboard"""
    base_score = (user.average_score or 0) * 10  # Convert percentage to points
    study_bonus = (user.total_study_hours or 0) * 2  # 2 points per study hour
    test_bonus = (user.tests_attempted or 0) * 5  # 5 points per test
    rank_bonus = (1000 - (user.current_rank or 1000)) if user.current_rank else 0
    
    total_score = base_score + study_bonus + test_bonus + max(rank_bonus, 0)
    return int(total_score)

def calculate_correct_answers(user):
    """Estimate correct answers based on tests attempted and average score"""
    total_questions = (user.tests_attempted or 0) * 10  # Assume 10 questions per test
    correct_answers = total_questions * (user.average_score or 0) / 100
    return int(correct_answers)

def calculate_user_streak(db: Session, user_id: str):
    """Calculate actual streak based on consecutive days with activity"""
    # Get the last 30 days of activity
    thirty_days_ago = date.today() - timedelta(days=30)
    
    activity_days = db.query(
        func.date(models.UserActivity.activity_date).label('activity_date')
    ).filter(
        models.UserActivity.user_id == user_id,
        models.UserActivity.activity_date >= thirty_days_ago
    ).distinct().order_by(
        func.date(models.UserActivity.activity_date).desc()
    ).all()
    
    if not activity_days:
        return 0
    
    # Calculate consecutive days from today
    today = date.today()
    streak = 0
    
    for i in range(30):  # Check last 30 days
        check_date = today - timedelta(days=i)
        
        # Check if user had activity on this date
        had_activity = any(
            activity.activity_date == check_date 
            for activity in activity_days
        )
        
        if had_activity:
            streak += 1
        else:
            break
    
    return streak

def get_user_preferred_subject(db: Session, user_id: str):
    """Get user's preferred subject from their activity or courses"""
    # Check user's enrolled courses to determine preferred subject
    user_courses = db.query(models.UserCourse).filter(
        models.UserCourse.user_id == user_id
    ).all()
    
    if user_courses:
        # Get the course with highest progress or most recent activity
        most_engaged_course = max(user_courses, key=lambda uc: uc.progress, default=None)
        if most_engaged_course:
            course = db.query(models.Course).filter(
                models.Course.id == most_engaged_course.course_id
            ).first()
            if course:
                # Extract subject from course title or use exam type
                return extract_subject_from_course(course.title) or course.exam_type
    
    # Fallback: Get from user's exam type
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user and user.exam_type:
        return get_subject_from_exam_type(user.exam_type)
    
    return "General"

def extract_subject_from_course(course_title: str):
    """Extract subject from course title"""
    subjects = ["Physics", "Mathematics", "Chemistry", "Biology", "History", 
                "Geography", "Quantitative", "Verbal", "Logical", "Technical",
                "General Knowledge", "Aptitude", "Reasoning"]
    
    course_lower = course_title.lower()
    for subject in subjects:
        if subject.lower() in course_lower:
            return subject
    return None

def get_subject_from_exam_type(exam_type: str):
    """Get default subject based on exam type"""
    subject_map = {
        'jee': 'Physics',
        'neet': 'Biology',
        'cat': 'Quantitative Aptitude',
        'upsc': 'History',
        'gate': 'Technical',
        'other_govt_exam': 'General Knowledge'
    }
    return subject_map.get(exam_type, 'General')


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
