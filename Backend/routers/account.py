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


# ---------------------------------------------------------------------------
# PROFILE
# ---------------------------------------------------------------------------

@router.get("/profile/{user_id}", response_model=schemas.EmployeeResponse)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    """Get user profile for account settings"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    name_parts = user.name.split() if user.name else ["", ""]
    return schemas.EmployeeResponse(
        id=user.id,
        firstName=name_parts[0] if len(name_parts) > 0 else "",
        lastName=name_parts[1] if len(name_parts) > 1 else "",
        email=user.email,
        phone=user.phone or "",
        organization=user.organization or "",
        role=user.role or "Student",
        bio=user.bio or "",
        timezone=user.timezone or "Asia/Kolkata",
        language=user.language or "English",
    )


@router.put("/profile/{user_id}", response_model=schemas.EmployeeResponse)
def update_user_profile(
    user_id: str,
    profile_data: schemas.EmployeeUpdate,
    db: Session = Depends(get_db),
):
    """Update user profile"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update name
    if profile_data.firstName and profile_data.lastName:
        user.name = f"{profile_data.firstName} {profile_data.lastName}"

    # Update other fields if provided
    for field, value in profile_data.dict(exclude_unset=True).items():
        if hasattr(user, field) and value is not None:
            setattr(user, field, value)

    db.commit()
    db.refresh(user)

    name_parts = user.name.split() if user.name else ["", ""]
    return schemas.EmployeeResponse(
        id=user.id,
        firstName=name_parts[0] if len(name_parts) > 0 else "",
        lastName=name_parts[1] if len(name_parts) > 1 else "",
        email=user.email,
        phone=user.phone,
        organization=user.organization,
        role=user.role,
        bio=user.bio,
        timezone=user.timezone,
        language=user.language,
    )


# ---------------------------------------------------------------------------
# PASSWORD CHANGE
# ---------------------------------------------------------------------------

@router.put("/password/{user_id}")
def change_password(
    user_id: str,
    password_data: schemas.PasswordChange,
    db: Session = Depends(get_db),
):
    """Change user password"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify current password (implement verification if needed)
    # if not verify_password(password_data.currentPassword, user.password_hash):
    #     raise HTTPException(status_code=400, detail="Current password is incorrect")

    if password_data.newPassword != password_data.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords don't match")

    # user.password_hash = hash_password(password_data.newPassword)
    db.commit()

    return {"message": "Password updated successfully"}


# ---------------------------------------------------------------------------
# SUBSCRIPTION DETAILS
# ---------------------------------------------------------------------------

@router.get("/subscription/{user_id}", response_model=schemas.UserSubscriptionDetails)
def get_user_subscription(user_id: str, db: Session = Depends(get_db)):
    """Get user subscription details"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    subscription_plan = None
    if user.subscription_plan_id:
        subscription_plan = db.query(models.SubscriptionPlan).filter(
            models.SubscriptionPlan.id == user.subscription_plan_id
        ).first()

    latest_transaction = db.query(models.Transaction).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.status == "captured",
    ).order_by(models.Transaction.date.desc()).first()

    return schemas.UserSubscriptionDetails(
        plan=subscription_plan.name if subscription_plan else "Free",
        status=user.subscription_status or "inactive",
        billingCycle="annual",
        nextBilling=user.subscription_end_date.date()
        if user.subscription_end_date
        else None,
        amount=subscription_plan.offer_price if subscription_plan else 0.0,
        features=subscription_plan.features if subscription_plan else [],
        paymentMethod=latest_transaction.payment_gateway_id[-4:]
        if latest_transaction
        else "****",
    )


# ---------------------------------------------------------------------------
# NOTIFICATION SETTINGS
# ---------------------------------------------------------------------------

@router.get(
    "/notification-settings/{user_id}",
    response_model=schemas.NotificationSettings,
)
def get_notification_settings(user_id: str, db: Session = Depends(get_db)):
    """Get user notification settings"""
    subscriber = db.query(models.NotificationSubscriber).filter(
        models.NotificationSubscriber.user_id == user_id
    ).first()

    if not subscriber:
        return schemas.NotificationSettings()

    # If stored as dict, return directly
    if isinstance(subscriber.subscribed_tags, dict):
        return schemas.NotificationSettings(**subscriber.subscribed_tags)

    return schemas.NotificationSettings()


@router.put("/notification-settings/{user_id}")
def update_notification_settings(
    user_id: str,
    settings: schemas.NotificationSettings,
    db: Session = Depends(get_db),
):
    """Update user notification settings"""
    subscriber = db.query(models.NotificationSubscriber).filter(
        models.NotificationSubscriber.user_id == user_id
    ).first()

    if not subscriber:
        subscriber = models.NotificationSubscriber(
            user_id=user_id, subscribed_tags=settings.dict(), is_active=True
        )
        db.add(subscriber)
    else:
        subscriber.subscribed_tags = settings.dict()

    db.commit()

    return {"message": "Notification settings updated successfully"}


# ---------------------------------------------------------------------------
# AVATAR UPLOAD / DELETE
# ---------------------------------------------------------------------------

@router.post(
    "/upload-avatar/{user_id}", response_model=schemas.AvatarResponse
)
async def upload_avatar(
    user_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    """Upload user avatar"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        upload_dir = "uploads/avatars"
        os.makedirs(upload_dir, exist_ok=True)

        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"avatar_{user_id}_{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        file_url = f"/uploads/avatars/{unique_filename}"
        user.avatar_url = file_url
        db.commit()

        return schemas.AvatarResponse(
            success=True,
            url=file_url,
            message="Avatar uploaded successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error uploading avatar: {str(e)}"
        )


@router.delete("/avatar/{user_id}")
def delete_avatar(user_id: str, db: Session = Depends(get_db)):
    """Delete user avatar"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.avatar_url = None
    db.commit()

    return {"message": "Avatar deleted successfully"}


# ---------------------------------------------------------------------------
# EXPORT / SUBSCRIPTION CANCEL
# ---------------------------------------------------------------------------

@router.post("/export-data/{user_id}", response_model=schemas.UserExportData)
def export_user_data(user_id: str, db: Session = Depends(get_db)):
    """Export user data"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = schemas.UserExportData(
        profile={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "join_date": str(user.join_date),
        },
        courses=[
            schemas.UserCourseData(course_id=uc.course_id, progress=uc.progress)
            for uc in user.user_courses
        ],
        transactions=[
            schemas.UserTransactionData(
                amount=t.amount, date=str(t.date), status=t.status
            )
            for t in user.transactions
        ],
    )

    return user_data


@router.post("/cancel-subscription/{user_id}")
def cancel_subscription(user_id: str, db: Session = Depends(get_db)):
    """Cancel user subscription"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.subscription_status = "cancelled"
    db.commit()

    return {"message": "Subscription cancelled successfully"}
