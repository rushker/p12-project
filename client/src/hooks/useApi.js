import { useEffect, useState } from 'react';
import api from '../api/client';

export default function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(endpoint)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading };
}