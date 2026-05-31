import { useEffect, useState } from "react";
import { Container } from "../ui/Container";
import { PostCard } from "../ui/PostCard";
import { useNews } from "../../hooks/useNews";

export const News = () => {
  const { posts, isLoading } = useNews();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = posts.length;

  const next = () =>
    setActiveIndex((prev) => (total === 0 ? 0 : (prev + 1) % total));
  const prev = () =>
    setActiveIndex((prev) => (total === 0 ? 0 : (prev - 1 + total) % total));

  useEffect(() => {
    if (isPaused || total === 0) return;

    const timer = setTimeout(() => {
      next();
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, total]);

  const getCardPosition = (index: number) => {
    let offset = index - activeIndex;

    if (offset < -Math.floor(total / 2)) offset += total;
    if (offset > Math.floor(total / 2)) offset -= total;

    if (offset === 0) {
      return "translate-x-[-50%] scale-100 opacity-100 z-30 shadow-2xl";
    } else if (offset === -1) {
      return "translate-x-[-155%] md:translate-x-[-140%] lg:translate-x-[-165%] scale-[0.85] opacity-50 z-20 cursor-pointer hover:opacity-100";
    } else if (offset === 1) {
      return "translate-x-[55%] md:translate-x-[40%] lg:translate-x-[65%] scale-[0.85] opacity-50 z-20 cursor-pointer hover:opacity-100";
    } else if (offset < -1) {
      return "translate-x-[-250%] scale-[0.7] opacity-0 z-10 pointer-events-none";
    } else {
      return "translate-x-[150%] scale-[0.7] opacity-0 z-10 pointer-events-none";
    }
  };

  // BORRAMOS EL: if (isLoading) return null;

  return (
    // 1. La sección y el ID AHORA SIEMPRE EXISTEN, sin importar si está cargando
    <section
      id="actividades"
      className="bg-[#10183e] py-24 text-white overflow-hidden relative min-h-[600px]"
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

      {/* 2. Aquí hacemos la división lógica: Si carga, mostramos el "esqueleto", si no, el carrusel */}
      {isLoading ? (
        <div className="flex h-[450px] items-center justify-center w-full md:h-[550px]">
          <p className="text-xl text-white/50 animate-pulse">
            Cargando novedades...
          </p>
        </div>
      ) : (
        <div className="relative h-[450px] w-full md:h-[550px]">
          {posts.map((post, index) => {
            const positionClasses = getCardPosition(index);
            const isCenter = index === activeIndex;

            return (
              <div
                key={post.post_id}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => {
                  const offset = index - activeIndex;
                  if (offset === 1 || offset === -(total - 1)) next();
                  if (offset === -1 || offset === total - 1) prev();
                }}
                className={`absolute left-1/2 top-0 h-[400px] w-[80vw] max-w-[500px] md:h-[500px] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.35,1)] ${positionClasses}`}
              >
                <PostCard post={post} isLarge={isCenter} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
