from app.models.schemas import PredictiveAlert


def compute_dropout_risk(attendance_percentage: float, assignment_submission_rate: float) -> float:
    attendance_gap = max(0.0, 75.0 - attendance_percentage) / 75.0
    assignment_gap = max(0.0, 1.0 - assignment_submission_rate)
    weighted_risk = (attendance_gap * 0.7) + (assignment_gap * 0.3)
    return round(min(1.0, max(0.0, weighted_risk)), 2)


def generate_predictive_alert(
    student_id: str,
    attendance_percentage: float,
    assignment_submission_rate: float,
) -> PredictiveAlert:
    risk = compute_dropout_risk(attendance_percentage, assignment_submission_rate)
    message = (
        "High risk of dropout. Immediate intervention recommended."
        if risk >= 0.6
        else "Risk under control. Continue regular monitoring."
    )
    return PredictiveAlert(
        student_id=student_id,
        attendance_percentage=attendance_percentage,
        risk_score=risk,
        message=message,
    )
