
from collections import defaultdict
from datetime import datetime
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import Response, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import extract, func
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..schemas.supply import SupplyCreate, SupplyUpdate, UsageCreate
from ..models.supplies import Supplies, UsageHistory
from ..routes.auth import require_admin, require_authenticated
from ..services.recommendations import (
    calculate_order_recommendation,
    detect_waste_alerts,
    estimate_cost_savings,
    get_dynamic_cost_per_unit,
)
from ..services.procurement import generate_usage_report_excel, generate_usage_report_pdf

import logging
logging.basicConfig()    
logging.getLogger("sqlalchemy.engine").setLevel(logging.DEBUG)

router = APIRouter()

# GET /supplies: List all supplies
@router.get("/supplies", response_model=list[SupplyCreate])
def list_supplies(
    category: str = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=500),  # Prevent abuse
):
    db = next(get_db())
    query = db.query(Supplies)
    if category:
        query = query.filter(Supplies.category == category)

    supplies = query.offset(skip).limit(limit).all()
    db.close()
    return supplies

# GET /supplies/{id}: Get supply by ID
@router.get("/supplies/{id}", response_model=SupplyCreate)
def get_supply_by_id(id: int):
    db = next(get_db())
    supply = db.query(Supplies).filter(Supplies.id == id).first()
    db.close()
    if not supply:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supply not found")
    return supply


# POST /supplies: Add supply (admin only)
@router.post("/supplies", response_model=SupplyCreate)
def add_supply(supply: SupplyCreate, user: dict = Depends(require_admin)):
    db = next(get_db())
    new_supply = Supplies(**supply.dict())
    db.add(new_supply)
    db.commit()
    db.refresh(new_supply)
    db.close()
    return new_supply

# PUT /supplies/{id}: Update supply (admin only)
@router.put("/supplies/{id}", response_model=SupplyCreate)
def update_supply(id: int, supply: SupplyUpdate, user: dict = Depends(require_admin)):
    db = next(get_db())
    existing_supply = db.query(Supplies).filter(Supplies.id == id).first()
    if not existing_supply:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supply not found")
    for key, value in supply.dict(exclude_unset=True).items():
        setattr(existing_supply, key, value)
    db.commit()
    db.refresh(existing_supply)
    db.close()
    return existing_supply

# POST /usage: Record usage and update quantity
@router.post("/usage", response_model=UsageCreate)
def record_usage(usage: UsageCreate, user: dict = Depends(require_authenticated)):
    try:
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
        db.close()
        return usage_record
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/usage/history")
def get_usage_history_all(db: Session = Depends(get_db)):
    # Query all usage entries
    usage_entries = db.query(UsageHistory).all()

    # Group usage by date
    usage_by_date = defaultdict(int)
    for entry in usage_entries:
        usage_date = entry.timestamp.strftime('%Y-%m-%d')  # format as string
        usage_by_date[usage_date] += entry.quantity_used

    # Sort by date
    sorted_dates = sorted(usage_by_date.keys())
    values = [usage_by_date[dt] for dt in sorted_dates]

    return {
        "dates": sorted_dates,
        "values": values
    }

# GET /usage/history: Get usage history for a supply
@router.get("/usage/history", response_model=list[UsageCreate])
def get_usage_history(supply_id: int):
    db = next(get_db())

    # Check if supply exists
    supply = db.query(Supplies).filter(Supplies.id == supply_id).first()
    if not supply:
        raise HTTPException(status_code=404, detail="Supply not found")

    try:
        usage = db.query(UsageHistory).filter(UsageHistory.supply_id == supply_id).all()

        if not usage:
            return []  # No data, but valid response

        # Optional: validate fields
        valid_usage = [u for u in usage if u.quantity_used is not None and u.timestamp is not None]
        return valid_usage

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")
    finally:
        db.close()


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

@router.get("/savings/history")
def get_savings_history(db: Session = Depends(get_db)) -> Dict:
    savings_by_month = defaultdict(float)

    # Query usage joined with supplies
    usage_data = (
        db.query(
            extract("year", UsageHistory.timestamp).label("year"),
            extract("month", UsageHistory.timestamp).label("month"),
            UsageHistory.supply_id,
            func.sum(UsageHistory.quantity_used).label("total_used")
        )
        .group_by("year", "month", UsageHistory.supply_id)
        .all()
    )

    for record in usage_data:
        year = int(record.year)
        month = int(record.month)
        total_used = record.total_used or 0

        supply = db.query(Supplies).filter(Supplies.id == record.supply_id).first()
        if not supply:
            continue

        optimal_stock = total_used * 1.5
        overstock = supply.quantity - optimal_stock
        cost_per_unit = get_dynamic_cost_per_unit(supply)
        estimated_savings = max(overstock, 0) * cost_per_unit

        month_label = f"{datetime(year, month, 1).strftime('%b %Y')}"
        savings_by_month[month_label] += estimated_savings

    # Sort the result by month
    sorted_months = sorted(savings_by_month.keys(), key=lambda m: datetime.strptime(m, "%b %Y"))
    values = [round(savings_by_month[m], 2) for m in sorted_months]

    return {
        "months": sorted_months,
        "values": values
    }


@router.get("/reports/usage/export")
def export_usage_report(format: str = Query("excel", enum=["excel", "pdf"]), db: Session = Depends(get_db)):
    if format == "excel":
        report = generate_usage_report_excel(db)
        return StreamingResponse(
            report,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=usage_report.xlsx"}
        )
    elif format == "pdf":
        report = generate_usage_report_pdf(db)
        return StreamingResponse(
            report,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=usage_report.pdf"}
        )

@router.get("/reports/usage-trends")
def usage_report(db: Session = Depends(get_db)):
    from ..services.recommendations import generate_usage_report
    return generate_usage_report(db)

