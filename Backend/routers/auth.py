# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import uuid
import jwt
from jwt import PyJWTError  # ✅ Correct exception import
from passlib.context import CryptContext
import json

from database import get_db
from models import User, Role
from schemas import (
    UserLogin, UserSignup, UserResponse, Token,
    PasswordResetRequest, PasswordResetConfirm
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ⚙️ JWT Config
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ======================
# 🔐 Utility Functions
# ======================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_user_from_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Dependency to extract user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if not email or not user_id:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise credentials_exception
    return user


# ======================
# 🧠 Auth Endpoints
# ======================
@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.post("/signup", response_model=UserResponse)
async def signup(signup_data: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == signup_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    default_role = db.query(Role).filter(Role.name == "User").first()
    if not default_role:
        default_role = Role(
            id=str(uuid.uuid4()),
            name="User",
            description="Default user role",
            level=1,
            permissions=json.dumps([]),
            is_system=True,
            is_active=True,
        )
        db.add(default_role)
        db.commit()
        db.refresh(default_role)

    user = User(
        id=str(uuid.uuid4()),
        name=f"{signup_data.first_name} {signup_data.last_name}",
        email=signup_data.email,
        phone=signup_data.phone,
        organization=signup_data.organization,
        role_id=default_role.id,
        password_hash=get_password_hash(signup_data.password),
        is_active=True,
        email_verified=False,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        organization=user.organization,
        role=default_role.name,
        is_active=user.is_active,
        email_verified=user.email_verified,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


@router.post("/forgot-password")
async def forgot_password(reset_request: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == reset_request.email).first()
    # Always return success to avoid user enumeration
    if user:
        print(f"Password reset requested for: {user.email}")
    return {"message": "If the email exists, a reset link has been sent", "success": True}


@router.post("/reset-password")
async def reset_password(reset_data: PasswordResetConfirm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == reset_data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    user.password_hash = get_password_hash(reset_data.new_password)
    user.updated_at = datetime.utcnow()
    db.commit()

    return {"message": "Password reset successfully", "success": True}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_user_from_token)):
    """Get current user"""
    role_name = current_user.role.name if current_user.role else None
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        organization=current_user.organization,
        role=role_name,
        is_active=current_user.is_active,
        email_verified=current_user.email_verified,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )


@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}


# ======================
# 🧱 Default Admin Setup
# ======================
def create_default_admin(db: Session):
    """Create default admin if not exists"""
    try:
        admin = db.query(User).filter(User.email == "admin@eduplatform.com").first()
        if admin:
            return

        admin_role = db.query(Role).filter(Role.name == "Administrator").first()
        if not admin_role:
            admin_role = Role(
                id=str(uuid.uuid4()),
                name="Administrator",
                description="Full system access",
                level=10,
                permissions=json.dumps(["*"]),
                is_system=True,
                is_active=True,
            )
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)

        new_admin = User(
            id=str(uuid.uuid4()),
            name="System Administrator",
            email="admin@eduplatform.com",
            role_id=admin_role.id,
            password_hash=get_password_hash("admin123"),
            is_active=True,
            email_verified=True,
        )
        db.add(new_admin)
        db.commit()
        print("✅ Default admin created: admin@eduplatform.com / admin123")
    except Exception as e:
        db.rollback()
        print(f"❌ Failed to create default admin: {e}")
