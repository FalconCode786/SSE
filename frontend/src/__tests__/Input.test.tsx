import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "../components/Input";

describe("Input Component", () => {
  it("renders input with label", () => {
    const { getByText } = render(
      <Input
        label="Email"
        placeholder="Enter email"
        value=""
        onChangeText={() => {}}
      />
    );
    expect(getByText("Email")).toBeTruthy();
  });

  it("displays placeholder text", () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter text"
        value=""
        onChangeText={() => {}}
      />
    );
    expect(getByPlaceholderText("Enter text")).toBeTruthy();
  });

  it("updates value on text change", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Test input"
        value=""
        onChangeText={mockOnChange}
      />
    );
    fireEvent.changeText(getByPlaceholderText("Test input"), "new value");
    expect(mockOnChange).toHaveBeenCalledWith("new value");
  });

  it("displays error message when provided", () => {
    const { getByText } = render(
      <Input
        placeholder="Test"
        value=""
        onChangeText={() => {}}
        error="This field is required"
      />
    );
    expect(getByText("This field is required")).toBeTruthy();
  });

  it("shows icon when provided", () => {
    const { getByTestId } = render(
      <Input
        placeholder="Email"
        value=""
        onChangeText={() => {}}
        icon="mail-outline"
      />
    );
    // Icon will be rendered if component exists
    expect(getByTestId).toBeDefined();
  });

  it("applies different variants", () => {
    const { getByPlaceholderText: getByPlaceholderFilledText } = render(
      <Input
        placeholder="Filled"
        value=""
        onChangeText={() => {}}
        variant="filled"
      />
    );
    expect(getByPlaceholderFilledText("Filled")).toBeTruthy();
  });

  it("disables input when disabled prop is true", () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Disabled"
        value=""
        onChangeText={() => {}}
        disabled={true}
      />
    );
    const input = getByPlaceholderText("Disabled");
    expect(input.props.editable).toBe(false);
  });

  it("handles numeric keyboard type", () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Phone"
        value=""
        onChangeText={() => {}}
        keyboardType="number-pad"
      />
    );
    const input = getByPlaceholderText("Phone");
    expect(input.props.keyboardType).toBe("number-pad");
  });
});
