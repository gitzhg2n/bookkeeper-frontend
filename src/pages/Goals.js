import React, { useEffect, useState } from "react";
import axios from "../api/client";

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

    useEffect(() => {
      async function fetchGoals() {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get("/api/goals");
          setGoals(res.data);
        } catch (err) {
          setError("Failed to load goals");
        }
        setLoading(false);
      }
      fetchGoals();
    }, []);

    function handleChange(e) {
      const { name, value } = e.target;
      setForm(f => ({ ...f, [name]: value }));
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
        fetchGoals();
      } catch (err) {
        setError("Failed to save goal");
      }
    }

    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Goals</h2>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Goal Name" style={{ fontSize: '1.1rem', padding: '0.75rem' }} />
          <input name="target_cents" type="number" value={form.target_cents} onChange={handleChange} placeholder="Target Amount (cents)" style={{ fontSize: '1.1rem', padding: '0.75rem' }} />
          <input name="due_date" type="date" value={form.due_date} onChange={handleChange} placeholder="Due Date" style={{ fontSize: '1.1rem', padding: '0.75rem' }} />
          <button type="submit" style={{ fontSize: '1.1rem', padding: '0.75rem' }}>{editing ? "Update" : "Create"} Goal</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(defaultGoal); }} style={{ fontSize: '1.1rem', padding: '0.75rem' }}>Cancel</button>}
        </form>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {goals.map(goal => (
            <li key={goal.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <b>{goal.name}</b> - Target: {goal.target_cents} - Due: {goal.due_date}
              <button onClick={() => handleEdit(goal)} style={{ marginLeft: '1rem' }}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  useEffect(() => {
    fetchGoals();
  }, []);
