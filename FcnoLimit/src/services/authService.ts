// Servicio de autenticación con soporte para refresh tokens
export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  token?: string; // Para compatibilidad con sistema legacy
  user: {
    id: number;
    nombre_completo: string;
    rol: string;
    correo: string;
  };
  expiresIn?: number;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

class AuthService {
  private readonly API_BASE = import.meta.env.VITE_API_URL || 'https://fcnolimit-back.onrender.com/api';
  
  constructor() {
    // Debug de configuración al inicializar
    console.log('🔧 AuthService Config:');
    console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('- API_BASE final:', this.API_BASE);
    console.log('- Environment mode:', import.meta.env.MODE);
    console.log('- Is Dev:', import.meta.env.DEV);
    console.log('- Is Prod:', import.meta.env.PROD);
    console.log('- All env vars:', import.meta.env);
  }
  
  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const user = this.getUser();
    const accessToken = localStorage.getItem('accessToken');
    const legacyToken = localStorage.getItem('token');
    
    return !!(user && (accessToken || legacyToken));
  }

  /**
   * Obtiene el usuario actual del localStorage
   */
  getUser() {
    try {
      const userJSON = localStorage.getItem('usuario');
      return userJSON ? JSON.parse(userJSON) : null;
    } catch {
      return null;
    }
  }

  /**
   * Obtiene el token de acceso válido, renovándolo si es necesario
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const legacyToken = localStorage.getItem('token');

    // Si tenemos sistema legacy, usar ese token
    if (!accessToken && legacyToken) {
      console.log('🔒 Usando token legacy');
      return legacyToken;
    }

    // Si no tenemos tokens, usuario no autenticado
    if (!accessToken || !refreshToken) {
      console.log('❌ No hay tokens disponibles');
      return null;
    }

    // Verificar si el access token está cerca de expirar (5 minutos antes)
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    if (tokenExpiresAt) {
      const expirationTime = parseInt(tokenExpiresAt);
      const timeUntilExpiry = expirationTime - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeUntilExpiry > fiveMinutes) {
        // Token aún válido
        console.log('✅ Access token aún válido');
        return accessToken;
      } else {
        // Token próximo a expirar, renovar
        console.log('🔄 Access token próximo a expirar, renovando...');
        return await this.refreshAccessToken();
      }
    }

    // Si no hay información de expiración, asumir que es válido
    return accessToken;
  }

  /**
   * Renueva el access token usando el refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.log('❌ No hay refresh token disponible');
      this.logout();
      return null;
    }

    try {
      console.log('📡 Enviando request para renovar token...');
      
      const response = await fetch(`${this.API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        console.log('❌ Error al renovar token:', response.status);
        this.logout();
        return null;
      }

      const data: RefreshResponse = await response.json();
      
      // Actualizar tokens en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('tokenExpiresAt', (Date.now() + (data.expiresIn * 1000)).toString());
      
      console.log('✅ Access token renovado exitosamente');
      return data.accessToken;
      
    } catch (error) {
      console.error('❌ Error al renovar access token:', error);
      this.logout();
      return null;
    }
  }

  /**
   * Realiza login del usuario
   */
  async login(correo: string, contraseña: string): Promise<LoginResponse> {
    const loginUrl = `${this.API_BASE}/usuarios/login`;
    console.log('🔗 URL de login:', loginUrl);
    console.log('📧 Datos:', { correo, contraseña: contraseña ? '***' : 'NO' });
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, contraseña })
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error response:', error);
      throw new Error(error.error || 'Error de autenticación');
    }

    const data: LoginResponse = await response.json();
    
    // Almacenar tokens según el tipo de respuesta
    if (data.accessToken && data.refreshToken) {
      // Sistema nuevo con refresh tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpiresAt', (Date.now() + (data.expiresIn! * 1000)).toString());
      console.log('🔒 Login exitoso con refresh tokens');
    } else if (data.token) {
      // Sistema legacy
      localStorage.setItem('token', data.token);
      console.log('🔒 Login exitoso con token legacy');
    }
    
    localStorage.setItem('usuario', JSON.stringify(data.user));
    
    return data;
  }

  /**
   * Cierra sesión del usuario
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Si tenemos refresh token, notificar al servidor
    if (refreshToken) {
      try {
        await fetch(`${this.API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken })
        });
        console.log('✅ Logout notificado al servidor');
      } catch (error) {
        console.error('⚠️ Error al notificar logout al servidor:', error);
      }
    }

    // Limpiar localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('tokenExpiresAt');
    
    console.log('🔓 Sesión cerrada');
  }

  /**
   * Cierra todas las sesiones del usuario
   */
  async logoutAll(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      try {
        await fetch(`${this.API_BASE}/auth/logout-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken })
        });
        console.log('✅ Todas las sesiones cerradas');
      } catch (error) {
        console.error('⚠️ Error al cerrar todas las sesiones:', error);
      }
    }

    // Limpiar localStorage
    this.logout();
  }

  /**
   * Obtiene las sesiones activas del usuario
   */
  async getUserSessions() {
    const token = await this.getValidAccessToken();
    
    if (!token) {
      throw new Error('No hay token válido');
    }

    const response = await fetch(`${this.API_BASE}/auth/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener sesiones');
    }

    return await response.json();
  }

  /**
   * Configura un interceptor para renovar tokens automáticamente
   */
  setupAxiosInterceptor(axiosInstance: any) {
    // Request interceptor
    axiosInstance.interceptors.request.use(async (config: any) => {
      const token = await this.getValidAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor para manejar tokens expirados
    axiosInstance.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const newToken = await this.refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } else {
            // Si no se puede renovar, redirigir a login
            window.location.href = '/auth';
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export const authService = new AuthService();
export default authService;
