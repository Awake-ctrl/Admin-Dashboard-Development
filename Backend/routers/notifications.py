from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func
import models
import schemas
from database import SessionLocal

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get all notifications
@router.get("", response_model=List[schemas.Notification])
async def get_notifications(db: Session = Depends(get_db)):
    try:
        notifications = db.query(models.Notification).order_by(
            models.Notification.created_at.desc()
        ).all()
        return notifications
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Get notification stats
@router.get("/stats", response_model=schemas.NotificationStats)
async def get_notification_stats(db: Session = Depends(get_db)):
    try:
        total_notifications = db.query(models.Notification).count()
        sent_notifications = db.query(models.Notification).filter(
            models.Notification.status == "sent"
        ).count()
        
        # Calculate total recipients using func.sum
        total_recipients_result = db.query(
            func.sum(models.Notification.recipients_count)
        ).filter(
            models.Notification.status == "sent"
        ).scalar()
        
        total_recipients = int(total_recipients_result) if total_recipients_result else 0
        
        # Count total subscribers (active notification subscribers)
        total_subscribers = db.query(models.NotificationSubscriber).filter(
            models.NotificationSubscriber.is_active == True
        ).count()
        
        return {
            "total_notifications": total_notifications,
            "sent_notifications": sent_notifications,
            "total_recipients": total_recipients,
            "total_subscribers": total_subscribers
        }
    except Exception as e:
        print(f"Error fetching notification stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Create notification
@router.post("", response_model=schemas.Notification)
async def create_notification(
    notification: schemas.NotificationCreate,
    db: Session = Depends(get_db)
):
    try:
        # Calculate recipients based on tag
        recipients_count = 0
        if notification.status == "sent":
            if notification.tag == "global":
                recipients_count = db.query(models.User).filter(
                    models.User.account_status == "active"
                ).count()
            elif notification.tag == "personlized":
                recipients_count = db.query(models.NotificationSubscriber).filter(
                    models.NotificationSubscriber.is_active == True
                ).count()
            else:
                # For exam-specific notifications (jee, neet, cat, etc.)
                recipients_count = db.query(models.User).filter(
                    models.User.exam_type == notification.tag,
                    models.User.account_status == "active"
                ).count()
        
        # Set sent_at if status is sent
        sent_at = datetime.utcnow() if notification.status == "sent" else None
        
        db_notification = models.Notification(
            title=notification.title,
            subtitle=notification.subtitle,
            icon=notification.icon,
            tag=notification.tag,
            status=notification.status,
            recipients_count=recipients_count,
            sent_at=sent_at
        )
        
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return db_notification
    except Exception as e:
        db.rollback()
        print(f"Error creating notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Update notification
@router.put("/{notification_id}", response_model=schemas.Notification)
async def update_notification(
    notification_id: int,
    notification: schemas.NotificationUpdate,
    db: Session = Depends(get_db)
):
    try:
        db_notification = db.query(models.Notification).filter(
            models.Notification.id == notification_id
        ).first()
        
        if not db_notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        # Update fields
        update_data = notification.dict(exclude_unset=True)
        
        # If tag is being updated, recalculate recipients
        if "tag" in update_data:
            tag = update_data["tag"]
            if tag == "global":
                db_notification.recipients_count = db.query(models.User).filter(
                    models.User.account_status == "active"
                ).count()
            elif tag == "personlized":
                db_notification.recipients_count = db.query(models.NotificationSubscriber).filter(
                    models.NotificationSubscriber.is_active == True
                ).count()
            else:
                db_notification.recipients_count = db.query(models.User).filter(
                    models.User.exam_type == tag,
                    models.User.account_status == "active"
                ).count()
        
        # Update other fields
        for key, value in update_data.items():
            if key != "tag":  # Already handled above
                setattr(db_notification, key, value)
        
        # If status changed to sent, set sent_at and recalculate recipients if needed
        if "status" in update_data and update_data["status"] == "sent":
            if db_notification.sent_at is None:
                db_notification.sent_at = datetime.utcnow()
            
            # Recalculate recipients if not already set
            if db_notification.recipients_count == 0:
                if db_notification.tag == "global":
                    db_notification.recipients_count = db.query(models.User).filter(
                        models.User.account_status == "active"
                    ).count()
                elif db_notification.tag == "personlized":
                    db_notification.recipients_count = db.query(models.NotificationSubscriber).filter(
                        models.NotificationSubscriber.is_active == True
                    ).count()
                else:
                    db_notification.recipients_count = db.query(models.User).filter(
                        models.User.exam_type == db_notification.tag,
                        models.User.account_status == "active"
                    ).count()
        
        db_notification.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_notification)
        return db_notification
    except Exception as e:
        db.rollback()
        print(f"Error updating notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Delete notification
@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db)
):
    try:
        db_notification = db.query(models.Notification).filter(
            models.Notification.id == notification_id
        ).first()
        
        if not db_notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        db.delete(db_notification)
        db.commit()
        return {"message": "Notification deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))