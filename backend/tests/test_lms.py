def test_attendance_scan_inside_geofence(client, auth_header):
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 24.8607, "longitude": 67.0011},
    )

    assert response.status_code == 200
    assert response.get_json()["marked"] is True


def test_attendance_scan_outside_geofence(client, auth_header):
    response = client.post(
        "/api/lms/attendance/scan",
        headers=auth_header,
        json={"latitude": 25.0, "longitude": 67.5},
    )

    assert response.status_code == 403
    assert response.get_json()["marked"] is False


def test_ai_chat_requires_prompt(client, auth_header):
    response = client.post(
        "/api/lms/chat",
        headers=auth_header,
        json={"course_context": "Data structures chapter 4"},
    )

    assert response.status_code == 400
