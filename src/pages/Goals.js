import React, { useEffect, useState } from "react";
import axios from "../api/client";
import { useAuth } from '../context/AuthContext';
import formatCurrency from '../utils/format';

const defaultGoal = {
  name: "",
  target_cents: 0,
  current_cents: 0,
  due_date: ""
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultGoal);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { api } = useAuth();

  // fetchGoals is top-level so other handlers can call it
  async function fetchGoals() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/goals");
      setGoals(res.data || []);
    } catch (err) {
      setError("Failed to load goals");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    // keep numeric fields as numbers
    if (name === 'target_cents' || name === 'current_cents') {
      setForm(f => ({ ...f, [name]: Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleEdit(goal) {
    setEditing(goal.id);
    setForm(goal);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await axios.put(`/api/goals/${editing}`, form);
      } else {
        await axios.post("/api/goals", form);
      }
      setEditing(null);
      setForm(defaultGoal);
      await fetchGoals();
    } catch (err) {
      setError("Failed to save goal");
    }
  }

  // Suggest required monthly contribution using the savings-goal calculator
  const [suggestedMonthly, setSuggestedMonthly] = useState(null);
  const [suggestError, setSuggestError] = useState("");
  async function handleSuggest(e) {
    e.preventDefault();
    setSuggestError("");
    setSuggestedMonthly(null);
    try {
      // call the protected calculator endpoint via API client (adds auth header)
      const resp = await api.request('/v1/calculators/savings-goal', {
        method: 'POST',
        body: JSON.stringify({
          goal_amount: form.target_cents / 100,
          current_savings: form.current_cents / 100,
          monthly_contribution: 0,
          annual_return: 0
        })
      });
      setSuggestedMonthly(resp.data.required_monthly);
    } catch (err) {
      setSuggestError(err.message || String(err));
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Goals</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Goal Name" style={{ fontSize: '1.1rem', padding: '0.75rem' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input name="target_cents" type="number" value={form.target_cents} onChange={handleChange} placeholder="Target Amount (cents)" style={{ fontSize: '1.1rem', padding: '0.75rem', flex: 1 }} />
          <input name="current_cents" type="number" value={form.current_cents} onChange={handleChange} placeholder="Current Amount (cents)" style={{ fontSize: '1.1rem', padding: '0.75rem', flex: 1 }} />
        </div>
        <input name="due_date" type="date" value={form.due_date} onChange={handleChange} placeholder="Due Date" style={{ fontSize: '1.1rem', padding: '0.75rem' }} />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="submit" style={{ fontSize: '1.1rem', padding: '0.75rem' }}>{editing ? "Update" : "Create"} Goal</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(defaultGoal); }} style={{ fontSize: '1.1rem', padding: '0.75rem' }}>Cancel</button>}
          <button type="button" onClick={handleSuggest} style={{ fontSize: '0.95rem', padding: '0.5rem 0.75rem', marginLeft: 'auto' }}>Suggest monthly</button>
        </div>
        {suggestError && <div style={{ color: 'red' }}>{suggestError}</div>}
        {suggestedMonthly !== null && (
          <div style={{ marginTop: 8, color: '#065f46', fontWeight: 600 }}>Suggested monthly: {formatCurrency(suggestedMonthly)}</div>
        )}
      </form>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {goals.map(goal => {
          const progress = goal.target_cents > 0 ? Math.min(1, goal.current_cents / goal.target_cents) : 0;
          return (
            <li key={goal.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>{goal.name}</b>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Target: {formatCurrency(goal.target_cents / 100)} · Current: {formatCurrency(goal.current_cents / 100)}</div>
                </div>
                <div>
                  <button onClick={() => handleEdit(goal)} style={{ marginLeft: '1rem' }}>Edit</button>
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: 10, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${progress * 100}%`, height: '100%', background: '#10b981' }} />
                </div>
                <div style={{ fontSize: '0.85rem', color: '#374151', marginTop: 6 }}>{Math.round(progress * 100)}% complete</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
