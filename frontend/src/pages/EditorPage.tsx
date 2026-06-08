import { EditorNavBar } from "../components/layout/EditorNavBar";
import { useNews } from "../hooks/useNews";
import PostFormVisual from "../components/editor/PostFormVisual";
import type { FormState } from "../components/editor/PostFormVisual";
import PostCardsEditor from "../components/editor/PostCardsEditor";
import { useState } from "react";
import { PostCard } from "../components/ui/PostCard";
import type { Post as ServicePost } from "../services/newsService";

export const EditorPage = () => {
  const { posts, isLoading, error } = useNews("all");
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: "Noticias",
    date: "",
    image: "/images/001-Comicion FACEA.png",
    postState: "publico",
  });

  const handleClear = () => {
    setForm({
      title: "",
      description: "",
      category: "Noticias",
      date: "",
      image: "/images/001-Comicion FACEA.png",
      postState: "publico",
    });
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
            Esta pantalla ya trabaja con el mismo flujo de datos de la sección pública.
            Más adelante se le sumará el formulario y las acciones de CRUD.
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
              <h2 className="text-2xl font-bold text-[#0d153b]">Publicaciones cargadas</h2>
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
              <PostFormVisual form={form} onChange={setForm} onClear={handleClear} />
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-slate-700">Previsualización</h3>
              <p className="text-sm text-slate-500">Separada para enfocarse en el contenido antes de publicarla.</p>

              <div className="mt-4 max-w-2xl">
                <PostCard
                  post={({
                    post_id: "preview",
                    title: form.title || "Título de ejemplo",
                    description: form.description || "Entradilla o descripción corta...",
                    category: form.category,
                    date: form.date || new Date().toISOString().split("T")[0],
                    image: form.image,
                    post_state_id: form.postState,
                  } as unknown) as ServicePost}
                  isLarge
                />
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0d153b]">Publicaciones cargadas</h2>
                  <p className="text-sm text-slate-600">Se están mostrando los posts reales que administra `useNews`.</p>
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
                <PostCardsEditor posts={posts} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditorPage;