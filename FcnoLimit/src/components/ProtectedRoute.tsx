import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface ProtectedRouteProps extends RouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  ...rest
}) => {
  // Obtener información del usuario del localStorage
  const token = localStorage.getItem("token");
  const userJSON = localStorage.getItem("usuario");
  let user = null;

  try {
    if (userJSON) user = JSON.parse(userJSON);
  } catch (e) {
    console.error("Error al parsear usuario del localStorage", e);
  }

  // Si no hay token, redirigir a login
  if (!token || !user) {
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