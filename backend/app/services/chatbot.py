from typing import Dict


def generate_study_response(prompt: str, course_context: str) -> Dict[str, str]:
    # Placeholder for OpenAI integration. Keep deterministic for testing.
    condensed_prompt = prompt.strip().lower()
    if "summarize" in condensed_prompt:
        answer = f"Summary: {course_context[:140]}..."
    else:
        answer = f"Tutor response based on course context: {course_context[:160]}..."
    return {"answer": answer}
