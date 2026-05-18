import { EditorNavBar } from "../components/layout/EditorNavBar";

export const EditorPage = () => {
  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <EditorNavBar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 lg:px-8">
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0d153b]">Panel de editor</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Esta será la base visual del CRUD de noticias. Por ahora solo existe
            la navegación protegida y el acceso al editor.
          </p>
        </section>
      </main>
    </div>
  );
};

export default EditorPage;