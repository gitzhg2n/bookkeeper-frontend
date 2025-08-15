import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InvestmentAlerts from "../pages/InvestmentAlerts";
import axios from "../api/client";

jest.mock("../api/client");

describe("InvestmentAlerts", () => {
  it("renders and allows creating an alert", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});
    render(<InvestmentAlerts />);
    expect(screen.getByText(/Investment Alerts/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Asset Symbol/i), { target: { value: "BTC" } });
    fireEvent.change(screen.getByPlaceholderText(/Threshold/i), { target: { value: 100 } });
    fireEvent.click(screen.getByText(/Create Alert/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
