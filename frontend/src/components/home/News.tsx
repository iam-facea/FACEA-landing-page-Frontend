import { Container } from "../ui/Container";
import { PostCard } from "../ui/PostCard";
import { useEffect, useState } from "react";
import postData from "../../../data/news/postData.json";
import { PostForm } from "../ui/PostForm";

// Interfaz para tipificar los posts que vienen del JSON
interface Post {
  post_id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  url: string;
  post_state_id: string;
}

export const News = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      // Usamos el JSON importado desde src
      const publicPosts = postData.posts.filter((p: Post) => p.post_state_id === "publico");
      setPosts(publicPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

          {/* Mostrar estado de carga */}
          {isLoading && (
            <div className="flex items-center justify-center w-full h-96">
              <p className="text-white/70">Cargando publicaciones...</p>
            </div>
          )}

          {/* Mostrar mensaje de error */}
          {error && !isLoading && (
            <div className="flex items-center justify-center w-full h-96">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {/* Renderizar los posts cargados desde el JSON */}
          {!isLoading &&
            !error &&
            posts.map((post) => (
              <PostCard
                key={post.post_id}
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
