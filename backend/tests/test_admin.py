def test_predictive_alert_requires_student_id(client, auth_header):
    response = client.post(
        "/api/admin/predictive-alert",
        headers=auth_header,
        json={"attendance_percentage": 62, "assignment_submission_rate": 0.5},
    )

    assert response.status_code == 400


def test_predictive_alert_success(client, auth_header):
    response = client.post(
        "/api/admin/predictive-alert",
        headers=auth_header,
        json={
            "student_id": "stu-1001",
            "attendance_percentage": 62,
            "assignment_submission_rate": 0.5,
        },
    )
    body = response.get_json()

    assert response.status_code == 200
    assert "risk_score" in body
    assert 0 <= body["risk_score"] <= 1
