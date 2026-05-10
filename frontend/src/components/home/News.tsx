import { useEffect, useRef } from "react";
import { Container } from "../ui/Container";
import { PostCard } from "../ui/PostCard";

const mockPosts = [
  {
    id: 1,
    etiqueta: "Evento",
    titulo: "Jornada de Liderazgo 2026",
    fecha: "15 de Mayo, 2026",
    imagen:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    descripcion:
      "Un encuentro intensivo para desarrollar habilidades de liderazgo basadas en principios cristianos.",
  },
  {
    id: 2,
    etiqueta: "Misión",
    titulo: "Viaje Solidario al Norte",
    fecha: "20 de Jun, 2026",
    imagen:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop",
    descripcion: "Llevando esperanza a comunidades rurales.",
  },
  {
    id: 3,
    etiqueta: "Académico",
    titulo: "Finanzas Éticas",
    fecha: "10 de Ago, 2026",
    imagen:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    descripcion: "Valores empresariales modernos.",
  },
  {
    id: 4,
    etiqueta: "Comunidad",
    titulo: "Encuentro Ex-Alumnos",
    fecha: "05 de Sep, 2026",
    imagen:
      "https://images.unsplash.com/photo-1523580494112-071ef046dd41?q=80&w=1000&auto=format&fit=crop",
    descripcion: "Reconectar y compartir testimonios.",
  },
  {
    id: 5,
    etiqueta: "Música",
    titulo: "Concierto de Primavera",
    fecha: "21 de Sep, 2026",
    imagen:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
    descripcion:
      "Celebramos la llegada de la primavera con nuestro coro oficial.",
  },
  {
    id: 6,
    etiqueta: "Evento",
    titulo: "Jornada de Liderazgo 2026",
    fecha: "15 de Mayo, 2026",
    imagen:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    descripcion:
      "Un encuentro intensivo para desarrollar habilidades de liderazgo basadas en principios cristianos.",
  },
  {
    id: 7,
    etiqueta: "Evento",
    titulo: "Jornada de Liderazgo 2026",
    fecha: "15 de Mayo, 2026",
    imagen:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    descripcion:
      "Un encuentro intensivo para desarrollar habilidades de liderazgo basadas en principios cristianos.",
  },
  {
    id: 8,
    etiqueta: "Evento",
    titulo: "Jornada de Liderazgo 2026",
    fecha: "15 de Mayo, 2026",
    imagen:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    descripcion:
      "Un encuentro intensivo para desarrollar habilidades de liderazgo basadas en principios cristianos.",
  },
];

export const News = () => {
  // 1. Referencia al contenedor del carrusel para poder moverlo con JavaScript
  const carouselRef = useRef<HTMLDivElement>(null);

  // 2. Efecto de Auto-Scroll Nativo
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        // Si llegamos al final del scroll, volvemos a cero de forma suave
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Si no, avanzamos 400px a la derecha
          carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
        }
      }
    }, 4000); // Se mueve cada 4 segundos

    return () => clearInterval(interval); // Limpiamos el intervalo si el usuario cambia de página
  }, []);

  return (
    <section
      id="actividades"
      className="bg-[#10183e] py-24 text-white overflow-hidden"
    >
      <Container>
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#bd222f]">
            Últimas Noticias
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Novedades FACEA
          </h2>
        </div>
      </Container>

      {/* CONTENEDOR DEL CARRUSEL (Estilo Grid Asimétrico) */}
      <div className="relative w-full">
        <div
          ref={carouselRef}
          // Grid de 2 filas, flujo horizontal.
          className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto px-6 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar lg:px-8 xl:px-[calc((100vw-1280px)/2+32px)]"
        >
          {mockPosts.map((post, index) => {
            const isLarge = index % 3 === 0;

            return (
              // EL ASIENTO DEL TREN: El padre define el tamaño y la posición en la grilla
              <div
                key={post.id}
                className={`shrink-0 snap-center ${
                  isLarge
                    ? "row-span-2 h-[500px] w-[85vw] md:w-[600px]"
                    : "row-span-1 h-[242px] w-[85vw] md:w-[400px]"
                }`}
              >
                {/* EL PASAJERO: La tarjeta se adapta a ese asiento */}
                <PostCard post={post} isLarge={isLarge} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
