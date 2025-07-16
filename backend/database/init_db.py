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
            Supplies(
                name="Paper",
                quantity=1000000,
                category="packs",
                unit="sheets",
                expiration_date=datetime.now() + timedelta(days=2),
                primary_supplier="Supplier A",
                cost_per_unit=0.1
            ),
            Supplies(
                name="Coffee Pods",
                quantity=2500,
                category="pods",
                unit="pods",
                expiration_date=datetime.now() + timedelta(days=60),
                primary_supplier="Supplier B",
                cost_per_unit=0.30,
            ),
            Supplies(
                name="Cleaning Spray",
                quantity=140,
                category="bottles",
                unit="bottles",
                expiration_date=datetime.now() + timedelta(days=90),
                primary_supplier="Supplier C",
                cost_per_unit=30,
            ),
        ]
        session.add_all(supplies)

        # Add sample users
        users = [
            Users(
                first_name="Alice",
                last_name="Smith",
                username="alice",
                password_hash=hash_password("securepassword123"),
                role="admin",
            ),
            Users(
                first_name="Bob",
                last_name="Johnson",
                username="bob",
                password_hash=hash_password("securepassword123"),
                role="employee",
            ),
            Users(
                first_name="Charlie",
                last_name="Brown",
                username="charlie",
                password_hash=hash_password("securepassword123"),
                role="employee",
            ),
        ]
        session.add_all(users)

        usage = [
            UsageHistory(supply_id=1, quantity_used=5, timestamp=datetime.now() - timedelta(days=1)),
            UsageHistory(supply_id=2, quantity_used=2, timestamp=datetime.now() - timedelta(days=5)),
            UsageHistory(supply_id=3, quantity_used=1, timestamp=datetime.now() - timedelta(days=10)),
            UsageHistory(supply_id=1, quantity_used=10, timestamp=datetime.now() - timedelta(days=3)),
            UsageHistory(supply_id=1, quantity_used=3, timestamp=datetime.now() - timedelta(days=2)),
            UsageHistory(supply_id=2, quantity_used=1, timestamp=datetime.now() - timedelta(days=4)),
            UsageHistory(supply_id=3, quantity_used=4, timestamp=datetime.now() - timedelta(days=6)),
            UsageHistory(supply_id=1, quantity_used=2, timestamp=datetime.now() - timedelta(days=7)),
            UsageHistory(supply_id=2, quantity_used=5, timestamp=datetime.now() - timedelta(days=8)),
            UsageHistory(supply_id=3, quantity_used=3, timestamp=datetime.now() - timedelta(days=9)),
            UsageHistory(supply_id=1, quantity_used=7, timestamp=datetime.now() - timedelta(days=11)),
            UsageHistory(supply_id=2, quantity_used=6, timestamp=datetime.now() - timedelta(days=12)),
            UsageHistory(supply_id=3, quantity_used=2, timestamp=datetime.now() - timedelta(days=13)),
            UsageHistory(supply_id=1, quantity_used=4, timestamp=datetime.now() - timedelta(days=14)),
            UsageHistory(supply_id=2, quantity_used=3, timestamp=datetime.now() - timedelta(days=15)),
            UsageHistory(supply_id=3, quantity_used=5, timestamp=datetime.now() - timedelta(days=16)),
            UsageHistory(supply_id=1, quantity_used=6, timestamp=datetime.now() - timedelta(days=17)),
            UsageHistory(supply_id=2, quantity_used=2, timestamp=datetime.now() - timedelta(days=18)),
            UsageHistory(supply_id=3, quantity_used=1, timestamp=datetime.now() - timedelta(days=19)),
            UsageHistory(supply_id=1, quantity_used=8, timestamp=datetime.now() - timedelta(days=20)),
            UsageHistory(supply_id=2, quantity_used=4, timestamp=datetime.now() - timedelta(days=21)),
            UsageHistory(supply_id=3, quantity_used=3, timestamp=datetime.now() - timedelta(days=22)),
            UsageHistory(supply_id=1, quantity_used=5, timestamp=datetime.now() - timedelta(days=23)),
            UsageHistory(supply_id=2, quantity_used=7, timestamp=datetime.now() - timedelta(days=24)),
            UsageHistory(supply_id=3, quantity_used=6, timestamp=datetime.now() - timedelta(days=25)),
            UsageHistory(supply_id=1, quantity_used=9, timestamp=datetime.now() - timedelta(days=26)),
            UsageHistory(supply_id=2, quantity_used=8, timestamp=datetime.now() - timedelta(days=27)),
            UsageHistory(supply_id=3, quantity_used=7, timestamp=datetime.now() - timedelta(days=28)),
            UsageHistory(supply_id=1, quantity_used=10, timestamp=datetime.now() - timedelta(days=29)),
            UsageHistory(supply_id=2, quantity_used=9, timestamp=datetime.now() - timedelta(days=30)),
            UsageHistory(supply_id=3, quantity_used=8, timestamp=datetime.now() - timedelta(days=31)),
            UsageHistory(supply_id=1, quantity_used=11, timestamp=datetime.now() - timedelta(days=32)),
            UsageHistory(supply_id=2, quantity_used=12, timestamp=datetime.now() - timedelta(days=33)),
            UsageHistory(supply_id=3, quantity_used=13, timestamp=datetime.now() - timedelta(days=34)),
            UsageHistory(supply_id=1, quantity_used=14, timestamp=datetime.now() - timedelta(days=35)),
            UsageHistory(supply_id=2, quantity_used=15, timestamp=datetime.now() - timedelta(days=36)),
            UsageHistory(supply_id=3, quantity_used=16, timestamp=datetime.now() - timedelta(days=37)),
            UsageHistory(supply_id=1, quantity_used=17, timestamp=datetime.now() - timedelta(days=38)),
            UsageHistory(supply_id=2, quantity_used=18, timestamp=datetime.now() - timedelta(days=39)),
            UsageHistory(supply_id=3, quantity_used=19, timestamp=datetime.now() - timedelta(days=40)),
            UsageHistory(supply_id=1, quantity_used=20, timestamp=datetime.now() - timedelta(days=41)),
            UsageHistory(supply_id=2, quantity_used=21, timestamp=datetime.now() - timedelta(days=42)),
            UsageHistory(supply_id=3, quantity_used=22, timestamp=datetime.now() - timedelta(days=43)),
            UsageHistory(supply_id=1, quantity_used=23, timestamp=datetime.now() - timedelta(days=44)),
            UsageHistory(supply_id=2, quantity_used=24, timestamp=datetime.now() - timedelta(days=45)),
            UsageHistory(supply_id=3, quantity_used=25, timestamp=datetime.now() - timedelta(days=46)),
            UsageHistory(supply_id=1, quantity_used=26, timestamp=datetime.now() - timedelta(days=47)),
            UsageHistory(supply_id=2, quantity_used=27, timestamp=datetime.now() - timedelta(days=48)),
            UsageHistory(supply_id=3, quantity_used=28, timestamp=datetime.now() - timedelta(days=49)),
            UsageHistory(supply_id=1, quantity_used=29, timestamp=datetime.now() - timedelta(days=50)),
            UsageHistory(supply_id=2, quantity_used=30, timestamp=datetime.now() - timedelta(days=51)),
            UsageHistory(supply_id=3, quantity_used=31, timestamp=datetime.now() - timedelta(days=52)),
            UsageHistory(supply_id=1, quantity_used=32, timestamp=datetime.now() - timedelta(days=53)),
            UsageHistory(supply_id=2, quantity_used=33, timestamp=datetime.now() - timedelta(days=54)),
            UsageHistory(supply_id=3, quantity_used=34, timestamp=datetime.now() - timedelta(days=55)),
            UsageHistory(supply_id=1, quantity_used=35, timestamp=datetime.now() - timedelta(days=56)),
            UsageHistory(supply_id=2, quantity_used=36, timestamp=datetime.now() - timedelta(days=57)),
            UsageHistory(supply_id=3, quantity_used=37, timestamp=datetime.now() - timedelta(days=58)),
            UsageHistory(supply_id=1, quantity_used=38, timestamp=datetime.now() - timedelta(days=59)),
            UsageHistory(supply_id=2, quantity_used=39, timestamp=datetime.now() - timedelta(days=60)),
            UsageHistory(supply_id=3, quantity_used=40, timestamp=datetime.now() - timedelta(days=61)),
            UsageHistory(supply_id=1, quantity_used=41, timestamp=datetime.now() - timedelta(days=62)),
            UsageHistory(supply_id=2, quantity_used=42, timestamp=datetime.now() - timedelta(days=63)),
            UsageHistory(supply_id=3, quantity_used=43, timestamp=datetime.now() - timedelta(days=64)),
            UsageHistory(supply_id=1, quantity_used=44, timestamp=datetime.now() - timedelta(days=65)),
            UsageHistory(supply_id=2, quantity_used=45, timestamp=datetime.now() - timedelta(days=66)),
            UsageHistory(supply_id=3, quantity_used=46, timestamp=datetime.now() - timedelta(days=67)),
            UsageHistory(supply_id=1, quantity_used=47, timestamp=datetime.now() - timedelta(days=68)),
            UsageHistory(supply_id=2, quantity_used=48, timestamp=datetime.now() - timedelta(days=69)),
            UsageHistory(supply_id=3, quantity_used=49, timestamp=datetime.now() - timedelta(days=70)),
            UsageHistory(supply_id=1, quantity_used=50, timestamp=datetime.now() - timedelta(days=71)),
            UsageHistory(supply_id=2, quantity_used=51, timestamp=datetime.now() - timedelta(days=72)),
            UsageHistory(supply_id=3, quantity_used=52, timestamp=datetime.now() - timedelta(days=73)),
            UsageHistory(supply_id=1, quantity_used=53, timestamp=datetime.now() - timedelta(days=74)),
            UsageHistory(supply_id=2, quantity_used=54, timestamp=datetime.now() - timedelta(days=75)),
            UsageHistory(supply_id=3, quantity_used=55, timestamp=datetime.now() - timedelta(days=76)),
            UsageHistory(supply_id=1, quantity_used=56, timestamp=datetime.now() - timedelta(days=77)),
            UsageHistory(supply_id=2, quantity_used=57, timestamp=datetime.now() - timedelta(days=78)),
            UsageHistory(supply_id=3, quantity_used=58, timestamp=datetime.now() - timedelta(days=79)),
            UsageHistory(supply_id=1, quantity_used=59, timestamp=datetime.now() - timedelta(days=80)),
            UsageHistory(supply_id=2, quantity_used=60, timestamp=datetime.now() - timedelta(days=81)),
            UsageHistory(supply_id=3, quantity_used=61, timestamp=datetime.now() - timedelta(days=82)),
            UsageHistory(supply_id=1, quantity_used=62, timestamp=datetime.now() - timedelta(days=83)),
            UsageHistory(supply_id=2, quantity_used=63, timestamp=datetime.now() - timedelta(days=84)),
            UsageHistory(supply_id=3, quantity_used=64, timestamp=datetime.now() - timedelta(days=85)),
            UsageHistory(supply_id=1, quantity_used=65, timestamp=datetime.now() - timedelta(days=86)),
            UsageHistory(supply_id=2, quantity_used=66, timestamp=datetime.now() - timedelta(days=87)),
            UsageHistory(supply_id=3, quantity_used=67, timestamp=datetime.now() - timedelta(days=88)),
            UsageHistory(supply_id=1, quantity_used=68, timestamp=datetime.now() - timedelta(days=89)),
            UsageHistory(supply_id=2, quantity_used=69, timestamp=datetime.now() - timedelta(days=90)),
            UsageHistory(supply_id=3, quantity_used=70, timestamp=datetime.now() - timedelta(days=91)),
            UsageHistory(supply_id=1, quantity_used=71, timestamp=datetime.now() - timedelta(days=92)),
            UsageHistory(supply_id=2, quantity_used=72, timestamp=datetime.now() - timedelta(days=93)),
            UsageHistory(supply_id=3, quantity_used=73, timestamp=datetime.now() - timedelta(days=94)),
            UsageHistory(supply_id=1, quantity_used=74, timestamp=datetime.now() - timedelta(days=95)),
            UsageHistory(supply_id=2, quantity_used=75, timestamp=datetime.now() - timedelta(days=96)),
            UsageHistory(supply_id=3, quantity_used=76, timestamp=datetime.now() - timedelta(days=97)),
            UsageHistory(supply_id=1, quantity_used=77, timestamp=datetime.now() - timedelta(days=98)),
            UsageHistory(supply_id=2, quantity_used=78, timestamp=datetime.now() - timedelta(days=99)),
            UsageHistory(supply_id=3, quantity_used=79, timestamp=datetime.now() - timedelta(days=100)),
        ]

        session.add_all(usage)

        # Commit changes
        session.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data.")
