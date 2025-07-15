from datetime import datetime, timedelta
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Cookie, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.models.users import Users
from ..database.db import get_db

# Secret key and algorithm for JWT
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Create JWT token
def create_jwt_token(user_id: int, role: str):
    expiration = datetime.now() + timedelta(hours=1)
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expiration,
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

# Verify JWT token
def verify_jwt_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        role = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"user_id": user_id, "role": role}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    db = next(get_db())
    db_user = db.query(Users).filter(Users.username == email).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.close()
    return db_user

# Hash password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password
def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

# Dependency to get current user from token
# def get_current_user(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         user_data = verify_jwt_token(token)
#         return user_data
#     except HTTPException:
#         raise credentials_exception
    
# def get_current_user(token: str = Cookie(None)):
#     if not token:
#         raise HTTPException(status_code=401, detail="Not authenticated")
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email = payload.get("sub")
#         user = get_user_by_email(email)
#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")
#         return user
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired")
#     except jwt.JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    authorization: str = request.headers.get("Authorization")
    if not authorization:
        raise credentials_exception
    token = authorization.replace("Bearer ", "", 1).replace("\"", "")
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(username)
    if user is None:
        raise credentials_exception
    return user

