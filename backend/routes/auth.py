from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from ..database.db import get_db
from ..schemas.user import UserCreate, UserLogin, UserResponse
from ..models.users import Users
from ..utils.auth import create_jwt_token, get_current_user
from jose import JWTError, jwt

ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 24 hours

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def require_admin(user: Users = Depends(get_current_user)):
    user_role = user.role.value
    if user_role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def require_authenticated(request: Request, user: dict = Depends(get_current_user)):
    token = request.headers.get("Authorization")
    if token:
        token = token.split(" ")[1]  # Get the token part after "Bearer"
        try:
            payload = jwt.decode(token, "your_secret_key_here", algorithms=["HS256"])
            return payload  # Return the decoded payload if valid
        except JWTError:
            raise HTTPException(status_code=403, detail="Invalid token")
    else:
        raise HTTPException(status_code=403, detail="Authorization header missing")



# POST /login: Authenticate user and return JWT token
@router.post("/login")
def login(user: UserLogin, response: Response = None):
    db = next(get_db())
    db_user = db.query(Users).filter(Users.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "username": db_user.username, "first_name": db_user.first_name, "last_name": db_user.last_name}, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=False,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 3600,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 3600,
        secure=False,  # Set to False for local development
        samesite="lax"
    )
    # logger.info(f"User {user.email} logged in successfully")
    db.close()
    return {"message": "Login successful"}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, "your_secret_key_here", algorithm="HS256")
    return encoded_jwt

# POST /register: Register user (admin only)
@router.post("/register", response_model=UserResponse)
# def register(user: UserCreate, current_user=Depends(require_admin)):
def register(user: UserCreate):
    db = next(get_db())
    db_user = db.query(Users).filter(Users.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    hashed_password = pwd_context.hash(user.password)
    new_user = Users(first_name=user.first_name, last_name=user.last_name, username=user.username, password_hash=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()
    return new_user

# GET /users/me: Return current user details
@router.get("/users/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user

def generate_token_response(token: str):
    response = Response()
    expire_time = datetime.now() + timedelta(hours=1)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 3600,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 3600,
        secure=True,  # Set to False for local development
        samesite="none"
    )
    response.headers["Content-Type"] = "application/json"
    return response

# GET /logout: Clear JWT token cookie
@router.get("/logout")
def logout():
    response = Response()
    response.delete_cookie("token")
    response.status_code = status.HTTP_204_NO_CONTENT
    return response