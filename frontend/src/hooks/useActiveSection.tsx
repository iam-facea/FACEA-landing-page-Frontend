import { useState, useEffect } from "react";

export const useActiveSection = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const options = {
      root: null,
      // El elemento se considera "activo" cuando cruza la mitad vertical de la pantalla
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // La condición mágica: Si la sección cruzó la mitad de la pantalla...
        if (entry.isIntersecting) {
          // ...actualizamos nuestro estado con el ID de esa sección
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Mandamos a vigilar a todos los IDs que le pasamos al hook
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Limpieza al desmontar (evita fugas de memoria)
    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sectionIds]);

  return activeId; // Devolvemos el ID ganador
};
