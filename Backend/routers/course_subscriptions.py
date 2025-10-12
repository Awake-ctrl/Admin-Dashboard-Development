# routers/course_subscriptions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas
from course_subscription_service import CourseSubscriptionService
from database import get_db

router = APIRouter(prefix="/api/course-subscriptions", tags=["Course Subscriptions"])

@router.get("/plans", response_model=List[schemas.CourseSubscriptionPlan])
def get_course_subscription_plans(db: Session = Depends(get_db)):
    service = CourseSubscriptionService(db)
    return service.get_subscription_plans()

@router.get("/plans/{plan_id}", response_model=schemas.CourseSubscriptionPlan)
def get_course_subscription_plan(plan_id: int, db: Session = Depends(get_db)):
    service = CourseSubscriptionService(db)
    plan = service.get_subscription_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    return plan

@router.post("/plans", response_model=schemas.CourseSubscriptionPlan)
def create_course_subscription_plan(
    plan: schemas.CourseSubscriptionPlanCreate,
    db: Session = Depends(get_db)
):
    service = CourseSubscriptionService(db)
    return service.create_subscription_plan(plan)

@router.put("/plans/{plan_id}", response_model=schemas.CourseSubscriptionPlan)
def update_course_subscription_plan(
    plan_id: int,
    plan_update: dict,
    db: Session = Depends(get_db)
):
    service = CourseSubscriptionService(db)
    updated_plan = service.update_subscription_plan(plan_id, plan_update)
    if not updated_plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    return updated_plan

@router.delete("/plans/{plan_id}")
def delete_course_subscription_plan(plan_id: int, db: Session = Depends(get_db)):
    service = CourseSubscriptionService(db)
    success = service.delete_subscription_plan(plan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    return {"message": "Subscription plan deleted successfully"}

@router.post("/users/{user_id}/subscribe")
def subscribe_user_to_plan(
    user_id: int,
    subscription_data: dict,  # {"plan_id": int}
    db: Session = Depends(get_db)
):
    service = CourseSubscriptionService(db)
    try:
        subscription = service.subscribe_user(user_id, subscription_data["plan_id"])
        return subscription
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/{user_id}/subscriptions")
def get_user_subscriptions(user_id: int, db: Session = Depends(get_db)):
    service = CourseSubscriptionService(db)
    return service.get_user_subscriptions(user_id)

@router.get("/stats")
def get_subscription_stats(db: Session = Depends(get_db)):
    service = CourseSubscriptionService(db)
    return service.get_subscription_stats()

@router.get("/users/{user_id}/can-access/{course_exam_type}")
def check_course_access(
    user_id: int,
    course_exam_type: str,
    db: Session = Depends(get_db)
):
    service = CourseSubscriptionService(db)
    can_access = service.can_access_course(user_id, course_exam_type)
    return {"can_access": can_access, "user_id": user_id, "course_type": course_exam_type}