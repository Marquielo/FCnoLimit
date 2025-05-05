import { useEffect, useState } from 'react';
import api from '../api/axios';

// Definimos el tipo de la respuesta esperada del backend
type PingResponse = { message: string };

export default function PingTest() {
  // Estado para guardar el mensaje recibido del backend
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // Realizamos una petición GET al endpoint /ping del backend
    api.get<PingResponse>('/ping')
      .then(res => setMsg(res.data.message)) // Si responde, guardamos el mensaje
      .catch(() => setMsg('Error de conexión')); // Si hay error, mostramos mensaje de error
  }, []);

  // Mostramos la respuesta del backend en pantalla
  return <div>Respuesta del backend: {msg}</div>;
}