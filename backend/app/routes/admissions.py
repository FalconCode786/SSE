from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.eligibility import DEFAULT_REQUIRED_MARKS, check_eligibility
from app.services.ocr import extract_document_fields

admissions_bp = Blueprint("admissions", __name__, url_prefix="/api/admissions")


@admissions_bp.post("/scan")
@jwt_required()
def scan_document():
    payload = request.get_json(silent=True) or {}
    mock_text = payload.get("mock_text", "")
    extracted = extract_document_fields(mock_text)
    return jsonify({"extracted": extracted}), 200


@admissions_bp.post("/eligibility")
@jwt_required()
def eligibility_check():
    payload = request.get_json(silent=True) or {}
    marks = float(payload.get("previous_marks", 0))
    required_marks = float(payload.get("required_marks", DEFAULT_REQUIRED_MARKS))

    result = check_eligibility(marks, required_marks)
    return (
        jsonify(
            {
                "eligible": result.eligible,
                "required_marks": result.required_marks,
                "obtained_marks": result.obtained_marks,
                "message": result.message,
            }
        ),
        200,
    )


@admissions_bp.get("/status")
@jwt_required()
def application_status():
    # Real-time status should be sourced from Supabase subscriptions in production.
    return jsonify({"status": "Pending"}), 200
