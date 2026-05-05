import { Container } from "../ui/Container";
import { PostCard } from "../ui/PostCard";

// 1. MOCK DE BASE DE DATOS:
// Así se verían los datos que después podrían venir desde una API.
const mockPosts = [
  {
    id: 1,
    category: "Evento",
    title: "Jornada de Liderazgo 2026",
    date: "15 de Mayo, 2026",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    description:
      "Un encuentro intensivo para desarrollar habilidades de liderazgo basadas en principios cristianos.",
  },
  {
    id: 2,
    category: "Misión",
    title: "Viaje Solidario al Norte",
    date: "20 de Junio, 2026",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop",
    description:
      "Sumate a nuestro equipo de voluntarios para llevar recursos y esperanza a comunidades rurales.",
  },
  {
    id: 3,
    category: "Académico",
    title: "Taller de Finanzas Éticas",
    date: "10 de Agosto, 2026",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    description:
      "Cómo aplicar los valores de FACEA en el mundo empresarial moderno y la toma de decisiones.",
  },
  {
    id: 4,
    category: "Comunidad",
    title: "Encuentro de Ex-Alumnos",
    date: "05 de Septiembre, 2026",
    image:
      "https://images.unsplash.com/photo-1523580494112-071ef046dd41?q=80&w=1000&auto=format&fit=crop",
    description:
      "Una noche para reconectar, compartir testimonios y ver el impacto de nuestra red.",
  },
];

export const News = () => {
  return (
    <section
      id="actividades"
      className="bg-[#10183e] py-24 text-white overflow-hidden"
    >
      <Container>
        {/* ENCABEZADO */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#bd222f]">
              Últimas Noticias
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Novedades FACEA
            </h2>
          </div>

          {/* Botón opcional para ir a ver "todos los posts" en otra página */}
          <a
            href="#todas"
            className="hidden text-sm font-semibold text-white/70 transition-colors hover:text-white md:block"
          >
            Ver todas &rarr;
          </a>
        </div>
      </Container>

      {/* 
        CARRUSEL ESTILO APPLE
        - overflow-x-auto: Permite scroll horizontal
        - snap-x snap-mandatory: Fuerza a que el scroll frene en cada tarjeta
        - hide-scrollbar: Oculta la barra fea del navegador (requiere un pequeño ajuste en tu index.css)
      */}
      <div className="relative w-full">
        <div className="flex w-full gap-6 overflow-x-auto px-6 pb-12 pt-4 snap-x snap-mandatory lg:px-8 xl:px-[calc((100vw-1280px)/2+32px)]">
          {/* El cálculo extraño del padding (xl:px-...) es un truco profesional para que 
              la primera tarjeta arranque alineada con el Container, pero las demás se 
              desborden hasta el borde infinito de la pantalla */}

          {mockPosts.map((post) => (
            <PostCard
              key={post.id}
              category={post.category}
              title={post.title}
              date={post.date}
              image={post.image}
              description={post.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
