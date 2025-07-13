// Sample data from the provided JSON
let appData = {
  accounts: [
    { id: 1, name: "Chase Checking", type: "Checking Account", category: "Basic Assets", balance: 2540.50, currency: "USD" },
    { id: 2, name: "Savings Account", type: "Savings Account", category: "Basic Assets", balance: 8750.00, currency: "USD" },
    { id: 3, name: "Credit Card", type: "Credit Card", category: "Basic Liabilities", balance: -1250.75, currency: "USD" },
    { id: 4, name: "401k Portfolio", type: "401k", category: "Traditional Investments", balance: 45000.00, currency: "USD" },
    { id: 5, name: "Crypto Portfolio", type: "Cryptocurrency", category: "Alternative Investments", balance: 8500.00, currency: "USD" },
    { id: 6, name: "Real Estate Investment", type: "Real Estate", category: "Alternative Investments", balance: 125000.00, currency: "USD" },
    { id: 7, name: "Gold Holdings", type: "Precious Metals", category: "Alternative Investments", balance: 12000.00, currency: "USD" }
  ],
  transactions: [
    { id: 1, date: "2025-07-12", description: "Grocery Store", amount: -85.50, category: "Food & Dining", account: "Chase Checking" },
    { id: 2, date: "2025-07-11", description: "Salary Deposit", amount: 3200.00, category: "Income", account: "Chase Checking" },
    { id: 3, date: "2025-07-10", description: "Gas Station", amount: -45.00, category: "Transportation", account: "Chase Checking" },
    { id: 4, date: "2025-07-09", description: "Netflix Subscription", amount: -15.99, category: "Entertainment", account: "Credit Card" },
    { id: 5, date: "2025-07-08", description: "Crypto Purchase", amount: -500.00, category: "Investments", account: "Chase Checking" }
  ],
  budgets: [
    { category: "Food & Dining", budgeted: 400.00, spent: 285.50, remaining: 114.50 },
    { category: "Transportation", budgeted: 300.00, spent: 145.00, remaining: 155.00 },
    { category: "Entertainment", budgeted: 100.00, spent: 45.99, remaining: 54.01 },
    { category: "Utilities", budgeted: 250.00, spent: 180.00, remaining: 70.00 }
  ],
  goals: [
    { name: "Emergency Fund", target: 10000.00, current: 8750.00, progress: 87.5 },
    { name: "Vacation Fund", target: 3000.00, current: 1200.00, progress: 40.0 },
    { name: "Investment Portfolio", target: 100000.00, current: 53500.00, progress: 53.5 }
  ],
  investments: [
    { symbol: "AAPL", name: "Apple Inc.", shares: 25, price: 190.50, value: 4762.50, change: 2.5, changePercent: 1.32 },
    { symbol: "GOOGL", name: "Alphabet Inc.", shares: 10, price: 142.80, value: 1428.00, change: -3.2, changePercent: -2.19 },
    { symbol: "MSFT", name: "Microsoft Corp.", shares: 15, price: 411.30, value: 6169.50, change: 5.1, changePercent: 1.25 }
  ],
  alternativeInvestments: [
    { type: "Cryptocurrency", name: "Bitcoin", amount: 0.25, value: 7500.00, change: 500.00, changePercent: 7.14 },
    { type: "Cryptocurrency", name: "Ethereum", amount: 5.0, value: 1000.00, change: -50.00, changePercent: -4.76 },
    { type: "Real Estate", name: "Rental Property", value: 125000.00, change: 5000.00, changePercent: 4.17 },
    { type: "Precious Metals", name: "Gold ETF", amount: 100, value: 12000.00, change: 200.00, changePercent: 1.69 },
    { type: "Private Equity", name: "Tech Startup Fund", value: 15000.00, change: 0.00, changePercent: 0.00 }
  ],
  accountTypes: {
    "Basic Assets": ["Checking Account", "Savings Account", "Money Market", "Certificate of Deposit", "Cash"],
    "Basic Liabilities": ["Credit Card", "Personal Loan", "Auto Loan", "Student Loan", "Mortgage"],
    "Traditional Investments": ["Stocks", "Bonds", "Mutual Funds", "ETFs", "401k", "IRA", "Roth IRA"],
    "Alternative Investments": ["Cryptocurrency", "Real Estate", "Private Equity", "Venture Capital", "Commodities", "Art & Collectibles", "Peer-to-Peer Lending", "Farmland", "Precious Metals", "Business Ownership", "Intellectual Property", "Royalties"],
    "Advanced Liabilities": ["Business Loans", "Investment Property Mortgages", "Margin Loans", "Tax Liabilities"]
  },
  categories: [
    "Food & Dining", "Transportation", "Entertainment", "Utilities", "Healthcare", "Shopping",
    "Travel", "Education", "Insurance", "Investments", "Income", "Savings", "Business",
    "Personal Care", "Home", "Gifts & Donations", "Fees & Charges", "Taxes"
  ]
};

