import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-me")
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
    CAMPUS_LATITUDE = float(os.getenv("CAMPUS_LATITUDE", "24.8607"))
    CAMPUS_LONGITUDE = float(os.getenv("CAMPUS_LONGITUDE", "67.0011"))
    CAMPUS_RADIUS_METERS = float(os.getenv("CAMPUS_RADIUS_METERS", "300"))
