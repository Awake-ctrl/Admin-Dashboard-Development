# services/revenue_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func
import models

class RevenueService:
    @staticmethod
    def update_all_plans_revenue(db: Session):
        """Update revenue for all subscription plans based on transactions"""
        plans = db.query(models.SubscriptionPlan).all()
        
        for plan in plans:
            # Calculate total revenue for this plan from successful transactions
            total_revenue = db.query(func.sum(models.Transaction.amount)).filter(
                models.Transaction.plan_name == plan.name,
                models.Transaction.status == 'captured'
            ).scalar() or 0
            
            # Calculate number of subscribers for this plan
            subscribers = db.query(models.User).filter(
                models.User.subscription_plan == plan.name,
                models.User.subscription_status == 'active'
            ).count()
            
            plan.revenue = total_revenue
            plan.subscribers = subscribers
        
        db.commit()
    
    @staticmethod
    def handle_transaction_status_change(db: Session, transaction_id: int, old_status: str, new_status: str):
        """Handle revenue updates when transaction status changes"""
        if old_status != new_status:
            RevenueService.update_all_plans_revenue(db)
    
    @staticmethod
    def get_subscription_stats(db: Session):
        """Get comprehensive subscription statistics"""
        total_revenue = db.query(func.sum(models.SubscriptionPlan.revenue)).scalar() or 0
        total_subscribers = db.query(func.sum(models.SubscriptionPlan.subscribers)).scalar() or 0
        active_plans = db.query(models.SubscriptionPlan).filter(
            models.SubscriptionPlan.is_active == True
        ).count()
        
        # Calculate conversion rate (simplified)
        total_users = db.query(models.User).count()
        conversion_rate = (total_subscribers / total_users * 100) if total_users > 0 else 0
        
        # Calculate churn rate (simplified)
        churn_rate = 2.3  # This would be calculated from historical data
        
        return {
            "total_revenue": total_revenue,
            "total_subscribers": total_subscribers,
            "conversion_rate": round(conversion_rate, 2),
            "churn_rate": churn_rate,
            "active_plans": active_plans,
            "monthly_recurring_revenue": total_revenue // 12
        }