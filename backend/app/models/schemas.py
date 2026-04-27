from dataclasses import dataclass
from typing import List


@dataclass
class EligibilityResult:
    eligible: bool
    required_marks: float
    obtained_marks: float
    message: str


@dataclass
class PredictiveAlert:
    student_id: str
    attendance_percentage: float
    risk_score: float
    message: str


@dataclass
class DashboardSummary:
    attendance_percentage: float
    pending_assignments: int
    today_schedule: List[str]
