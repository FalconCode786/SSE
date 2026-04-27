def test_eligibility_pass(client, auth_header):
    response = client.post(
        "/api/admissions/eligibility",
        headers=auth_header,
        json={"previous_marks": 76, "required_marks": 60},
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["eligible"] is True


def test_eligibility_fail(client, auth_header):
    response = client.post(
        "/api/admissions/eligibility",
        headers=auth_header,
        json={"previous_marks": 40, "required_marks": 60},
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["eligible"] is False
