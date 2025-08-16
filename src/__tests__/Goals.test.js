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

  it("shows suggested monthly when suggest is clicked", async () => {
    // prepare a single goal and mock API responses
    const goals = [{ id: 1, name: 'Car', target_cents: 1000000, current_cents: 250000 }];
    axios.get.mockResolvedValueOnce({ data: goals });

    // Mock the AuthContext api.request through a small manual mock on the module
    jest.doMock('../context/AuthContext', () => ({
      useAuth: () => ({ api: { request: jest.fn().mockResolvedValue({ data: { required_monthly: 200.0 } }) } })
    }));

    // Re-require the component so it picks up the mocked context
    const { default: GoalsWithAuth } = await import('../pages/Goals');

    render(<GoalsWithAuth />);

    // wait for goals to load
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // suggestion button exists
    const suggestButton = screen.getByRole('button', { name: /suggest monthly/i });
    fireEvent.click(suggestButton);

    // suggested monthly text appears
    await waitFor(() => expect(screen.getByText(/Suggested monthly/i)).toBeInTheDocument());
    expect(screen.getByText(/\$200.00/)).toBeInTheDocument();
  });

  it("allows editing an existing goal and calls update", async () => {
    const goals = [{ id: 2, name: 'Bike', target_cents: 500000, current_cents: 100000 }];
    axios.get.mockResolvedValueOnce({ data: goals });
    axios.put.mockResolvedValueOnce({});

    render(<Goals />);

    // wait for goals to load
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // click Edit on the goal
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // change the name and current amount
    fireEvent.change(screen.getByPlaceholderText(/Goal Name/i), { target: { value: 'Bike - New' } });
    fireEvent.change(screen.getByPlaceholderText(/Current \(cents\)/i), { target: { value: 150000 } });

    // click Update Goal (button text shows "Update Goal" when editing)
    const updateButton = screen.getByRole('button', { name: /update goal/i });
    fireEvent.click(updateButton);

    await waitFor(() => expect(axios.put).toHaveBeenCalled());
  });

  it("shows error when saving a goal fails", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<Goals />);

    // fill the form
    fireEvent.change(screen.getByPlaceholderText(/Goal Name/i), { target: { value: 'Trip' } });
    fireEvent.change(screen.getByPlaceholderText(/Target \(cents\)/i), { target: { value: 200000 } });
    fireEvent.change(screen.getByPlaceholderText(/Current \(cents\)/i), { target: { value: 0 } });
    fireEvent.change(screen.getByPlaceholderText(/Due Date/i), { target: { value: '2026-06-01' } });

    // click Create Goal
    const createBtn = screen.getByRole('button', { name: /create goal/i });
    fireEvent.click(createBtn);

    // error message should display
    await waitFor(() => expect(screen.getByText(/Failed to save goal/i)).toBeInTheDocument());
  });

  it("handles progress edge cases: zero target and overfunded goal", async () => {
    const goals = [
      { id: 3, name: 'ZeroTarget', target_cents: 0, current_cents: 0 },
      { id: 4, name: 'Overfunded', target_cents: 50000, current_cents: 60000 }
    ];
    axios.get.mockResolvedValueOnce({ data: goals });

    render(<Goals />);

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(screen.getByText(/ZeroTarget/)).toBeInTheDocument();
    expect(screen.getByText(/0% complete/i)).toBeInTheDocument();

    expect(screen.getByText(/Overfunded/)).toBeInTheDocument();
    expect(screen.getByText(/100% complete/i)).toBeInTheDocument();
  });
});
