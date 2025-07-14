from pydantic import BaseModel, Field, constr
from enum import Enum

# Enum for user roles
class UserRole(str, Enum):
    admin = "admin"
    employee = "employee"

# UserBase schema
class UserBase(BaseModel):
    first_name: str
    last_name: str
    username: str
    role: UserRole

class UserLogin(BaseModel):
    username: str
    password: str
    # role: str

# UserCreate schema (extends UserBase)
class UserCreate(UserBase):
    password: constr(min_length=8) = Field(..., description="Password must be at least 8 characters long")

# UserResponse schema (extends UserBase with additional fields)
class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True

# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str

# Login schema
class Login(BaseModel):
    username: str
    password: str