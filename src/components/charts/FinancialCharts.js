import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

// Enhanced spending chart with trend analysis
export function SpendingTrendChart({ transactions, categories, timeframe = 'month' }) {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];
    
    // Group transactions by time period
    const grouped = transactions.reduce((acc, tx) => {
      const date = new Date(tx.date);
      const key = timeframe === 'month' 
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        : date.toISOString().split('T')[0];
      
      if (!acc[key]) {
        acc[key] = { date: key, income: 0, expenses: 0, net: 0 };
      }
      
      if (tx.amount > 0) {
        acc[key].income += tx.amount / 100;
      } else {
        acc[key].expenses += Math.abs(tx.amount) / 100;
      }
      acc[key].net = acc[key].income - acc[key].expenses;
      
      return acc;
    }, {});
    
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, timeframe]);

  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Spending Trends
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke={theme.palette.success.main} 
              strokeWidth={2}
              name="Income"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke={theme.palette.error.main} 
              strokeWidth={2}
              name="Expenses"
            />
            <Line 
              type="monotone" 
              dataKey="net" 
              stroke={theme.palette.primary.main} 
              strokeWidth={2}
              name="Net"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Category spending breakdown
export function CategoryPieChart({ transactions, categories }) {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    if (!transactions || !categories) return [];
    
    const categorySpending = transactions
      .filter(tx => tx.amount < 0) // Only expenses
      .reduce((acc, tx) => {
        const category = categories.find(c => c.id === tx.category_id);
        const categoryName = category?.name || 'Uncategorized';
        
        acc[categoryName] = (acc[categoryName] || 0) + Math.abs(tx.amount) / 100;
        return acc;
      }, {});
    
    return Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  }, [transactions, categories]);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Spending by Category
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Budget vs actual spending
export function BudgetComparisonChart({ budgets, actualSpending }) {
  const chartData = useMemo(() => {
    if (!budgets || !actualSpending) return [];
    
    return budgets.map(budget => {
      const actual = actualSpending.find(s => s.category_id === budget.category_id);
      return {
        category: budget.category_name,
        budgeted: budget.amount / 100,
        actual: (actual?.amount || 0) / 100,
        remaining: Math.max(0, (budget.amount - (actual?.amount || 0)) / 100),
        overBudget: Math.max(0, ((actual?.amount || 0) - budget.amount) / 100),
      };
    });
  }, [budgets, actualSpending]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Budget vs Actual
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
            <Bar dataKey="overBudget" fill="#ff7c7c" name="Over Budget" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Net worth progression over time
export function NetWorthChart({ accounts, historicalData }) {
  const chartData = useMemo(() => {
    if (!historicalData || !Array.isArray(historicalData)) return [];
    
    return historicalData.map(snapshot => ({
      date: new Date(snapshot.date).toLocaleDateString(),
      netWorth: snapshot.total_assets - snapshot.total_liabilities,
      assets: snapshot.total_assets,
      liabilities: snapshot.total_liabilities,
    }));
  }, [historicalData]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Net Worth Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(value)}
            />
            <Area 
              type="monotone" 
              dataKey="netWorth" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
              name="Net Worth"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Dashboard layout component
export function FinancialDashboard({ 
  transactions, 
  categories, 
  budgets, 
  accounts, 
  historicalData 
}) {
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
      <SpendingTrendChart transactions={transactions} categories={categories} />
      <CategoryPieChart transactions={transactions} categories={categories} />
      <BudgetComparisonChart budgets={budgets} actualSpending={transactions} />
      <NetWorthChart accounts={accounts} historicalData={historicalData} />
    </Box>
  );
}
