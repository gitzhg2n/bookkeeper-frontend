import { useEffect, useState } from 'react';
import api from '../utils/api';

export function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState('');
  
  const dependencies = options.dependencies || [];

  useEffect(() => {
    if (options.skip) return;
    
    setLoading(true);
    setError('');
    
    api
      .get(endpoint)
      .then(res => setData(res.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to fetch data.'))
      .finally(() => setLoading(false));
      
  }, [endpoint, options.skip, ...dependencies]); // Include dependencies in dependency array

  return { data, loading, error };
}