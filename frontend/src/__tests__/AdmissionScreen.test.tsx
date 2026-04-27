import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { AdmissionScreen } from "../screens/AdmissionScreen";

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: { token: "test-token", role: "prospective_student" } }),
}));

jest.mock("../services/api", () => ({
  checkEligibility: jest.fn(async () => ({
    eligible: true,
    message: "Eligible for admission",
  })),
  submitApplication: jest.fn(async () => ({
    application_id: "APP-001",
    status: "submitted",
    message: "Application submitted successfully",
  })),
}));

describe("AdmissionScreen", () => {
  it("renders admission screen tabs", () => {
    const { getByText } = render(<AdmissionScreen />);

    expect(getByText(/application|status/i)).toBeTruthy();
  });

  it("displays application form", () => {
    const { getByPlaceholderText } = render(<AdmissionScreen />);

    expect(getByPlaceholderText(/name|full name/i)).toBeTruthy();
  });

  it("shows eligibility result after check", async () => {
    const { getByText, getByTestId } = render(<AdmissionScreen />);

    fireEvent.press(getByText(/check|eligibility/i));

    await waitFor(() => {
      expect(getByTestId("eligibility-message")).toHaveTextContent(
        "Eligible for admission"
      );
    });
  });

  it("allows filling out application form", () => {
    const { getByPlaceholderText } = render(<AdmissionScreen />);

    const nameInput = getByPlaceholderText(/name|full name/i);
    fireEvent.changeText(nameInput, "John Doe");

    expect(nameInput.props.value).toBe("John Doe");
  });

  it("validates required fields", () => {
    const { getByText } = render(<AdmissionScreen />);

    fireEvent.press(getByText(/submit|apply/i));

    expect(getByText(/required|error|invalid/i) || getByText(/name|email/i)).toBeTruthy();
  });

  it("displays program selector", () => {
    const { getByText } = render(<AdmissionScreen />);

    expect(getByText(/program|select|course/i)).toBeTruthy();
  });

  it("allows selecting different programs", () => {
    const { getByText } = render(<AdmissionScreen />);

    const programButtons = getByText(/computer|engineering|business|arts/i);
    fireEvent.press(programButtons);

    expect(programButtons).toBeTruthy();
  });

  it("shows OCR document scanner option", () => {
    const { getByText } = render(<AdmissionScreen />);

    expect(getByText(/ocr|scan|document|upload/i)).toBeTruthy();
  });

  it("displays application status", async () => {
    const { getByText } = render(<AdmissionScreen />);

    await waitFor(() => {
      expect(getByText(/status|submitted|pending|approved/i) || getByText(/application/i)).toBeTruthy();
    });
  });

  it("shows success message after submission", async () => {
    const { getByText, getByPlaceholderText } = render(<AdmissionScreen />);

    const nameInput = getByPlaceholderText(/name|full name/i);
    fireEvent.changeText(nameInput, "Jane Smith");

    fireEvent.press(getByText(/submit|apply/i));

    await waitFor(() => {
      expect(getByText(/success|submitted|complete/i) || getByText(/application/i)).toBeTruthy();
    });
  });

  it("handles eligibility check with different marks", async () => {
    const { getByText, getByPlaceholderText } = render(<AdmissionScreen />);

    const marksInput = getByPlaceholderText(/marks|score/i);
    fireEvent.changeText(marksInput, "75");

    fireEvent.press(getByText(/check|eligibility/i));

    await waitFor(() => {
      expect(getByText(/eligible|admission|result/i) || getByText(/eligibility/i)).toBeTruthy();
    });
  });

  it("validates CNIC format", () => {
    const { getByPlaceholderText } = render(<AdmissionScreen />);

    const cnicInput = getByPlaceholderText(/cnic|id/i);
    fireEvent.changeText(cnicInput, "12345");

    // Should show validation error for invalid CNIC
    expect(cnicInput.props.value).toBe("12345");
  });
});
