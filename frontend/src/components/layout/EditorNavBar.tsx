import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import faceaLogo from "../../assets/images/FACEA-logo.png";
import { authService } from "../../services/authService";

export const EditorNavBar = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md shadow-sm sm:px-6 md:px-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/" title="Ir a la portada" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
          <img src={faceaLogo} alt="FACEA" className="h-8 w-auto object-contain sm:h-9" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[#0d153b] sm:text-base">
              Editor FACEA
            </span>
            <span className="hidden text-[10px] font-medium text-slate-400 sm:inline">
              Panel de Administración
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0d153b] sm:inline-flex items-center gap-1.5"
        >
          <span>←</span> Ver Portada
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Cerrar sesión"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-[#0d153b] transition-colors hover:border-[#bd222f] hover:text-[#bd222f] active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
        >
          {loggingOut ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </div>
    </header>
  );
};
