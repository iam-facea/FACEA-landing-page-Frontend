import { useEffect, useRef, useState } from "react";
import { Container } from "../ui/Container";
import { PostCard } from "../ui/PostCard";
import { useNews } from "../../hooks/useNews";
import { useNavigate } from "react-router-dom";

export const News = () => {
  const { posts, isLoading } = useNews();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Soporte para gestos táctiles (Swipe)
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const total = posts.length;

  const next = () =>
    setActiveIndex((prev) => (total === 0 ? 0 : (prev + 1) % total));
  const prev = () =>
    setActiveIndex((prev) => (total === 0 ? 0 : (prev - 1 + total) % total));

  useEffect(() => {
    if (isPaused || total === 0) return;

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (total === 0 ? 0 : (prev + 1) % total));
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    // Umbral mínimo de 45px para reconocer el swipe
    if (diff > 45) {
      next(); // Deslizó hacia la izquierda -> siguiente
    } else if (diff < -45) {
      prev(); // Deslizó hacia la derecha -> anterior
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const getCardPosition = (index: number) => {
    let offset = index - activeIndex;

    if (offset < -Math.floor(total / 2)) offset += total;
    if (offset > Math.floor(total / 2)) offset -= total;

    if (offset === 0) {
      return "translate-x-[-50%] scale-100 opacity-100 z-30 shadow-2xl";
    } else if (offset === -1) {
      return "translate-x-[-150%] sm:translate-x-[-140%] lg:translate-x-[-165%] scale-[0.85] opacity-40 sm:opacity-50 z-20 cursor-pointer hover:opacity-100";
    } else if (offset === 1) {
      return "translate-x-[50%] sm:translate-x-[40%] lg:translate-x-[65%] scale-[0.85] opacity-40 sm:opacity-50 z-20 cursor-pointer hover:opacity-100";
    } else if (offset < -1) {
      return "translate-x-[-250%] scale-[0.7] opacity-0 z-10 pointer-events-none";
    } else {
      return "translate-x-[150%] scale-[0.7] opacity-0 z-10 pointer-events-none";
    }
  };

  return (
    <section
      id="actividades"
      className="bg-[#10183e] py-16 sm:py-20 md:py-24 text-white overflow-hidden relative min-h-[580px] sm:min-h-[620px]"
    >
      <Container>
        <div className="mb-10 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#bd222f]">
              Últimas Noticias
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Novedades FACEA
            </h2>
          </div>

          {/* Flechas de control visibles y cómodas en desktop y tablet */}
          {total > 1 && (
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Noticia anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Siguiente noticia"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </Container>

      {isLoading ? (
        <div className="flex h-[380px] sm:h-[450px] md:h-[550px] items-center justify-center w-full">
          <p className="text-lg text-white/50 animate-pulse">
            Cargando novedades...
          </p>
        </div>
      ) : (
        <div
          className="relative h-[400px] sm:h-[460px] md:h-[540px] w-full touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
                  else if (offset === -1 || offset === total - 1) prev();
                  else if (offset === 0) navigate(`/novedades/${post.post_id}`);
                }}
                className={`absolute left-1/2 top-0 h-[360px] w-[86vw] max-w-[420px] sm:h-[420px] sm:w-[75vw] sm:max-w-[480px] md:h-[490px] md:max-w-[500px] transition-all duration-[700ms] ease-[cubic-bezier(0.25,1,0.35,1)] ${positionClasses}`}
              >
                <PostCard post={post} isLarge={isCenter} />
              </div>
            );
          })}
        </div>
      )}

      {/* Indicadores de posición (Dots) + Controles táctiles en móvil */}
      {total > 1 && !isLoading && (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:hidden">
          {/* Flechas táctiles móviles directas */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Noticia anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white active:bg-white/30"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Paginador numérico / Dots */}
            <div className="flex items-center gap-2">
              {posts.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ir a noticia ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-7 bg-[#bd222f]"
                      : "w-2.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Siguiente noticia"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white active:bg-white/30"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <span className="text-xs text-white/50">
            {activeIndex + 1} de {total} (desliza o toca para leer)
          </span>
        </div>
      )}
    </section>
  );
};
