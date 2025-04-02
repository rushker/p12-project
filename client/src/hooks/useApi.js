import { useState } from 'react';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (...args) => {
    try {
      setLoading(true);
      const response = await apiFunc(...args);
      setData(response);
      return { success: true, ...response };
    } catch (err) {
      setError(err.message || 'Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { callApi, data, loading, error };
};