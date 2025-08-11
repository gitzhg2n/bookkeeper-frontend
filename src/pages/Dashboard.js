import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHouseholds } from '../context/HouseholdContext';

function currentMonth() {
  const d = new Date();
  return d.toISOString().slice(0, 7);
}

export default function Dashboard() {
  const { api } = useAuth();
  const { selectedId } = useHouseholds();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [month] = useState(currentMonth());

  useEffect(() => {
    const load = async () => {
      if (!selectedId) {
        setSummary(null);
        return;
      }
      setLoading(true);
      try {
        const resp = await api.budgetSummary(selectedId, month);
        setSummary(resp.data);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedId, month, api]);

  if (!selectedId) {
    return (
      <div>
        <h3>Dashboard</h3>
        <p>Select a household to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Dashboard</h3>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Budget Summary for {month}</div>
      </div>
      {loading && <div>Loading...</div>}
      {summary && (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 4, background: '#fff' }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>Total Planned</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>${(summary.total_planned_cents / 100).toFixed(2)}</div>
          </div>
          <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 4, background: '#fff' }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>Total Actual</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>${(summary.total_actual_cents / 100).toFixed(2)}</div>
          </div>
          <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 4, background: '#fff' }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>Variance</div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: summary.total_planned_cents - summary.total_actual_cents < 0 ? 'red' : 'inherit',
              }}
            >
              ${((summary.total_planned_cents - summary.total_actual_cents) / 100).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