// Application state
let isAdvancedMode = false;
let currentTheme = 'auto';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  setCurrentDate();
  renderDashboard();
  renderAccounts();
  renderTransactions();
  renderBudgets();
  renderGoals();
  renderInvestments();
  renderAlternativeInvestments();
  populateFormSelects();
  updateUIMode();
  // Initialize charts after a small delay to ensure DOM is ready
  setTimeout(() => {
    initializeCharts();
  }, 100);
}

function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const tabName = this.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Advanced mode toggle
  const advancedModeToggle = document.getElementById('advancedMode');
  if (advancedModeToggle) {
    advancedModeToggle.addEventListener('change', function() {
      isAdvancedMode = this.checked;
      updateUIMode();
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Modal close on outside click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });

  // Form submissions
  const addAccountForm = document.getElementById('addAccountForm');
  if (addAccountForm) {
    addAccountForm.addEventListener('submit', handleAddAccount);
  }

  const addTransactionForm = document.getElementById('addTransactionForm');
  if (addTransactionForm) {
    addTransactionForm.addEventListener('submit', handleAddTransaction);
  }

  const addBudgetForm = document.getElementById('addBudgetForm');
  if (addBudgetForm) {
    addBudgetForm.addEventListener('submit', handleAddBudget);
  }

  const addGoalForm = document.getElementById('addGoalForm');
  if (addGoalForm) {
    addGoalForm.addEventListener('submit', handleAddGoal);
  }

  const addInvestmentForm = document.getElementById('addInvestmentForm');
  if (addInvestmentForm) {
    addInvestmentForm.addEventListener('submit', handleAddInvestment);
  }

  const addAlternativeForm = document.getElementById('addAlternativeForm');
  if (addAlternativeForm) {
    addAlternativeForm.addEventListener('submit', handleAddAlternative);
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportReport);
  }

  // Account category change
  const accountCategory = document.getElementById('accountCategory');
  if (accountCategory) {
    accountCategory.addEventListener('change', updateAccountTypes);
  }

  // Set today's date as default for transaction date
  const transactionDate = document.getElementById('transactionDate');
  if (transactionDate) {
    transactionDate.value = new Date().toISOString().split('T')[0];
  }
}

function setCurrentDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const currentDateElement = document.getElementById('currentDate');
  if (currentDateElement) {
    currentDateElement.textContent = `As of ${now.toLocaleDateString('en-US', options)}`;
  }
}

