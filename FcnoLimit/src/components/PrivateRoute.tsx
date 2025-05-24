import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  allowedRoles: string[];
  // Hacer path opcional, igual que en RouteProps
  // path?: string | string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  allowedRoles,
  ...rest
}) => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && currentUser && allowedRoles.includes(currentUser.role) ? (
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