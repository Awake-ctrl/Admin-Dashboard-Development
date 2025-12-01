# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import uuid
import jwt
from jwt import PyJWTError
from passlib.context import CryptContext
import json

from database import get_db
from models import Employee, Role
from schemas import (
    EmployeeLogin, EmployeeSignup, EmployeeResponse, Token,
    PasswordResetRequest, PasswordResetConfirm, EmployeeUpdate,PasswordChange, User 
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Use a more compatible hashing algorithm
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],  # Fallback to pbkdf2 if bcrypt fails
    deprecated="auto"
)

# JWT Config
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ======================
# Utility Functions
# ======================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    try:
        return pwd_context.hash(password)
    except ValueError as e:
        if "longer than 72 bytes" in str(e):
            # Truncate password for bcrypt compatibility
            password_bytes = password.encode('utf-8')
            if len(password_bytes) > 72:
                password_bytes = password_bytes[:72]
            truncated_password = password_bytes.decode('utf-8', errors='ignore')
            return pwd_context.hash(truncated_password)
        raise

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_employee_from_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Dependency to extract employee from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        employee_id: str = payload.get("employee_id")
        if not email or not employee_id:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except PyJWTError:
        raise credentials_exception

    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise credentials_exception
    return employee

# ======================
# Auth Endpoints
# ======================
@router.post("/login", response_model=Token)
async def login(login_data: EmployeeLogin, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.email == login_data.email).first()

    if not employee:
        raise HTTPException(status_code=401, detail="Employee not found")

    if not verify_password(login_data.password, employee.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": employee.email, "employee_id": employee.id},
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": Employee.id,
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }

@router.post("/signup", response_model=EmployeeResponse)
async def signup(signup_data: EmployeeSignup, db: Session = Depends(get_db)):
    # Check if employee already exists
    existing = db.query(Employee).filter(Employee.email == signup_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Assign roles (if none provided, give a default)
    assigned_roles = []
    if signup_data.roles:
        assigned_roles = db.query(Role).filter(Role.name.in_(signup_data.roles)).all()
    else:
        default_role = db.query(Role).filter(Role.name == "Employee").first()
        if not default_role:
            default_role = Role(
                id=str(uuid.uuid4()),
                name="Employee",
                description="Default employee role",
                level=1,
                permissions=json.dumps([]),
                is_system=True,
                is_active=True,
            )
            db.add(default_role)
            db.commit()
            db.refresh(default_role)
        assigned_roles = [default_role]

    try:
        # Create employee
        employee = Employee(
            id=str(uuid.uuid4()),
            first_name=signup_data.first_name,
            last_name=signup_data.last_name,
            email=signup_data.email,
            phone_number=signup_data.phone_number,
            organization=signup_data.organization,
            password_hash=get_password_hash(signup_data.password),
            bio=signup_data.bio,
            timezone=signup_data.timezone or "Asia/Kolkata",
            is_active=True,
            email_verified=False,
            roles=assigned_roles,
        )

        db.add(employee)
        db.commit()
        db.refresh(employee)

        return EmployeeResponse(
            id=employee.id,
            first_name=employee.first_name,
            last_name=employee.last_name,
            email=employee.email,
            phone_number=employee.phone_number,
            organization=employee.organization,
            roles=[r.name for r in assigned_roles],
            bio=employee.bio,
            timezone=employee.timezone,
            is_active=employee.is_active,
            email_verified=employee.email_verified,
            created_at=employee.created_at,
            updated_at=employee.updated_at,
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating account: {str(e)}")


@router.get("/me", response_model=EmployeeResponse)
async def get_me(current_employee: Employee = Depends(get_employee_from_token)):
    """Get current employee"""
    return EmployeeResponse(
        id=current_employee.id,
        first_name=current_employee.first_name,
        last_name=current_employee.last_name,
        email=current_employee.email,
        phone_number=current_employee.phone_number,
        organization=current_employee.organization,
        roles=[r.name for r in current_employee.roles],
        bio=current_employee.bio,
        is_active=current_employee.is_active,
        email_verified=current_employee.email_verified,
        created_at=current_employee.created_at,
        updated_at=current_employee.updated_at,
    )

@router.put("/update", response_model=EmployeeResponse)
async def update_employee(
    update_data: EmployeeUpdate,
    current_employee: Employee = Depends(get_employee_from_token),
    db: Session = Depends(get_db),
):
    """Update current employee details."""
    if update_data.first_name:
        current_employee.first_name = update_data.first_name
    if update_data.last_name:
        current_employee.last_name = update_data.last_name
    if update_data.phone_number:
        current_employee.phone_number = update_data.phone_number
    # if update_data.organization:
    #     current_employee.organization = update_data.organization
    if update_data.bio:
        current_employee.bio = update_data.bio
    if update_data.timezone:
        current_employee.timezone=update_data.timezone
    # Handle role updates
    if update_data.roles is not None:
        roles = db.query(Role).filter(Role.name.in_(update_data.roles)).all()
        current_employee.roles = roles

    current_employee.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_employee)

    return EmployeeResponse(
        id=current_employee.id,
        first_name=current_employee.first_name,
        last_name=current_employee.last_name,
        email=current_employee.email,
        phone_number=current_employee.phone_number,
        organization=current_employee.organization,
        roles=[r.name for r in current_employee.roles],
        bio=current_employee.bio,
        timezone=current_employee.timezone,
        is_active=current_employee.is_active,
        email_verified=current_employee.email_verified,
        
        created_at=current_employee.created_at,
        updated_at=current_employee.updated_at,
    )


# Add this endpoint to auth.py

@router.put("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_employee: Employee = Depends(get_employee_from_token),
    db: Session = Depends(get_db),
):
    """Change employee password"""
    
    # Verify current password
    if not verify_password(password_data.currentPassword, current_employee.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(password_data.newPassword) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Update password
    try:
        current_employee.password_hash = get_password_hash(password_data.newPassword)
        current_employee.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Password updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating password: {str(e)}"
        )