import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationCenter from "../pages/NotificationCenter";
import axios from "../api/client";

jest.mock("../api/client");

describe("NotificationCenter", () => {
  it("renders and marks notifications as read", async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { id: 1, title: "Test Alert", message: "Test message", read: false, created_at: new Date().toISOString() }
    ] });
    axios.post.mockResolvedValue({});
    render(<NotificationCenter />);
    expect(await screen.findByText(/Test Alert/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Mark Read/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
