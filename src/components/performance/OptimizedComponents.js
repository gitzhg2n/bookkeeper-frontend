import React, { memo, useMemo, useCallback, Suspense, lazy } from 'react';
import { FixedSizeList as List } from 'react-window';
import { CircularProgress, Box } from '@mui/material';

// Lazy load heavy components
export const Calculator = lazy(() => import('../pages/Calculators'));
export const TransactionHistory = lazy(() => import('../pages/Transactions'));
export const BudgetAnalytics = lazy(() => import('../components/BudgetAnalytics'));

// Memoized transaction row component
export const TransactionRow = memo(({ 
  transaction, 
  onEdit, 
  onDelete, 
  categories 
}) => {
  const category = useMemo(() => 
    categories.find(c => c.id === transaction.category_id), 
    [categories, transaction.category_id]
  );

  const handleEdit = useCallback(() => onEdit(transaction), [onEdit, transaction]);
  const handleDelete = useCallback(() => onDelete(transaction.id), [onDelete, transaction.id]);

  const formattedAmount = useMemo(() => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: transaction.currency || 'USD'
    }).format(transaction.amount / 100),
    [transaction.amount, transaction.currency]
  );

  const formattedDate = useMemo(() => 
    new Date(transaction.date).toLocaleDateString(),
    [transaction.date]
  );

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '8px 16px',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {transaction.description}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          {category?.name || 'Uncategorized'} • {formattedDate}
        </div>
      </div>
      <div style={{ 
        fontWeight: 600, 
        color: transaction.amount > 0 ? '#2e7d32' : '#d32f2f',
        marginRight: 16
      }}>
        {formattedAmount}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleEdit} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
          Edit
        </button>
        <button onClick={handleDelete} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
          Delete
        </button>
      </div>
    </div>
  );
});

// Virtualized transaction list for performance
export function VirtualizedTransactionList({ 
  transactions, 
  categories, 
  onEdit, 
  onDelete, 
  height = 400 
}) {
  const Row = useCallback(({ index, style }) => {
    const transaction = transactions[index];
    return (
      <div style={style}>
        <TransactionRow
          transaction={transaction}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    );
  }, [transactions, categories, onEdit, onDelete]);

  if (!transactions || transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <div>No transactions found</div>
      </Box>
    );
  }

  return (
    <List
      height={height}
      itemCount={transactions.length}
      itemSize={72} // Height of each transaction row
      itemData={transactions}
    >
      {Row}
    </List>
  );
}

// Performance wrapper for data-heavy components
export const WithPerformanceOptimization = memo(({ 
  children, 
  data, 
  loading = false,
  error = null,
  fallback = <CircularProgress />
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        {fallback}
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <div>Error: {error.message}</div>
      </Box>
    );
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
});

// Hook for debounced search
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
