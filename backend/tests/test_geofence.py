import pytest


def test_attendance_requires_location(client, auth_header):
    """Test that attendance endpoint requires location data"""
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={},
    )

    assert response.status_code == 400


def test_attendance_inside_campus_geofence(client, auth_header):
    """Test attendance marking inside campus geofence (Karachi)"""
    # Coordinates within Karachi University geofence
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 24.8607, "longitude": 67.0011},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["marked"] is True


def test_attendance_outside_campus_geofence(client, auth_header):
    """Test attendance marking outside campus geofence"""
    # Coordinates outside geofence (different city)
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 31.5497, "longitude": 74.3436},  # Lahore
    )

    assert response.status_code == 403
    data = response.get_json()
    assert data["marked"] is False


def test_attendance_at_geofence_boundary(client, auth_header):
    """Test attendance at geofence boundary"""
    # Coordinates near boundary (should be inside)
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 24.86, "longitude": 67.00},
    )

    assert response.status_code in [200, 403]
    assert "marked" in response.get_json()


def test_attendance_without_latitude(client, auth_header):
    """Test attendance fails without latitude"""
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"longitude": 67.0011},
    )

    assert response.status_code == 400


def test_attendance_without_longitude(client, auth_header):
    """Test attendance fails without longitude"""
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 24.8607},
    )

    assert response.status_code == 400


def test_attendance_without_auth(client):
    """Test that attendance requires authentication"""
    response = client.post(
        "/api/lms/attendance/scan",
        json={"latitude": 24.8607, "longitude": 67.0011},
    )

    assert response.status_code == 401


def test_attendance_multiple_scans(client, auth_header):
    """Test multiple attendance scans in one day"""
    # First scan
    response1 = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 24.8607, "longitude": 67.0011},
    )
    assert response1.status_code == 200

    # Second scan
    response2 = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 24.8607, "longitude": 67.0011},
    )
    # Should fail or return already marked
    assert response2.status_code in [200, 409]


def test_attendance_invalid_coordinates(client, auth_header):
    """Test attendance with invalid coordinate values"""
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 999, "longitude": 999},
    )

    assert response.status_code == 400
