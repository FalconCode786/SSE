import pytest
from app.services.eligibility import check_eligibility, DEFAULT_REQUIRED_MARKS


class TestEligibilityService:
    """Test suite for eligibility checking service"""

    def test_eligible_above_threshold(self):
        """Student with marks above threshold should be eligible"""
        result = check_eligibility(obtained_marks=80, required_marks=60)

        assert result.eligible is True
        assert result.obtained_marks == 80
        assert result.required_marks == 60
        assert "Eligible" in result.message

    def test_not_eligible_below_threshold(self):
        """Student with marks below threshold should not be eligible"""
        result = check_eligibility(obtained_marks=45, required_marks=60)

        assert result.eligible is False
        assert result.obtained_marks == 45
        assert result.required_marks == 60
        assert "Not eligible" in result.message

    def test_eligible_at_threshold(self):
        """Student with marks exactly at threshold should be eligible"""
        result = check_eligibility(obtained_marks=60, required_marks=60)

        assert result.eligible is True

    def test_default_required_marks(self):
        """Should use default required marks when not provided"""
        result = check_eligibility(obtained_marks=75)

        assert result.required_marks == DEFAULT_REQUIRED_MARKS

    def test_perfect_score_eligible(self):
        """Perfect score should always be eligible"""
        result = check_eligibility(obtained_marks=100, required_marks=90)

        assert result.eligible is True

    def test_zero_score_not_eligible(self):
        """Zero score should not be eligible"""
        result = check_eligibility(obtained_marks=0, required_marks=50)

        assert result.eligible is False

    def test_high_required_marks(self):
        """Should handle high required marks threshold"""
        result = check_eligibility(obtained_marks=85, required_marks=90)

        assert result.eligible is False

    def test_low_required_marks(self):
        """Should handle low required marks threshold"""
        result = check_eligibility(obtained_marks=25, required_marks=20)

        assert result.eligible is True

    def test_result_contains_correct_message(self):
        """Result should contain appropriate message"""
        eligible_result = check_eligibility(75, 60)
        not_eligible_result = check_eligibility(45, 60)

        assert isinstance(eligible_result.message, str)
        assert isinstance(not_eligible_result.message, str)
        assert len(eligible_result.message) > 0
        assert len(not_eligible_result.message) > 0
