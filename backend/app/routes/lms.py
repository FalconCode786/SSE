from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required

from app.services.chatbot import generate_study_response
from app.services.geofence import is_within_geofence

lms_bp = Blueprint("lms", __name__, url_prefix="/api/lms")


@lms_bp.get("/dashboard")
@jwt_required()
def dashboard():
    claims = get_jwt()
    role = claims.get("role", "student")
    base_response = {
        "today_schedule": ["DBMS 9:00 AM", "Software Engineering 11:00 AM"],
        "pending_assignments": 2,
        "attendance_percentage": 84,
        "role": role,
    }
    return jsonify(base_response), 200


@lms_bp.post("/attendance/scan")
@jwt_required()
def attendance_scan():
    payload = request.get_json(silent=True) or {}
    user_lat = float(payload.get("latitude", 0))
    user_lon = float(payload.get("longitude", 0))

    campus_lat = current_app.config["CAMPUS_LATITUDE"]
    campus_lon = current_app.config["CAMPUS_LONGITUDE"]
    radius = current_app.config["CAMPUS_RADIUS_METERS"]

    valid = is_within_geofence(user_lat, user_lon, campus_lat, campus_lon, radius)
    if not valid:
        return jsonify({"marked": False, "reason": "Outside campus geofence"}), 403

    return jsonify({"marked": True, "status": "Present"}), 200


@lms_bp.post("/chat")
@jwt_required()
def ai_chat():
    payload = request.get_json(silent=True) or {}
    prompt = payload.get("prompt", "")
    context = payload.get("course_context", "No course context provided")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    return jsonify(generate_study_response(prompt, context)), 200


@lms_bp.get("/notifications/personalized")
@jwt_required()
def personalized_notifications():
    return (
        jsonify(
            {
                "notifications": [
                    "Assignment 3 deadline in 24 hours",
                    "Merit list update available",
                ]
            }
        ),
        200,
    )
