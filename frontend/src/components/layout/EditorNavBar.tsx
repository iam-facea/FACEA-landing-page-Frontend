import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <a href="/editor" className="flex items-center gap-3">
        <img src={faceaLogo} alt="FACEA" className="h-9 w-auto object-contain" />
        <span className="text-sm font-semibold tracking-wide text-[#0d153b]">
          Editor FACEA
        </span>
      </a>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-[#0d153b] transition-colors hover:border-[#bd222f] hover:text-[#bd222f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loggingOut ? "Cerrando..." : "Cerrar sesión"}
      </button>
    </header>
  );
};
