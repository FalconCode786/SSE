from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = payload.get("email", "")
    role = payload.get("role", "prospective_student")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    token = create_access_token(identity=email, additional_claims={"role": role})
    return jsonify({"access_token": token, "role": role}), 200
