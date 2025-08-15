import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Categories from "../pages/Categories";
import axios from "../api/client";

jest.mock("../api/client");

describe("Categories", () => {
  it("renders and allows adding a category", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});
    render(<Categories />);
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Category Name/i), { target: { value: "Groceries" } });
    fireEvent.change(screen.getByPlaceholderText(/Parent ID/i), { target: { value: "" } });
    fireEvent.click(screen.getByText(/Add Category/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
