// Servicio simple de Google OAuth sin Firebase
import React, { useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const SimpleGoogleAuth: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Simular un token de Google (para pruebas)
  const generateFakeToken = () => {
    // Este es un token JWT fake con estructura similar a Google
    const fakeToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjljNDA5Zjc3YTEwZDZjZTBjNTQ2Yzk5MGNkNjQzZmI4ZjYyZDgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDA3NDA4NzE4MTkyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDA3NDA4NzE4MTkyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEwNTAyMjUxMTU4OTIwMjU4OTc2IiwiaGQiOiJ0ZXN0LmNvbSIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiSHU5Nkh6cHFmNi1WeDNLdGIwVzJuUSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLyIsImdpdmVuX25hbWUiOiJUZXN0IiwiZmFtaWx5X25hbWUiOiJVc2VyIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MjQ1NzM4ODMsImV4cCI6MTYyNDU3NzQ4MywianRpIjoiYWJjZGVmZ2hpai4xMjM0NTY3ODkwIn0.fake-signature";
    setToken(fakeToken);
  };

  const testWithBackend = async () => {
    if (!token) {
      alert('Primero genera un token fake');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://fcnolimit-back.onrender.com/api/oauth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FCnoLimit-Test/1.0'
        },
        body: JSON.stringify({
          googleToken: token
        })
      });

      const data = await response.json();
      setResult(data);
      
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Token copiado al clipboard!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 Prueba Simple de Google OAuth</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={generateFakeToken}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔑 Generar Token Fake
        </button>
        
        <button 
          onClick={testWithBackend}
          disabled={loading || !token}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#34a853',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading || !token ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Probando...' : '🚀 Probar con Backend'}
        </button>
      </div>

      {token && (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>🔑 Token Generado:</h3>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '3px',
            wordBreak: 'break-all',
            fontSize: '12px',
            marginBottom: '10px',
            maxHeight: '100px',
            overflow: 'auto'
          }}>
            {token}
          </div>
          <button 
            onClick={() => copyToClipboard(token)}
            style={{
              padding: '5px 15px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            📋 Copiar Token
          </button>
        </div>
      )}

      {result && (
        <div style={{ 
          backgroundColor: result.error ? '#ffebee' : '#e8f5e8', 
          padding: '15px', 
          borderRadius: '5px' 
        }}>
          <h3>{result.error ? '❌ Error:' : '✅ Resultado:'}</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '3px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
        <h4>📋 Instrucciones:</h4>
        <ol>
          <li>Haz clic en "Generar Token Fake"</li>
          <li>Haz clic en "Probar con Backend"</li>
          <li>Verás el resultado de la validación (debería fallar con token fake)</li>
          <li>Copia el token y úsalo en Postman para probar manualmente</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleGoogleAuth;
