import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  hoverEffect = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) => {
  // Estilos base: Fondo blanco puro, borde súper sutil y sombra difuminada
  const baseStyles =
    "overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-[0px_4px_20px_rgba(13,21,59,0.03)] transition-all duration-300";

  // Si la tarjeta es interactiva, le damos un efecto de elevación
  const hoverStyles = hoverEffect
    ? "hover:-translate-y-1 hover:shadow-[0px_12px_30px_rgba(13,21,59,0.08)] cursor-pointer"
    : "";

  // Control de espaciado interno
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10",
  };

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
