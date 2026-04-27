import pytest

from app import create_app


@pytest.fixture()
def client():
    app = create_app()
    app.config.update({"TESTING": True})
    with app.test_client() as test_client:
        yield test_client


def _login_and_get_token(client, role="enrolled_student"):
    response = client.post(
        "/api/auth/login",
        json={"email": "student@example.com", "role": role},
    )
    return response.get_json()["access_token"]


@pytest.fixture()
def auth_header(client):
    token = _login_and_get_token(client)
    return {"Authorization": f"Bearer {token}"}
