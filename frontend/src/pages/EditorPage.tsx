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
    error: apiError,
    createPost,
    updatePost,
    updatePostState,
    deletePost,
  } = useNews("all");
  const [selectedPost, setSelectedPost] = useState<ServicePost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: "Noticias",
    date: new Date().toISOString().split("T")[0],
    image: "",
    postState: "publico",
    file: null,
  });

  const resetFormState = () => {
    setForm({
      title: "",
      description: "",
      category: "Noticias",
      date: new Date().toISOString().split("T")[0],
      image: "",
      postState: "publico",
      file: null,
      imageContentId: undefined,
    });
  };

  const handleClear = () => {
    setSelectedPost(null);
    setFormFeedback(null);
    resetFormState();
  };

  const handleFormChange = (nextForm: FormState) => {
    setForm(nextForm);
    // Si el usuario cambia la foto o escribe, limpiamos alertas de error previas
    if (formFeedback?.type === "error") {
      setFormFeedback(null);
    }
  };

  const handleEditPost = (post: ServicePost) => {
    setSelectedPost(post);
    setFormFeedback(null);
    setForm({
      title: post.title,
      description: post.description,
      category: post.category,
      date: post.date.split("T")[0],
      image: post.image ?? post.imageUrl ?? "",
      postState: post.post_state_id === 1 ? "publico" : "oculta",
      file: null,
      imageContentId: post.imageContentId,
    });
    // Scroll suave hacia el formulario para facilitar la edición
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (nextForm: FormState) => {
    setSubmitting(true);
    setFormFeedback(null);

    try {
      const payload = {
        title: nextForm.title.trim(),
        description: nextForm.description.trim(),
        category: nextForm.category.trim(),
        date: nextForm.date,
        url: undefined,
        postStateId: nextForm.postState === "publico" ? 1 : 2,
        file: nextForm.file,
        imageContentId: nextForm.imageContentId,
      };

      if (selectedPost) {
        await updatePost(selectedPost.post_id, payload);
        setSelectedPost(null);
        resetFormState();
        setFormFeedback({
          type: "success",
          message: "Publicación actualizada exitosamente.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!nextForm.file) {
        setFormFeedback({
          type: "error",
          message: "Debes seleccionar una imagen para la publicación.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      await createPost({ ...payload, file: nextForm.file });
      setSelectedPost(null);
      resetFormState();
      setFormFeedback({
        type: "success",
        message: "Publicación creada exitosamente.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("[EditorPage] Error en handleSubmit:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Error inesperado al procesar la publicación en el servidor.";
      setFormFeedback({ type: "error", message });
      // Scroll hacia la alerta para que el usuario la vea de inmediato
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleState = async (post: ServicePost) => {
    try {
      await updatePostState(post.post_id, post.post_state_id === 1 ? 2 : 1);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al cambiar el estado.";
      setFormFeedback({ type: "error", message });
    }
  };

  const handleDeletePost = async (post: ServicePost) => {
    try {
      await deletePost(post.post_id);
      if (selectedPost?.post_id === post.post_id) handleClear();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar la publicación.";
      setFormFeedback({ type: "error", message });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <EditorNavBar />

      <Container className="py-10">
        <div className="flex flex-col gap-8">
          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bd222f]">
              Panel de Administración (IAM FACEA)
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[#0d153b]">
              Gestión editorial de publicaciones
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Crea, edita o elimina publicaciones utilizando el backend de Supabase. Todo cambio publicado se reflejará instantáneamente en la Landing Page.
            </p>
          </Card>

          {/* Solo mostramos apiError si no es un error de publicación ya informado por formFeedback */}
          {apiError && !formFeedback && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm"
            >
              ⚠️ {apiError}
            </div>
          )}

          {formFeedback && (
            <div
              role="alert"
              className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${
                formFeedback.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {formFeedback.type === "error" ? "❌ " : "✅ "}
              {formFeedback.message}
            </div>
          )}

          <div className="space-y-12">
            {/* ZONA DE REDACCIÓN Y PREVISUALIZACIÓN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Formulario (Toma 7 columnas) */}
              <div className="lg:col-span-7">
                <PostFormVisual
                  form={form}
                  onChange={handleFormChange}
                  onClear={handleClear}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  submitLabel={
                    selectedPost ? "Actualizar Noticia" : "Publicar Noticia"
                  }
                />
              </div>

              {/* Previsualización (Toma 5 columnas) */}
              <div className="lg:col-span-5">
                <div className="sticky top-24">
                  <h3 className="text-lg font-semibold text-[#0d153b] mb-4">
                    Previsualización en tiempo real
                  </h3>

                  <div className="h-[450px] w-full rounded-3xl shadow-lg ring-1 ring-slate-200">
                    <PostCard
                      post={
                        {
                          post_id: "preview-id",
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
                            form.postState === "publico" ? "Público" : "Borrador",
                        } as ServicePost
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
                    Consultando base de datos de Supabase...
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
