from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from ..database.db import get_db
from ..models.supplies import Supplies, UsageHistory
from math import ceil

# Calculate order recommendation
def calculate_order_recommendation(db: Session):
    supply_ids = db.query(Supplies.id).all()
    recommendations = []

    for supply_id_tuple in supply_ids:
        supply_id = supply_id_tuple[0]
        supply = db.query(Supplies).filter(Supplies.id == supply_id).first()
        if not supply:
            recommendations.append({"supply_id": supply_id, "error": "Supply not found"})
            continue

        # Calculate average weekly usage from UsageHistory
        one_month_ago = datetime.utcnow() - timedelta(days=30)
        usage_data = (
            db.query(func.sum(UsageHistory.quantity_used).label("total_usage"))
            .filter(UsageHistory.supply_id == supply_id, UsageHistory.timestamp >= one_month_ago)
            .first()
        )
        total_usage = usage_data.total_usage or 0
        avg_weekly_usage = total_usage / 4  # Approximate 4 weeks in a month

        # Suggest order quantity to maintain 2 weeks of stock
        desired_stock = 2 * avg_weekly_usage  # Desired stock for 2 weeks
        recommended_quantity = max(0, ceil(abs(desired_stock - supply.quantity)))

        # Prioritize eco-friendly suppliers (mocked for now)
        eco_friendly_supplier = "EcoSupplier Inc."

        recommendations.append({
            "supply_id": supply_id,
            "current_stock": supply.quantity,
            "average_weekly_usage": avg_weekly_usage,
            "recommended_order_quantity": recommended_quantity,
            "supplier": eco_friendly_supplier,
        })

    return recommendations

# Detect waste alerts
def detect_waste_alerts(db: Session):
    alerts = []
    threshold = 100  # Overstock threshold
    nearing_expiration_days = 7

    supplies = db.query(Supplies).all()
    for supply in supplies:
        if supply.quantity > threshold:
            alerts.append({
                "supply_id": supply.id,
                "name": supply.name,
                "alert": "Overstocking",
                "quantity": supply.quantity,
            })
        if supply.expiration_date and supply.expiration_date <= datetime.utcnow() + timedelta(days=nearing_expiration_days):
            alerts.append({
                "supply_id": supply.id,
                "name": supply.name,
                "alert": "Nearing expiration",
                "expiration_date": supply.expiration_date,
            })

    return alerts

# Estimate cost savings
def estimate_cost_savings(db: Session):
    savings = []
    supplies = db.query(Supplies).all()

    for supply in supplies:
        # Calculate historical over-ordering (mocked logic)
        one_month_ago = datetime.utcnow() - timedelta(days=30)
        usage_data = (
            db.query(func.sum(UsageHistory.quantity_used).label("total_usage"))
            .filter(UsageHistory.supply_id == supply.id, UsageHistory.timestamp >= one_month_ago)
            .first()
        )
        total_usage = usage_data.total_usage or 0
        optimal_stock = total_usage * 1.5  # Maintain 1.5x monthly usage as optimal stock
        overstock = max(0, supply.quantity - optimal_stock)

        # Calculate cost savings (mocked cost per unit)
        cost_per_unit = 10  # Example cost per unit
        savings_amount = overstock * cost_per_unit

        if savings_amount > 0:
            savings.append({
                "supply_id": supply.id,
                "name": supply.name,
                "overstock_quantity": overstock,
                "estimated_savings": savings_amount,
            })

    return savings