import { useNavigate } from "react-router-dom";
import faceaLogo from "../../assets/images/FACEA-logo.png";
import { authService } from "../../services/authService";

export const EditorNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
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
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-[#0d153b] transition-colors hover:border-[#bd222f] hover:text-[#bd222f]"
      >
        Cerrar sesión
      </button>
    </header>
  );
};