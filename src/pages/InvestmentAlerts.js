import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';

const defaultAlert = {
  assetSymbol: "",
  alertType: "price",
  direction: "up",
  threshold: 0,
  active: true,
  compound: null,
  time_window: null,
  cooldown_minutes: 0,
  custom_rule: ""
};

export default function InvestmentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultAlert);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { api } = useAuth();
  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAlerts() {
    setLoading(true);
    setError("");
    try {
      const res = await api.request('/v1/investment_alerts');
      setAlerts(res.data);
    } catch (err) {
      setError(err.message || "Failed to load alerts");
    }
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleEdit(alert) {
    setEditing(alert.id);
    setForm(alert);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editing) {
        await api.request(`/v1/investment_alerts/${editing}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await api.request('/v1/investment_alerts', { method: 'POST', body: JSON.stringify(form) });
      }
      setEditing(null);
      setForm(defaultAlert);
      fetchAlerts();
    } catch (err) {
      setError(err.message || "Failed to save alert");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    setError("");
    setLoading(true);
    try {
      await api.request(`/v1/investment_alerts/${id}`, { method: 'DELETE' });
      fetchAlerts();
    } catch (err) {
      setError(err.message || "Failed to delete alert");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Investment Alerts</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="assetSymbol" value={form.assetSymbol} onChange={handleChange} placeholder="Asset Symbol" />
        <select name="alertType" value={form.alertType} onChange={handleChange}>
          <option value="price">Price</option>
          <option value="percent_change">Percent Change</option>
          <option value="value">Value</option>
        </select>
        <select name="direction" value={form.direction} onChange={handleChange}>
          <option value="up">Up</option>
          <option value="down">Down</option>
        </select>
        <input name="threshold" type="number" value={form.threshold} onChange={handleChange} placeholder="Threshold" />
        <input name="cooldown_minutes" type="number" value={form.cooldown_minutes} onChange={handleChange} placeholder="Cooldown (min)" />
        <input name="custom_rule" value={form.custom_rule} onChange={handleChange} placeholder="Custom Rule (optional)" />
        {/* Advanced: Compound and TimeWindow editors would go here */}
        <button type="submit">{editing ? "Update" : "Create"} Alert</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm(defaultAlert); }}>Cancel</button>}
      </form>
      <ul style={{ padding: 0, listStyle: 'none', marginTop: '2rem' }}>
        {alerts.map(alert => (
          <li key={alert.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <div><b>{alert.assetSymbol}</b> ({alert.alertType}, {alert.direction})</div>
            <div>Threshold: {alert.threshold}</div>
            <div>Cooldown: {alert.cooldown_minutes} min</div>
            <div>Custom Rule: {alert.custom_rule}</div>
            <button onClick={() => handleEdit(alert)}>Edit</button>
            <button onClick={() => handleDelete(alert.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
