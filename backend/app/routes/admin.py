from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.predictive import generate_predictive_alert

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.post("/predictive-alert")
@jwt_required()
def predictive_alert():
    payload = request.get_json(silent=True) or {}
    student_id = payload.get("student_id", "")
    attendance = float(payload.get("attendance_percentage", 0))
    submission_rate = float(payload.get("assignment_submission_rate", 0))

    if not student_id:
        return jsonify({"error": "student_id is required"}), 400

    alert = generate_predictive_alert(student_id, attendance, submission_rate)
    return (
        jsonify(
            {
                "student_id": alert.student_id,
                "attendance_percentage": alert.attendance_percentage,
                "risk_score": alert.risk_score,
                "message": alert.message,
            }
        ),
        200,
    )
