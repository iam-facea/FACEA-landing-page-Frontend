// Exportamos la constante en mayúsculas para indicar que es inmutable
export const NAV_LINKS = [
  { id: "inicio", label: "Inicio", href: "#inicio" },
  { id: "nosotros", label: "Nosotros", href: "#nosotros" },
  { id: "actividades", label: "Novedades", href: "#actividades" },
  { id: "impacto", label: "Impacto", href: "#impacto" },
];

export const NAV_IDS = NAV_LINKS.map((link) => link.id);