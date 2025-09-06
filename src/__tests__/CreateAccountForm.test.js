import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import { CreateAccountForm } from '../components/forms/ValidatedForm';

test('shows validation errors for required fields', async () => {
  const mockSubmit = jest.fn();
  render(<CreateAccountForm onSubmit={mockSubmit} loading={false} />);

  // Click submit without filling fields
  fireEvent.click(screen.getByText('Create Account'));

  await waitFor(() => expect(screen.getByText('Account name is required')).toBeInTheDocument());
  expect(screen.getByText('Account type is required')).toBeInTheDocument();
  expect(screen.getByText('Initial balance is required')).toBeInTheDocument();
});
