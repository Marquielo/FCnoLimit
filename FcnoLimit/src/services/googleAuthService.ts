// Servicio para Google OAuth integrado con tu backend
import { GoogleAuthProvider, signInWithPopup, getAuth, OAuthProvider } from 'firebase/auth';
import app from '../config/firebase';

export interface GoogleAuthResult {
  idToken: string;
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
  };
}

class GoogleAuthService {
  private auth = getAuth(app);
  private provider = new GoogleAuthProvider();

  constructor() {
    // Configurar scopes adicionales si los necesitas
    this.provider.addScope('email');
    this.provider.addScope('profile');
  }

  /**
   * Hacer login con Google y obtener ID token
   */
  async signInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      console.log('🔍 Iniciando login con Google...');
      
      // Abrir popup de Google
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;
      
      console.log('✅ Login con Google exitoso:', user.email);
        // Obtener ID token para enviar al backend
      const idToken = await user.getIdToken();
      
      console.log('🔑 ID Token obtenido:', idToken);
      console.log('📏 Longitud del token:', idToken.length, 'caracteres');
      
      return {
        idToken,
        user: {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || ''
        }
      };
      
    } catch (error: any) {
      console.error('❌ Error en login con Google:', error);
      
      // Manejo de errores específicos
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelado por el usuario');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup bloqueado por el navegador');
      } else {
        throw new Error(`Error de autenticación: ${error.message}`);
      }
    }
  }

  /**
   * Enviar token de Google al backend para obtener JWT
   */
  async authenticateWithBackend(idToken: string) {
    try {
      console.log('🔄 Enviando token a backend...');
      
      const response = await fetch('https://fcnolimit-back.onrender.com/api/oauth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FCnoLimit-Frontend/1.0'
        },
        body: JSON.stringify({
          googleToken: idToken
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Error en el servidor');
      }

      const data = await response.json();
      console.log('✅ Autenticación con backend exitosa');
      
      return data;
    } catch (error: any) {
      console.error('❌ Error autenticando con backend:', error);
      throw error;
    }
  }

  /**
   * Flujo completo: Google OAuth + Backend Authentication
   */
  async loginComplete() {
    try {
      // Paso 1: Login con Google
      const googleResult = await this.signInWithGoogle();
      
      // Paso 2: Autenticar con backend
      const backendResult = await this.authenticateWithBackend(googleResult.idToken);
      
      return {
        ...backendResult,
        googleUser: googleResult.user
      };
      
    } catch (error) {
      console.error('❌ Error en login completo:', error);
      throw error;
    }
  }
}

class AppleAuthService {
  private auth = getAuth(app);
  private provider = new OAuthProvider('apple.com');

  constructor() {
    // Configurar scopes para Apple
    this.provider.addScope('email');
    this.provider.addScope('name');
  }

  /**
   * Login con Apple ID
   */
  async signInWithApple(): Promise<GoogleAuthResult> {
    try {
      console.log('🍎 Iniciando login con Apple...');
      
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;
      
      console.log('✅ Login con Apple exitoso:', user.email);
      
      const idToken = await user.getIdToken();
      console.log('🔑 Apple ID Token obtenido:', idToken);
      
      return {
        idToken,
        user: {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || ''
        }
      };
      
    } catch (error: any) {
      console.error('❌ Error en login con Apple:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelado por el usuario');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup bloqueado por el navegador');
      } else {
        throw new Error(`Error de autenticación: ${error.message}`);
      }
    }
  }

  /**
   * Flujo completo Apple
   */
  async loginComplete() {
    try {
      const appleResult = await this.signInWithApple();
      
      const response = await fetch('https://fcnolimit-back.onrender.com/api/oauth/apple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FCnoLimit-Frontend/1.0'
        },
        body: JSON.stringify({
          appleToken: appleResult.idToken
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Error en el servidor');
      }

      const data = await response.json();
      return { ...data, appleUser: appleResult.user };
      
    } catch (error) {
      console.error('❌ Error en login completo con Apple:', error);
      throw error;
    }
  }
}

export const googleAuthService = new GoogleAuthService();
export const appleAuthService = new AppleAuthService();
export default googleAuthService;
