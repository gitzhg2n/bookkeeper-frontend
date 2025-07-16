import { useEffect, useState } from 'react';
import api from '../api';

export function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState('');

  useEffect(() => {
    if (options.skip) return;
    setLoading(true);
    api.get(endpoint)
      .then(res => setData(res.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to fetch data.'))
      .finally(() => setLoading(false));
  }, [endpoint, options.skip]);

  return { data, loading, error };
}