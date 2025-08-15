import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

export default function TransactionsPage() {
  const { api } = useAuth();
  const { selectedId } = useHouseholds();
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ amount_cents: 0, category_id: '', memo: '', occurred_at: '' });
  const [categories, setCategories] = useState([]);

  const loadAccounts = useCallback(async () => {
    if (!selectedId) {
      setAccounts([]);
      return;
    }
    try {
      const resp = await api.listAccounts(selectedId);
      setAccounts(resp.data || []);
    } catch (e) {
      // ignore
    }
  }, [selectedId, api]);

  const loadCategories = useCallback(async () => {
    if (!selectedId) {
      setCategories([]);
      return;
    }
    try {
      const resp = await api.listCategories(selectedId);
      setCategories(resp.data || []);
    } catch (e) {
      // ignore
    }
  }, [selectedId, api]);

  const loadTransactions = useCallback(async () => {
    if (!accountId) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resp = await api.listTransactions(accountId);
      setTransactions(resp.data || []);
    } catch (e) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [accountId, api]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // ...existing logic...

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Transactions</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {/* ...existing form and transaction list code, add responsive styles as needed... */}
    </div>
  );
}
