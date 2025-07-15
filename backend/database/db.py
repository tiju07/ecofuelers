from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Database URL from .env
DATABASE_URL = "sqlite:///inventory.db"

# SQLAlchemy engine and session factory
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, pool_size=30, max_overflow=50)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        raise
    finally:
        db.close()

# Initialize database (for migrations or setup)
def init_db():
    Base.metadata.create_all(bind=engine)
