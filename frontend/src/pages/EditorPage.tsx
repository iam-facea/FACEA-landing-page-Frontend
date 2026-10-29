import { useState } from "react";
import { EditorNavBar } from "../components/layout/EditorNavBar";
import { useNews } from "../hooks/useNews";
import PostFormVisual from "../components/editor/PostFormVisual";
import type { FormState } from "../components/editor/PostFormVisual";
import PostCardsEditor from "../components/editor/PostCardsEditor";
import { PostCard } from "../components/ui/PostCard";
import type { Post as ServicePost } from "../services/newsService";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";

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
      alert(
        "¡Atención! Debes seleccionar una imagen destacada antes de publicar.",
      );
      return;
    }

    await createPost({ ...payload, file: nextForm.file });
    handleClear();
  };

  const handleToggleState = async (post: ServicePost) => {
    await updatePostState(post.post_id, post.post_state_id === 1 ? 2 : 1);
  };

  const handleDeletePost = async (post: ServicePost) => {
    await deletePost(post.post_id);
    if (selectedPost?.post_id === post.post_id) handleClear();
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <EditorNavBar />

      {/* Usamos el componente genérico Container */}
      <Container className="py-10">
        <div className="flex flex-col gap-8">
          {/* Usamos tu UI Kit Card en lugar de un section con estilos sueltos */}
          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bd222f]">
              Panel de Administración
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[#0d153b]">
              Gestión de noticias FACEA
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Crea, edita o elimina publicaciones. Todo cambio aquí se reflejará
              instantáneamente en la Landing Page.
            </p>
          </Card>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-12">
            {/* ZONA DE REDACCIÓN Y PREVISUALIZACIÓN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Formulario (Toma 7 columnas) */}
              <div className="lg:col-span-7">
                <PostFormVisual
                  form={form}
                  onChange={setForm}
                  onClear={handleClear}
                  onSubmit={handleSubmit}
                  submitLabel={
                    selectedPost ? "Actualizar Noticia" : "Publicar Noticia"
                  }
                />
              </div>

              {/* Previsualización (Toma 5 columnas) */}
              <div className="lg:col-span-5">
                <div className="sticky top-24">
                  <h3 className="text-lg font-semibold text-[#0d153b] mb-4">
                    Previsualización
                  </h3>

                  {/* Contenedor que evita el "achatamiento" simulando el ancho del carrusel */}
                  <div className="h-[450px] w-full rounded-3xl shadow-lg ring-1 ring-slate-200">
                    <PostCard
                      post={
                        {
                          post_id: 0,
                          title: form.title || "Escribe un título atractivo...",
                          description:
                            form.description ||
                            "La descripción corta de tu noticia aparecerá aquí.",
                          category: form.category,
                          date:
                            form.date || new Date().toISOString().split("T")[0],
                          image: form.image,
                          imageUrl: form.image,
                          post_state_id: form.postState === "publico" ? 1 : 2,
                          state:
                            form.postState === "publico" ? "Público" : "Oculto",
                          views: 0,
                        } as unknown as ServicePost
                      }
                      isLarge={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ZONA DE LISTADO DE POSTS */}
            <div className="pt-8 border-t border-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0d153b]">
                  Publicaciones Guardadas
                </h2>
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#bd222f] shadow-sm">
                  {posts.length} Totales
                </div>
              </div>

              {isLoading ? (
                <Card className="p-16 text-center text-slate-500 border-dashed border-2">
                  <span className="animate-pulse">
                    Cargando la base de datos...
                  </span>
                </Card>
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
        </div>
      </Container>
    </div>
  );
};

export default EditorPage;
