import {
  publicPublicationsService,
  editorPublicationsService,
} from "./publicationService";
import type {
  PublicPublication,
  EditorPublication,
  PublicationStatus,
} from "../types/publication";

export interface Post {
  post_id: string; // UUID de Supabase
  title: string;
  description: string;
  category: string;
  date: string; // Formato YYYY-MM-DD
  image: string; // URL pública servida desde CDN / Vercel Blob
  imageUrl: string;
  post_state_id: number; // 1 = Publicado, 2 = Borrador
  state: string; // "Público" | "Borrador"
  views?: number;
  imageContentId?: string;
}

export interface CreatePostInput {
  title: string;
  description: string;
  category: string;
  date?: string;
  url?: string;
  postStateId?: number;
  file?: File;
  imageContentId?: string;
}

export interface UpdatePostInput {
  title: string;
  description: string;
  category: string;
  date?: string;
  url?: string;
  postStateId?: number;
  file?: File | null;
  imageContentId?: string;
}

export const toPublicViewModel = (pub: PublicPublication): Post => ({
  post_id: pub.id,
  title: pub.title,
  description: pub.description,
  category: pub.category,
  date: pub.publicationDate,
  image: pub.imageUrl,
  imageUrl: pub.imageUrl,
  post_state_id: 1,
  state: "Público",
});

export const toEditorViewModel = (pub: EditorPublication): Post => ({
  post_id: pub.id,
  title: pub.title,
  description: pub.description,
  category: pub.category,
  date: pub.publicationDate,
  image: pub.image?.url ?? "",
  imageUrl: pub.image?.url ?? "",
  post_state_id: pub.status === "published" ? 1 : 2,
  state: pub.status === "published" ? "Público" : "Borrador",
  imageContentId: pub.image?.id,
});

export const newsService = {
  /**
   * Obtiene las publicaciones públicas para el Home / News
   */
  getPublished: async (): Promise<Post[]> => {
    try {
      const response = await publicPublicationsService.getPublications(20);
      return response.items.map(toPublicViewModel);
    } catch (err) {
      console.warn("[newsService] Error al obtener publicaciones de Supabase:", err);
      return [];
    }
  },

  /**
   * Obtiene todas las publicaciones (editoriales) para el panel de administración
   */
  getAll: async (): Promise<Post[]> => {
    try {
      const response = await editorPublicationsService.getPublications(50);
      return response.items.map(toEditorViewModel);
    } catch {
      // Si falla la auth o es público, fallback a las públicas
      return newsService.getPublished();
    }
  },

  /**
   * Obtiene una publicación por UUID (intenta primero editorial, luego pública)
   */
  getById: async (id: string | number): Promise<Post | null> => {
    const stringId = String(id);
    try {
      const editorPub = await editorPublicationsService.getPublicationById(stringId);
      if (editorPub) return toEditorViewModel(editorPub);
    } catch {
      // Ignoramos si no hay permisos editoriales
    }

    try {
      const publicPub = await publicPublicationsService.getPublicationById(stringId);
      return publicPub ? toPublicViewModel(publicPub) : null;
    } catch {
      return null;
    }
  },

  /**
   * Crea una publicación en 2 pasos según el contrato:
   * 1. Sube la imagen a /functions/v1/images si se adjuntó archivo.
   * 2. Envía el payload JSON con imageContentId a /functions/v1/editor-publications.
   */
  create: async (data: CreatePostInput): Promise<Post> => {
    let imageContentId = data.imageContentId;

    if (data.file && !imageContentId) {
      const uploadRes = await editorPublicationsService.uploadImage(data.file);
      imageContentId = uploadRes.id;
    }

    if (!imageContentId) {
      throw new Error("Se requiere una imagen para crear la publicación.");
    }

    const status: PublicationStatus = data.postStateId === 2 ? "draft" : "published";

    const created = await editorPublicationsService.createPublication({
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      publicationDate: data.date,
      status,
      imageContentId,
    });

    return toEditorViewModel(created);
  },

  /**
   * Actualiza una publicación existente (reemplazo completo PUT)
   */
  update: async (
    id: string | number,
    data: UpdatePostInput,
  ): Promise<Post | null> => {
    const stringId = String(id);
    let imageContentId = data.imageContentId;

    if (data.file) {
      const uploadRes = await editorPublicationsService.uploadImage(data.file);
      imageContentId = uploadRes.id;
    }

    // Si no vino imagen nueva, necesitamos mantener el imageContentId existente
    if (!imageContentId) {
      const existing = await editorPublicationsService.getPublicationById(stringId);
      imageContentId = existing?.image?.id;
    }

    if (!imageContentId) {
      throw new Error("No se pudo determinar el ID de la imagen para la publicación.");
    }

    const status: PublicationStatus = data.postStateId === 2 ? "draft" : "published";
    const publicationDate = data.date || new Date().toISOString().split("T")[0];

    const updated = await editorPublicationsService.replacePublication(stringId, {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      publicationDate,
      status,
      imageContentId,
    });

    return toEditorViewModel(updated);
  },

  /**
   * Cambia el estado (publicado/borrador) mediante un replace rápido
   */
  updateState: async (
    id: string | number,
    postStateId: number,
  ): Promise<Post | null> => {
    const stringId = String(id);
    const existing = await editorPublicationsService.getPublicationById(stringId);
    if (!existing) return null;

    const status: PublicationStatus = postStateId === 2 ? "draft" : "published";

    const updated = await editorPublicationsService.replacePublication(stringId, {
      title: existing.title,
      description: existing.description,
      category: existing.category,
      publicationDate: existing.publicationDate,
      status,
      imageContentId: existing.image.id,
    });

    return toEditorViewModel(updated);
  },

  /**
   * Elimina una publicación llamando a DELETE /editor-publications/{id}
   */
  delete: async (id: string | number): Promise<boolean> => {
    return editorPublicationsService.deletePublication(String(id));
  },

  incrementViews: async (): Promise<boolean> => {
    // ViewsCount fue eliminado deliberadamente del backend según contrato
    return true;
  },
};

export default newsService;
