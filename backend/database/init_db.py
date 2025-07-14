from sqlalchemy.orm import Session
from ..database.db import engine, Base
from ..models.supplies import Supplies, UsageHistory
from ..models.users import Users
from dotenv import load_dotenv
from ..utils.auth import hash_password
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Initialize database tables and add sample data
def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create a new database session
    with Session(engine) as session:
        # Add sample supplies
        supplies = [
            Supplies(name="Paper", quantity=100, category="packs", expiration_date=datetime.now() + timedelta(days=2)),
            Supplies(name="Coffee Pods", quantity=50, category="pods", expiration_date=datetime.now() + timedelta(days=60)),
            Supplies(name="Cleaning Spray", quantity=20, category="bottles", expiration_date=datetime.now() + timedelta(days=90)),
        ]
        # session.add_all(supplies)

        # Add sample users
        users = [
            Users(
                first_name="Alice",
                last_name="Smith",
                username="alice",
                password_hash=hash_password("password123"),
                role="admin"
            ),
            Users(
                first_name="Bob",
                last_name="Johnson",
                username="bob",
                password_hash=hash_password("password123"),
                role="employee"
            ),
            Users(
                first_name="Charlie",
                last_name="Brown",
                username="charlie",
                password_hash=hash_password("password123"),
                role="employee"
            ),
        ]
        # session.add_all(users)

        usage = [
            UsageHistory(supply_id=1, quantity_used=5),
            UsageHistory(supply_id=2, quantity_used=2),
            UsageHistory(supply_id=3, quantity_used=1),
            UsageHistory(supply_id=1, quantity_used=10),
        ]

        # session.add_all(usage)

        # Commit changes
        session.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data.")
