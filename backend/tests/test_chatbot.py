import pytest


def test_ai_chat_requires_prompt(client, auth_header):
    """Test that chat endpoint requires a prompt"""
    response = client.post(
        "/api/lms/chat",
        headers=auth_header,
        json={"course_context": "Data structures chapter 4"},
    )

    assert response.status_code == 400


def test_ai_chat_success(client, auth_header):
    """Test successful AI chat interaction"""
    response = client.post(
        "/api/lms/chat",
        headers=auth_header,
        json={
            "prompt": "What is a binary search tree?",
            "course_context": "Data structures",
        },
    )

    assert response.status_code == 200
    data = response.get_json()
    assert "response" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0


def test_ai_chat_different_courses(client, auth_header):
    """Test AI chat with different course contexts"""
    courses = ["Data structures", "Algorithms", "Web Development"]

    for course in courses:
        response = client.post(
            "/api/lms/chat",
            headers=auth_header,
            json={
                "prompt": "Explain the main concepts",
                "course_context": course,
            },
        )
        assert response.status_code == 200
        assert "response" in response.get_json()


def test_ai_chat_empty_prompt(client, auth_header):
    """Test that empty prompt is rejected"""
    response = client.post(
        "/api/lms/chat",
        headers=auth_header,
        json={"prompt": "", "course_context": "Data structures"},
    )

    assert response.status_code == 400


def test_ai_chat_very_long_prompt(client, auth_header):
    """Test AI chat with very long prompt"""
    long_prompt = "a" * 1000

    response = client.post(
        "/api/lms/chat",
        headers=auth_header,
        json={"prompt": long_prompt, "course_context": "Data structures"},
    )

    assert response.status_code == 200
    assert "response" in response.get_json()


def test_ai_chat_special_characters(client, auth_header):
    """Test AI chat with special characters in prompt"""
    response = client.post(
        "/api/lms/chat",
        headers=auth_header,
        json={
            "prompt": "What is O(n log n)? Explain with examples!@#$%",
            "course_context": "Algorithms",
        },
    )

    assert response.status_code == 200
    assert "response" in response.get_json()


def test_ai_chat_without_auth(client):
    """Test that chat requires authentication"""
    response = client.post(
        "/api/lms/chat",
        json={"prompt": "Hello", "course_context": "Data structures"},
    )

    assert response.status_code == 401
