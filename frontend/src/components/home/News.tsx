import { Container } from "../ui/Container";

// 1. MOCK DE LA BASE DE DATOS:
// Así es exactamente como se verá el JSON que nos devuelva la API en el futuro.
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
    fecha: "20 de Junio, 2026",
    imagen:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop",
    descripcion:
      "Sumate a nuestro equipo de voluntarios para llevar recursos y esperanza a comunidades rurales.",
  },
  {
    id: 3,
    etiqueta: "Académico",
    titulo: "Taller de Finanzas Éticas",
    fecha: "10 de Agosto, 2026",
    imagen:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    descripcion:
      "Cómo aplicar los valores de FACEA en el mundo empresarial moderno y la toma de decisiones.",
  },
  {
    id: 4,
    etiqueta: "Comunidad",
    titulo: "Encuentro de Ex-Alumnos",
    fecha: "05 de Septiembre, 2026",
    imagen:
      "https://images.unsplash.com/photo-1523580494112-071ef046dd41?q=80&w=1000&auto=format&fit=crop",
    descripcion:
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
            <article
              key={post.id}
              className="group relative flex h-[450px] w-[85vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl bg-slate-800 md:h-[500px] md:w-[600px]"
            >
              {/* Imagen de fondo con efecto zoom al pasar el mouse */}
              <img
                src={post.imagen}
                alt={post.titulo}
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradiente oscuro abajo para que el texto siempre sea legible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Contenido de la tarjeta */}
              <div className="relative z-10 p-8 md:p-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-[#bd222f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {post.etiqueta}
                  </span>
                  <span className="text-sm font-medium text-white/80">
                    {post.fecha}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-bold leading-tight md:text-3xl">
                  {post.titulo}
                </h3>
                <p className="line-clamp-2 text-white/70">{post.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
