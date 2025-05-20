import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('usuario');
      return !!(token && userString && JSON.parse(userString));
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return false;
    }
  };

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/auth',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;