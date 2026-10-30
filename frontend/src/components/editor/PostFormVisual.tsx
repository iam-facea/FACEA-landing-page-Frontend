import React, { useState, useRef } from "react";
import { Button } from "../ui/Button";
import { IMAGE_UPLOAD_CONSTRAINTS } from "../../types/publication";

export type FormState = {
  title: string;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD
  image: string; // URL pública para preview
  postState: "publico" | "oculta"; // Mapea a 'published' | 'draft'
  file: File | null;
  imageContentId?: string; // UUID devuelto por /functions/v1/images
};

interface Props {
  form?: FormState;
  onChange?: (next: FormState) => void;
  onClear?: () => void;
  onSubmit?: (state: FormState) => void | Promise<void>;
  submitLabel?: string;
  submitting?: boolean;
}

export const PostFormVisual: React.FC<Props> = ({
  form,
  onChange,
  onClear,
  onSubmit,
  submitLabel = "Publicar",
  submitting = false,
}) => {
  const [local, setLocal] = useState<FormState>(
    form ?? {
      title: "",
      description: "",
      category: "Noticias",
      date: new Date().toISOString().split("T")[0],
      image: "",
      postState: "publico",
      file: null,
    },
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const controlled = Boolean(form && onChange);
  const state = controlled ? (form as FormState) : local;

  const update = (patch: Partial<FormState>) => {
    const next = { ...state, ...patch };
    if (controlled && onChange) onChange(next);
    else setLocal(next);
  };

  const handleClear = () => {
    setValidationError(null);
    const cleared: FormState = {
      title: "",
      description: "",
      category: "Noticias",
      date: new Date().toISOString().split("T")[0],
      image: "",
      postState: "publico",
      file: null,
      imageContentId: undefined,
    };
    if (controlled && onChange) onChange(cleared);
    else setLocal(cleared);
    if (onClear) onClear();
  };

  // --- Validación en cliente de imágenes (Sección 6 del Contrato) ---
  const validateFile = (file: File): string | null => {
    const allowed = IMAGE_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES as readonly string[];
    if (!allowed.includes(file.type)) {
      return "Formato no soportado. Se requieren imágenes JPG, PNG o WebP.";
    }
    if (file.size > IMAGE_UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES) {
      return "El archivo supera el tamaño máximo permitido de 5 MB.";
    }
    return null;
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
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setValidationError(null);
    update({
      image: URL.createObjectURL(file),
      file,
      // Al cambiar de archivo reseteamos el ID anterior para forzar nueva subida
      imageContentId: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validaciones de contrato previas al envío
    if (!state.title.trim() || state.title.trim().length > 160) {
      setValidationError("El título es obligatorio y debe tener entre 1 y 160 caracteres.");
      return;
    }
    if (!state.description.trim() || state.description.trim().length > 1000) {
      setValidationError("La descripción es obligatoria y debe tener hasta 1000 caracteres.");
      return;
    }
    if (!state.category.trim() || state.category.trim().length > 80) {
      setValidationError("La categoría es obligatoria y debe tener hasta 80 caracteres.");
      return;
    }
    if (!state.date) {
      setValidationError("La fecha de publicación en formato YYYY-MM-DD es obligatoria.");
      return;
    }

    if (onSubmit) {
      await onSubmit(state);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-[0px_10px_40px_rgba(13,21,59,0.04)] p-8 mb-16 max-w-4xl mx-auto font-sans">
      <form className="space-y-8" onSubmit={handleSubmit}>
        {validationError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
          >
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categoría */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1"
            >
              Categoría
            </label>
            <select
              id="category"
              value={state.category}
              onChange={(e) => update({ category: e.target.value })}
              disabled={submitting}
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] focus:ring-2 focus:ring-[#0d153b] transition-all appearance-none cursor-pointer disabled:opacity-60"
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
            <label
              htmlFor="title"
              className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1"
            >
              Título ({state.title.length}/160)
            </label>
            <input
              id="title"
              value={state.title}
              maxLength={160}
              onChange={(e) => update({ title: e.target.value })}
              disabled={submitting}
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] placeholder:text-[#76767f] focus:ring-2 focus:ring-[#0d153b] transition-all disabled:opacity-60"
              placeholder="Escribe un título atractivo (máx 160 caracteres)..."
              type="text"
              required
            />
          </div>

          {/* Fecha (YYYY-MM-DD) */}
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1"
            >
              Fecha de Publicación
            </label>
            <input
              id="date"
              type="date"
              value={state.date}
              onChange={(e) => update({ date: e.target.value })}
              disabled={submitting}
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] focus:ring-2 focus:ring-[#0d153b] transition-all cursor-pointer disabled:opacity-60"
              required
            />
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label
              htmlFor="postState"
              className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1"
            >
              Estado Editorial
            </label>
            <select
              id="postState"
              value={state.postState}
              onChange={(e) =>
                update({ postState: e.target.value as FormState["postState"] })
              }
              disabled={submitting}
              className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] focus:ring-2 focus:ring-[#0d153b] transition-all appearance-none cursor-pointer disabled:opacity-60"
            >
              <option value="publico">Público (published)</option>
              <option value="oculta">Borrador (draft)</option>
            </select>
          </div>
        </div>

        {/* Descripción Breve */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1"
          >
            Descripción Breve ({state.description.length}/1000)
          </label>
          <textarea
            id="description"
            value={state.description}
            maxLength={1000}
            onChange={(e) => update({ description: e.target.value })}
            disabled={submitting}
            className="w-full bg-[#f3f3f5] border-none outline-none rounded-lg py-4 px-4 text-[#1a1c1d] placeholder:text-[#76767f] focus:ring-2 focus:ring-[#0d153b] transition-all resize-none disabled:opacity-60"
            placeholder="Describe el contenido de la publicación (máx 1000 caracteres)..."
            rows={4}
            required
          />
        </div>

        {/* Zona de Carga de Imagen (Paso 1) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#46464e] ml-1">
            Imagen Destacada (JPG, PNG, WebP — máx 5 MB)
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !submitting && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors group cursor-pointer ${
              submitting ? "cursor-not-allowed opacity-60" : ""
            } ${
              isDragging
                ? "border-[#0d153b] bg-[#e0e1f7]"
                : "border-[#c7c5cf] bg-[#ffffff] hover:bg-[#f3f3f5]"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              disabled={submitting}
              onChange={(e) =>
                e.target.files && handleFileSelect(e.target.files[0])
              }
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
            />
            <svg
              className="w-12 h-12 text-[#c7c5cf] group-hover:text-[#0d153b] transition-colors mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-[#1a1c1d] font-medium text-sm">
              Arrastra y suelta tu imagen aquí o haz clic para explorar
            </p>
            <p className="text-[#76767f] text-xs mt-1">
              Formatos válidos: JPG, PNG, WebP (hasta 5 MB)
            </p>

            {/* Previsualización del archivo seleccionado */}
            {state.file && (
              <div className="mt-4 px-4 py-2 bg-[#e0e1f7] text-[#0d153b] rounded-lg text-xs font-semibold flex items-center gap-2">
                <span>📁 {state.file.name}</span>
                <span>({(state.file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
            )}
            {!state.file && state.image && (
              <div className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                <span>Imagen actual guardada en el servidor</span>
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
            disabled={submitting}
            className="px-8"
          >
            Limpiar
          </Button>

          <button
            type="submit"
            disabled={submitting}
            className="px-10 py-3 rounded-full bg-[#bd222f] text-white font-bold hover:scale-105 shadow-lg shadow-[#bd222f]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? "Guardando..." : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PostFormVisual;
