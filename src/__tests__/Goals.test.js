import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Goals from "../pages/Goals";
import axios from "../api/client";

jest.mock("../api/client");

describe("Goals", () => {
  it("renders and allows adding a goal", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});
    render(<Goals />);
    expect(screen.getByText(/Goals/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Goal Name/i), { target: { value: "Vacation" } });
    fireEvent.change(screen.getByPlaceholderText(/Target \(cents\)/i), { target: { value: 100000 } });
    fireEvent.change(screen.getByPlaceholderText(/Current \(cents\)/i), { target: { value: 10000 } });
    fireEvent.change(screen.getByPlaceholderText(/Due Date/i), { target: { value: "2025-12-31" } });
    fireEvent.click(screen.getByText(/Add Goal/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
