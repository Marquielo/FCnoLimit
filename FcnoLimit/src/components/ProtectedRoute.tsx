import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { authService } from "../services/authService";

interface ProtectedRouteProps extends RouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  ...rest
}) => {
  // Usar el servicio de autenticación
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Si no hay token, redirigir a login
  if (!isAuthenticated || !user) {
    return <Redirect to="/auth" />;
  }

  // Si hay roles permitidos y el usuario no tiene un rol válido
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol del usuario
    switch (user.rol) {
      case "admin":
        return <Redirect to="/admin" />;
      case "jugador":
        return <Redirect to="/jugador/perfil" />;
      case "entrenador":
        return <Redirect to="/entrenador/dashboard" />;
      default:
        return <Redirect to="/inicio" />;
    }
  }

  // Si todo está correcto, renderizar la ruta
  return <Route {...rest} />;
};

export default ProtectedRoute;