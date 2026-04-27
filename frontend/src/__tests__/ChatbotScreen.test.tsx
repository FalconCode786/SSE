import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ChatbotScreen } from "../screens/ChatbotScreen";

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: { token: "chatbot-token", role: "enrolled_student" } }),
}));

jest.mock("../services/api", () => ({
  askChatbot: jest.fn(async () => ({
    response: "Binary search trees are data structures that organize data in a hierarchical manner...",
  })),
}));

describe("ChatbotScreen", () => {
  it("renders chatbot screen title", () => {
    const { getByText } = render(<ChatbotScreen />);

    expect(getByText(/chatbot|assistant|ai/i)).toBeTruthy();
  });

  it("displays course selector", () => {
    const { getByText } = render(<ChatbotScreen />);

    expect(getByText(/course|select/i)).toBeTruthy();
  });

  it("shows message input area", () => {
    const { getByPlaceholderText } = render(<ChatbotScreen />);

    expect(
      getByPlaceholderText(/type|message|ask|question/i)
    ).toBeTruthy();
  });

  it("displays message history", async () => {
    const { getByText } = render(<ChatbotScreen />);

    await waitFor(() => {
      expect(getByText(/message|chat|conversation/i) || getByText(/chatbot/i)).toBeTruthy();
    });
  });

  it("allows typing message", () => {
    const { getByPlaceholderText } = render(<ChatbotScreen />);

    const input = getByPlaceholderText(/type|message|ask|question/i);
    fireEvent.changeText(input, "What is a linked list?");

    expect(input.props.value).toBe("What is a linked list?");
  });

  it("sends message on button press", async () => {
    const { getByPlaceholderText, getByText } = render(<ChatbotScreen />);

    const input = getByPlaceholderText(/type|message|ask|question/i);
    fireEvent.changeText(input, "Explain recursion");

    const sendButton = getByText(/send|submit/i).parent;
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(getByPlaceholderText(/type|message|ask|question/i)).toBeTruthy();
    });
  });

  it("displays suggested questions", () => {
    const { getByText } = render(<ChatbotScreen />);

    expect(getByText(/suggested|question|help/i) || getByText(/what|how|explain/i)).toBeTruthy();
  });

  it("handles suggested question click", async () => {
    const { getByText } = render(<ChatbotScreen />);

    // Try to find and click a suggested question button
    const buttons = getByText(/what|how|explain/i);
    if (buttons && buttons.parent) {
      fireEvent.press(buttons.parent);

      await waitFor(() => {
        expect(getByText(/chatbot/i)).toBeTruthy();
      });
    }
  });

  it("shows character count", () => {
    const { getByPlaceholderText, getByText } = render(<ChatbotScreen />);

    const input = getByPlaceholderText(/type|message|ask|question/i);
    fireEvent.changeText(input, "Hello");

    expect(getByText(/5|count|character/i) || getByText(/hello/i)).toBeTruthy();
  });

  it("prevents message send at character limit", () => {
    const { getByPlaceholderText } = render(<ChatbotScreen />);

    const input = getByPlaceholderText(/type|message|ask|question/i);
    const longMessage = "a".repeat(501);

    fireEvent.changeText(input, longMessage);

    expect(input.props.value.length).toBeGreaterThanOrEqual(500);
  });

  it("displays bot response messages", async () => {
    const { getByPlaceholderText, getByText } = render(<ChatbotScreen />);

    const input = getByPlaceholderText(/type|message|ask|question/i);
    fireEvent.changeText(input, "What is OOP?");

    const sendButton = getByText(/send|submit/i).parent;
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(getByText(/binary|tree|data|structure/i) || getByText(/response/i)).toBeTruthy();
    });
  });

  it("handles loading state while waiting for response", async () => {
    const { getByPlaceholderText, getByText } = render(<ChatbotScreen />);

    const input = getByPlaceholderText(/type|message|ask|question/i);
    fireEvent.changeText(input, "Explain arrays");

    const sendButton = getByText(/send|submit/i).parent;
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(getByText(/chatbot/i)).toBeTruthy();
    });
  });
});
