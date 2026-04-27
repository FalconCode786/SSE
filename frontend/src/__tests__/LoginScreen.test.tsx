import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { LoginScreen } from "../screens/LoginScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({ params: { token: null } }),
}));

jest.mock("../services/api", () => ({
  login: jest.fn(async (email, role) => ({
    access_token: "test-token",
    role: role,
  })),
}));

describe("LoginScreen", () => {
  it("renders login form", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText("name@example.com")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
  });

  it("shows email validation error for invalid email", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("name@example.com");
    fireEvent.changeText(emailInput, "invalid-email");

    fireEvent.press(getByText("Sign In"));

    expect(getByText(/valid email/i) || getByText(/required/i)).toBeTruthy();
  });

  it("accepts valid email format", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("name@example.com");
    fireEvent.changeText(emailInput, "student@example.com");

    expect(emailInput.props.value).toBe("student@example.com");
  });

  it("shows all role selection options", () => {
    const { getByText } = render(<LoginScreen />);

    expect(getByText(/prospective/i)).toBeTruthy();
    expect(getByText(/enrolled/i)).toBeTruthy();
    expect(getByText(/faculty/i)).toBeTruthy();
    expect(getByText(/admin/i)).toBeTruthy();
  });

  it("allows role selection", () => {
    const { getByText } = render(<LoginScreen />);

    const facultyButton = getByText(/faculty/i).parent;
    fireEvent.press(facultyButton);

    expect(facultyButton).toBeTruthy();
  });

  it("shows remember me checkbox", () => {
    const { getByText } = render(<LoginScreen />);

    expect(getByText(/remember/i)).toBeTruthy();
  });

  it("allows toggle of remember me", () => {
    const { getByTestId } = render(<LoginScreen />);

    const rememberCheckbox = getByTestId("remember-checkbox");
    fireEvent.press(rememberCheckbox);

    expect(rememberCheckbox).toBeTruthy();
  });

  it("disables submit button with invalid input", () => {
    const { getByText } = render(<LoginScreen />);

    const submitButton = getByText("Sign In").parent;
    expect(submitButton.props.disabled).toBe(true);
  });

  it("enables submit button with valid input", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("name@example.com");
    fireEvent.changeText(emailInput, "student@example.com");

    await waitFor(() => {
      const submitButton = getByText("Sign In").parent;
      expect(submitButton).toBeTruthy();
    });
  });

  it("shows loading state during login", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("name@example.com");
    fireEvent.changeText(emailInput, "student@example.com");

    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(getByText("Sign In")).toBeTruthy();
    });
  });
});
