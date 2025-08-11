import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const HouseholdContext = createContext();

export function HouseholdProvider({ children }) {
  const { api, isAuthenticated } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setHouseholds([]);
      setSelectedId(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await api.listHouseholds();
      const list = resp.data || [];
      setHouseholds(list);
      if (list.length > 0 && !list.find(h => h.id === selectedId)) {
        setSelectedId(list[0].id);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated, selectedId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <HouseholdContext.Provider value={{ households, selectedId, setSelectedId, refresh, loading, error }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHouseholds() {
  const ctx = useContext(HouseholdContext);
  if (!ctx) {
    throw new Error('useHouseholds must be used within HouseholdProvider');
  }
  return ctx;
}
