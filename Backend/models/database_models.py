# models/database_models.py
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

# Association table for role permissions
role_permissions = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', String, ForeignKey('roles.id')),
    Column('permission_id', String, ForeignKey('permissions.id'))
)

# Association table for user roles
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', String, ForeignKey('users.id')),
    Column('role_id', String, ForeignKey('roles.id')),
    Column('assigned_at', DateTime, default=func.now()),
    Column('assigned_by', String)
)

class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    category = Column(String, nullable=False)

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    level = Column(Integer, nullable=False, default=1)
    is_active = Column(Boolean, default=True)
    is_system = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    permissions = relationship("Permission", secondary=role_permissions, backref="roles")
    users = relationship("User", secondary=user_roles, backref="roles")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    avatar = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

class RoleAssignmentHistory(Base):
    __tablename__ = "role_assignment_history"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role_id = Column(String, ForeignKey("roles.id"), nullable=False)
    action = Column(String, nullable=False)  # assigned, updated, removed
    assigned_by = Column(String, nullable=False)
    timestamp = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User")
    role = relationship("Role")