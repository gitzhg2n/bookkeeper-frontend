import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Calculators from '../pages/Calculators';

// Mock AuthContext to provide api.request
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    api: {
      request: jest.fn((path) => {
        if (path.includes('mortgage')) return Promise.resolve({ data: { monthly_payment: 1500 } });
        if (path.includes('debt-payoff')) return Promise.resolve({ data: { months_to_pay_off: 24, total_interest_paid: 200 } });
        if (path.includes('investment-growth')) return Promise.resolve({ data: { future_value: 10000, total_contributions: 5000, total_interest_earned: 5000 } });
        if (path.includes('rent-vs-buy')) return Promise.resolve({ data: { total_cost_of_owning: 100000, total_cost_of_renting: 90000, net_benefit_of_owning: 10000, recommendation: 'Buy' } });
        if (path.includes('tax-estimator')) return Promise.resolve({ data: { total_tax_amount: 12000, effective_tax_rate: 0.12 } });
  if (path.includes('loan-comparison')) return Promise.resolve({ data: { winner: 'Offer A', monthly_payment_delta: -50 } });
  if (path.includes('affordability')) return Promise.resolve({ data: { max_loan: 350000, monthly_payment: 1500 } });
  if (path.includes('credit-optimization')) return Promise.resolve({ data: { pay_off_order: ['Card 2', 'Card 1'] } });
  if (path.includes('college-savings')) return Promise.resolve({ data: { target_amount: 200000, monthly_needed: 500 } });
  if (path.includes('fee-drag')) return Promise.resolve({ data: { final_with_fees: 95000, final_without_fees: 100000, drag: 5000 } });
  if (path.includes('safe-withdrawal')) return Promise.resolve({ data: { sustainable_withdrawal: 40000, years_supported: 30 } });
  if (path.includes('cd-ladder')) return Promise.resolve({ data: { ladder: [{ term_months: 12, amount: 20000 }, { term_months: 24, amount: 20000 }] } });
  if (path.includes('payroll')) return Promise.resolve({ data: { net_per_period: 2500, annual_net: 60000 } });
  if (path.includes('convert-currency')) return Promise.resolve({ data: { converted_amount: 850, rate: 0.85 } });
        return Promise.resolve({ data: {} });
      }),
    },
  }),
}));

describe('Calculators page', () => {
  it('calculates mortgage, debt, investment, rent vs buy, and tax flows', async () => {
    render(<Calculators />);

    // Mortgage
    fireEvent.change(screen.getByLabelText(/Loan Amount/i), { target: { value: '200000' } });
    fireEvent.change(screen.getByLabelText(/Annual Interest Rate/i), { target: { value: '3.5' } });
    fireEvent.change(screen.getByLabelText(/Loan Term/i), { target: { value: '30' } });
    fireEvent.click(screen.getByText(/Calculate/i));
    await waitFor(() => screen.getByText(/Monthly payment/i));

    // Debt
    fireEvent.change(screen.getByLabelText(/Debt Amount/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/^Annual Interest Rate/i), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText(/Monthly Payment/i), { target: { value: '250' } });
    fireEvent.click(screen.getAllByText(/Calculate/i)[1]);
    await waitFor(() => screen.getByText(/Months to pay off/i));

    // Investment
    fireEvent.change(screen.getByLabelText(/Monthly Contribution/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/Annual Return/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Years to Grow/i), { target: { value: '10' } });
    fireEvent.click(screen.getByText(/Project/i));
    await waitFor(() => screen.getByText(/Future value/i));

    // Rent vs Buy - minimal fields
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '300000' } });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '60000' } });
    fireEvent.change(screen.getByLabelText(/Mortgage Interest Rate/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Loan Term/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText(/Comparison Years/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Investment Return Rate/i), { target: { value: '5' } });
    fireEvent.click(screen.getByText(/Compare/i));
    await waitFor(() => screen.getByText(/Total cost of owning/i));

    // Tax estimator
    fireEvent.change(screen.getByLabelText(/Gross Income/i), { target: { value: '100000' } });
    fireEvent.click(screen.getByText(/Estimate/i));
    await waitFor(() => screen.getByText(/Total tax/i));

  // Loan comparison
  fireEvent.change(screen.getByLabelText(/Offer A.*Principal/i), { target: { value: '200000' } });
  fireEvent.change(screen.getByLabelText(/Offer A.*Interest Rate/i), { target: { value: '3.5' } });
  fireEvent.change(screen.getByLabelText(/Offer A.*Term/i), { target: { value: '30' } });
  fireEvent.change(screen.getByLabelText(/Offer B.*Principal/i), { target: { value: '200000' } });
  fireEvent.change(screen.getByLabelText(/Offer B.*Interest Rate/i), { target: { value: '4.0' } });
  fireEvent.change(screen.getByLabelText(/Offer B.*Term/i), { target: { value: '30' } });
  fireEvent.click(screen.getByText(/Compare Loans/i));
  await waitFor(() => screen.getByText(/winner/i));

  // Affordability
  fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '90000' } });
  fireEvent.change(screen.getByLabelText(/DTI Ratio/i), { target: { value: '36' } });
  fireEvent.change(screen.getByLabelText(/Interest Rate.*Affordability/i), { target: { value: '4' } });
  fireEvent.click(screen.getByText(/Calculate Affordability/i));
  await waitFor(() => screen.getByText(/Max loan/i));
  }, 20000);
});
