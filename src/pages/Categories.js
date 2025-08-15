import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

export default function CategoriesPage() {
  const { api } = useAuth();
  const { selectedId } = useHouseholds();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState('');

  const load = useCallback(async () => {
    if (!selectedId) {
      setCategories([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resp = await api.listCategories(selectedId);
      setCategories(resp.data || []);
    } catch (e) {
      setError("Failed to load categories");
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
        await api.updateCategory(editing, { name: name.trim() });
      } else {
        await api.createCategory(selectedId, name.trim());
      }
      setName('');
      setEditing(null);
      await load();
    } catch (e2) {
      setError("Failed to save category");
    }
  };

  const handleDelete = async id => {
    setError("");
    try {
      await api.deleteCategory(id);
      load();
    } catch (e) {
      setError("Failed to delete category");
    }
  };

  if (!selectedId) {
    return <div>Select a household first.</div>;
  }

  return (
    <div>
      <h3>Categories</h3>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={submit} style={{ marginTop: 12 }}>
        <input placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
        <button style={{ marginLeft: 8 }}>Add</button>
      </form>
      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
        {categories.length === 0 && !loading && <li style={{ opacity: 0.6 }}>No categories yet.</li>}
      </ul>
    </div>
  );
}
