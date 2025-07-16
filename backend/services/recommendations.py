import random
from statistics import mean, median, stdev
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from ..database.db import get_db
from ..models.supplies import Supplies, UsageHistory
from math import ceil
from ..services.procurement import check_supplier_stock, get_alternative_products, handle_alternative_suppliers
from backend.database.db import get_db


# Calculate order recommendation
def calculate_order_recommendation(db: Session):
    alert_map = get_conflicting_alerts_map(db)  # ✅ Inject alert info

    supply_ids = db.query(Supplies.id).all()
    recommendations = []
    now = datetime.utcnow()

    for supply_id_tuple in supply_ids:
        supply_id = supply_id_tuple[0]
        supply = db.query(Supplies).filter(Supplies.id == supply_id).first()
        if not supply:
            continue

        # Get usage in last 30 days
        one_month_ago = now - timedelta(days=30)
        usage_entries = (
            db.query(UsageHistory)
            .filter(UsageHistory.supply_id == supply_id, UsageHistory.timestamp >= one_month_ago)
            .all()
        )

        # Calculate usage count
        usage_count = (
            db.query(func.count(UsageHistory.id))
            .filter(UsageHistory.supply_id == supply_id, UsageHistory.timestamp >= one_month_ago)
            .scalar()
        )

        if usage_count < 3:
            recommendations.append({
                "supply_id": supply_id,
                "name": supply.name,
                "message": "Insufficient usage data to generate order recommendation",
                "current_stock": supply.quantity
            })
            continue


        if not usage_entries:
            continue

        # Group by week
        weekly_usage = [0, 0, 0, 0]
        for entry in usage_entries:
            week_index = min(3, (now - entry.timestamp).days // 7)
            weekly_usage[week_index] += entry.quantity_used

        # Detect and exclude spikes (e.g., more than 3x median)
        base_median = median([u for u in weekly_usage if u > 0]) or 0
        filtered_usage = [u for u in weekly_usage if u <= base_median * 3]

        if not filtered_usage:
            avg_weekly_usage = 0
        else:
            avg_weekly_usage = sum(filtered_usage) / len(filtered_usage)

        desired_stock = 2 * avg_weekly_usage
        if(desired_stock > supply.quantity):
            recommended_quantity = desired_stock
        else:
            # If current stock is sufficient, recommend to order at least 1.5x the average weekly usage
            recommended_quantity = desired_stock

        stock_available = check_supplier_stock(supply)
        conflict_alerts = alert_map.get(supply.id, [])

        if not stock_available:
            alt_suppliers = handle_alternative_suppliers(supply_id, db)
            alt_products = get_alternative_products(supply, db)

            recommendations.append({
                "supply_id": supply.id,
                "name": supply.name,
                "current_stock": supply.quantity,
                "recommended_order_quantity": recommended_quantity,
                "supplier": supply.primary_supplier,
                "status": "Primary supplier out of stock",
                "conflicts": conflict_alerts,
                "alternative_suppliers": alt_suppliers["alternative_suppliers"],
                "alternative_products": alt_products,
                "avg_weekly_usage": avg_weekly_usage
            })
        else:
            recommendations.append({
                "supply_id": supply.id,
                "name": supply.name,
                "current_stock": supply.quantity,
                "recommended_order_quantity": recommended_quantity,
                "supplier": supply.primary_supplier,
                "status": "Primary supplier available",
                "conflicts": conflict_alerts,
                "avg_weekly_usage": avg_weekly_usage
            })
    db.close()
    return recommendations



# Detect waste alerts
def detect_waste_alerts(db: Session):
    alerts = []
    threshold = 100  # Overstock threshold
    nearing_expiration_days = 7
    now = datetime.utcnow()
    one_week_ago = now - timedelta(days=7)

    supplies = db.query(Supplies).all()

    for supply in supplies:
        # ✅ Check for overstock
        if supply.quantity > threshold:
            alerts.append({
                "supply_id": supply.id,
                "name": supply.name,
                "alert": "Overstocking",
                "quantity": supply.quantity,
            })
        # ✅ Check for low stock
        elif supply.quantity < threshold:
            alerts.append({
                "supply_id": supply.id,
                "name": supply.name,
                "alert": "Low stock",
                "quantity": supply.quantity,
            })

        # ✅ Check for expiration, but filter based on usage rate
        if supply.expiration_date and supply.expiration_date <= now + timedelta(days=nearing_expiration_days):
            # Check recent usage
            recent_usage = (
                db.query(func.sum(UsageHistory.quantity_used))
                .filter(
                    UsageHistory.supply_id == supply.id,
                    UsageHistory.timestamp >= one_week_ago
                )
                .scalar() or 0
            )

            if recent_usage < (0.3 * supply.quantity):  # If usage is less than 30% of stock
                alerts.append({
                    "supply_id": supply.id,
                    "name": supply.name,
                    "alert": "Nearing expiration with slow usage",
                    "quantity": supply.quantity,
                    "expiration_date": supply.expiration_date,
                    "recent_weekly_usage": recent_usage,
                })
            # else: No alert, since it’s being consumed fast
    db.close()
    return alerts


# Estimate cost savings
def estimate_cost_savings(db: Session):
    savings = []
    supplies = db.query(Supplies).all()

    for supply in supplies:
        one_month_ago = datetime.utcnow() - timedelta(days=30)
        usage_data = (
            db.query(func.sum(UsageHistory.quantity_used).label("total_usage"))
            .filter(UsageHistory.supply_id == supply.id, UsageHistory.timestamp >= one_month_ago)
            .first()
        )

        total_usage = usage_data.total_usage or 0
        optimal_stock = total_usage * 1.5
        overstock = supply.quantity - optimal_stock

        # ✅ Use dynamic cost per unit
        actual_cost = get_dynamic_cost_per_unit(supply)
        estimated_savings = overstock * actual_cost

        # ✅ Handle unstable or zero/negative savings
        if estimated_savings <= 0:
            savings.append({
                "supply_id": supply.id,
                "name": supply.name,
                "message": "No significant cost savings due to fluctuating prices",
                "current_cost_per_unit": actual_cost,
                "overstock_quantity": max(overstock, 0),
                "estimated_savings": 0
            })
        else:
            savings.append({
                "supply_id": supply.id,
                "name": supply.name,
                "current_cost_per_unit": actual_cost,
                "overstock_quantity": overstock,
                "estimated_savings": round(estimated_savings, 2)
            })
    db.close()
    return savings

def get_conflicting_alerts_map(db: Session):
    """
    Returns a dict {supply_id: [alerts]} for items that are flagged.
    """
    alert_data = detect_waste_alerts(db)
    alert_map = {}
    for alert in alert_data:
        sid = alert["supply_id"]
        if sid not in alert_map:
            alert_map[sid] = []
        alert_map[sid].append(alert["alert"])
    return alert_map

def get_dynamic_cost_per_unit(supply: Supplies) -> float:
    """
    Simulate fluctuating costs (for demo).
    Real-world use: fetch from historical price table or external API.
    """
    db = next(get_db())
    supply_from_db = db.query(Supplies).filter(Supplies.id == supply.id).first()
    db.close()
    return supply_from_db.cost_per_unit if supply_from_db else 10

def generate_usage_report(db: Session):
    report = []
    supplies = db.query(Supplies).all()

    for supply in supplies:
        usage_entries = (
            db.query(UsageHistory)
            .filter(UsageHistory.supply_id == supply.id)
            .order_by(UsageHistory.timestamp.asc())
            .all()
        )

        if not usage_entries:
            report.append({
                "supply_id": supply.id,
                "name": supply.name,
                "message": "No usage history available"
            })
            continue

        if len(usage_entries) < 3:
            report.append({
                "supply_id": supply.id,
                "name": supply.name,
                "message": "Insufficient usage data for reliable trend analysis",
                "entries": len(usage_entries),
                "recent_usages": [entry.quantity_used for entry in usage_entries],
                "timestamps": [entry.timestamp.isoformat() for entry in usage_entries]
            })
            continue

        usage_values = [entry.quantity_used for entry in usage_entries]
        timestamps = [entry.timestamp for entry in usage_entries]

        usage_avg = mean(usage_values)
        usage_min = min(usage_values)
        usage_max = max(usage_values)
        usage_stdev = stdev(usage_values) if len(usage_values) > 1 else 0.0

        variability = "High" if usage_stdev > usage_avg else "Moderate" if usage_stdev > (0.5 * usage_avg) else "Low"

        report.append({
            "supply_id": supply.id,
            "name": supply.name,
            "entries": len(usage_values),
            "average_usage": round(usage_avg, 2),
            "min_usage": usage_min,
            "max_usage": usage_max,
            "usage_variability": variability,
            "std_dev": round(usage_stdev, 2)
        })

    return report
