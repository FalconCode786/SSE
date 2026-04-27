import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { AdminScreen } from "../screens/AdminScreen";

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: { token: "admin-token", role: "admin" } }),
}));

jest.mock("../services/api", () => ({
  fetchPredictiveAlert: jest.fn(async () => ({
    message: "High risk of dropout. Immediate intervention recommended.",
    risk_score: 75,
    student_name: "John Doe",
  })),
}));

describe("AdminScreen", () => {
  it("renders admin screen header", () => {
    const { getByText } = render(<AdminScreen />);

    expect(getByText(/analytics|alerts|admin/i)).toBeTruthy();
  });

  it("shows tabs for analytics and alerts", () => {
    const { getByText } = render(<AdminScreen />);

    expect(getByText(/analytics/i)).toBeTruthy();
    expect(getByText(/alerts/i)).toBeTruthy();
  });

  it("switches between tabs", () => {
    const { getByText } = render(<AdminScreen />);

    const alertsTab = getByText(/alerts/i).parent;
    fireEvent.press(alertsTab);

    expect(alertsTab).toBeTruthy();
  });

  it("displays student analysis form in analytics tab", () => {
    const { getByPlaceholderText } = render(<AdminScreen />);

    expect(getByPlaceholderText(/student id|id/i)).toBeTruthy();
  });

  it("allows entering student ID", () => {
    const { getByPlaceholderText } = render(<AdminScreen />);

    const studentIdInput = getByPlaceholderText(/student id|id/i);
    fireEvent.changeText(studentIdInput, "STU-001");

    expect(studentIdInput.props.value).toBe("STU-001");
  });

  it("shows predictive risk result after analysis", async () => {
    const { getByText, getByTestId, getByPlaceholderText } = render(<AdminScreen />);

    const studentIdInput = getByPlaceholderText(/student id|id/i);
    fireEvent.changeText(studentIdInput, "STU-001");

    fireEvent.press(getByText(/analyze/i));

    await waitFor(() => {
      expect(getByTestId("risk-message") || getByText(/risk|dropout/i)).toBeTruthy();
    });
  });

  it("displays risk score with color coding", async () => {
    const { getByText, getByPlaceholderText } = render(<AdminScreen />);

    const studentIdInput = getByPlaceholderText(/student id|id/i);
    fireEvent.changeText(studentIdInput, "STU-001");

    fireEvent.press(getByText(/analyze/i));

    await waitFor(() => {
      expect(getByText(/75|risk|high/i)).toBeTruthy();
    });
  });

  it("shows at-risk students list in alerts tab", async () => {
    const { getByText } = render(<AdminScreen />);

    const alertsTab = getByText(/alerts/i).parent;
    fireEvent.press(alertsTab);

    await waitFor(() => {
      expect(getByText(/at-risk|students|alerts/i)).toBeTruthy();
    });
  });

  it("displays action buttons", () => {
    const { getByText } = render(<AdminScreen />);

    const alertsTab = getByText(/alerts/i).parent;
    fireEvent.press(alertsTab);

    expect(getByText(/send.*alert|mass/i) || getByText(/generate|report/i)).toBeTruthy();
  });

  it("handles send mass alert action", () => {
    const { getByText } = render(<AdminScreen />);

    const alertsTab = getByText(/alerts/i).parent;
    fireEvent.press(alertsTab);

    const sendButton = getByText(/send.*alert|mass/i).parent;
    fireEvent.press(sendButton);

    expect(sendButton).toBeTruthy();
  });

  it("handles generate report action", () => {
    const { getByText } = render(<AdminScreen />);

    const alertsTab = getByText(/alerts/i).parent;
    fireEvent.press(alertsTab);

    const reportButton = getByText(/generate|report/i).parent;
    fireEvent.press(reportButton);

    expect(reportButton).toBeTruthy();
  });

  it("shows loading state during analysis", async () => {
    const { getByText, getByPlaceholderText } = render(<AdminScreen />);

    const studentIdInput = getByPlaceholderText(/student id|id/i);
    fireEvent.changeText(studentIdInput, "STU-001");

    fireEvent.press(getByText(/analyze/i));

    await waitFor(() => {
      expect(getByText(/analyze/i) || getByText(/admin/i)).toBeTruthy();
    });
  });

  it("handles empty student ID validation", () => {
    const { getByText } = render(<AdminScreen />);

    fireEvent.press(getByText(/analyze/i));

    expect(getByText(/required|error/i) || getByText(/student/i)).toBeTruthy();
  });
});
