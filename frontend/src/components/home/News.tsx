import { useEffect, useState } from "react";
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
];

export const News = () => {
  // 1. Estado: Sabemos exactamente qué tarjeta está en el centro
  const [activeIndex, setActiveIndex] = useState(0);
  const total = mockPosts.length;

  // 2. Funciones para avanzar y retroceder en círculo
  const next = () => setActiveIndex((prev) => (prev + 1) % total);
  const prev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  // 3. Auto-movimiento cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(interval);
  }, []); // El array vacío es correcto porque usamos la función callback (prev) en el set state

  // 4. La matemática del círculo: Calcula dónde va cada tarjeta respecto a la activa
  const getCardPosition = (index: number) => {
    let offset = index - activeIndex;

    // Magia modular: Si estamos en la 1ra tarjeta (0), la última (5) se vuelve la "anterior" (-1)
    if (offset < -Math.floor(total / 2)) offset += total;
    if (offset > Math.floor(total / 2)) offset -= total;

    // Asignamos las clases de Tailwind según su posición (offset)
    if (offset === 0) {
      // LA CENTRADA (Activa y Grande)
      return "translate-x-[-50%] scale-100 opacity-100 z-30 shadow-2xl";
    } else if (offset === -1) {
      // LA DE LA IZQUIERDA (Pequeña y opaca)
      return "translate-x-[-155%] md:translate-x-[-140%] lg:translate-x-[-165%] scale-[0.85] opacity-50 z-20 cursor-pointer hover:opacity-100";
    } else if (offset === 1) {
      // LA DE LA DERECHA (Pequeña y opaca)
      return "translate-x-[55%] md:translate-x-[40%] lg:translate-x-[65%] scale-[0.85] opacity-50 z-20 cursor-pointer hover:opacity-100";
    } else if (offset < -1) {
      // OCULTAS A LA IZQUIERDA
      return "translate-x-[-250%] scale-[0.7] opacity-0 z-10 pointer-events-none";
    } else {
      // OCULTAS A LA DERECHA
      return "translate-x-[150%] scale-[0.7] opacity-0 z-10 pointer-events-none";
    }
  };

  return (
    <section
      id="actividades"
      className="bg-[#10183e] py-24 text-white overflow-hidden relative"
    >
      <Container>
        <div className="mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#bd222f]">
            Últimas Noticias
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Novedades FACEA
          </h2>
        </div>
      </Container>

      {/* CONTENEDOR DEL CARRUSEL (Altura fija para las posiciones absolutas) */}
      <div className="relative h-[450px] w-full md:h-[550px]">
        {mockPosts.map((post, index) => {
          const positionClasses = getCardPosition(index);
          const isCenter = index === activeIndex;

          return (
            <div
              key={post.id}
              // Al hacer clic en una tarjeta de los costados, la traemos al centro
              onClick={() => {
                const offset = index - activeIndex;
                if (offset === 1 || offset === -(total - 1)) next();
                if (offset === -1 || offset === total - 1) prev();
              }}
              // Todas las tarjetas arrancan en el centro (left-1/2) y las movemos con Transform
              className={`absolute left-1/2 top-0 h-[400px] w-[80vw] max-w-[500px] md:h-[500px] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.35,1)] ${positionClasses}`}
            >
              {/* Le avisamos a PostCard si es la del centro para que muestre la descripción */}
              <PostCard post={post} isLarge={isCenter} />
            </div>
          );
        })}
      </div>
    </section>
  );
};
