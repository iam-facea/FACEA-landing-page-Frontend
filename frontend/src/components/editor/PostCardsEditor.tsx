import type { Post as ServicePost } from "../../services/newsService";
import { PostCard } from "../ui/PostCard";
import { Button } from "../ui/Button";

interface Props {
  posts: ServicePost[];
  onEdit: (post: ServicePost) => void;
  onToggleState: (post: ServicePost) => void;
  onDelete: (post: ServicePost) => void;
}

export const PostCardsEditor = ({
  posts,
  onEdit,
  onToggleState,
  onDelete,
}: Props) => {
  return (
    // GRID de 2 columnas para escritorio, 1 para celular
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <div
          key={post.post_id}
          className="flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Le damos una altura fija (h-72) para que PostCard se vea proporcionado y no achatado */}
          <div className="h-72 relative w-full">
            <PostCard post={post} />

            {/* Etiqueta flotante para saber si está oculto a simple vista */}
            {post.post_state_id !== 1 && (
              <div className="absolute top-4 left-4 z-30 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Oculto
              </div>
            )}
            <div className="absolute bottom-4 right-4 z-30 bg-white/95 backdrop-blur-sm text-[#0d153b] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200/50">
              {/* Ícono de ojo en SVG nativo para no depender de fuentes externas */}
              <svg
                className="w-4 h-4 text-[#64748b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {post.views || 0}
            </div>
          </div>

          {/* Botonera de acciones (Reutilizando tu UI de Button) */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(post)}
              >
                Editar
              </Button>
              {/* Cambiamos el confuso "Publicar" por Ocultar / Mostrar */}
              <Button
                size="sm"
                variant={post.post_state_id === 1 ? "secondary" : "primary"}
                onClick={() => onToggleState(post)}
              >
                {post.post_state_id === 1 ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `¿Seguro que quieres eliminar "${post.title}"?`,
                  )
                )
                  onDelete(post);
              }}
              className="text-slate-400 hover:text-red-600 text-sm font-bold px-3 py-2 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostCardsEditor;
