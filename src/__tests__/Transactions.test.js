import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Transactions from "../pages/Transactions";
import axios from "../api/client";

jest.mock("../api/client");

describe("Transactions", () => {
  it("renders and allows adding a transaction", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});
    render(<Transactions />);
    expect(screen.getByText(/Transactions/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Account ID/i), { target: { value: "1" } });
    fireEvent.change(screen.getByPlaceholderText(/Amount \(cents\)/i), { target: { value: 1000 } });
    fireEvent.change(screen.getByPlaceholderText(/Currency/i), { target: { value: "USD" } });
    fireEvent.click(screen.getByText(/Add Transaction/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
