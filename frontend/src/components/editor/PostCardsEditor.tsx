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
  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
        <p className="text-lg font-medium text-slate-700">No hay publicaciones guardadas todavía.</p>
        <p className="text-sm text-slate-400 mt-1">
          Utiliza el formulario de arriba para redactar y publicar tu primera noticia.
        </p>
      </div>
    );
  }

  return (
    // GRID de 2 columnas para escritorio, 1 para celular
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <div
          key={post.post_id}
          className="flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="h-72 relative w-full">
            <PostCard post={post} />

            {/* Etiqueta flotante para saber si está en borrador a simple vista */}
            {post.post_state_id !== 1 && (
              <div className="absolute top-4 left-4 z-30 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Borrador
              </div>
            )}
            <div className="absolute bottom-4 right-4 z-30 bg-white/95 backdrop-blur-sm text-[#0d153b] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200/50">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {post.state}
              </span>
            </div>
          </div>

          {/* Botonera de acciones */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(post)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant={post.post_state_id === 1 ? "secondary" : "primary"}
                onClick={() => onToggleState(post)}
              >
                {post.post_state_id === 1 ? "Pasar a Borrador" : "Publicar"}
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
              className="text-slate-400 hover:text-red-600 text-sm font-bold px-3 py-2 transition-colors cursor-pointer"
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
