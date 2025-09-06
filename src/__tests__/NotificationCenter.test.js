import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import NotificationCenter from '../components/NotificationCenter';

const mockNotifications = [
  {id: 1, title: 'Alert A', body: 'Body A', read: false},
  {id: 2, title: 'Alert B', body: 'Body B', read: true},
];

beforeEach(() => {
  global.fetch = jest.fn((url, opts) => {
    if (url.endsWith('/api/notifications')) {
      return Promise.resolve({ok: true, json: () => Promise.resolve(mockNotifications)});
    }
    if (url.endsWith('/api/notifications/1/read')) {
      return Promise.resolve({ok: true, json: () => Promise.resolve({success: true})});
    }
    return Promise.resolve({ok: false, status: 404});
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders notifications and marks as read', async () => {
  render(<NotificationCenter />);

  expect(screen.getByTestId('notif-loading')).toBeInTheDocument();

  await waitFor(() => expect(screen.getByTestId('notif-list')).toBeInTheDocument());

  expect(screen.getByText('Alert A')).toBeInTheDocument();
  expect(screen.getByText('Alert B')).toBeInTheDocument();

  const markBtn = screen.getByTestId('mark-1');
  fireEvent.click(markBtn);

  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/notifications/1/read'), expect.any(Object)));
});
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
