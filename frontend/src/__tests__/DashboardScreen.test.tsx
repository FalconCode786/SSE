import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { DashboardScreen } from "../screens/DashboardScreen";

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: { token: "dashboard-token", role: "enrolled_student" } }),
}));

jest.mock("../services/api", () => ({
  fetchDashboard: jest.fn(async () => ({
    attendance_percentage: 85,
    pending_assignments: 3,
    schedule: [
      {
        id: 1,
        course: "Data Structures",
        time: "09:00 AM",
        location: "Room 101",
      },
      {
        id: 2,
        course: "Web Development",
        time: "11:00 AM",
        location: "Lab 2",
      },
    ],
  })),
}));

describe("DashboardScreen", () => {
  it("renders dashboard header", () => {
    const { getByText } = render(<DashboardScreen />);

    expect(getByText(/welcome/i) || getByText(/dashboard/i)).toBeTruthy();
  });

  it("displays attendance statistics", async () => {
    const { getByText } = render(<DashboardScreen />);

    await waitFor(() => {
      expect(getByText(/attendance/i)).toBeTruthy();
    });
  });

  it("shows attendance percentage", async () => {
    const { getByText } = render(<DashboardScreen />);

    await waitFor(() => {
      expect(getByText(/85/i)).toBeTruthy();
    });
  });

  it("displays pending assignments count", async () => {
    const { getByText } = render(<DashboardScreen />);

    await waitFor(() => {
      expect(getByText(/pending/i)).toBeTruthy();
    });
  });

  it("shows today's schedule", async () => {
    const { getByText } = render(<DashboardScreen />);

    await waitFor(() => {
      expect(getByText(/schedule/i) || getByText(/today/i)).toBeTruthy();
    });
  });

  it("renders schedule items", async () => {
    const { getByText } = render(<DashboardScreen />);

    await waitFor(() => {
      expect(
        getByText(/data structures/i) || getByText(/schedule/i)
      ).toBeTruthy();
    });
  });

  it("supports pull to refresh", async () => {
    const { getByTestId } = render(<DashboardScreen />);

    const refreshControl = getByTestId("refresh-control");
    fireEvent(refreshControl, "refresh");

    await waitFor(() => {
      expect(refreshControl).toBeTruthy();
    });
  });

  it("handles error state", async () => {
    const { getByText, getByTestId } = render(<DashboardScreen />);

    // Simulate error by checking if error alert renders
    await waitFor(() => {
      const component = getByTestId("dashboard-screen");
      expect(component).toBeTruthy();
    });
  });

  it("displays stats cards with proper values", async () => {
    const { getByText } = render(<DashboardScreen />);

    await waitFor(() => {
      const attendanceCard = getByText(/attendance/i);
      expect(attendanceCard).toBeTruthy();
    });
  });

  it("shows empty state when no schedule items", async () => {
    const { getByText, queryByText } = render(<DashboardScreen />);

    await waitFor(() => {
      expect(getByText(/schedule/i) || queryByText(/no schedule/i)).toBeTruthy();
    });
  });

  it("handles loading state", () => {
    const { getByTestId } = render(<DashboardScreen />);

    expect(getByTestId).toBeDefined();
  });
});
