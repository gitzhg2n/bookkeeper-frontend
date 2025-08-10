import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function HouseholdsAccountsDemo() {
  const { api } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);

  const [newHousehold, setNewHousehold] = useState('');
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [budgetMonth, setBudgetMonth] = useState(() => new Date().toISOString().slice(0,7));
  const [budgetPlanned, setBudgetPlanned] = useState('');
  const [selectedCategoryForBudget, setSelectedCategoryForBudget] = useState('');
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const resp = await api.listHouseholds();
      setHouseholds(resp.data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const createHousehold = async () => {
    try {
      await api.createHousehold(newHousehold);
      setNewHousehold('');
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const loadAccounts = async (hid) => {
    try {
      const resp = await api.listAccounts(hid);
      setAccounts(resp.data);
    } catch (e) {
      setError(e.message);
    }
  };

  const loadCategories = async (hid) => {
    try {
      const resp = await api.listCategories(hid);
      setCategories(resp.data);
    } catch (e) {
      setError(e.message);
    }
  };

  const loadBudgets = async (hid, month) => {
    try {
      const resp = await api.listBudgets(hid, month);
      setBudgets(resp.data);
      const sum = await api.budgetSummary(hid, month);
      setSummary(sum.data);
    } catch (e) {
      setError(e.message);
    }
  };

  const selectHousehold = (hid) => {
    setSelectedHousehold(hid);
    loadAccounts(hid);
    loadCategories(hid);
    loadBudgets(hid, budgetMonth);
  };

  const createAccount = async () => {
    try {
      await api.createAccount(selectedHousehold, { name: newAccount, type: 'checking', currency: 'USD', opening_balance_cents: 0 });
      setNewAccount('');
      loadAccounts(selectedHousehold);
    } catch (e) {
      setError(e.message);
    }
  };

  const createCategory = async () => {
    try {
      await api.createCategory(selectedHousehold, newCategory);
      setNewCategory('');
      loadCategories(selectedHousehold);
    } catch (e) {
      setError(e.message);
    }
  };

  const upsertBudget = async () => {
    try {
      await api.upsertBudget(selectedHousehold, budgetMonth, Number(selectedCategoryForBudget), Number(budgetPlanned));
      setBudgetPlanned('');
      loadBudgets(selectedHousehold, budgetMonth);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Households</h3>
      <div>
        <input placeholder="New household name" value={newHousehold} onChange={e => setNewHousehold(e.target.value)} />
        <button onClick={createHousehold} disabled={!newHousehold}>Create</button>
      </div>
      <ul>
        {households.map(h => (
          <li key={h.id}>
            <button onClick={() => selectHousehold(h.id)}>
              {h.name} ({h.role})
            </button>
          </li>
        ))}
      </ul>

      {selectedHousehold && (
        <div style={{ marginTop: 24 }}>
          <h4>Accounts</h4>
          <div>
            <input placeholder="New account name" value={newAccount} onChange={e => setNewAccount(e.target.value)} />
            <button onClick={createAccount} disabled={!newAccount}>Create Account</button>
          </div>
          <ul>
            {accounts.map(a => <li key={a.id}>{a.name} - {a.type} - {a.currency}</li>)}
          </ul>

          <h4 style={{ marginTop: 24 }}>Categories</h4>
          <div>
            <input placeholder="New category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
            <button onClick={createCategory} disabled={!newCategory}>Create Category</button>
          </div>
          <ul>
            {categories.map(c => <li key={c.id}>{c.name}</li>)}
          </ul>

            <h4 style={{ marginTop: 24 }}>Budgets</h4>
            <div>
              <label>Month: </label>
              <input type="month" value={budgetMonth} onChange={e => {
                setBudgetMonth(e.target.value);
                loadBudgets(selectedHousehold, e.target.value);
              }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <select value={selectedCategoryForBudget} onChange={e => setSelectedCategoryForBudget(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Planned (cents)" type="number" value={budgetPlanned} onChange={e => setBudgetPlanned(e.target.value)} />
              <button onClick={upsertBudget} disabled={!selectedCategoryForBudget || !budgetPlanned}>Set Budget</button>
            </div>
            <table style={{ marginTop: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '4px 8px' }}>Category</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '4px 8px' }}>Planned</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '4px 8px' }}>Actual</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '4px 8px' }}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {summary?.items?.map(i => {
                  const cat = categories.find(c => c.id === i.category_id);
                  return (
                    <tr key={i.category_id}>
                      <td style={{ padding: '4px 8px' }}>{cat?.name || i.category_id}</td>
                      <td style={{ padding: '4px 8px' }}>{(i.planned_cents/100).toFixed(2)}</td>
                      <td style={{ padding: '4px 8px' }}>{(i.actual_cents/100).toFixed(2)}</td>
                      <td style={{ padding: '4px 8px' }}>{(i.variance/100).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {summary && <div style={{ marginTop: 8 }}>Summary: {summary.summary}</div>}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
}