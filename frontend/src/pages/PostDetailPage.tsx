import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { newsService, type Post } from "../services/newsService";

export const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Al llamar a getById, el backend en .NET sumará automáticamente post.Views++
    if (id) {
      newsService
        .incrementViews(id) // Llamada para incrementar las vistas
        .then(() => {
          return newsService.getById(id); // Luego obtenemos los detalles (GET) del post
        })
        .then((data) => setPost(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb]">
        <p className="text-xl text-[#0d153b] animate-pulse font-bold">
          Cargando artículo...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9fb] gap-4">
        <p className="text-2xl text-red-600 font-bold">Noticia no encontrada</p>
        <Link to="/" className="text-[#0d153b] hover:text-[#bd222f] underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      {/* Cabecera minimalista */}
      <header className="bg-[#10183e] py-6 px-6 lg:px-8 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="text-white hover:text-[#bd222f] transition-colors flex items-center gap-2 font-medium w-fit"
          >
            <span>&larr;</span> Volver al inicio
          </Link>
        </div>
      </header>

      <main className="py-12 px-6 lg:px-8">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-[300px] md:h-[450px] w-full relative">
            <img
              src={
                post.image ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
              }
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-[#bd222f] uppercase tracking-widest shadow-lg">
              {post.category}
            </div>
          </div>

          <div className="p-8 md:p-14">
            <div className="flex justify-between items-center mb-8 text-sm text-slate-500 font-semibold border-b border-slate-100 pb-4">
              <span>{post.date.split("T")[0]}</span>
              {/* ¡Aquí mostramos las vistas reales del backend! */}
              <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[#0d153b]">
                👁️ {post.views} vistas
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-[#0d153b] mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="prose prose-lg text-slate-600 whitespace-pre-wrap leading-relaxed">
              {post.description}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};
