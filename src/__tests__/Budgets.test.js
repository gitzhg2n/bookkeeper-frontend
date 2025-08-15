import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Budgets from "../pages/Budgets";
import axios from "../api/client";

jest.mock("../api/client");

describe("Budgets", () => {
  it("renders and allows adding a budget", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});
    render(<Budgets />);
    expect(screen.getByText(/Budgets/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Household ID/i), { target: { value: "1" } });
    fireEvent.change(screen.getByPlaceholderText(/Month/i), { target: { value: "2025-08" } });
    fireEvent.change(screen.getByPlaceholderText(/Category ID/i), { target: { value: "1" } });
    fireEvent.change(screen.getByPlaceholderText(/Planned \(cents\)/i), { target: { value: 50000 } });
    fireEvent.click(screen.getByText(/Add Budget/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
