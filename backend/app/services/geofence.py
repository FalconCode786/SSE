from math import asin, cos, radians, sin, sqrt


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius_m = 6371000
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)

    a = sin(d_lat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(d_lon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return earth_radius_m * c


def is_within_geofence(
    user_lat: float,
    user_lon: float,
    campus_lat: float,
    campus_lon: float,
    radius_meters: float,
) -> bool:
    distance = haversine_distance_meters(user_lat, user_lon, campus_lat, campus_lon)
    return distance <= radius_meters
