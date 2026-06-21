import { EditorNavBar } from "../components/layout/EditorNavBar";
import { useNews } from "../hooks/useNews";
import PostFormVisual from "../components/editor/PostFormVisual";
import type { FormState } from "../components/editor/PostFormVisual";
import PostCardsEditor from "../components/editor/PostCardsEditor";
import { useState } from "react";
import { PostCard } from "../components/ui/PostCard";
import type { Post as ServicePost } from "../services/newsService";

export const EditorPage = () => {
  const {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    updatePostState,
    deletePost,
  } = useNews("all");
  const [selectedPost, setSelectedPost] = useState<ServicePost | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: "Noticias",
    date: "",
    image: "",
    postState: "publico",
    file: null,
  });

  const handleClear = () => {
    setSelectedPost(null);
    setForm({
      title: "",
      description: "",
      category: "Noticias",
      date: "",
      image: "",
      postState: "publico",
      file: null,
    });
  };

  const handleEditPost = (post: ServicePost) => {
    setSelectedPost(post);
    setForm({
      title: post.title,
      description: post.description,
      category: post.category,
      date: post.date.split("T")[0],
      image: post.image ?? post.imageUrl ?? "",
      postState: post.post_state_id === 1 ? "publico" : "oculta",
      file: null,
    });
  };

  const handleSubmit = async (nextForm: FormState) => {
    const payload = {
      title: nextForm.title,
      description: nextForm.description,
      category: nextForm.category,
      date: nextForm.date,
      url: undefined,
      postStateId: nextForm.postState === "publico" ? 1 : 2,
      file: nextForm.file,
    };

    if (selectedPost) {
      await updatePost(selectedPost.post_id, payload);
      handleClear();
      return;
    }

    if (!nextForm.file) {
      return;
    }

    await createPost({
      ...payload,
      file: nextForm.file,
    });
    handleClear();
  };

  const handleToggleState = async (post: ServicePost) => {
    await updatePostState(post.post_id, post.post_state_id === 1 ? 2 : 1);
  };

  const handleDeletePost = async (post: ServicePost) => {
    await deletePost(post.post_id);

    if (selectedPost?.post_id === post.post_id) {
      handleClear();
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <EditorNavBar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bd222f]">
            Editor de publicaciones
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#0d153b]">
            Gestión de noticias FACEA
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Esta pantalla ya trabaja con la API real de posts y permite crear,
            editar, ocultar y eliminar publicaciones.
          </p>
        </section>

        {error && (
          <section className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </section>
        )}

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0d153b]">
                Publicaciones cargadas
              </h2>
              <p className="text-sm text-slate-600">
                Se están mostrando los posts reales que administra `useNews`.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              {posts.length} publicaciones
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <PostFormVisual
                form={form}
                onChange={setForm}
                onClear={handleClear}
                onSubmit={handleSubmit}
                submitLabel={selectedPost ? "Actualizar" : "Publicar"}
              />
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Previsualización
              </h3>
              <p className="text-sm text-slate-500">
                Separada para enfocarse en el contenido antes de publicarla.
              </p>

              <div className="mt-4 max-w-2xl">
                <PostCard
                  post={
                    {
                      post_id: 0,
                      title: form.title || "Título de ejemplo",
                      description:
                        form.description || "Entradilla o descripción corta...",
                      category: form.category,
                      date: form.date || new Date().toISOString().split("T")[0],
                      image: form.image,
                      imageUrl: form.image,
                      post_state_id: form.postState === "publico" ? 1 : 2,
                      state:
                        form.postState === "publico" ? "Público" : "Oculto",
                      views: 0,
                    } as unknown as ServicePost
                  }
                  isLarge
                />
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0d153b]">
                    Publicaciones cargadas
                  </h2>
                  <p className="text-sm text-slate-600">
                    Se están mostrando los posts reales que administra
                    `useNews`.
                  </p>
                </div>

                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  {posts.length} publicaciones
                </div>
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                  Cargando publicaciones...
                </div>
              ) : (
                <PostCardsEditor
                  posts={posts}
                  onEdit={handleEditPost}
                  onToggleState={handleToggleState}
                  onDelete={handleDeletePost}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditorPage;
