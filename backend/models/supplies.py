from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime, timedelta

# Supplies model
class Supplies(Base):
    __tablename__ = "supplies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expiration_date = Column(DateTime, nullable=True, default=datetime.utcnow() + timedelta(days=30))

    # Relationship to UsageHistory
    usage_history = relationship("UsageHistory", back_populates="supply", lazy="selectin", cascade="all, delete-orphan")

# UsageHistory model
class UsageHistory(Base):
    __tablename__ = "usage_history"

    id = Column(Integer, primary_key=True, index=True)
    supply_id = Column(Integer, ForeignKey("supplies.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity_used = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship to Supplies
    supply = relationship("Supplies", back_populates="usage_history")