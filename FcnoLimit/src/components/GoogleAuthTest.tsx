// Componente de prueba para Google OAuth
import React, { useState } from 'react';
import { googleAuthService } from '../services/googleAuthService';

interface AuthResult {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  googleUser?: any;
}

const GoogleAuthTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuthResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string>('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setIdToken('');

    try {
      console.log('🚀 Iniciando login completo con Google...');
      
      const authResult = await googleAuthService.loginComplete();
      
      console.log('🎉 Login exitoso:', authResult);
      setResult(authResult);
      
      // Guardar tokens en localStorage (opcional para prueba)
      if (authResult.accessToken) {
        localStorage.setItem('accessToken', authResult.accessToken);
      }
      if (authResult.refreshToken) {
        localStorage.setItem('refreshToken', authResult.refreshToken);
      }
      
    } catch (err: any) {
      console.error('💥 Error en login:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginOnly = async () => {
    setLoading(true);
    setError(null);
    setIdToken('');

    try {
      const googleResult = await googleAuthService.signInWithGoogle();
      setIdToken(googleResult.idToken);
      console.log('🔑 Token ID para copiar:', googleResult.idToken);
    } catch (err: any) {
      setError(err.message);
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
      <h2>🧪 Prueba de Google OAuth</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Procesando...' : '🔐 Login Completo (Google + Backend)'}
        </button>
        
        <button 
          onClick={handleGoogleLoginOnly}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#34a853',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Cargando...' : '🔑 Solo obtener Token ID'}
        </button>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ❌ <strong>Error:</strong> {error}
        </div>
      )}

      {idToken && (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>🔑 Token ID obtenido:</h3>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '3px',
            wordBreak: 'break-all',
            fontSize: '12px',
            marginBottom: '10px'
          }}>
            {idToken}
          </div>
          <button 
            onClick={() => copyToClipboard(idToken)}
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
          <p style={{ fontSize: '14px', color: '#666' }}>
            💡 Copia este token y úsalo en Postman para probar el endpoint /api/oauth/google
          </p>
        </div>
      )}

      {result && (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '5px' 
        }}>
          <h3>✅ Resultado del Login:</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '3px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthTest;
