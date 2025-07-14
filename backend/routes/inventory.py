from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..schemas.supply import SupplyCreate, SupplyUpdate, UsageCreate
from ..models.supplies import Supplies, UsageHistory
from ..utils.auth import get_current_user
# , require_admin
from ..services.recommendations import (
    calculate_order_recommendation,
    detect_waste_alerts,
    estimate_cost_savings,
)
import logging
logging.basicConfig()    
logging.getLogger("sqlalchemy.engine").setLevel(logging.DEBUG)

router = APIRouter()

# GET /supplies: List all supplies
@router.get("/supplies", response_model=list[SupplyCreate])
def list_supplies():
    db = next(get_db())
    db = next(get_db())
    supplies = db.query(Supplies).all()
    return supplies

# POST /supplies: Add supply (admin only)
@router.post("/supplies", response_model=SupplyCreate)
def add_supply(supply: SupplyCreate, ):
    db = next(get_db())
    db = next(get_db())
    new_supply = Supplies(**supply.dict())
    db.add(new_supply)
    db.commit()
    db.refresh(new_supply)
    return new_supply

# PUT /supplies/{id}: Update supply (admin only)
@router.put("/supplies/{id}", response_model=SupplyCreate)
# def update_supply(id: int, supply: SupplyUpdate, , 
# db = next(get_db())user=Depends(require_admin)):
def update_supply(id: int, supply: SupplyUpdate, ):
    db = next(get_db())
    db = next(get_db())
    existing_supply = db.query(Supplies).filter(Supplies.id == id).first()
    if not existing_supply:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supply not found")
    for key, value in supply.dict(exclude_unset=True).items():
        setattr(existing_supply, key, value)
    db.commit()
    db.refresh(existing_supply)
    return existing_supply

# POST /usage: Record usage and update quantity
@router.post("/usage", response_model=UsageCreate)
def record_usage(usage: UsageCreate):
    db = next(get_db())
    supply = db.query(Supplies).filter(Supplies.id == usage.supply_id).first()
    if not supply:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supply not found")
    if supply.quantity < usage.quantity_used:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient supply quantity")
    supply.quantity -= usage.quantity_used
    usage_record = UsageHistory(**usage.dict())
    db.add(usage_record)
    db.commit()
    db.refresh(usage_record)
    return usage_record

# GET /usage/history: Get usage history for a supply
@router.get("/usage/history", response_model=list[UsageCreate])
def get_usage_history(supply_id: int):
    db = next(get_db())
    return db.query(UsageHistory).filter(UsageHistory.supply_id == supply_id).all()

# GET /recommendations: Get order recommendations
@router.get("/recommendations", response_model=list[dict])
def get_recommendations():
    db = next(get_db())
    return calculate_order_recommendation(db)

# GET /alerts: Get waste alerts
@router.get("/alerts")
def get_alerts():
    db = next(get_db())
    return detect_waste_alerts(db)

# GET /savings: Get cost savings estimates
@router.get("/savings")
def get_savings():
    db = next(get_db())
    return estimate_cost_savings(db)