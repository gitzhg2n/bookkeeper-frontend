import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { createTheme } from '@mui/material/styles';

// Test theme
const testTheme = createTheme();

// Mock API client for testing
export const createMockAPI = (overrides = {}) => ({
  login: jest.fn().mockResolvedValue({ 
    data: { access_token: 'test-token', user_id: 1, email: 'test@test.com' }
  }),
  register: jest.fn().mockResolvedValue({ 
    data: { access_token: 'test-token', user_id: 1, email: 'test@test.com' }
  }),
  me: jest.fn().mockResolvedValue({ 
    data: { id: 1, email: 'test@test.com' }
  }),
  getAccounts: jest.fn().mockResolvedValue({ data: [] }),
  getTransactions: jest.fn().mockResolvedValue({ data: [] }),
  getBudgets: jest.fn().mockResolvedValue({ data: [] }),
  getCategories: jest.fn().mockResolvedValue({ data: [] }),
  ...overrides
});

// Test wrapper with all providers
export function TestWrapper({ 
  children, 
  initialEntries = ['/'],
  mockAPI = createMockAPI()
}) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={testTheme}>
        <NotificationProvider>
          <AuthProvider mockAPI={mockAPI}>
            {children}
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// Custom render function
export function renderWithProviders(
  ui, 
  { initialEntries, mockAPI, ...renderOptions } = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper 
        initialEntries={initialEntries}
        mockAPI={mockAPI}
      >
        {children}
      </TestWrapper>
    ),
    ...renderOptions
  });
}

// Common test utilities
export const testUtils = {
  // Wait for loading to finish
  waitForLoadingToFinish: () => waitFor(() => 
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  ),

  // Fill out login form
  fillLoginForm: async (email = 'test@test.com', password = 'password') => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);
    return user.click(screen.getByRole('button', { name: /login/i }));
  },

  // Wait for successful login
  waitForLogin: () => waitFor(() => 
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument()
  ),

  // Check error message appears
  expectError: (message) => waitFor(() =>
    expect(screen.getByText(message)).toBeInTheDocument()
  ),

  // Mock fetch responses
  mockFetch: (responses) => {
    global.fetch = jest.fn()
      .mockImplementation((url) => {
        const response = responses[url] || responses.default;
        return Promise.resolve({
          ok: response.ok !== false,
          status: response.status || 200,
          json: () => Promise.resolve(response.data || response)
        });
      });
  },

  // Clean up mocks
  cleanup: () => {
    jest.clearAllMocks();
    if (global.fetch && global.fetch.mockRestore) {
      global.fetch.mockRestore();
    }
  }
};

// Example test file structure
export const exampleTests = {
  // Authentication tests
  login: `
    describe('LoginPage', () => {
      it('should login successfully with valid credentials', async () => {
        const mockAPI = createMockAPI();
        renderWithProviders(<LoginPage />, { mockAPI });
        
        await testUtils.fillLoginForm();
        await testUtils.waitForLogin();
        
        expect(mockAPI.login).toHaveBeenCalledWith('test@test.com', 'password');
      });

      it('should show error with invalid credentials', async () => {
        const mockAPI = createMockAPI({
          login: jest.fn().mockRejectedValue(new Error('Invalid credentials'))
        });
        renderWithProviders(<LoginPage />, { mockAPI });
        
        await testUtils.fillLoginForm();
        await testUtils.expectError('Invalid credentials');
      });
    });
  `,

  // Component tests
  accountList: `
    describe('AccountList', () => {
      it('should display accounts when loaded', async () => {
        const mockAPI = createMockAPI({
          getAccounts: jest.fn().mockResolvedValue({
            data: [
              { id: 1, name: 'Checking', balance: 100000, currency: 'USD' }
            ]
          })
        });
        
        renderWithProviders(<AccountList />, { mockAPI });
        
        await waitFor(() => {
          expect(screen.getByText('Checking')).toBeInTheDocument();
          expect(screen.getByText('$1,000.00')).toBeInTheDocument();
        });
      });
    });
  `
};

export * from '@testing-library/react';
export { userEvent };
