import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

export default function CategoriesPage() {
  const { api } = useAuth();
  const { selectedId } = useHouseholds();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [name, setName] = useState('');

  const load = useCallback(async () => {
    if (!selectedId) {
      setCategories([]);
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const resp = await api.listCategories(selectedId);
      setCategories(resp.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedId, api]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async e => {
    e.preventDefault();
    if (!selectedId || !name.trim()) {
      return;
    }
    try {
      await api.createCategory(selectedId, name.trim());
      setName('');
      await load();
    } catch (e2) {
      setErr(e2.message);
    }
  };

  if (!selectedId) {
    return <div>Select a household first.</div>;
  }

  return (
    <div>
      <h3>Categories</h3>
      {loading && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <ul>
        {categories.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
        {categories.length === 0 && !loading && <li style={{ opacity: 0.6 }}>No categories yet.</li>}
      </ul>
      <form onSubmit={submit} style={{ marginTop: 12 }}>
        <input placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
        <button style={{ marginLeft: 8 }}>Add</button>
      </form>
    </div>
  );
}
