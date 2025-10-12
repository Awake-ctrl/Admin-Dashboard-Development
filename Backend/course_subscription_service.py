# course_subscription_service.py
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from datetime import datetime, timedelta
import models
import schemas

class CourseSubscriptionService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_subscription_plans(self) -> List[models.CourseSubscriptionPlan]:
        """Get all active course subscription plans"""
        return self.db.query(models.CourseSubscriptionPlan).filter(
            models.CourseSubscriptionPlan.is_active == True
        ).all()
    
    def get_subscription_plan(self, plan_id: int) -> Optional[models.CourseSubscriptionPlan]:
        """Get specific subscription plan"""
        return self.db.query(models.CourseSubscriptionPlan).filter(
            models.CourseSubscriptionPlan.id == plan_id
        ).first()
    
    def create_subscription_plan(self, plan: schemas.CourseSubscriptionPlanCreate) -> models.CourseSubscriptionPlan:
        """Create new subscription plan"""
        db_plan = models.CourseSubscriptionPlan(**plan.dict())
        self.db.add(db_plan)
        self.db.commit()
        self.db.refresh(db_plan)
        return db_plan
    
    def update_subscription_plan(self, plan_id: int, plan_update: dict) -> Optional[models.CourseSubscriptionPlan]:
        """Update subscription plan"""
        db_plan = self.db.query(models.CourseSubscriptionPlan).filter(
            models.CourseSubscriptionPlan.id == plan_id
        ).first()
        
        if db_plan:
            for key, value in plan_update.items():
                setattr(db_plan, key, value)
            db_plan.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(db_plan)
        
        return db_plan
    
    def delete_subscription_plan(self, plan_id: int) -> bool:
        """Soft delete subscription plan"""
        db_plan = self.db.query(models.CourseSubscriptionPlan).filter(
            models.CourseSubscriptionPlan.id == plan_id
        ).first()
        
        if db_plan:
            db_plan.is_active = False
            db_plan.updated_at = datetime.utcnow()
            self.db.commit()
            return True
        return False
    
    def subscribe_user(self, user_id: int, plan_id: int) -> models.UserCourseSubscription:
        """Subscribe user to a course plan"""
        plan = self.get_subscription_plan(plan_id)
        if not plan or not plan.is_active:
            raise ValueError("Invalid or inactive subscription plan")
        
        # Calculate expiration date
        expires_at = datetime.utcnow() + timedelta(days=plan.duration_days)
        
        # Create subscription
        subscription = models.UserCourseSubscription(
            user_id=user_id,
            plan_id=plan_id,
            expires_at=expires_at,
            status="active"
        )
        
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        return subscription
    
    def get_user_subscriptions(self, user_id: int) -> List[models.UserCourseSubscription]:
        """Get user's active course subscriptions"""
        return self.db.query(models.UserCourseSubscription).filter(
            models.UserCourseSubscription.user_id == user_id,
            models.UserCourseSubscription.status == "active",
            models.UserCourseSubscription.expires_at > datetime.utcnow()
        ).all()
    
    def can_access_course(self, user_id: int, course_exam_type: str) -> bool:
        """Check if user can access a course based on exam type"""
        active_subscriptions = self.get_user_subscriptions(user_id)
        
        for subscription in active_subscriptions:
            plan = subscription.plan
            # Check if plan allows access to this course category
            if "all" in plan.course_categories or course_exam_type in plan.course_categories:
                return True
        
        return False
    
    def get_subscription_stats(self) -> Dict[str, Any]:
        """Get statistics for course subscriptions"""
        total_subscriptions = self.db.query(models.UserCourseSubscription).count()
        
        active_subscriptions = self.db.query(models.UserCourseSubscription).filter(
            models.UserCourseSubscription.status == "active",
            models.UserCourseSubscription.expires_at > datetime.utcnow()
        ).count()
        
        # Revenue calculation
        revenue_result = self.db.query(
            func.sum(models.CourseSubscriptionPlan.price)
        ).join(
            models.UserCourseSubscription,
            models.UserCourseSubscription.plan_id == models.CourseSubscriptionPlan.id
        ).filter(
            models.UserCourseSubscription.status == "active"
        ).scalar()
        
        total_revenue = revenue_result if revenue_result else 0
        
        # Subscribers per plan
        plan_stats = self.db.query(
            models.CourseSubscriptionPlan.name,
            func.count(models.UserCourseSubscription.id).label('subscriber_count'),
            func.sum(models.CourseSubscriptionPlan.price).label('revenue')
        ).join(
            models.UserCourseSubscription,
            models.UserCourseSubscription.plan_id == models.CourseSubscriptionPlan.id
        ).filter(
            models.UserCourseSubscription.status == "active",
            models.UserCourseSubscription.expires_at > datetime.utcnow()
        ).group_by(
            models.CourseSubscriptionPlan.name
        ).all()
        
        return {
            "total_subscriptions": total_subscriptions,
            "active_subscriptions": active_subscriptions,
            "total_revenue": total_revenue,
            "plan_stats": [
                {
                    "plan_name": stat.name,
                    "subscriber_count": stat.subscriber_count,
                    "revenue": stat.revenue or 0
                }
                for stat in plan_stats
            ]
        }