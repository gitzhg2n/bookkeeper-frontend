import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function HouseholdsAccountsDemo() {
  const { api } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [newHousehold, setNewHousehold] = useState('');
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [newAccount, setNewAccount] = useState('');
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

  const createAccount = async () => {
    try {
      await api.createAccount(selectedHousehold, { name: newAccount, type: 'checking', currency: 'USD', opening_balance_cents: 0 });
      setNewAccount('');
      loadAccounts(selectedHousehold);
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
            <button onClick={() => { setSelectedHousehold(h.id); loadAccounts(h.id); }}>
              {h.name} ({h.role})
            </button>
          </li>
        ))}
      </ul>
      {selectedHousehold && (
        <div style={{ marginTop: 24 }}>
          <h4>Accounts in Household {selectedHousehold}</h4>
            <div>
              <input placeholder="New account name" value={newAccount} onChange={e => setNewAccount(e.target.value)} />
              <button onClick={createAccount} disabled={!newAccount}>Create Account</button>
            </div>
            <ul>
              {accounts.map(a => <li key={a.id}>{a.name} - {a.type} - {a.currency}</li>)}
            </ul>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
}