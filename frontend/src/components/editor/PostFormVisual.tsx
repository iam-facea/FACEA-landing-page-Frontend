import React, { useState, useRef } from "react";
import { Button } from "../ui/Button";

export type FormState = {
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  postState: "publico" | "oculta";
  file: File | null;
};

interface Props {
  form?: FormState;
  onChange?: (next: FormState) => void;
  onClear?: () => void;
  onSubmit?: (state: FormState) => void | Promise<void>;
  submitLabel?: string;
}

export const PostFormVisual: React.FC<Props> = ({
  form,
  onChange,
  onClear,
  onSubmit,
  submitLabel = "Publicar",
}) => {
  const [local, setLocal] = useState<FormState>(
    form ?? {
      title: "",
      description: "",
      category: "Noticias",
      date: "",
      image: "",
      postState: "publico",
      file: null,
    },
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const controlled = Boolean(form && onChange);
  const state = controlled ? (form as FormState) : local;

  const update = (patch: Partial<FormState>) => {
    const next = { ...state, ...patch };
    if (controlled && onChange) onChange(next);
    else setLocal(next);
  };

  const handleClear = () => {
    const cleared: FormState = {
      title: "",
      description: "",
      category: "Noticias",
      date: "",
      image: "",
      postState: "publico",
      file: null,
    };
    if (controlled && onChange) onChange(cleared);
    else setLocal(cleared);
    if (onClear) onClear();
  };

  // --- Funciones para Drag & Drop ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    update({ image: URL.createObjectURL(file), file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(state);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-[0px_10px_40px_rgba(13,21,59,0.04)] p-8 mb-16 max-w-4xl mx-auto font-sans">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categoría */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1">
              Categoría
            </label>
            <select
              value={state.category}
              onChange={(e) => update({ category: e.target.value })}
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] focus:ring-2 focus:ring-[#0d153b] transition-all appearance-none cursor-pointer"
            >
              <option value="Noticias">Noticias</option>
              <option value="Eventos">Eventos</option>
              <option value="Escuela Sabática">Escuela Sabática</option>
              <option value="Faros">Faros</option>
              <option value="Avisos">Avisos</option>
            </select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1">
              Título
            </label>
            <input
              value={state.title}
              onChange={(e) => update({ title: e.target.value })}
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] placeholder:text-[#76767f] focus:ring-2 focus:ring-[#0d153b] transition-all"
              placeholder="Escribe un título atractivo..."
              type="text"
            />
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1">
              Fecha
            </label>
            <input
              type="date"
              value={state.date}
              onChange={(e) => update({ date: e.target.value })}
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] focus:ring-2 focus:ring-[#0d153b] transition-all cursor-pointer"
            />
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1">
              Estado
            </label>
            <select
              value={state.postState}
              onChange={(e) =>
                update({ postState: e.target.value as FormState["postState"] })
              }
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] focus:ring-2 focus:ring-[#0d153b] transition-all appearance-none cursor-pointer"
            >
              <option value="publico">Público</option>
              <option value="oculta">Oculto</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1">
            Descripción Breve
          </label>
          <textarea
            value={state.description}
            onChange={(e) => update({ description: e.target.value })}
            className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] placeholder:text-[#76767f] focus:ring-2 focus:ring-[#0d153b] transition-all resize-none"
            placeholder="Describe brevemente el contenido de la publicación..."
            rows={4}
          />
        </div>

        {/* Zona de Drag & Drop (Imagen) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1">
            Imagen Destacada
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors group cursor-pointer ${
              isDragging
                ? "border-[#0d153b] bg-[#e0e1f7]"
                : "border-[#c7c5cf] bg-[#ffffff] hover:bg-[#f3f3f5]"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                e.target.files && handleFileSelect(e.target.files[0])
              }
              className="hidden"
              accept="image/*"
            />
            <span className="material-symbols-outlined text-4xl text-[#c7c5cf] group-hover:text-[#0d153b] transition-colors mb-3">
              cloud_upload
            </span>
            <p className="text-[#1a1c1d] font-medium">
              Arrastra y suelta la imagen aquí
            </p>
            <p className="text-[#46464e] text-sm my-2">o</p>
            <button
              type="button"
              className="bg-[#e8e8ea] px-6 py-2 rounded-full text-[#46464e] font-semibold text-sm hover:bg-[#e2e2e4] transition-colors pointer-events-none"
            >
              Explorar archivos
            </button>
            {/* Indicador de archivo seleccionado */}
            {state.image && (
              <div className="mt-4 px-4 py-2 bg-[#e0e1f7] text-[#0d153b] rounded-lg text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">image</span>
                {state.image}
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#eeeef0]">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
            className="px-8"
          >
            Limpiar
          </Button>

          <button
            type="submit"
            className="px-10 py-3 rounded-full bg-[#bd222f] text-white font-bold hover:scale-105 shadow-lg shadow-[#bd222f]/20 transition-all active:scale-95"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PostFormVisual;
