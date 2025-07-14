from uuid import uuid4
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# SupplyBase schema
class SupplyBase(BaseModel):
    id: Optional[int] = None
    name: str
    category: str
    quantity: int = Field(..., ge=0, description="Quantity must be non-negative")
    expiration_date: Optional[datetime] = None
    last_updated: datetime = None

# SupplyCreate schema (extends SupplyBase)
class SupplyCreate(SupplyBase):
    pass

# SupplyUpdate schema (extends SupplyBase, all fields optional)
class SupplyUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=0, description="Quantity must be non-negative")
    expiration_date: Optional[datetime] = None

# SupplyResponse schema (extends SupplyBase with additional fields)
class SupplyResponse(SupplyBase):
    id: int
    last_updated: datetime

    class Config:
        orm_mode = True

# UsageCreate schema
class UsageCreate(BaseModel):
    supply_id: int = uuid4()
    quantity_used: int = Field(..., ge=1, description="Quantity used must be at least 1")

# UsageResponse schema (extends UsageCreate with additional fields)
class UsageResponse(UsageCreate):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

# RecommendationResponse schema
class RecommendationResponse(BaseModel):
    supply_id: int
    name: str
    suggested_quantity: int
    supplier: str

# AlertResponse schema
class AlertResponse(BaseModel):
    supply_id: int
    name: str
    issue: str
    urgency: str

# SavingsResponse schema
class SavingsResponse(BaseModel):
    supply_id: int
    name: str
    estimated_savings: float