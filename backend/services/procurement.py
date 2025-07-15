from io import BytesIO
from fastapi import requests
from sqlalchemy.orm import Session
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
import pandas as pd
from ..models.supplies import Supplies, UsageHistory

# Mock procurement API base URL and API key
PROCUREMENT_API_BASE_URL = "https://mock-procurement-api.com"
API_KEY = "your_api_key_here"

# Send order to procurement API
def send_order(supply_id: int, quantity: int, db: Session):
    supply = db.query(Supplies).filter(Supplies.id == supply_id).first()
    if not supply:
        return {"error": "Supply not found"}

    # Prepare API request payload
    payload = {
        "supply_id": supply_id,
        "quantity": quantity,
        "supplier": supply.primary_supplier,
    }
    headers = {"Authorization": f"Bearer {API_KEY}"}

    try:
        response = requests.post(f"{PROCUREMENT_API_BASE_URL}/orders", json=payload, headers=headers)
        response.raise_for_status()
        return {"status": "success", "message": "Order sent successfully"}
    except requests.exceptions.HTTPError as http_err:
        return {"status": "failure", "error": f"HTTP error occurred: {http_err}"}
    except requests.exceptions.RequestException as req_err:
        return {"status": "failure", "error": f"Request error occurred: {req_err}"}

# Handle alternative suppliers
def handle_alternative_suppliers(supply_id: int, db: Session):
    supply = db.query(Supplies).filter(Supplies.id == supply_id).first()
    if not supply:
        return {"error": "Supply not found"}

    # Mock logic for alternative suppliers
    alternative_suppliers = [
        {"name": "AltSupplier A", "contact": "contact@altsuppliera.com"},
        {"name": "AltSupplier B", "contact": "contact@altsupplierb.com"},
    ]

    return {
        "supply_id": supply_id,
        "primary_supplier": supply.primary_supplier,
        "alternative_suppliers": alternative_suppliers,
    }

# Error handling for API failures
def handle_api_errors(response):
    if response.status_code == 401:
        return {"status": "failure", "error": "Authentication error. Check API key."}
    elif response.status_code == 404:
        return {"status": "failure", "error": "Resource not found."}
    elif response.status_code >= 500:
        return {"status": "failure", "error": "Server error. Try again later."}
    else:
        return {"status": "failure", "error": f"Unexpected error: {response.text}"}
    

def generate_usage_report_excel(db: Session):
    data = (
        db.query(UsageHistory)
        .join(Supplies, UsageHistory.supply_id == Supplies.id)
        .with_entities(
            Supplies.name.label("Supply Name"),
            UsageHistory.quantity_used.label("Quantity Used"),
            UsageHistory.timestamp.label("Used On")
        )
        .all()
    )
    df = pd.DataFrame(data)
    output = BytesIO()
    df.to_excel(output, index=False, engine='openpyxl')
    output.seek(0)
    return output

def generate_usage_report_pdf(db: Session):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    data = (
        db.query(UsageHistory)
        .join(Supplies, UsageHistory.supply_id == Supplies.id)
        .with_entities(
            Supplies.name,
            UsageHistory.quantity_used,
            UsageHistory.timestamp
        )
        .all()
    )

    table_data = [["Supply Name", "Quantity Used", "Used On"]]
    for row in data:
        table_data.append([row.name, row.quantity_used, row.timestamp.strftime("%Y-%m-%d %H:%M")])

    table = Table(table_data)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
    ]))

    elements.append(Paragraph("Supply Usage Report", styles["Heading1"]))
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return buffer

def check_supplier_stock(supply: Supplies):
    """
    Mocked function to simulate supplier stock check.
    For demo: assume suppliers with name containing 'OutOfStock' are unavailable.
    """
    if "OutOfStock" in supply.primary_supplier:
        return False
    return True

def get_alternative_products(supply: Supplies, db: Session):
    """
    Return alternative supplies from the same category with available stock.
    """
    alternatives = (
        db.query(Supplies)
        .filter(
            Supplies.category == supply.category,
            Supplies.id != supply.id,
            Supplies.quantity > 0
        )
        .limit(5)
        .all()
    )

    return [{"id": alt.id, "name": alt.name, "supplier": alt.primary_supplier, "quantity": alt.quantity}
            for alt in alternatives]