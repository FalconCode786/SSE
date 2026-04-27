from app.models.schemas import EligibilityResult


DEFAULT_REQUIRED_MARKS = 60.0


def check_eligibility(obtained_marks: float, required_marks: float = DEFAULT_REQUIRED_MARKS) -> EligibilityResult:
    is_eligible = obtained_marks >= required_marks
    message = (
        "Eligible for admission"
        if is_eligible
        else "Not eligible. Improve marks or apply for alternate program."
    )
    return EligibilityResult(
        eligible=is_eligible,
        required_marks=required_marks,
        obtained_marks=obtained_marks,
        message=message,
    )
