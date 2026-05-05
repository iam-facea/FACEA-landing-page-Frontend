import { useState } from "react";
import { Button } from "../ui/Button";
import { useActiveSection } from "../../hooks/useActiveSection";
import { NAV_LINKS } from "../../constants/navigation";
import faceaLogo from "../../assets/images/FACEA-logo.png";

export const Navbar = () => {
  // Estado para el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NUEVO: Estado para saber qué sección está activa (por defecto arranca en 'inicio')
  const activeSection = useActiveSection(NAV_LINKS.map((link) => link.id));

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Función combinada para cuando alguien hace clic en un enlace
  const handleNavClick = () => {
    setIsMenuOpen(false); // Si estaba en móvil, cerramos el menú al elegir
  };

  return (
    <nav className="fixed top-0 z-50 flex h-16 w-full items-center border-b border-slate-200/40 bg-[#f9f9fb]/60 backdrop-blur-md transition-all">
      <div className="relative mx-auto flex w-full max-w-7xl items-center px-6 lg:px-8">
        {/* 1. MÓVIL: Logo a la izquierda */}
        <div className="z-50 md:hidden">
          <a
            href="#inicio"
            onClick={handleNavClick}
            aria-label="Volver al inicio"
            className="shrink-0 transition-transform hover:scale-105"
          >
            <img
              src={faceaLogo}
              alt="IAM FACEA Logo"
              className="h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* 2. DESKTOP: Logo + Enlaces en el CENTRO ABSOLUTO */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
          <a
            href="#inicio"
            onClick={handleNavClick}
            aria-label="Volver al inicio"
            className="shrink-0 transition-transform hover:scale-105"
          >
            <img
              src={faceaLogo}
              alt="IAM FACEA Logo"
              className="h-8 w-auto object-contain"
            />
          </a>

          {/* Mapeo dinámico de los enlaces Desktop */}
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={handleNavClick}
                // Aquí ocurre la magia del color rojo (#bd222f) vs gris (#64748b)
                className={`text-sm tracking-wide transition-colors ${
                  activeSection === link.id
                    ? "font-bold text-[#bd222f]"
                    : "font-medium text-[#64748b] hover:text-[#0d153b]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* 3. DERECHA: Botón CTA y Menú Hamburguesa */}
        <div className="ml-auto flex items-center z-50">
          <div className="hidden md:block">
            <Button variant="primary" size="sm">
              Tienda y Donaciones
            </Button>
          </div>

          <button
            className="relative ml-4 p-2 text-[#0d153b] transition-colors hover:text-[#bd222f] focus:outline-none md:hidden"
            onClick={toggleMenu}
            aria-label="Alternar menú móvil"
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 4. MENÚ DESPLEGABLE MÓVIL */}
      <div
        className={`absolute left-0 top-16 w-full border-b border-slate-200/40 bg-[#f9f9fb]/95 p-6 shadow-xl backdrop-blur-xl md:hidden origin-top transform transition-all duration-300 ease-out ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {/* Mapeo dinámico de los enlaces Móviles */}
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={handleNavClick}
              className={`text-base tracking-wide transition-colors ${
                activeSection === link.id
                  ? "font-bold text-[#bd222f]"
                  : "font-medium text-[#64748b] hover:text-[#0d153b]"
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="mt-4 border-t border-slate-200 pt-6">
            <Button variant="primary" fullWidth onClick={toggleMenu}>
              Tienda y Donaciones
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
