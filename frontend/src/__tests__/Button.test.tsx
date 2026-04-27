import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Button } from "../components/Button";
import { theme } from "../theme/theme";

describe("Button Component", () => {
  it("renders button with label", () => {
    const { getByText } = render(
      <Button label="Click Me" onPress={() => {}} />
    );
    expect(getByText("Click Me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button label="Click" onPress={mockOnPress} />
    );
    fireEvent.press(getByText("Click"));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it("disables button when disabled prop is true", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button label="Click" onPress={mockOnPress} disabled={true} />
    );
    fireEvent.press(getByText("Click"));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("shows loading state", () => {
    const { getByText } = render(
      <Button label="Click" onPress={() => {}} loading={true} />
    );
    expect(getByText("Click")).toBeTruthy();
  });

  it("applies primary variant styles", () => {
    const { getByText } = render(
      <Button label="Primary" onPress={() => {}} variant="primary" />
    );
    const button = getByText("Primary").parent;
    expect(button).toBeTruthy();
  });

  it("applies danger variant styles", () => {
    const { getByText } = render(
      <Button label="Delete" onPress={() => {}} variant="danger" />
    );
    const button = getByText("Delete").parent;
    expect(button).toBeTruthy();
  });

  it("renders with full width", () => {
    const { getByText } = render(
      <Button label="Full Width" onPress={() => {}} fullWidth={true} />
    );
    expect(getByText("Full Width")).toBeTruthy();
  });

  it("respects different sizes", () => {
    const { getByText: getByTextSm } = render(
      <Button label="Small" onPress={() => {}} size="sm" />
    );
    const { getByText: getByTextLg } = render(
      <Button label="Large" onPress={() => {}} size="lg" />
    );
    expect(getByTextSm("Small")).toBeTruthy();
    expect(getByTextLg("Large")).toBeTruthy();
  });
});
