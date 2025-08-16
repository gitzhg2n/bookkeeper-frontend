describe('Calculators e2e', () => {
  beforeEach(() => {
    // intercept calculator API calls and provide deterministic responses
    cy.intercept('POST', '/v1/calculators/mortgage', (req) => {
      req.reply({ statusCode: 200, body: { data: { monthly_payment: 1234.56 } } });
    }).as('mortgage');

    cy.intercept('POST', '/v1/calculators/debt-payoff', (req) => {
      req.reply({ statusCode: 200, body: { data: { months_to_pay_off: 12, total_interest_paid: 100 } } });
    }).as('debt');

    cy.intercept('POST', '/v1/calculators/investment-growth', (req) => {
      req.reply({ statusCode: 200, body: { data: { future_value: 5000, total_contributions: 3000, total_interest_earned: 2000 } } });
    }).as('investment');

    cy.intercept('POST', '/v1/calculators/rent-vs-buy', (req) => {
      req.reply({ statusCode: 200, body: { data: { total_cost_of_owning: 100000, total_cost_of_renting: 90000, net_benefit_of_owning: 10000, recommendation: 'Buy' } } });
    }).as('rvb');

    cy.intercept('POST', '/v1/calculators/tax-estimator', (req) => {
      req.reply({ statusCode: 200, body: { data: { total_tax_amount: 12000, effective_tax_rate: 0.12 } } });
    }).as('tax');

    cy.intercept('POST', '/v1/calculators/loan-comparison', (req) => {
      req.reply({ statusCode: 200, body: { data: { winner: 'Offer A', monthly_payment_delta: -50 } } });
    }).as('loanComp');

    cy.intercept('POST', '/v1/calculators/affordability', (req) => {
      req.reply({ statusCode: 200, body: { data: { max_loan: 350000, monthly_payment: 1500 } } });
    }).as('afford');

    cy.intercept('POST', '/v1/calculators/fee-drag', (req) => {
      req.reply({ statusCode: 200, body: { data: { final_with_fees: 95000, final_without_fees: 100000, drag: 5000 } } });
    }).as('feedrag');

    cy.intercept('POST', '/v1/calculators/safe-withdrawal', (req) => {
      req.reply({ statusCode: 200, body: { data: { sustainable_withdrawal: 40000, years_supported: 30 } } });
    }).as('safe');

    cy.intercept('POST', '/v1/calculators/cd-ladder', (req) => {
      req.reply({ statusCode: 200, body: { data: { ladder: [{ term_months: 12, amount: 20000 }, { term_months: 24, amount: 20000 }] } } });
    }).as('cdladder');

    cy.intercept('POST', '/v1/calculators/payroll', (req) => {
      req.reply({ statusCode: 200, body: { data: { net_per_period: 2500, annual_net: 60000 } } });
    }).as('payroll');

    cy.intercept('POST', '/v1/calculators/convert-currency', (req) => {
      req.reply({ statusCode: 200, body: { data: { converted_amount: 850, rate: 0.85 } } });
    }).as('convert');
  });

  it('performs mortgage calculation', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Loan Amount ($)"]').type('200000');
    cy.get('input[aria-label="Annual Interest Rate (%)"]').type('3.5');
    cy.get('input[aria-label="Loan Term (Years)"]').type('30');
    cy.contains('Calculate').click();
    cy.wait('@mortgage');
    cy.contains('Monthly payment').should('exist');
  });

  it('performs debt payoff calculation', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Debt Amount ($)"]').type('5000');
    cy.get('input[aria-label="Annual Interest Rate (%)"]').eq(1).type('10');
    cy.get('input[aria-label="Monthly Payment ($)"]').type('500');
    cy.contains('Calculate').eq(1).click();
    cy.wait('@debt');
    cy.contains('Months to pay off').should('exist');
  });

  it('performs investment growth projection', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Monthly Contribution ($)"]').type('200');
    cy.get('input[aria-label="Annual Return (%)"]').type('5');
    cy.get('input[aria-label="Years to Grow"]').type('10');
    cy.contains('Project').click();
    cy.wait('@investment');
    cy.contains('Future value').should('exist');
  });

  it('performs rent vs buy comparison', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Home Price ($)"]').type('300000');
    cy.get('input[aria-label="Down Payment ($)"]').type('60000');
    cy.get('input[aria-label="Mortgage Interest Rate (%)"]').type('4');
    cy.get('input[aria-label="Loan Term (Years)"]').type('30');
    cy.get('input[aria-label="Monthly Rent ($)"]').type('1500');
    cy.get('input[aria-label="Comparison Years"]').type('10');
    cy.get('input[aria-label="Investment Return Rate (%)"]').type('5');
    cy.contains('Compare').click();
    cy.wait('@rvb');
    cy.contains('Total cost of owning').should('exist');
  });

  it('performs tax estimation', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Gross Income ($)"]').type('100000');
    cy.contains('Estimate').click();
    cy.wait('@tax');
    cy.contains('Total tax').should('exist');
  });

  it('performs loan comparison', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Principal ($)"]').first().type('200000');
    cy.get('input[aria-label="Interest Rate (%)"]').first().type('3.5');
    cy.get('input[aria-label="Term (years)"]').first().type('30');
    cy.get('input[aria-label="Principal ($)"]').eq(1).type('200000');
    cy.get('input[aria-label="Interest Rate (%)"]').eq(1).type('4.0');
    cy.get('input[aria-label="Term (years)"]').eq(1).type('30');
    cy.contains('Compare Loans').click();
    cy.wait('@loanComp');
    cy.contains('winner', { matchCase: false }).should('exist');
  });

  it('performs affordability calculation', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Annual Income ($)"]').type('90000');
    cy.get('input[aria-label="DTI Ratio (%)"]').type('36');
    cy.get('input[aria-label="Interest Rate (%)"]').eq(4).type('4');
    cy.contains('Calculate Affordability').click();
    cy.wait('@afford');
    cy.contains('Max loan').should('exist');
  });

  it('performs fee drag and safe withdrawal', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Initial Amount ($)"]').type('80000');
    cy.get('input[aria-label="Annual Contribution ($)"]').type('2000');
    cy.get('input[aria-label="Gross Return (%)"]').type('6');
    cy.get('input[aria-label="Fee (%)"]').type('0.5');
    cy.get('input[aria-label="Years"]').first().type('10');
    cy.contains('Calculate Drag').click();
    cy.wait('@feedrag');
    cy.contains('Fee drag summary').should('exist');

    // Safe withdrawal
    cy.get('input[aria-label="Initial Portfolio ($)"]').type('100000');
    cy.get('input[aria-label="Withdrawal Rate (%)"]').type('4');
    cy.get('input[aria-label="Expected Return (%)"]').type('5');
    cy.get('input[aria-label="Years"]').eq(1).type('30');
    cy.contains('Estimate').click();
    cy.wait('@safe');
    cy.contains('Safe withdrawal estimate').should('exist');
  });

  it('performs CD ladder, payroll, and currency convert', () => {
    cy.visit('/calculators');
    cy.get('input[aria-label="Total Amount ($)"]').type('100000');
    cy.get('input[aria-label="Rungs"]').type('4');
    cy.get('input[aria-label="Base Rate (%)"]').type('2');
    cy.contains('Build Ladder').click();
    cy.wait('@cdladder');
    cy.contains('CD Ladder').should('exist');

    // Payroll
    cy.get('input[aria-label="Gross Annual ($)"]').type('80000');
    cy.get('input[aria-label="Pay Periods Per Year"]').type('24');
    cy.contains('Estimate Take-home').click();
    cy.wait('@payroll');
    cy.contains('Payroll estimate').should('exist');

    // Convert
    cy.get('input[aria-label="Amount"]').type('1000');
    cy.get('input[aria-label="Exchange Rate"]').type('0.85');
    cy.contains('Convert').click();
    cy.wait('@convert');
    cy.contains('Currency conversion').should('exist');
  });
});
