import pytest
from fastapi.testclient import TestClient
from backend.main import app  # Assuming your FastAPI app is in backend/main.py
from backend.utils.auth import create_jwt_token

client = TestClient(app)

# Helper function to generate admin token
def get_admin_token():
    return create_jwt_token(user_id=1, role="admin")

# Helper function to generate employee token
def get_employee_token():
    return create_jwt_token(user_id=2, role="employee")

# Test GET /supplies returns list of supplies (TC#1, TC#3)
def test_get_supplies():
    response = client.get("/supplies")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Test POST /supplies creates supply (admin only, TC#2, TC#13)
def test_create_supply_admin_only():
    token = get_admin_token()
    supply_data = {
        "name": "Test Supply",
        "category": "Test Category",
        "quantity": 10,
        "expiration_date": "2023-12-31T00:00:00"
    }
    response = client.post("/supplies", json=supply_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json()["name"] == "Test Supply"

def test_create_supply_unauthorized():
    token = get_employee_token()
    supply_data = {
        "name": "Test Supply",
        "category": "Test Category",
        "quantity": 10,
        "expiration_date": "2023-12-31T00:00:00"
    }
    response = client.post("/supplies", json=supply_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403

# Test PUT /supplies/{id} updates supply (admin only, TC#2, TC#13)
def test_update_supply_admin_only():
    token = get_admin_token()
    update_data = {"quantity": 20}
    response = client.put("/supplies/1", json=update_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["quantity"] == 20

def test_update_supply_unauthorized():
    token = get_employee_token()
    update_data = {"quantity": 20}
    response = client.put("/supplies/1", json=update_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403

# Test POST /usage records usage (TC#2)
def test_record_usage():
    token = get_admin_token()
    usage_data = {"supply_id": 1, "quantity_used": 5}
    response = client.post("/usage", json=usage_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json()["quantity_used"] == 5

# Test invalid inputs (e.g., negative quantity, TC#16)
def test_invalid_input_negative_quantity():
    token = get_admin_token()
    supply_data = {
        "name": "Invalid Supply",
        "category": "Test Category",
        "quantity": -5,
        "expiration_date": "2023-12-31T00:00:00"
    }
    response = client.post("/supplies", json=supply_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 400
    assert "Quantity must be non-negative" in response.json()["detail"]

# Test database failure scenarios (TC#15)
def test_database_failure(monkeypatch):
    def mock_db_failure(*args, **kwargs):
        raise Exception("Database connection error")
    monkeypatch.setattr("backend.database.get_db", mock_db_failure)
    response = client.get("/supplies")
    assert response.status_code == 500
    assert "Database connection error" in response.json()["error"]

# Test large number of supplies (TC#27)
def test_large_number_of_supplies():
    token = get_admin_token()
    for i in range(1000):
        supply_data = {
            "name": f"Supply {i}",
            "category": "Test Category",
            "quantity": 10,
            "expiration_date": "2023-12-31T00:00:00"
        }
        response = client.post("/supplies", json=supply_data, headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 201
    response = client.get("/supplies")
    assert response.status_code == 200
    assert len(response.json()) >= 1000