function switchTab(tabName) {
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.getElementById(`${tabName}-tab`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Re-render charts if switching to reports tab
  if (tabName === 'reports') {
    setTimeout(() => {
      initializeCharts();
    }, 100);
  }
}

function updateUIMode() {
  const advancedElements = document.querySelectorAll('.advanced-only');
  advancedElements.forEach(element => {
    if (isAdvancedMode) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  });

  // Update dashboard based on mode
  renderDashboard();
  renderAccounts();
  populateFormSelects();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  
  if (body.getAttribute('data-color-scheme') === 'dark') {
    body.setAttribute('data-color-scheme', 'light');
    if (themeToggle) themeToggle.textContent = '🌙';
  } else {
    body.setAttribute('data-color-scheme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatPercentage(value) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function calculateNetWorth() {
  return appData.accounts.reduce((total, account) => total + account.balance, 0);
}

function renderDashboard() {
  const netWorth = calculateNetWorth();
  const dashboardCards = document.getElementById('dashboardCards');
  
  if (!dashboardCards) return;
  
  let cardsHTML = `
    <div class="card dashboard-card">
      <div class="card__body">
        <h3>Net Worth</h3>
        <div class="metric-value">${formatCurrency(netWorth)}</div>
        <div class="metric-change positive">+$2,450.00 (1.2%)</div>
      </div>
    </div>
    <div class="card dashboard-card">
      <div class="card__body">
        <h3>Monthly Cash Flow</h3>
        <div class="metric-value">+$2,180.00</div>
        <div class="metric-change positive">+$340.00 vs last month</div>
      </div>
    </div>
    <div class="card dashboard-card">
      <div class="card__body">
        <h3>Budget Status</h3>
        <div class="budget-overview">
          <div class="budget-bar">
            <div class="budget-progress" style="width: 65%"></div>
          </div>
          <div class="budget-text">$656.49 of $1,050.00 spent</div>
        </div>
      </div>
    </div>
  `;

  if (isAdvancedMode) {
    const totalInvestments = appData.investments.reduce((sum, inv) => sum + inv.value, 0) + 
                            appData.alternativeInvestments.reduce((sum, alt) => sum + alt.value, 0);
    cardsHTML += `
      <div class="card dashboard-card">
        <div class="card__body">
          <h3>Investment Performance</h3>
          <div class="metric-value">${formatCurrency(totalInvestments)}</div>
          <div class="metric-change positive">+$5,200.00 (3.1%)</div>
        </div>
      </div>
    `;
  }

  dashboardCards.innerHTML = cardsHTML;

  // Render recent transactions
  renderRecentTransactions();
}

function renderRecentTransactions() {
  const recentTransactions = document.getElementById('recentTransactions');
  if (!recentTransactions) return;
  
  const recent = appData.transactions.slice(0, 5);
  
  recentTransactions.innerHTML = recent.map(transaction => `
    <div class="transaction-item ${transaction.amount < 0 ? 'negative' : 'positive'}">
      <div class="transaction-details">
        <div class="transaction-description">${transaction.description}</div>
        <div class="transaction-meta">${transaction.category} • ${transaction.account}</div>
      </div>
      <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
    </div>
  `).join('');
}

function renderAccounts() {
  const accountsGrid = document.getElementById('accountsGrid');
  if (!accountsGrid) return;
  
  const filteredAccounts = isAdvancedMode ? appData.accounts : 
    appData.accounts.filter(account => 
      account.category === 'Basic Assets' || account.category === 'Basic Liabilities'
    );

  accountsGrid.innerHTML = filteredAccounts.map(account => `
    <div class="card">
      <div class="card__body">
        <h4>${account.name}</h4>
        <div class="account-type">${account.type}</div>
        <div class="metric-value ${account.balance < 0 ? 'negative' : 'positive'}">
          ${formatCurrency(account.balance)}
        </div>
      </div>
    </div>
  `).join('');
}

function renderTransactions() {
  const transactionsList = document.getElementById('transactionsList');
  if (!transactionsList) return;
  
  transactionsList.innerHTML = appData.transactions.map(transaction => `
    <div class="transaction-item ${transaction.amount < 0 ? 'negative' : 'positive'}">
      <div class="transaction-details">
        <div class="transaction-description">${transaction.description}</div>
        <div class="transaction-meta">${transaction.date} • ${transaction.category} • ${transaction.account}</div>
      </div>
      <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
    </div>
  `).join('');
}

function renderBudgets() {
  const budgetsGrid = document.getElementById('budgetsGrid');
  if (!budgetsGrid) return;
  
  budgetsGrid.innerHTML = appData.budgets.map(budget => {
    const percentage = (budget.spent / budget.budgeted) * 100;
    const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';
    
    return `
      <div class="card">
        <div class="card__body">
          <h4>${budget.category}</h4>
          <div class="budget-overview">
            <div class="budget-bar">
              <div class="budget-progress" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div class="budget-text">
              ${formatCurrency(budget.spent)} of ${formatCurrency(budget.budgeted)}
            </div>
            <div class="budget-remaining ${status}">
              ${formatCurrency(budget.remaining)} remaining
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderGoals() {
  const goalsGrid = document.getElementById('goalsGrid');
  if (!goalsGrid) return;
  
  goalsGrid.innerHTML = appData.goals.map(goal => `
    <div class="card">
      <div class="card__body">
        <h4>${goal.name}</h4>
        <div class="goal-progress">
          <div class="budget-bar">
            <div class="budget-progress" style="width: ${goal.progress}%"></div>
          </div>
          <div class="goal-text">
            ${formatCurrency(goal.current)} of ${formatCurrency(goal.target)}
          </div>
          <div class="goal-percentage">${goal.progress.toFixed(1)}% complete</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderInvestments() {
  const investmentsGrid = document.getElementById('investmentsGrid');
  if (!investmentsGrid) return;
  
  investmentsGrid.innerHTML = appData.investments.map(investment => `
    <div class="card">
      <div class="card__body">
        <h4>${investment.symbol}</h4>
        <div class="investment-name">${investment.name}</div>
        <div class="metric-value">${formatCurrency(investment.value)}</div>
        <div class="metric-change ${investment.change >= 0 ? 'positive' : 'negative'}">
          ${formatCurrency(investment.change)} (${formatPercentage(investment.changePercent)})
        </div>
        <div class="investment-details">
          ${investment.shares} shares @ ${formatCurrency(investment.price)}
        </div>
      </div>
    </div>
  `).join('');
}

function renderAlternativeInvestments() {
  const alternativesGrid = document.getElementById('alternativesGrid');
  if (!alternativesGrid) return;
  
  alternativesGrid.innerHTML = appData.alternativeInvestments.map(alternative => `
    <div class="card">
      <div class="card__body">
        <h4>${alternative.name}</h4>
        <div class="alternative-type">${alternative.type}</div>
        <div class="metric-value">${formatCurrency(alternative.value)}</div>
        <div class="metric-change ${alternative.change >= 0 ? 'positive' : 'negative'}">
          ${formatCurrency(alternative.change)} (${formatPercentage(alternative.changePercent)})
        </div>
        ${alternative.amount ? `<div class="alternative-amount">${alternative.amount} units</div>` : ''}
      </div>
    </div>
  `).join('');
}

function populateFormSelects() {
  // Account categories
  const categorySelect = document.getElementById('accountCategory');
  if (categorySelect) {
    const categories = isAdvancedMode ? 
      Object.keys(appData.accountTypes) : 
      ['Basic Assets', 'Basic Liabilities'];
    
    categorySelect.innerHTML = '<option value="">Select Category</option>' +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  // Transaction categories
  const transactionCategorySelect = document.getElementById('transactionCategory');
  if (transactionCategorySelect) {
    transactionCategorySelect.innerHTML = '<option value="">Select Category</option>' +
      appData.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  // Transaction accounts
  const transactionAccountSelect = document.getElementById('transactionAccount');
  if (transactionAccountSelect) {
    transactionAccountSelect.innerHTML = '<option value="">Select Account</option>' +
      appData.accounts.map(acc => `<option value="${acc.name}">${acc.name}</option>`).join('');
  }

  // Budget categories
  const budgetCategorySelect = document.getElementById('budgetCategory');
  if (budgetCategorySelect) {
    budgetCategorySelect.innerHTML = '<option value="">Select Category</option>' +
      appData.categories.filter(cat => cat !== 'Income').map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  // Alternative investment types
  const alternativeTypeSelect = document.getElementById('alternativeType');
  if (alternativeTypeSelect) {
    const altTypes = ['Cryptocurrency', 'Real Estate', 'Private Equity', 'Venture Capital', 
                     'Commodities', 'Art & Collectibles', 'Peer-to-Peer Lending', 
                     'Farmland', 'Precious Metals', 'Business Ownership', 
                     'Intellectual Property', 'Royalties'];
    alternativeTypeSelect.innerHTML = '<option value="">Select Type</option>' +
      altTypes.map(type => `<option value="${type}">${type}</option>`).join('');
  }

  // Filter selects
  populateFilterSelects();
}

function populateFilterSelects() {
  const accountFilter = document.getElementById('accountFilter');
  if (accountFilter) {
    accountFilter.innerHTML = '<option value="">All Accounts</option>' +
      appData.accounts.map(acc => `<option value="${acc.name}">${acc.name}</option>`).join('');
  }

  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
      appData.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }
}

function updateAccountTypes() {
  const category = document.getElementById('accountCategory').value;
  const typeSelect = document.getElementById('accountType');
  
  if (typeSelect) {
    if (category && appData.accountTypes[category]) {
      typeSelect.innerHTML = '<option value="">Select Type</option>' +
        appData.accountTypes[category].map(type => `<option value="${type}">${type}</option>`).join('');
    } else {
      typeSelect.innerHTML = '<option value="">Select Type</option>';
    }
  }
}

// Form handlers
function handleAddAccount(e) {
  e.preventDefault();
  const newAccount = {
    id: appData.accounts.length + 1,
    name: document.getElementById('accountName').value,
    type: document.getElementById('accountType').value,
    category: document.getElementById('accountCategory').value,
    balance: parseFloat(document.getElementById('accountBalance').value),
    currency: 'USD'
  };
  
  appData.accounts.push(newAccount);
  renderAccounts();
  renderDashboard();
  populateFormSelects();
  closeModal('addAccountModal');
  e.target.reset();
}

function handleAddTransaction(e) {
  e.preventDefault();
  const newTransaction = {
    id: appData.transactions.length + 1,
    date: document.getElementById('transactionDate').value,
    description: document.getElementById('transactionDescription').value,
    amount: parseFloat(document.getElementById('transactionAmount').value),
    category: document.getElementById('transactionCategory').value,
    account: document.getElementById('transactionAccount').value
  };
  
  appData.transactions.unshift(newTransaction);
  
  // Update account balance
  const account = appData.accounts.find(acc => acc.name === newTransaction.account);
  if (account) {
    account.balance += newTransaction.amount;
  }
  
  renderTransactions();
  renderAccounts();
  renderDashboard();
  closeModal('addTransactionModal');
  e.target.reset();
}

function handleAddBudget(e) {
  e.preventDefault();
  const category = document.getElementById('budgetCategory').value;
  const amount = parseFloat(document.getElementById('budgetAmount').value);
  
  // Check if budget already exists
  const existingBudget = appData.budgets.find(b => b.category === category);
  if (existingBudget) {
    existingBudget.budgeted = amount;
    existingBudget.remaining = amount - existingBudget.spent;
  } else {
    const newBudget = {
      category: category,
      budgeted: amount,
      spent: 0,
      remaining: amount
    };
    appData.budgets.push(newBudget);
  }
  
  renderBudgets();
  closeModal('addBudgetModal');
  e.target.reset();
}

function handleAddGoal(e) {
  e.preventDefault();
  const target = parseFloat(document.getElementById('goalTarget').value);
  const current = parseFloat(document.getElementById('goalCurrent').value);
  
  const newGoal = {
    name: document.getElementById('goalName').value,
    target: target,
    current: current,
    progress: (current / target) * 100
  };
  
  appData.goals.push(newGoal);
  renderGoals();
  closeModal('addGoalModal');
  e.target.reset();
}

function handleAddInvestment(e) {
  e.preventDefault();
  const shares = parseFloat(document.getElementById('investmentShares').value);
  const price = parseFloat(document.getElementById('investmentPrice').value);
  
  const newInvestment = {
    symbol: document.getElementById('investmentSymbol').value,
    name: document.getElementById('investmentName').value,
    shares: shares,
    price: price,
    value: shares * price,
    change: 0,
    changePercent: 0
  };
  
  appData.investments.push(newInvestment);
  renderInvestments();
  closeModal('addInvestmentModal');
  e.target.reset();
}

function handleAddAlternative(e) {
  e.preventDefault();
  const newAlternative = {
    type: document.getElementById('alternativeType').value,
    name: document.getElementById('alternativeName').value,
    value: parseFloat(document.getElementById('alternativeValueInput').value),
    change: 0,
    changePercent: 0
  };
  
  appData.alternativeInvestments.push(newAlternative);
  renderAlternativeInvestments();
  closeModal('addAlternativeModal');
  e.target.reset();
}

function initializeCharts() {
  // Net Worth Chart
  const netWorthCtx = document.getElementById('netWorthChart');
  if (netWorthCtx) {
    new Chart(netWorthCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Net Worth',
          data: [180000, 185000, 190000, 195000, 192000, 198000, 199789],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000) + 'k';
              }
            }
          }
        }
      }
    });
  }

  // Spending Chart
  const spendingCtx = document.getElementById('spendingChart');
  if (spendingCtx) {
    new Chart(spendingCtx, {
      type: 'doughnut',
      data: {
        labels: appData.budgets.map(b => b.category),
        datasets: [{
          data: appData.budgets.map(b => b.spent),
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}

function exportReport() {
  const reportData = {
    netWorth: calculateNetWorth(),
    accounts: appData.accounts,
    budgets: appData.budgets,
    goals: appData.goals,
    generatedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bookkeeper-report.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Make functions available globally for inline onclick handlers
window.switchTab = switchTab;
window.openModal = openModal;
window.closeModal = closeModal;