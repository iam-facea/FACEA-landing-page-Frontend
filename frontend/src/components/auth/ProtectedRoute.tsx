import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!authService.isAuthenticated()) {
    // Si no está logueado, lo pateamos a la ruta de login
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, renderizamos lo que sea que le hayamos pasado adentro
  return <>{children}</>;
};
