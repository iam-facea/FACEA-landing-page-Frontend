import React from "react";
import type { Post } from "../../services/newsService";
import { PostCard } from "../ui/PostCard";

interface Props {
  posts: Post[];
  onEdit?: (post: Post) => void;
  onToggleState?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export const PostCardsEditor: React.FC<Props> = ({
  posts,
  onEdit,
  onToggleState,
  onDelete,
}) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0d153b]">
          Listado de publicaciones
        </h3>
        <span className="text-sm text-slate-600">Acciones visuales</span>
      </div>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.post_id} className="w-full">
            <div className="mb-3">
              <PostCard post={post} isLarge />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onEdit?.(post)}
                className="rounded-md bg-[#e8e8ea] text-[#0d153b] px-4 py-2 text-sm border border-transparent hover:bg-[#e2e2e4]"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onToggleState?.(post)}
                className="rounded-md bg-[#e8e8ea] text-[#0d153b] px-4 py-2 text-sm border border-transparent hover:bg-[#e2e2e4]"
              >
                {post.post_state_id === 1 ? "Ocultar" : "Publicar"}
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(post)}
                className="rounded-md bg-white text-red-600 px-4 py-2 text-sm border border-red-100 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostCardsEditor;
