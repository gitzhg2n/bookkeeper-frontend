import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

export default function TransactionsPage() {
  const { api } = useAuth();
  const { selectedId } = useHouseholds();
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
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
    setErr(null);
    try {
      const resp = await api.listTransactions(accountId);
      setTransactions(resp.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [accountId, api]);

  useEffect(() => {
    loadAccounts();
    loadCategories();
  }, [loadAccounts, loadCategories]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const submit = async e => {
    e.preventDefault();
    if (!accountId) {
      return;
    }
    try {
      await api.createTransaction(accountId, {
        amount_cents: Number(form.amount_cents),
        category_id: form.category_id ? Number(form.category_id) : null,
        memo: form.memo,
        occurred_at: form.occurred_at || undefined,
      });
      setForm({ amount_cents: 0, category_id: '', memo: '', occurred_at: '' });
      await loadTransactions();
    } catch (e2) {
      setErr(e2.message);
    }
  };

  if (!selectedId) {
    return <div>Select a household first.</div>;
  }

  return (
    <div>
      <h3>Transactions</h3>
      <div style={{ marginBottom: 12 }}>
        <select value={accountId} onChange={e => setAccountId(e.target.value)}>
          <option value="">Select account</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      {accountId && (
        <form
          onSubmit={submit}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
        >
          <input
            type="number"
            value={form.amount_cents}
            onChange={e => setForm(f => ({ ...f, amount_cents: e.target.value }))}
            placeholder="Amount (cents)"
            required
          />
          <select
            value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
          >
            <option value="">No category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={form.memo}
            onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
            placeholder="Memo"
          />
          <input
            type="datetime-local"
            value={form.occurred_at}
            onChange={e => setForm(f => ({ ...f, occurred_at: e.target.value }))}
          />
          <button>Add</button>
        </form>
      )}
      {loading && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}
      {accountId && (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th align="left">Date</th>
              <th align="left">Memo</th>
              <th align="left">Category</th>
              <th align="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => {
              const cat = categories.find(c => c.id === t.category_id);
              return (
                <tr key={t.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td>{new Date(t.occurred_at).toLocaleDateString()}</td>
                  <td>{t.memo}</td>
                  <td>{cat?.name || '—'}</td>
                  <td align="right">{(t.amount_cents / 100).toFixed(2)}</td>
                </tr>
              );
            })}
            {transactions.length === 0 && !loading && (
              <tr>
                <td colSpan={4} style={{ padding: 8, opacity: 0.6 }}>
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
