import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    authService.hasStoredSession(),
  );

  useEffect(() => {
    let isMounted = true;
    authService.isAuthenticated().then((authenticated) => {
      if (isMounted) {
        setIsAuthenticated(authenticated);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading && !isAuthenticated) {
    // Spinner o pantalla neutra mientras valida con Supabase
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#bd222f]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
