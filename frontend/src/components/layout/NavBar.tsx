import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { useActiveSection } from "../../hooks/useActiveSection";
import { NAV_LINKS, NAV_IDS } from "../../constants/navigation";
import faceaLogo from "../../assets/images/FACEA-logo.png";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeSection = useActiveSection(NAV_IDS);

  // 1. Usamos la clase de Tailwind en lugar de modificar el estilo inline
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Limpieza de seguridad
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 flex h-16 w-full items-center border-b border-slate-200/40 bg-[#f9f9fb]/90 backdrop-blur-md transition-all">
      {/* CONTENEDOR PRINCIPAL DE LA BARRA (Debe estar por encima de todo, z-50) */}
      <div className="relative z-50 mx-auto flex w-full max-w-7xl items-center px-6 lg:px-8">
        {/* MÓVIL: Logo */}
        <div className="md:hidden">
          <a
            href="#inicio"
            onClick={handleNavClick}
            className="shrink-0 transition-transform hover:scale-105"
          >
            <img
              src={faceaLogo}
              alt="IAM FACEA Logo"
              className="h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* DESKTOP: Logo + Enlaces */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
          <a
            href="#inicio"
            onClick={handleNavClick}
            className="shrink-0 transition-transform hover:scale-105"
          >
            <img
              src={faceaLogo}
              alt="IAM FACEA Logo"
              className="h-8 w-auto object-contain"
            />
          </a>
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={handleNavClick}
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

        {/* DERECHA: Botón y Menú Hamburguesa */}
        <div className="ml-auto flex items-center">
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

      {/* 2. LA MAGIA: El Overlay (Guardaespaldas del scroll) */}
      {/* 'touch-none' bloquea todo intento de scroll nativo en móviles */}
      <div
        className={`fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm touch-none transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleNavClick}
      />

      {/* 3. MENÚ DESPLEGABLE MÓVIL (Por encima del overlay, z-50) */}
      <div
        className={`absolute left-0 top-16 w-full z-50 border-b border-slate-200/40 bg-[#f9f9fb] p-6 shadow-xl md:hidden origin-top transform transition-all duration-300 ease-out ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4">
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
            <Button variant="primary" fullWidth onClick={handleNavClick}>
              Tienda y Donaciones
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
