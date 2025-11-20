# routers/roles.py
import json
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from database import get_db
from models import Role, User, Permission, RoleAssignmentHistory, user_roles
from models import (
    RoleCreate, RoleUpdate, RoleResponse, RoleAssignmentResponse,
    RoleAssignmentCreate, BulkRoleAssignment, RoleAction,DEFAULT_PERMISSIONS
)
# from "../models" import DEFAULT_PERMISSION

router = APIRouter(prefix="/api/roles", tags=["roles"])

# Helper function to parse permissions
def parse_permissions(permissions_data):
    """Parse permissions from string to list"""
    if permissions_data is None:
        return []
    
    if isinstance(permissions_data, list):
        return permissions_data
    
    if isinstance(permissions_data, str):
        try:
            # Try to parse as JSON
            return json.loads(permissions_data)
        except json.JSONDecodeError:
            # If it's a string representation of a list, try eval (be careful with this)
            try:
                # Only use eval if the string looks like a Python list
                if permissions_data.startswith('[') and permissions_data.endswith(']'):
                    return eval(permissions_data)
                else:
                    return [permissions_data]
            except:
                return [permissions_data]
    
    return []

# Role Management Endpoints
@router.get("/", response_model=List[RoleResponse])
async def get_roles(
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    is_system: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all roles with optional filtering"""
    query = db.query(Role)
    
    if is_active is not None:
        query = query.filter(Role.is_active == is_active)
    if is_system is not None:
        query = query.filter(Role.is_system == is_system)
    
    roles = query.offset(skip).limit(limit).all()
    
    # Convert to response model with user count
    role_responses = []
    for role in roles:
        user_count = db.query(user_roles).filter(user_roles.c.role_id == role.id).count()
        
        # Parse permissions properly
        permissions_list = parse_permissions(role.permissions)
        
        role_data = {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "level": role.level,
            "permissions": permissions_list,
            "user_count": user_count,
            "is_active": role.is_active,
            "is_system": role.is_system,
            "created_at": role.created_at,
            "updated_at": role.updated_at
        }
        role_responses.append(RoleResponse(**role_data))
    
    return role_responses

@router.get("/{role_id}", response_model=RoleResponse)
async def get_role(role_id: str, db: Session = Depends(get_db)):
    """Get a specific role by ID"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    user_count = db.query(user_roles).filter(user_roles.c.role_id == role_id).count()
    
    # Parse permissions properly
    permissions_list = parse_permissions(role.permissions)
    
    role_data = {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "level": role.level,
        "permissions": permissions_list,
        "user_count": user_count,
        "is_active": role.is_active,
        "is_system": role.is_system,
        "created_at": role.created_at,
        "updated_at": role.updated_at
    }
    
    return RoleResponse(**role_data)

@router.post("/", response_model=RoleResponse)
async def create_role(role_data: RoleCreate, db: Session = Depends(get_db)):
    """Create a new role"""
    # Check if role name already exists
    existing_role = db.query(Role).filter(Role.name == role_data.name).first()
    if existing_role:
        raise HTTPException(status_code=400, detail="Role name already exists")
    
    # Create new role
    role_id = str(uuid.uuid4())
    
    # Convert permissions to JSON string for storage
    permissions_json = json.dumps(role_data.permissions)
    
    role = Role(
        id=role_id,
        name=role_data.name,
        description=role_data.description,
        level=role_data.level,
        permissions=permissions_json,  # Store as JSON string
        is_system=False,
        is_active=True
    )
    
    db.add(role)
    db.commit()
    db.refresh(role)
    
    # Return response with parsed permissions
    role_response_data = {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "level": role.level,
        "permissions": role_data.permissions,  # Use original list
        "user_count": 0,
        "is_active": role.is_active,
        "is_system": role.is_system,
        "created_at": role.created_at,
        "updated_at": role.updated_at
    }
    
    return RoleResponse(**role_response_data)

@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(role_id: str, role_data: RoleUpdate, db: Session = Depends(get_db)):
    """Update an existing role"""
    # print("i am in the put function")
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role.is_system:
        raise HTTPException(status_code=400, detail="Cannot modify system roles")
    
    # Update fields
    update_data = role_data.dict(exclude_unset=True)
    # print(update_data,role_data)
    # print(role_id)
    for field, value in update_data.items():
        if field == 'permissions' and value is not None:
            # Convert permissions to JSON string for storage
            setattr(role, field, json.dumps(value))
        else:
            setattr(role, field, value)
    
    role.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(role)
    
    user_count = db.query(user_roles).filter(user_roles.c.role_id == role_id).count()
    
    # Parse permissions for response
    permissions_list = parse_permissions(role.permissions)
    
    role_response_data = {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "level": role.level,
        "permissions": permissions_list,
        "user_count": user_count,
        "is_active": role.is_active,
        "is_system": role.is_system,
        "created_at": role.created_at,
        "updated_at": role.updated_at
    }
    
    return RoleResponse(**role_response_data)

@router.delete("/{role_id}")
async def delete_role(role_id: str, db: Session = Depends(get_db)):
    """Delete a role"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role.is_system:
        raise HTTPException(status_code=400, detail="Cannot delete system roles")
    
    # Check if role has users assigned
    user_count = db.query(user_roles).filter(user_roles.c.role_id == role_id).count()
    if user_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete role with {user_count} users assigned"
        )
    
    db.delete(role)
    db.commit()
    
    return {"message": "Role deleted successfully"}

# Role Assignment Endpoints
@router.post("/assign")
async def assign_role(assignment: RoleAssignmentCreate, db: Session = Depends(get_db)):
    """Assign a role to a user"""
    # Check if user exists
    user = db.query(User).filter(User.id == assignment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if role exists
    role = db.query(Role).filter(Role.id == assignment.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Check if user already has this role
    existing_assignment = db.execute(
        user_roles.select().where(
            user_roles.c.user_id == assignment.user_id,
            user_roles.c.role_id == assignment.role_id
        )
    ).first()
    
    if existing_assignment:
        raise HTTPException(status_code=400, detail="User already has this role")
    
    # Assign role
    stmt = user_roles.insert().values(
        user_id=assignment.user_id,
        role_id=assignment.role_id,
        assigned_by=assignment.assigned_by
    )
    db.execute(stmt)
    
    # Log assignment history
    history_id = str(uuid.uuid4())
    history = RoleAssignmentHistory(
        id=history_id,
        user_id=assignment.user_id,
        role_id=assignment.role_id,
        action=RoleAction.ASSIGNED,
        assigned_by=assignment.assigned_by
    )
    db.add(history)
    
    db.commit()
    
    return {"message": "Role assigned successfully"}

@router.post("/bulk-assign")
async def bulk_assign_role(bulk_assignment: BulkRoleAssignment, db: Session = Depends(get_db)):
    """Assign a role to multiple users"""
    # Check if role exists
    role = db.query(Role).filter(Role.id == bulk_assignment.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    success_count = 0
    errors = []
    
    for user_id in bulk_assignment.user_ids:
        try:
            # Check if user exists
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                errors.append(f"User {user_id} not found")
                continue
            
            # Check if user already has this role
            existing_assignment = db.execute(
                user_roles.select().where(
                    user_roles.c.user_id == user_id,
                    user_roles.c.role_id == bulk_assignment.role_id
                )
            ).first()
            
            if existing_assignment:
                errors.append(f"User {user_id} already has this role")
                continue
            
            # Assign role
            stmt = user_roles.insert().values(
                user_id=user_id,
                role_id=bulk_assignment.role_id,
                assigned_by=bulk_assignment.assigned_by
            )
            db.execute(stmt)
            
            # Log assignment history
            history_id = str(uuid.uuid4())
            history = RoleAssignmentHistory(
                id=history_id,
                user_id=user_id,
                role_id=bulk_assignment.role_id,
                action=RoleAction.ASSIGNED,
                assigned_by=bulk_assignment.assigned_by
            )
            db.add(history)
            
            success_count += 1
            
        except Exception as e:
            errors.append(f"Error assigning role to user {user_id}: {str(e)}")
    
    db.commit()
    
    return {
        "message": f"Role assigned to {success_count} users",
        "success_count": success_count,
        "errors": errors
    }

@router.post("/remove")
async def remove_role(assignment: RoleAssignmentCreate, db: Session = Depends(get_db)):
    """Remove a role from a user"""
    # Check if assignment exists
    existing_assignment = db.execute(
        user_roles.select().where(
            user_roles.c.user_id == assignment.user_id,
            user_roles.c.role_id == assignment.role_id
        )
    ).first()
    
    if not existing_assignment:
        raise HTTPException(status_code=404, detail="Role assignment not found")
    
    # Remove role assignment
    stmt = user_roles.delete().where(
        user_roles.c.user_id == assignment.user_id,
        user_roles.c.role_id == assignment.role_id
    )
    db.execute(stmt)
    
    # Log removal history
    history_id = str(uuid.uuid4())
    history = RoleAssignmentHistory(
        id=history_id,
        user_id=assignment.user_id,
        role_id=assignment.role_id,
        action=RoleAction.REMOVED,
        assigned_by=assignment.assigned_by
    )
    db.add(history)
    
    db.commit()
    
    return {"message": "Role removed successfully"}

@router.get("/assignments/history", response_model=List[RoleAssignmentResponse])
async def get_role_assignments(
    skip: int = 0,
    limit: int = 50,
    user_id: Optional[str] = None,
    role_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get role assignment history"""
    query = db.query(RoleAssignmentHistory)
    
    if user_id:
        query = query.filter(RoleAssignmentHistory.user_id == user_id)
    if role_id:
        query = query.filter(RoleAssignmentHistory.role_id == role_id)
    
    assignments = query.order_by(RoleAssignmentHistory.timestamp.desc()).offset(skip).limit(limit).all()
    
    assignment_responses = []
    for assignment in assignments:
        assignment_responses.append(RoleAssignmentResponse(
            id=assignment.id,
            user={
                "id": assignment.user.id,
                "name": assignment.user.name,
                "email": assignment.user.email,
                # "avatar": assignment.user.avatar
            },
            role=assignment.role.name,
            action=assignment.action,
            date=assignment.timestamp,
            assigned_by=assignment.assigned_by
        ))
    
    return assignment_responses

@router.get("/users/{user_id}/roles")
async def get_user_roles(user_id: str, db: Session = Depends(get_db)):
    """Get all roles assigned to a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get roles through the association table
    roles = db.query(Role).join(user_roles).filter(user_roles.c.user_id == user_id).all()
    return roles

@router.get("/permissions/categories")
async def get_permission_categories():
    """Get all permission categories"""
    return {
        "user_management": "User Management",
        "content_management": "Content Management", 
        "course_management": "Course Management",
        "analytics": "Analytics",
        "system": "System"
    }

@router.get("/permissions/list")
async def get_all_permissions(db: Session = Depends(get_db)):
    """Get all available permissions"""
    permissions = db.query(Permission).all()
    return permissions

# Initialize data function (call this from main.py)
def initialize_roles_data(db: Session):
    """Initialize default permissions and system roles"""
    pass
    # try:
    #     # Create default permissions
    #     for perm_data in DEFAULT_PERMISSIONS:
    #         perm = db.query(Permission).filter(Permission.id == perm_data["id"]).first()
    #         if not perm:
    #             perm = Permission(**perm_data)
    #             db.add(perm)
        
    #     # # Create system roles
    #     # for role_data in SYSTEM_ROLES:
    #     #     role = db.query(Role).filter(Role.id == role_data["id"]).first()
    #     #     if not role:
    #     #         role = Role(**role_data)
    #     #         db.add(role)
        
    #     db.commit()
    #     print("Roles and permissions initialized successfully")
    # except Exception as e:
    #     db.rollback()
    #     print(f"Error initializing roles and permissions: {e}")