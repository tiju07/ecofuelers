from sqlalchemy import Column, Float, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime, timedelta

# Supplies model
class Supplies(Base):
    __tablename__ = "supplies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    quantity = Column(Integer)
    unit = Column(String)
    expiration_date = Column(DateTime)
    primary_supplier = Column(String)
    cost_per_unit = Column(Float, nullable=True)  # ✅ New

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