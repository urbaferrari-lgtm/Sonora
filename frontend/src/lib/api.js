const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function request(path, options = {}) {
  const token = localStorage.getItem('sonora-token');
  const response = await fetch(`${API}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) localStorage.removeItem('sonora-token');
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export { API };
