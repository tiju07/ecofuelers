import pytest
from fastapi.testclient import TestClient
from backend.main import app  # Assuming your FastAPI app is in backend/main.py
from backend.utils.auth import decode_jwt_token

client = TestClient(app)

# Helper function to generate admin token
def get_admin_token():
    return client.post(
        "/login",
        json={"username": "admin", "password": "admin_password"}
    ).json()["access_token"]

# Test POST /login returns valid JWT token (TC#14)
def test_login_returns_valid_jwt():
    response = client.post("/login", json={"username": "test_user", "password": "test_password"})
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None
    decoded_token = decode_jwt_token(token)
    assert "user_id" in decoded_token
    assert "role" in decoded_token

# Test POST /register creates user (admin only, TC#13)
def test_register_user_admin_only():
    admin_token = get_admin_token()
    user_data = {
        "username": "new_user",
        "password": "new_password",
        "role": "employee"
    }
    response = client.post("/register", json=user_data, headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 201
    assert response.json()["username"] == "new_user"

def test_register_user_unauthorized():
    response = client.post("/register", json={"username": "unauthorized_user", "password": "password", "role": "employee"})
    assert response.status_code == 401

# Test GET /users/me returns user details (TC#14)
def test_get_user_details():
    response = client.post("/login", json={"username": "test_user", "password": "test_password"})
    token = response.json()["access_token"]
    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user_details = response.json()
    assert "username" in user_details
    assert user_details["username"] == "test_user"

# Test unauthorized access for protected routes (TC#25–TC#26)
def test_protected_route_unauthorized_access():
    response = client.get("/users/me")
    assert response.status_code == 401
    assert "detail" in response.json()
    assert response.json()["detail"] == "Not authenticated"

def test_protected_route_invalid_token():
    response = client.get("/users/me", headers={"Authorization": "Bearer invalid_token"})
    assert response.status_code == 401
    assert "detail" in response.json()
    assert response.json()["detail"] == "Could not validate credentials"