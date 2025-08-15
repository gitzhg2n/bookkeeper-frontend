import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

export default function AccountsPage() {
  const { api } = useAuth();
  const { selectedId } = useHouseholds();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: '', type: 'checking', currency: 'USD', opening_balance_cents: 0 });

  const load = useCallback(async () => {
    if (!selectedId) {
      setAccounts([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resp = await api.listAccounts(selectedId);
      setAccounts(resp.data || []);
    } catch (e) {
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, [selectedId, api]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.updateAccount(editing, form);
      } else {
        await api.createAccount(selectedId, form);
      }
      setEditing(null);
      setForm({ ...form, name: '', opening_balance_cents: 0 });
      await load();
    } catch (e2) {
      setError("Failed to save account");
    }
  };

  const handleDelete = async id => {
    setError("");
    try {
      await api.deleteAccount(id);
      load();
    } catch (e) {
      setError("Failed to delete account");
    }
  };

  if (!selectedId) {
    return <div>Select a household first.</div>;
  }

  return (
    <div>
      <h3>Accounts</h3>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 8 }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th>Type</th>
            <th>Currency</th>
            <th>Opening Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(a => (
            <tr key={a.id} style={{ borderTop: '1px solid #e5e7eb' }}>
              <td>{a.name}</td>
              <td align="center">{a.type}</td>
              <td align="center">{a.currency}</td>
              <td align="right">{(a.opening_balance_cents / 100).toFixed(2)}</td>
            </tr>
          ))}
          {accounts.length === 0 && !loading && (
            <tr>
              <td colSpan={4} style={{ padding: 8, opacity: 0.6 }}>
                No accounts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <form onSubmit={submit} style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit</option>
          <option value="loan">Loan</option>
        </select>
        <input
          style={{ width: 90 }}
          value={form.currency}
          onChange={e => setForm(f => ({ ...f, currency: e.target.value.toUpperCase() }))}
        />
        <input
          type="number"
          style={{ width: 140 }}
          value={form.opening_balance_cents}
          onChange={e => setForm(f => ({ ...f, opening_balance_cents: Number(e.target.value) }))}
        />
        <button>Add Account</button>
      </form>
    </div>
  );
}
