import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

export default function HouseholdsPage() {
  const { api } = useAuth();
  const { households, refresh, selectedId, setSelectedId, loading, error } = useHouseholds();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const create = async e => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      await api.createHousehold(name.trim());
      setName('');
      await refresh();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3>Households</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading...</div>}
      <ul style={{ paddingLeft: 16 }}>
        {households.map(h => (
          <li key={h.id} style={{ marginBottom: 4 }}>
            <button
              style={{ fontWeight: h.id === selectedId ? 600 : 400 }}
              onClick={() => setSelectedId(h.id)}
            >
              {h.name} {h.id === selectedId && '✓'}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={create} style={{ marginTop: 16 }}>
        <input
          placeholder="New household name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button disabled={submitting || !name.trim()} style={{ marginLeft: 8 }}>
          Create
        </button>
      </form>
      {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
    </div>
  );
}
