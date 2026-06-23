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
