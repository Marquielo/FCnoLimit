import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // Debe ser: https://fcnolimit-back.onrender.com/api

const api = axios.create({
  baseURL: apiUrl,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Uso correcto:
// api.post('/usuarios/login', data); // Esto hará la petición a https://fcnolimit-back.onrender.com/api/usuarios/login