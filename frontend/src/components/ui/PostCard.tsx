// src/components/ui/PostCard.tsx
import faceaLogo from "../../assets/images/FACEA-logo.png";
import type { Post } from "../../services/newsService"; // Importamos solo la interfaz oficial

interface PostCardProps {
  post: Post;
  isLarge?: boolean;
}

export const PostCard = ({ post, isLarge = false }: PostCardProps) => {
  // Ya no necesitamos validaciones complejas. Usamos directamente post.image
  const imageUrl =
    post.image ||
    post.imageUrl ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop";

  return (
    <article className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[32px] bg-slate-800 transition-all">
      <img
        src={imageUrl}
        alt={post.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Usamos post.category en lugar de etiqueta */}
      {post.category && (
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-md border border-white/10">
          <img
            src={faceaLogo}
            alt="FACEA"
            className="h-6 w-auto object-contain drop-shadow-md"
          />
          <span className="text-xs font-bold tracking-wider text-white uppercase shadow-sm mt-[1px]">
            {post.category}
          </span>
        </div>
      )}

      <div className={`relative z-10 ${isLarge ? "p-8 md:p-10" : "p-6"}`}>
        {/* Usamos post.date */}
        <span className="text-sm font-medium text-white/70 mb-2 block">
          {post.date.split("T")[0]} {/* Solo mostramos la fecha sin la hora */}
        </span>

        {/* Usamos post.title */}
        <h3
          className={`font-bold leading-tight text-white mb-2 ${isLarge ? "text-3xl md:text-4xl" : "text-xl"}`}
        >
          {post.title}
        </h3>

        {/* Usamos post.description */}
        {isLarge && (
          <p className="line-clamp-2 text-white/70 text-lg">
            {post.description}
          </p>
        )}
      </div>
    </article>
  );
};
