import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  nombre_completo: string;
  rol: string;
  correo: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = authService.getUser();
      const hasValidToken = await authService.getValidAccessToken();
      
      if (currentUser && hasValidToken) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (correo: string, contraseña: string) => {
    try {
      const result = await authService.login(correo, contraseña);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Limpiar estado local incluso si falla el logout en el servidor
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logoutAll = async () => {
    try {
      await authService.logoutAll();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout all:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    logoutAll,
    checkAuthStatus
  };
};

export default useAuth;
