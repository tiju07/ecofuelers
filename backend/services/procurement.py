import requests
from sqlalchemy.orm import Session
from models.supplies import Supplies

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