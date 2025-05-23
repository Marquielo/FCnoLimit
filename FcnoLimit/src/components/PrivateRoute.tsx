import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, allowedRoles = [], ...rest }) => {
  // Obtener usuario del localStorage
  const userJSON = localStorage.getItem('usuario');
  let user = null;
  
  try {
    user = userJSON ? JSON.parse(userJSON) : null;
  } catch (e) {
    console.error('Error al parsear usuario:', e);
  }
  
  const isAuthenticated = Boolean(localStorage.getItem('token') && user);
  const hasRequiredRole = allowedRoles.length === 0 || (user && allowedRoles.includes(user.rol));
  
  return (
    <Route
      {...rest}
      render={props => {
        // Si no está autenticado, redirigir a login
        if (!isAuthenticated) {
          return <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />;
        }
        
        // Si no tiene el rol requerido, redirigir según su rol
        if (!hasRequiredRole) {
          switch (user.rol) {
            case 'admin':
              return <Redirect to="/admin/dashboard" />;
            case 'jugador':
              return <Redirect to="/jugador/perfil" />;
            case 'entrenador':
              return <Redirect to="/entrenador/perfil" />;
            default:
              return <Redirect to="/inicio" />;
          }
        }
        
        // Si todo está bien, mostrar el componente
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;