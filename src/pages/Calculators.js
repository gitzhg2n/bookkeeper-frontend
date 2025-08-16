import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import ErrorMessage from '../components/ErrorMessage';
import formatCurrency from '../utils/format';

const Calculators = () => {
  // Mortgage
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTermYears, setLoanTermYears] = useState('');
  const [mortgageResult, setMortgageResult] = useState(null);
  const [mortgageError, setMortgageError] = useState('');
  const [mortgageLoading, setMortgageLoading] = useState(false);

  // Debt payoff
  const [debtAmount, setDebtAmount] = useState('');
  const [debtInterestRate, setDebtInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [debtResult, setDebtResult] = useState(null);
  const [debtError, setDebtError] = useState('');
  const [debtLoading, setDebtLoading] = useState(false);

  // Investment growth
  const [initialPrincipal, setInitialPrincipal] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [investmentRate, setInvestmentRate] = useState('');
  const [yearsToGrow, setYearsToGrow] = useState('');
  const [investmentResult, setInvestmentResult] = useState(null);
  const [investmentError, setInvestmentError] = useState('');
  const [investmentLoading, setInvestmentLoading] = useState(false);

  // Rent vs Buy
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [buyInterestRate, setBuyInterestRate] = useState('');
  const [loanTermYearsBuy, setLoanTermYearsBuy] = useState('');
  const [propertyTaxRate, setPropertyTaxRate] = useState('');
  const [homeInsurance, setHomeInsurance] = useState('');
  const [maintenanceCosts, setMaintenanceCosts] = useState('');
  const [appreciationRate, setAppreciationRate] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [sellingCostsRate, setSellingCostsRate] = useState('');
  const [monthlyRentRVB, setMonthlyRentRVB] = useState('');
  const [rentersInsurance, setRentersInsurance] = useState('');
  const [annualRentIncrease, setAnnualRentIncrease] = useState('');
  const [comparisonYears, setComparisonYears] = useState('');
  const [investmentReturnRate, setInvestmentReturnRate] = useState('');
  const [rvbResult, setRvbResult] = useState(null);
  const [rvbError, setRvbError] = useState('');
  const [rvbLoading, setRvbLoading] = useState(false);

  // Tax estimator
  const [filingStatus, setFilingStatus] = useState('single');
  const [grossIncome, setGrossIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [taxResult, setTaxResult] = useState(null);
  const [taxError, setTaxError] = useState('');
  const [taxLoading, setTaxLoading] = useState(false);

  const { api } = useAuth();

  // --- NEW: Loan Comparison ---
  const [loan1Principal, setLoan1Principal] = useState('');
  const [loan1Rate, setLoan1Rate] = useState('');
  const [loan1Term, setLoan1Term] = useState('');
  const [loan1Fees, setLoan1Fees] = useState('');

  const [loan2Principal, setLoan2Principal] = useState('');
  const [loan2Rate, setLoan2Rate] = useState('');
  const [loan2Term, setLoan2Term] = useState('');
  const [loan2Fees, setLoan2Fees] = useState('');

  const [loanCompResult, setLoanCompResult] = useState(null);
  const [loanCompError, setLoanCompError] = useState('');
  const [loanCompLoading, setLoanCompLoading] = useState(false);

  // --- NEW: Affordability ---
  const [annualIncomeAff, setAnnualIncomeAff] = useState('');
  const [dtiRatio, setDtiRatio] = useState('');
  const [downPaymentAff, setDownPaymentAff] = useState('');
  const [affInterest, setAffInterest] = useState('');
  const [affTerm, setAffTerm] = useState('30');
  const [otherDebtsAff, setOtherDebtsAff] = useState('');
  const [affordResult, setAffordResult] = useState(null);
  const [affordError, setAffordError] = useState('');
  const [affordLoading, setAffordLoading] = useState(false);

  // --- NEW: Credit Optimization ---
  const [card1Bal, setCard1Bal] = useState('');
  const [card1APR, setCard1APR] = useState('');
  const [card1Min, setCard1Min] = useState('');
  const [card2Bal, setCard2Bal] = useState('');
  const [card2APR, setCard2APR] = useState('');
  const [card2Min, setCard2Min] = useState('');
  const [creditOptResult, setCreditOptResult] = useState(null);
  const [creditOptError, setCreditOptError] = useState('');
  const [creditOptLoading, setCreditOptLoading] = useState(false);

  // --- NEW: College Savings ---
  const [csCurrent, setCsCurrent] = useState('');
  const [csTuition, setCsTuition] = useState('');
  const [csInflation, setCsInflation] = useState('');
  const [csReturn, setCsReturn] = useState('');
  const [csYears, setCsYears] = useState('');
  const [csResult, setCsResult] = useState(null);
  const [csError, setCsError] = useState('');
  const [csLoading, setCsLoading] = useState(false);

  // --- NEW: Fee Drag ---
  const [fdInitial, setFdInitial] = useState('');
  const [fdAnnual, setFdAnnual] = useState('');
  const [fdReturn, setFdReturn] = useState('');
  const [fdFee, setFdFee] = useState('');
  const [fdYears, setFdYears] = useState('');
  const [fdResult, setFdResult] = useState(null);
  const [fdError, setFdError] = useState('');
  const [fdLoading, setFdLoading] = useState(false);

  // --- NEW: Safe Withdrawal ---
  const [swInitial, setSwInitial] = useState('');
  const [swRate, setSwRate] = useState('4');
  const [swReturn, setSwReturn] = useState('');
  const [swYears, setSwYears] = useState('');
  const [swResult, setSwResult] = useState(null);
  const [swError, setSwError] = useState('');
  const [swLoading, setSwLoading] = useState(false);

  // --- NEW: CD Ladder ---
  const [cdTotal, setCdTotal] = useState('');
  const [cdRungs, setCdRungs] = useState('5');
  const [cdBaseRate, setCdBaseRate] = useState('2');
  const [cdResult, setCdResult] = useState(null);
  const [cdError, setCdError] = useState('');
  const [cdLoading, setCdLoading] = useState(false);

  // --- NEW: Payroll ---
  const [payGross, setPayGross] = useState('');
  const [payPeriods, setPayPeriods] = useState('24');
  const [payFed, setPayFed] = useState('12');
  const [payState, setPayState] = useState('5');
  const [payPreTax, setPayPreTax] = useState('');
  const [payResult, setPayResult] = useState(null);
  const [payError, setPayError] = useState('');
  const [payLoading, setPayLoading] = useState(false);

  // --- NEW: Currency Convert ---
  const [ccAmount, setCcAmount] = useState('');
  const [ccRate, setCcRate] = useState('');
  const [ccResult, setCcResult] = useState(null);
  const [ccError, setCcError] = useState('');
  const [ccLoading, setCcLoading] = useState(false);

  const handleMortgage = async (e) => {
    e.preventDefault();
    setMortgageError('');
    setMortgageResult(null);
    // basic validation
    if (!loanAmount || !interestRate || !loanTermYears) {
      setMortgageError('Please fill out all required fields.');
      return;
    }
    setMortgageLoading(true);
    try {
      const resp = await api.request('/v1/calculators/mortgage', {
        method: 'POST',
        body: JSON.stringify({
          loan_amount: parseFloat(loanAmount),
          interest_rate: parseFloat(interestRate),
          loan_term_years: parseInt(loanTermYears, 10),
        }),
      });
      setMortgageResult(resp.data);
    } catch (err) {
      setMortgageError(err.message);
    }
    setMortgageLoading(false);
  };

  const handleDebt = async (e) => {
    e.preventDefault();
    setDebtError('');
    setDebtResult(null);
    if (!debtAmount || !debtInterestRate || !monthlyPayment) {
      setDebtError('Please fill out all required fields.');
      return;
    }
    setDebtLoading(true);
    try {
  const resp = await api.request('/v1/calculators/debt-payoff', {
        method: 'POST',
        body: JSON.stringify({
          debt_amount: parseFloat(debtAmount),
          interest_rate: parseFloat(debtInterestRate),
          monthly_payment: parseFloat(monthlyPayment),
        }),
      });
      setDebtResult(resp.data);
    } catch (err) {
      setDebtError(err.message);
    }
    setDebtLoading(false);
  };

  const handleInvestment = async (e) => {
    e.preventDefault();
    setInvestmentError('');
    setInvestmentResult(null);
    if (!monthlyContribution || !investmentRate || !yearsToGrow) {
      setInvestmentError('Please fill out all required fields.');
      return;
    }
    setInvestmentLoading(true);
    try {
  const resp = await api.request('/v1/calculators/investment-growth', {
        method: 'POST',
        body: JSON.stringify({
          initial_principal: parseFloat(initialPrincipal) || 0,
          monthly_contribution: parseFloat(monthlyContribution),
          interest_rate: parseFloat(investmentRate),
          years_to_grow: parseInt(yearsToGrow, 10),
        }),
      });
      setInvestmentResult(resp.data);
    } catch (err) {
      setInvestmentError(err.message);
    }
    setInvestmentLoading(false);
  };

  const handleRentVsBuy = async (e) => {
    e.preventDefault();
    setRvbError('');
    setRvbResult(null);
    // compress basic validation
    if (!homePrice || !downPayment || !buyInterestRate || !loanTermYearsBuy || !monthlyRentRVB || !comparisonYears) {
      setRvbError('Please fill out all required fields.');
      return;
    }
    setRvbLoading(true);
    try {
      const resp = await api.request('/v1/calculators/rent-vs-buy', {
        method: 'POST',
        body: JSON.stringify({
          home_price: parseFloat(homePrice),
          down_payment: parseFloat(downPayment),
          interest_rate: parseFloat(buyInterestRate),
          loan_term_years: parseInt(loanTermYearsBuy, 10),
          property_tax_rate: parseFloat(propertyTaxRate),
          home_insurance: parseFloat(homeInsurance),
          maintenance_costs: parseFloat(maintenanceCosts),
          appreciation_rate: parseFloat(appreciationRate),
          closing_costs: parseFloat(closingCosts),
          selling_costs_rate: parseFloat(sellingCostsRate),
          monthly_rent: parseFloat(monthlyRentRVB),
          renters_insurance: parseFloat(rentersInsurance),
          annual_rent_increase: parseFloat(annualRentIncrease),
          comparison_years: parseInt(comparisonYears, 10),
          investment_return_rate: parseFloat(investmentReturnRate),
        }),
      });
      setRvbResult(resp.data);
    } catch (err) {
      setRvbError(err.message);
    }
    setRvbLoading(false);
  };

  const handleTaxEstimator = async (e) => {
    e.preventDefault();
    setTaxError('');
    setTaxResult(null);
    if (!grossIncome) {
      setTaxError('Please enter gross income.');
      return;
    }
    setTaxLoading(true);
    try {
      const resp = await api.request('/v1/calculators/tax-estimator', {
        method: 'POST',
        body: JSON.stringify({
          filing_status: filingStatus,
          gross_income: parseFloat(grossIncome),
          deductions: parseFloat(deductions) || 0,
        }),
      });
      setTaxResult(resp.data);
    } catch (err) {
      setTaxError(err.message);
    }
    setTaxLoading(false);
  };

  // --- Handlers for new calculators ---
  const handleLoanComparison = async (e) => {
    e.preventDefault();
    setLoanCompError('');
    setLoanCompResult(null);
    if (!loan1Principal || !loan1Rate || !loan1Term || !loan2Principal || !loan2Rate || !loan2Term) {
      setLoanCompError('Please fill out both loan offers.');
      return;
    }
    setLoanCompLoading(true);
    try {
      const resp = await api.request('/v1/calculators/loan-comparison', {
        method: 'POST',
        body: JSON.stringify({
          offers: [
            { principal: parseFloat(loan1Principal), interest_rate: parseFloat(loan1Rate), term_years: parseInt(loan1Term, 10), fees: parseFloat(loan1Fees) || 0 },
            { principal: parseFloat(loan2Principal), interest_rate: parseFloat(loan2Rate), term_years: parseInt(loan2Term, 10), fees: parseFloat(loan2Fees) || 0 },
          ],
        }),
      });
      setLoanCompResult(resp.data);
    } catch (err) {
      setLoanCompError(err.message);
    }
    setLoanCompLoading(false);
  };

  const handleAffordability = async (e) => {
    e.preventDefault();
    setAffordError('');
    setAffordResult(null);
    if (!annualIncomeAff || !dtiRatio || !affInterest || !affTerm) {
      setAffordError('Please fill required fields.');
      return;
    }
    setAffordLoading(true);
    try {
      const resp = await api.request('/v1/calculators/affordability', {
        method: 'POST',
        body: JSON.stringify({
          annual_income: parseFloat(annualIncomeAff),
          dti_ratio: parseFloat(dtiRatio),
          down_payment: parseFloat(downPaymentAff) || 0,
          interest_rate: parseFloat(affInterest),
          loan_term_years: parseInt(affTerm, 10),
          other_monthly_debts: parseFloat(otherDebtsAff) || 0,
        }),
      });
      setAffordResult(resp.data);
    } catch (err) {
      setAffordError(err.message);
    }
    setAffordLoading(false);
  };

  const handleCreditOpt = async (e) => {
    e.preventDefault();
    setCreditOptError('');
    setCreditOptResult(null);
    if (!card1Bal || !card1APR || !card1Min) {
      setCreditOptError('Please enter at least one card.');
      return;
    }
    setCreditOptLoading(true);
    try {
      const cards = [];
      cards.push({ balance: parseFloat(card1Bal), apr: parseFloat(card1APR), min_payment: parseFloat(card1Min) });
      if (card2Bal && card2APR && card2Min) {
        cards.push({ balance: parseFloat(card2Bal), apr: parseFloat(card2APR), min_payment: parseFloat(card2Min) });
      }
      const resp = await api.request('/v1/calculators/credit-optimization', {
        method: 'POST',
        body: JSON.stringify({ cards, extra_monthly: 0 }),
      });
      setCreditOptResult(resp.data);
    } catch (err) {
      setCreditOptError(err.message);
    }
    setCreditOptLoading(false);
  };

  const handleCollegeSavings = async (e) => {
    e.preventDefault();
    setCsError('');
    setCsResult(null);
    if (!csTuition || !csYears) {
      setCsError('Please fill required fields.');
      return;
    }
    setCsLoading(true);
    try {
      const resp = await api.request('/v1/calculators/college-savings', {
        method: 'POST',
        body: JSON.stringify({ current_balance: parseFloat(csCurrent) || 0, annual_tuition: parseFloat(csTuition), tuition_inflation: parseFloat(csInflation) || 0, annual_return: parseFloat(csReturn) || 0, years_until_college: parseInt(csYears, 10) }),
      });
      setCsResult(resp.data);
    } catch (err) {
      setCsError(err.message);
    }
    setCsLoading(false);
  };

  const handleFeeDrag = async (e) => {
    e.preventDefault();
    setFdError('');
    setFdResult(null);
    if (!fdInitial || !fdAnnual || !fdReturn || !fdFee || !fdYears) {
      setFdError('Please fill required fields.');
      return;
    }
    setFdLoading(true);
    try {
      const resp = await api.request('/v1/calculators/fee-drag', {
        method: 'POST',
        body: JSON.stringify({ initial: parseFloat(fdInitial), annual_contribution: parseFloat(fdAnnual), gross_return: parseFloat(fdReturn), fee_percent: parseFloat(fdFee), years: parseInt(fdYears, 10) }),
      });
      setFdResult(resp.data);
    } catch (err) {
      setFdError(err.message);
    }
    setFdLoading(false);
  };

  const handleSafeWithdrawal = async (e) => {
    e.preventDefault();
    setSwError('');
    setSwResult(null);
    if (!swInitial || !swRate || !swReturn || !swYears) {
      setSwError('Please fill required fields.');
      return;
    }
    setSwLoading(true);
    try {
      const resp = await api.request('/v1/calculators/safe-withdrawal', {
        method: 'POST',
        body: JSON.stringify({ initial: parseFloat(swInitial), withdrawal_rate: parseFloat(swRate), annual_return: parseFloat(swReturn), years: parseInt(swYears, 10) }),
      });
      setSwResult(resp.data);
    } catch (err) {
      setSwError(err.message);
    }
    setSwLoading(false);
  };

  const handleCDLadder = async (e) => {
    e.preventDefault();
    setCdError('');
    setCdResult(null);
    if (!cdTotal || !cdRungs || !cdBaseRate) {
      setCdError('Please fill required fields.');
      return;
    }
    setCdLoading(true);
    try {
      const resp = await api.request('/v1/calculators/cd-ladder', {
        method: 'POST',
        body: JSON.stringify({ total_amount: parseFloat(cdTotal), rungs: parseInt(cdRungs, 10), base_rate: parseFloat(cdBaseRate) }),
      });
      setCdResult(resp.data);
    } catch (err) {
      setCdError(err.message);
    }
    setCdLoading(false);
  };

  const handlePayroll = async (e) => {
    e.preventDefault();
    setPayError('');
    setPayResult(null);
    if (!payGross || !payPeriods) {
      setPayError('Please fill required fields.');
      return;
    }
    setPayLoading(true);
    try {
      const resp = await api.request('/v1/calculators/payroll', {
        method: 'POST',
        body: JSON.stringify({ gross_annual: parseFloat(payGross), pay_periods: parseInt(payPeriods, 10), federal_rate: parseFloat(payFed) || 0, state_rate: parseFloat(payState) || 0, pre_tax: parseFloat(payPreTax) || 0 }),
      });
      setPayResult(resp.data);
    } catch (err) {
      setPayError(err.message);
    }
    setPayLoading(false);
  };

  const handleConvertCurrency = async (e) => {
    e.preventDefault();
    setCcError('');
    setCcResult(null);
    if (!ccAmount || !ccRate) {
      setCcError('Please fill required fields.');
      return;
    }
    setCcLoading(true);
    try {
      const resp = await api.request('/v1/calculators/convert-currency', {
        method: 'POST',
        body: JSON.stringify({ amount: parseFloat(ccAmount), rate: parseFloat(ccRate) }),
      });
      setCcResult(resp.data);
    } catch (err) {
      setCcError(err.message);
    }
    setCcLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Financial Calculators</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mortgage */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Mortgage Calculator</h2>
          <form onSubmit={handleMortgage}>
            <FormInput label="Loan Amount ($)" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} required />
            <FormInput label="Annual Interest Rate (%)" type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} required />
            <FormInput label="Loan Term (Years)" type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} required />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={mortgageLoading}>{mortgageLoading ? 'Calculating...' : 'Calculate'}</button>
            </div>
          </form>
          {mortgageResult && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <strong>Monthly payment: </strong>{formatCurrency(mortgageResult.monthly_payment)}
            </div>
          )}
          {mortgageError && <ErrorMessage message={mortgageError} />}
        </div>

        {/* Debt Payoff */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Debt Payoff Calculator</h2>
          <form onSubmit={handleDebt}>
            <FormInput label="Debt Amount ($)" type="number" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)} required />
            <FormInput label="Annual Interest Rate (%)" type="number" step="0.01" value={debtInterestRate} onChange={(e) => setDebtInterestRate(e.target.value)} required />
            <FormInput label="Monthly Payment ($)" type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} required />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={debtLoading}>{debtLoading ? 'Calculating...' : 'Calculate'}</button>
            </div>
          </form>
          {debtResult && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <div><strong>Months to pay off:</strong> {debtResult.months_to_pay_off}</div>
              <div><strong>Total interest:</strong> {formatCurrency(debtResult.total_interest_paid)}</div>
            </div>
          )}
          {debtError && <ErrorMessage message={debtError} />}
        </div>

        {/* Investment Growth */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Investment Growth Projector</h2>
          <form onSubmit={handleInvestment}>
            <FormInput label="Initial Principal ($)" type="number" value={initialPrincipal} onChange={(e) => setInitialPrincipal(e.target.value)} />
            <FormInput label="Monthly Contribution ($)" type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} required />
            <FormInput label="Annual Return (%)" type="number" step="0.01" value={investmentRate} onChange={(e) => setInvestmentRate(e.target.value)} required />
            <FormInput label="Years to Grow" type="number" value={yearsToGrow} onChange={(e) => setYearsToGrow(e.target.value)} required />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={investmentLoading}>{investmentLoading ? 'Projecting...' : 'Project'}</button>
            </div>
          </form>
          {investmentResult && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <div><strong>Future value:</strong> {formatCurrency(investmentResult.future_value)}</div>
              <div><strong>Total contributions:</strong> {formatCurrency(investmentResult.total_contributions)}</div>
              <div><strong>Total interest:</strong> {formatCurrency(investmentResult.total_interest_earned)}</div>
            </div>
          )}
          {investmentError && <ErrorMessage message={investmentError} />}
        </div>

        {/* Placeholders for Rent vs Buy and Tax Estimator */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Rent vs Buy</h2>
          <form onSubmit={handleRentVsBuy}>
            <h3 className="font-semibold">Buying</h3>
            <FormInput label="Home Price ($)" type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} required />
            <FormInput label="Down Payment ($)" type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} required />
            <FormInput label="Mortgage Interest Rate (%)" type="number" step="0.01" value={buyInterestRate} onChange={(e) => setBuyInterestRate(e.target.value)} required />
            <FormInput label="Loan Term (Years)" type="number" value={loanTermYearsBuy} onChange={(e) => setLoanTermYearsBuy(e.target.value)} required />
            <FormInput label="Property Tax Rate (%)" type="number" step="0.01" value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(e.target.value)} required />
            <FormInput label="Annual Home Insurance ($)" type="number" value={homeInsurance} onChange={(e) => setHomeInsurance(e.target.value)} required />
            <FormInput label="Annual Maintenance ($)" type="number" value={maintenanceCosts} onChange={(e) => setMaintenanceCosts(e.target.value)} required />
            <FormInput label="Annual Appreciation (%)" type="number" step="0.01" value={appreciationRate} onChange={(e) => setAppreciationRate(e.target.value)} required />
            <FormInput label="Closing Costs ($)" type="number" value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} required />
            <FormInput label="Selling Costs (%) of sale" type="number" step="0.01" value={sellingCostsRate} onChange={(e) => setSellingCostsRate(e.target.value)} required />

            <h3 className="font-semibold mt-3">Renting</h3>
            <FormInput label="Monthly Rent ($)" type="number" value={monthlyRentRVB} onChange={(e) => setMonthlyRentRVB(e.target.value)} required />
            <FormInput label="Annual Renters Insurance ($)" type="number" value={rentersInsurance} onChange={(e) => setRentersInsurance(e.target.value)} required />
            <FormInput label="Annual Rent Increase (%)" type="number" step="0.01" value={annualRentIncrease} onChange={(e) => setAnnualRentIncrease(e.target.value)} required />

            <h3 className="font-semibold mt-3">Comparison</h3>
            <FormInput label="Comparison Years" type="number" value={comparisonYears} onChange={(e) => setComparisonYears(e.target.value)} required />
            <FormInput label="Investment Return Rate (%)" type="number" step="0.01" value={investmentReturnRate} onChange={(e) => setInvestmentReturnRate(e.target.value)} required />

            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={rvbLoading}>{rvbLoading ? 'Comparing...' : 'Compare'}</button>
            </div>
          </form>
          {rvbResult && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <div><strong>Total cost of owning:</strong> {formatCurrency(rvbResult.total_cost_of_owning)}</div>
              <div><strong>Total cost of renting:</strong> {formatCurrency(rvbResult.total_cost_of_renting)}</div>
              <div><strong>Net benefit of owning:</strong> {formatCurrency(rvbResult.net_benefit_of_owning)}</div>
              <div><strong>Recommendation:</strong> {rvbResult.recommendation}</div>
            </div>
          )}
          {rvbError && <ErrorMessage message={rvbError} />}
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Tax Estimator</h2>
          <form onSubmit={handleTaxEstimator}>
            <label className="block mb-2">Filing Status</label>
            <select className="form-select mb-3" value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)}>
              <option value="single">Single</option>
              <option value="married_jointly">Married filing jointly</option>
              <option value="married_separately">Married filing separately</option>
              <option value="head_of_household">Head of household</option>
            </select>
            <FormInput label="Gross Income ($)" type="number" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} required />
            <FormInput label="Deductions ($)" type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={taxLoading}>{taxLoading ? 'Estimating...' : 'Estimate'}</button>
            </div>
          </form>
          {taxResult && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <div><strong>Total tax:</strong> {formatCurrency(taxResult.total_tax_amount)}</div>
              <div><strong>Effective tax rate:</strong> {(taxResult.effective_tax_rate * 100).toFixed(2)}%</div>
            </div>
          )}
          {taxError && <ErrorMessage message={taxError} />}
        </div>

        {/* Loan Comparison */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Loan Comparison</h2>
          <form onSubmit={handleLoanComparison}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Offer A</h4>
                <FormInput label="Principal ($)" type="number" value={loan1Principal} onChange={(e) => setLoan1Principal(e.target.value)} />
                <FormInput label="Interest Rate (%)" type="number" step="0.01" value={loan1Rate} onChange={(e) => setLoan1Rate(e.target.value)} />
                <FormInput label="Term (years)" type="number" value={loan1Term} onChange={(e) => setLoan1Term(e.target.value)} />
                <FormInput label="Fees ($)" type="number" value={loan1Fees} onChange={(e) => setLoan1Fees(e.target.value)} />
              </div>
              <div>
                <h4 className="font-semibold">Offer B</h4>
                <FormInput label="Principal ($)" type="number" value={loan2Principal} onChange={(e) => setLoan2Principal(e.target.value)} />
                <FormInput label="Interest Rate (%)" type="number" step="0.01" value={loan2Rate} onChange={(e) => setLoan2Rate(e.target.value)} />
                <FormInput label="Term (years)" type="number" value={loan2Term} onChange={(e) => setLoan2Term(e.target.value)} />
                <FormInput label="Fees ($)" type="number" value={loan2Fees} onChange={(e) => setLoan2Fees(e.target.value)} />
              </div>
            </div>
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={loanCompLoading}>{loanCompLoading ? 'Comparing...' : 'Compare Loans'}</button>
            </div>
          </form>
          {loanCompError && <ErrorMessage message={loanCompError} />}
          {loanCompResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Winner: {loanCompResult.winner || '—'}</div>
              <div>Monthly payment difference: {typeof loanCompResult.monthly_payment_delta === 'number' ? `${formatCurrency(Math.abs(loanCompResult.monthly_payment_delta))} ${loanCompResult.monthly_payment_delta < 0 ? 'cheaper' : 'more expensive'}` : '—'}</div>
            </div>
          )}
        </div>

        {/* Affordability */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Mortgage Affordability</h2>
          <form onSubmit={handleAffordability}>
            <FormInput label="Annual Income ($)" type="number" value={annualIncomeAff} onChange={(e) => setAnnualIncomeAff(e.target.value)} />
            <FormInput label="DTI Ratio (%)" type="number" step="0.1" value={dtiRatio} onChange={(e) => setDtiRatio(e.target.value)} />
            <FormInput label="Down Payment ($)" type="number" value={downPaymentAff} onChange={(e) => setDownPaymentAff(e.target.value)} />
            <FormInput label="Interest Rate (%)" type="number" step="0.01" value={affInterest} onChange={(e) => setAffInterest(e.target.value)} />
            <FormInput label="Loan Term (years)" type="number" value={affTerm} onChange={(e) => setAffTerm(e.target.value)} />
            <FormInput label="Other Monthly Debts ($)" type="number" value={otherDebtsAff} onChange={(e) => setOtherDebtsAff(e.target.value)} />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={affordLoading}>{affordLoading ? 'Calculating...' : 'Calculate Affordability'}</button>
            </div>
          </form>
          {affordError && <ErrorMessage message={affordError} />}
          {affordResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Max loan: {affordResult.max_loan ? formatCurrency(affordResult.max_loan) : '—'}</div>
              <div>Estimated monthly payment: {affordResult.monthly_payment ? formatCurrency(affordResult.monthly_payment) : '—'}</div>
            </div>
          )}
        </div>

        {/* Credit Optimization */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Credit Optimization</h2>
          <form onSubmit={handleCreditOpt}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Card 1</h4>
                <FormInput label="Balance ($)" type="number" value={card1Bal} onChange={(e) => setCard1Bal(e.target.value)} />
                <FormInput label="APR (%)" type="number" step="0.01" value={card1APR} onChange={(e) => setCard1APR(e.target.value)} />
                <FormInput label="Min Payment ($)" type="number" value={card1Min} onChange={(e) => setCard1Min(e.target.value)} />
              </div>
              <div>
                <h4 className="font-semibold">Card 2 (optional)</h4>
                <FormInput label="Balance ($)" type="number" value={card2Bal} onChange={(e) => setCard2Bal(e.target.value)} />
                <FormInput label="APR (%)" type="number" step="0.01" value={card2APR} onChange={(e) => setCard2APR(e.target.value)} />
                <FormInput label="Min Payment ($)" type="number" value={card2Min} onChange={(e) => setCard2Min(e.target.value)} />
              </div>
            </div>
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={creditOptLoading}>{creditOptLoading ? 'Analyzing...' : 'Optimize'}</button>
            </div>
          </form>
          {creditOptError && <ErrorMessage message={creditOptError} />}
          {creditOptResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Recommended payoff order</div>
              <ol className="list-decimal list-inside">
                {(creditOptResult.pay_off_order || []).map((n, i) => <li key={i}>{n}</li>)}
              </ol>
            </div>
          )}
        </div>

        {/* College Savings */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">College Savings Planner</h2>
          <form onSubmit={handleCollegeSavings}>
            <FormInput label="Current Balance ($)" type="number" value={csCurrent} onChange={(e) => setCsCurrent(e.target.value)} />
            <FormInput label="Annual Tuition Today ($)" type="number" value={csTuition} onChange={(e) => setCsTuition(e.target.value)} required />
            <FormInput label="Tuition Inflation (%)" type="number" step="0.01" value={csInflation} onChange={(e) => setCsInflation(e.target.value)} />
            <FormInput label="Expected Return (%)" type="number" step="0.01" value={csReturn} onChange={(e) => setCsReturn(e.target.value)} />
            <FormInput label="Years Until College" type="number" value={csYears} onChange={(e) => setCsYears(e.target.value)} required />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={csLoading}>{csLoading ? 'Calculating...' : 'Plan Savings'}</button>
            </div>
          </form>
          {csError && <ErrorMessage message={csError} />}
          {csResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Target amount: {csResult.target_amount ? formatCurrency(csResult.target_amount) : '—'}</div>
              <div>Monthly needed: {csResult.monthly_needed ? formatCurrency(csResult.monthly_needed) : '—'}</div>
            </div>
          )}
        </div>

        {/* Fee Drag */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Investment Fee Drag</h2>
          <form onSubmit={handleFeeDrag}>
            <FormInput label="Initial Amount ($)" type="number" value={fdInitial} onChange={(e) => setFdInitial(e.target.value)} />
            <FormInput label="Annual Contribution ($)" type="number" value={fdAnnual} onChange={(e) => setFdAnnual(e.target.value)} />
            <FormInput label="Gross Return (%)" type="number" step="0.01" value={fdReturn} onChange={(e) => setFdReturn(e.target.value)} />
            <FormInput label="Fee (%)" type="number" step="0.01" value={fdFee} onChange={(e) => setFdFee(e.target.value)} />
            <FormInput label="Years" type="number" value={fdYears} onChange={(e) => setFdYears(e.target.value)} />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={fdLoading}>{fdLoading ? 'Calculating...' : 'Calculate Drag'}</button>
            </div>
          </form>
          {fdError && <ErrorMessage message={fdError} />}
          {fdResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Fee drag summary</div>
              <div>Final value (with fees): {fdResult.final_with_fees ? formatCurrency(fdResult.final_with_fees) : '—'}</div>
              <div>Final value (no fees): {fdResult.final_without_fees ? formatCurrency(fdResult.final_without_fees) : '—'}</div>
              <div>Estimated drag: {fdResult.drag ? formatCurrency(fdResult.drag) : '—'}</div>
            </div>
          )}
        </div>

        {/* Safe Withdrawal */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Safe Withdrawal</h2>
          <form onSubmit={handleSafeWithdrawal}>
            <FormInput label="Initial Portfolio ($)" type="number" value={swInitial} onChange={(e) => setSwInitial(e.target.value)} />
            <FormInput label="Withdrawal Rate (%)" type="number" step="0.01" value={swRate} onChange={(e) => setSwRate(e.target.value)} />
            <FormInput label="Expected Return (%)" type="number" step="0.01" value={swReturn} onChange={(e) => setSwReturn(e.target.value)} />
            <FormInput label="Years" type="number" value={swYears} onChange={(e) => setSwYears(e.target.value)} />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={swLoading}>{swLoading ? 'Calculating...' : 'Estimate'}</button>
            </div>
          </form>
          {swError && <ErrorMessage message={swError} />}
          {swResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Safe withdrawal estimate</div>
              <div>Sustainable annual withdrawal: {swResult.sustainable_withdrawal ? formatCurrency(swResult.sustainable_withdrawal) : '—'}</div>
              <div>Estimated years supported: {swResult.years_supported ?? '—'}</div>
            </div>
          )}
        </div>

        {/* CD Ladder */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">CD Ladder</h2>
          <form onSubmit={handleCDLadder}>
            <FormInput label="Total Amount ($)" type="number" value={cdTotal} onChange={(e) => setCdTotal(e.target.value)} />
            <FormInput label="Rungs" type="number" value={cdRungs} onChange={(e) => setCdRungs(e.target.value)} />
            <FormInput label="Base Rate (%)" type="number" step="0.01" value={cdBaseRate} onChange={(e) => setCdBaseRate(e.target.value)} />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={cdLoading}>{cdLoading ? 'Calculating...' : 'Build Ladder'}</button>
            </div>
          </form>
          {cdError && <ErrorMessage message={cdError} />}
          {cdResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">CD Ladder</div>
              <div className="mt-2">
                {(cdResult.ladder || []).length > 0 ? (
                  <ul className="list-disc list-inside">
                    {(cdResult.ladder || []).map((r, i) => (
                      <li key={i}>{r.term_months ? `${r.term_months} mo` : r.term || 'term'} — {r.amount ? formatCurrency(r.amount) : '—'}</li>
                    ))}
                  </ul>
                ) : (
                  <div>No ladder data returned.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payroll */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Payroll Estimator</h2>
          <form onSubmit={handlePayroll}>
            <FormInput label="Gross Annual ($)" type="number" value={payGross} onChange={(e) => setPayGross(e.target.value)} />
            <FormInput label="Pay Periods Per Year" type="number" value={payPeriods} onChange={(e) => setPayPeriods(e.target.value)} />
            <FormInput label="Federal Tax Rate (%)" type="number" step="0.01" value={payFed} onChange={(e) => setPayFed(e.target.value)} />
            <FormInput label="State Tax Rate (%)" type="number" step="0.01" value={payState} onChange={(e) => setPayState(e.target.value)} />
            <FormInput label="Pre-tax Deductions ($)" type="number" value={payPreTax} onChange={(e) => setPayPreTax(e.target.value)} />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={payLoading}>{payLoading ? 'Calculating...' : 'Estimate Take-home'}</button>
            </div>
          </form>
          {payError && <ErrorMessage message={payError} />}
          {payResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Payroll estimate</div>
              <div>Net per period: {payResult.net_per_period ? formatCurrency(payResult.net_per_period) : '—'}</div>
              <div>Estimated annual net: {payResult.annual_net ? formatCurrency(payResult.annual_net) : '—'}</div>
            </div>
          )}
        </div>

        {/* Currency Convert */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Currency Convert</h2>
          <form onSubmit={handleConvertCurrency}>
            <FormInput label="Amount" type="number" value={ccAmount} onChange={(e) => setCcAmount(e.target.value)} />
            <FormInput label="Exchange Rate" type="number" step="0.0001" value={ccRate} onChange={(e) => setCcRate(e.target.value)} />
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={ccLoading}>{ccLoading ? 'Converting...' : 'Convert'}</button>
            </div>
          </form>
          {ccError && <ErrorMessage message={ccError} />}
          {ccResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <div className="font-semibold">Currency conversion</div>
              <div>Converted amount: {ccResult.converted_amount ? formatCurrency(ccResult.converted_amount) : '—'}</div>
              <div>Rate used: {ccResult.rate ? Number(ccResult.rate).toFixed(6) : (ccRate ? Number(ccRate).toFixed(6) : '—')}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Calculators;
