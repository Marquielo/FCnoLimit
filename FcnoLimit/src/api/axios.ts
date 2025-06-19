import axios from 'axios';
import { authService } from '../services/authService';

const apiUrl = import.meta.env.VITE_API_URL; // Debe ser: https://fcnolimit-back.onrender.com/api

const api = axios.create({
  baseURL: apiUrl,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar interceptors usando el servicio de autenticación
authService.setupAxiosInterceptor(api);

export default api;

// Uso correcto:
// api.post('/usuarios/login', data); // Esto hará la petición a https://fcnolimit-back.onrender.com/api/usuarios/login