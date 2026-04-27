from typing import Dict


def extract_document_fields(mock_text: str) -> Dict[str, str]:
    # Placeholder OCR parser; replace with Tesseract/AWS Textract integration.
    parts = [part.strip() for part in mock_text.split(";") if part.strip()]
    extracted = {}
    for part in parts:
        if ":" in part:
            key, value = part.split(":", 1)
            extracted[key.strip().lower()] = value.strip()
    return {
        "cnic": extracted.get("cnic", ""),
        "name": extracted.get("name", ""),
        "marks": extracted.get("marks", "0"),
    }
