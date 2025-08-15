import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Accounts from "../pages/Accounts";
import axios from "../api/client";

jest.mock("../api/client");

describe("Accounts", () => {
  it("renders and allows adding an account", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});
    render(<Accounts />);
    expect(screen.getByText(/Accounts/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Account Name/i), { target: { value: "Checking" } });
    fireEvent.change(screen.getByPlaceholderText(/Type/i), { target: { value: "Checking" } });
    fireEvent.change(screen.getByPlaceholderText(/Currency/i), { target: { value: "USD" } });
    fireEvent.change(screen.getByPlaceholderText(/Opening Balance \(cents\)/i), { target: { value: 100000 } });
    fireEvent.click(screen.getByText(/Add Account/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
