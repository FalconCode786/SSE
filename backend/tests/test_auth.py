import pytest


def test_login_success(client):
    """Test successful login with valid credentials"""
    response = client.post(
        "/api/auth/login",
        json={"email": "student@example.com", "role": "enrolled_student"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert data["role"] == "enrolled_student"


def test_login_with_different_roles(client):
    """Test login with different user roles"""
    roles = ["prospective_student", "enrolled_student", "faculty", "admin"]

    for role in roles:
        response = client.post(
            "/api/auth/login",
            json={"email": f"user@example.com", "role": role},
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["role"] == role


def test_login_without_email(client):
    """Test login fails when email is missing"""
    response = client.post(
        "/api/auth/login",
        json={"role": "enrolled_student"},
    )

    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data


def test_login_with_empty_email(client):
    """Test login fails with empty email"""
    response = client.post(
        "/api/auth/login",
        json={"email": "", "role": "enrolled_student"},
    )

    assert response.status_code == 400


def test_login_default_role(client):
    """Test login uses default role when not specified"""
    response = client.post(
        "/api/auth/login",
        json={"email": "student@example.com"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["role"] == "prospective_student"  # default role
