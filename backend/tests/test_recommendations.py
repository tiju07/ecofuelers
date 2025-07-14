import pytest
from fastapi.testclient import TestClient
from backend.main import app  # Assuming your FastAPI app is in backend/main.py
from backend.utils.auth import create_jwt_token

client = TestClient(app)

# Helper function to generate admin token
def get_admin_token():
    return create_jwt_token(user_id=1, role="admin")

# Test GET /recommendations returns suggestions based on usage (TC#4–TC#6)
def test_get_recommendations():
    token = get_admin_token()
    response = client.get("/recommendations", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    for recommendation in response.json():
        assert "supply_id" in recommendation
        assert "recommended_quantity" in recommendation

# Test recommendations handle insufficient data (TC#17)
def test_recommendations_insufficient_data():
    token = get_admin_token()
    response = client.get("/recommendations", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 400
    assert "Insufficient data for recommendations" in response.json()["error"]

# Test recommendations avoid excessive orders (TC#18)
def test_recommendations_avoid_excessive_orders():
    token = get_admin_token()
    response = client.get("/recommendations", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    for recommendation in response.json():
        assert recommendation["recommended_quantity"] <= 100  # Assuming 100 is the max threshold

# Test GET /alerts detects overstocking and expiration (TC#7–TC#8)
def test_get_alerts():
    token = get_admin_token()
    response = client.get("/alerts", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    for alert in response.json():
        assert "type" in alert
        assert alert["type"] in ["overstock", "expiration"]

# Test alerts handle missing/duplicate cases (TC#19–TC#20)
def test_alerts_handle_missing_cases():
    token = get_admin_token()
    response = client.get("/alerts", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 0  # Assuming no alerts exist for missing cases

def test_alerts_handle_duplicate_cases():
    token = get_admin_token()
    response = client.get("/alerts", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    alerts = response.json()
    alert_ids = [alert["id"] for alert in alerts]
    assert len(alert_ids) == len(set(alert_ids))  # Ensure no duplicate alerts

# Test edge cases: variable usage, supplier unavailability (TC#29–TC#32)
def test_recommendations_variable_usage():
    token = get_admin_token()
    # Simulate variable usage data
    response = client.post("/usage", json={"supply_id": 1, "quantity_used": 10}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.post("/usage", json={"supply_id": 1, "quantity_used": 5}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.get("/recommendations", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    for recommendation in response.json():
        assert recommendation["recommended_quantity"] >= 0

def test_recommendations_supplier_unavailability():
    token = get_admin_token()
    # Simulate supplier unavailability
    response = client.get("/recommendations?supplier_unavailable=true", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    for recommendation in response.json():
        assert recommendation["recommended_quantity"] == 0  # No recommendations if supplier is unavailable