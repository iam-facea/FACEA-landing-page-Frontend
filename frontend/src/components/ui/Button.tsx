import React from "react";

// Tipamos nuestro componente extendiendo los atributos nativos de HTML
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  // 1. ESTILOS BASE: Lo que comparten TODOS los botones (borde, fuente, animación)
  // Agregué 'active:scale-[0.98]' para que haga un pequeño hundimiento al hacer clic real
  // 'inline-flex items-center justify-center' asegura que el texto (y futuros íconos) queden centrados
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-in-out hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100";

  // 2. VARIANTES DE COLOR: Tus diseños exactos
  const variants = {
    primary: "bg-[#10183e] text-white shadow-lg",
    // Le agregué un leve borde sutil al secundario que suele ayudar en fondos blancos
    secondary:
      "bg-[#e8e8ea] text-[#0d153b] hover:bg-[#e2e2e4] border border-transparent hover:border-[#d1d1d4]",
  };

  // 3. TAMAÑOS: Para poder reusarlo en distintas partes de la web
  const sizes = {
    sm: "px-4 py-2 text-sm", // Ideal para formularios o tarjetas pequeñas
    md: "px-6 py-3 text-base", // El tamaño estándar por defecto
    lg: "px-8 py-4 text-lg", // <-- Este es TU tamaño original, ideal para el HeroBanner
  };

  // 4. ANCHO COMPLETO: Utilidad rápida para vistas móviles
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      // Juntamos todas las piezas dinámicamente y permitimos inyectar clases extra con 'className'
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
