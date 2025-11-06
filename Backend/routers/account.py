# routers/account.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from typing import Optional
import os
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/account", tags=["account"])

@router.get("/profile/{user_id}", response_model=schemas.UserProfile)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    """Get user profile for account settings"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    name_parts = user.name.split() if user.name else ["", ""]
    return {
        "id": user.id,
        "firstName": name_parts[0] if len(name_parts) > 0 else "",
        "lastName": name_parts[1] if len(name_parts) > 1 else "",
        "email": user.email,
        "phone": user.phone or "",
        "organization": user.organization or "",
        "role": user.role or "Student",
        "bio": user.bio or "",
        "timezone": user.timezone or "Asia/Kolkata",
        "language": user.language or "English"
    }

@router.put("/profile/{user_id}")
def update_user_profile(
    user_id: str, 
    profile_data: schemas.UserProfileUpdate, 
    db: Session = Depends(get_db)
):
    """Update user profile"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update name
    if profile_data.firstName and profile_data.lastName:
        user.name = f"{profile_data.firstName} {profile_data.lastName}"
    
    # Update other fields
    if profile_data.email:
        user.email = profile_data.email
    if profile_data.phone:
        user.phone = profile_data.phone
    if profile_data.organization:
        user.organization = profile_data.organization
    if profile_data.role:
        user.role = profile_data.role
    if profile_data.bio:
        user.bio = profile_data.bio
    if profile_data.timezone:
        user.timezone = profile_data.timezone
    if profile_data.language:
        user.language = profile_data.language
    
    db.commit()
    db.refresh(user)
    
    return {"message": "Profile updated successfully", "user": user}


@router.put("/password/{user_id}")
def change_password(
    user_id: str,
    password_data: schemas.PasswordChange,
    db: Session = Depends(get_db)
):
    """Change user password"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password (implement your password verification)
    # if not verify_password(password_data.currentPassword, user.password_hash):
    #     raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Check if passwords match (already validated by schema, but double-check)
    if password_data.newPassword != password_data.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords don't match")
    
    # Update password (implement your password hashing)
    # user.password_hash = hash_password(password_data.newPassword)
    
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.get("/subscription/{user_id}", response_model=schemas.UserSubscriptionDetails)
def get_user_subscription(user_id: str, db: Session = Depends(get_db)):
    """Get user subscription details"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get subscription plan details
    subscription_plan = None
    if user.subscription_plan_id:
        subscription_plan = db.query(models.SubscriptionPlan).filter(
            models.SubscriptionPlan.id == user.subscription_plan_id
        ).first()
    
    # Get latest transaction
    latest_transaction = db.query(models.Transaction).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.status == "captured"
    ).order_by(models.Transaction.date.desc()).first()
    
    return {
        "plan": subscription_plan.name if subscription_plan else "Free",
        "status": user.subscription_status,
        "billingCycle": "annual",
        "nextBilling": user.subscription_end_date.date() if user.subscription_end_date else None,
        "amount": subscription_plan.offer_price if subscription_plan else 0,
        "features": subscription_plan.features if subscription_plan else [],
        "paymentMethod": latest_transaction.payment_gateway_id[-4:] if latest_transaction else "****"
    }

@router.get("/notification-settings/{user_id}")
def get_notification_settings(user_id: str, db: Session = Depends(get_db)):
    """Get user notification settings"""
    subscriber = db.query(models.NotificationSubscriber).filter(
        models.NotificationSubscriber.user_id == user_id
    ).first()
    
    if not subscriber:
        # Return default settings
        return {
            "emailNotifications": True,
            "pushNotifications": True,
            "smsNotifications": False,
            "weeklyReports": True,
            "securityAlerts": True,
            "marketingEmails": False,
            "courseUpdates": True,
            "systemMaintenance": True
        }
    
    # Parse subscribed_tags to get notification settings
    return subscriber.subscribed_tags if isinstance(subscriber.subscribed_tags, dict) else {
        "emailNotifications": True,
        "pushNotifications": True,
        "smsNotifications": False,
        "weeklyReports": True,
        "securityAlerts": True,
        "marketingEmails": False,
        "courseUpdates": True,
        "systemMaintenance": True
    }

@router.put("/notification-settings/{user_id}")
def update_notification_settings(
    user_id: str,
    settings: dict,
    db: Session = Depends(get_db)
):
    """Update user notification settings"""
    subscriber = db.query(models.NotificationSubscriber).filter(
        models.NotificationSubscriber.user_id == user_id
    ).first()
    
    if not subscriber:
        subscriber = models.NotificationSubscriber(
            user_id=user_id,
            subscribed_tags=settings,
            is_active=True
        )
        db.add(subscriber)
    else:
        subscriber.subscribed_tags = settings
    
    db.commit()
    
    return {"message": "Notification settings updated successfully"}

@router.post("/upload-avatar/{user_id}")
async def upload_avatar(
    user_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload user avatar"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Create uploads directory
        upload_dir = "uploads/avatars"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"avatar_{user_id}_{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Update user avatar URL
        file_url = f"/uploads/avatars/{unique_filename}"
        user.avatar_url = file_url
        db.commit()
        
        return {
            "success": True,
            "url": file_url,
            "message": "Avatar uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading avatar: {str(e)}")

@router.delete("/avatar/{user_id}")
def delete_avatar(user_id: str, db: Session = Depends(get_db)):
    """Delete user avatar"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.avatar_url = None
    db.commit()
    
    return {"message": "Avatar deleted successfully"}

@router.post("/export-data/{user_id}")
def export_user_data(user_id: str, db: Session = Depends(get_db)):
    """Export user data"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Collect all user data
    user_data = {
        "profile": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "join_date": str(user.join_date)
        },
        "courses": [
            {"course_id": uc.course_id, "progress": uc.progress}
            for uc in user.user_courses
        ],
        "transactions": [
            {"amount": t.amount, "date": str(t.date), "status": t.status}
            for t in user.transactions
        ]
    }
    
    return {"data": user_data, "message": "Data exported successfully"}

@router.post("/cancel-subscription/{user_id}")
def cancel_subscription(user_id: str, db: Session = Depends(get_db)):
    """Cancel user subscription"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.subscription_status = "cancelled"
    db.commit()
    
    return {"message": "Subscription cancelled successfully"}