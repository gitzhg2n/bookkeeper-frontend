import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

function currentMonth() {
  const d = new Date();
  return d.toISOString().slice(0, 7);
}

export default function BudgetsPage() {
  const { api } = useAuth();
  const { selectedId } = useHouseholds();
  const [month, setMonth] = useState(currentMonth());
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newBudget, setNewBudget] = useState({ category_id: '', planned_cents: 0 });

  const load = useCallback(async () => {
    if (!selectedId) {
      setBudgets([]);
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const [bResp, cResp] = await Promise.all([
        api.listBudgets(selectedId, month),
        api.listCategories(selectedId),
      ]);
      setBudgets(bResp.data || []);
      setCategories(cResp.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedId, month, api]);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = async e => {
    e.preventDefault();
    if (!selectedId || !newBudget.category_id) {
      return;
    }
    try {
      await api.upsertBudget(selectedId, month, Number(newBudget.category_id), Number(newBudget.planned_cents));
      setNewBudget({ category_id: '', planned_cents: 0 });
      await load();
    } catch (e2) {
      setErr(e2.message);
    }
  };

  if (!selectedId) {
    return <div>Select a household first.</div>;
  }

  const totalPlanned = budgets.reduce((s, b) => s + b.planned_cents, 0);
  const totalActual = budgets.reduce((s, b) => s + b.actual_cents, 0);

  return (
    <div>
      <h3>Budgets</h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Month: <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
        </label>
        <div style={{ fontSize: 14 }}>
          Planned: {(totalPlanned / 100).toFixed(2)} | Actual: {(totalActual / 100).toFixed(2)} | Variance:{' '}
          {((totalPlanned - totalActual) / 100).toFixed(2)}
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 8 }}>
        <thead>
          <tr>
            <th align="left">Category</th>
            <th align="right">Planned</th>
            <th align="right">Actual</th>
            <th align="right">Variance</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(b => {
            const cat = categories.find(c => c.id === b.category_id);
            const variance = b.planned_cents - b.actual_cents;
            return (
              <tr key={b.category_id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td>{cat?.name || b.category_id}</td>
                <td align="right">{(b.planned_cents / 100).toFixed(2)}</td>
                <td align="right">{(b.actual_cents / 100).toFixed(2)}</td>
                <td align="right" style={{ color: variance < 0 ? 'red' : 'inherit' }}>
                  {(variance / 100).toFixed(2)}
                </td>
              </tr>
            );
          })}
          {budgets.length === 0 && !loading && (
            <tr>
              <td colSpan={4} style={{ padding: 8, opacity: 0.6 }}>
                No budgets yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <form onSubmit={upsert} style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={newBudget.category_id}
          onChange={e => setNewBudget(b => ({ ...b, category_id: e.target.value }))}
          required
        >
          <option value="">Select category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={newBudget.planned_cents}
          onChange={e => setNewBudget(b => ({ ...b, planned_cents: e.target.value }))}
          placeholder="Planned (cents)"
          required
        />
        <button>Upsert</button>
      </form>
    </div>
  );
}
