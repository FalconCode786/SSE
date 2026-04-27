from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.config import Config
from app.routes.admin import admin_bp
from app.routes.admissions import admissions_bp
from app.routes.auth import auth_bp
from app.routes.lms import lms_bp

jwt = JWTManager()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(admissions_bp)
    app.register_blueprint(lms_bp)
    app.register_blueprint(admin_bp)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app
