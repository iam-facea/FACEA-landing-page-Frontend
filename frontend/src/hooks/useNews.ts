import { useCallback, useEffect, useState } from "react";
import {
  newsService,
  type CreatePostInput,
  type Post,
  type UpdatePostInput,
} from "../services/newsService";

type NewsMode = "published" | "all";

export const useNews = (mode: NewsMode = "published") => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async (nextMode: NewsMode = mode) => {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        nextMode === "published"
          ? await newsService.getPublished()
          : await newsService.getAll();

      setPosts(data);
    } catch (err: unknown) {
      console.error("[useNews] Error al cargar las novedades:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las novedades.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    void loadPosts(mode);
  }, [loadPosts, mode]);

  const createPost = async (postData: CreatePostInput): Promise<Post> => {
    try {
      const newPost = await newsService.create(postData);
      try {
        await loadPosts(mode);
      } catch {
        // Si falla la recarga pero se creó, retornamos la nueva
      }
      return newPost;
    } catch (err: unknown) {
      console.error("[useNews] Error al crear la novedad:", err);
      const msg =
        err instanceof Error ? err.message : "No se pudo crear la novedad.";
      setError(msg);
      throw err; // Re-lanzamos para que el formulario lo atrape y muestre la alerta exacta
    }
  };

  const updatePost = async (id: string | number, patch: UpdatePostInput): Promise<Post> => {
    try {
      const updatedPost = await newsService.update(id, patch);
      if (!updatedPost) {
        throw new Error("No se pudo actualizar la publicación en el servidor.");
      }

      try {
        await loadPosts(mode);
      } catch {
        // Ignoramos fallo de recarga
      }

      return updatedPost;
    } catch (err: unknown) {
      console.error("[useNews] Error al actualizar la novedad:", err);
      const msg =
        err instanceof Error ? err.message : "No se pudo actualizar la novedad.";
      setError(msg);
      throw err;
    }
  };

  const updatePostState = async (id: string | number, postStateId: number): Promise<Post | null> => {
    try {
      const updatedPost = await newsService.updateState(id, postStateId);
      if (!updatedPost) return null;

      try {
        await loadPosts(mode);
      } catch {
        // Ignoramos fallo de recarga
      }

      return updatedPost;
    } catch (err: unknown) {
      console.error("[useNews] Error al cambiar el estado de la novedad:", err);
      const msg =
        err instanceof Error ? err.message : "No se pudo cambiar el estado de la novedad.";
      setError(msg);
      throw err;
    }
  };

  const deletePost = async (id: string | number): Promise<boolean> => {
    try {
      const success = await newsService.delete(id);
      if (!success) return false;

      try {
        await loadPosts(mode);
      } catch {
        // Ignoramos fallo de recarga
      }

      return true;
    } catch (err: unknown) {
      console.error("[useNews] Error al eliminar la novedad:", err);
      const msg =
        err instanceof Error ? err.message : "No se pudo eliminar la novedad.";
      setError(msg);
      throw err;
    }
  };

  const getPostById = async (id: string | number) => {
    try {
      return await newsService.getById(id);
    } catch (err) {
      console.error("[useNews] Error al obtener la novedad por ID:", err);
      return null;
    }
  };
  
  const incrementViews = async (id?: string | number) => {
    try {
      return await newsService.incrementViews(id);
    } catch (err) {
      console.error("[useNews] Error al incrementar la vista de la novedad:", err);
      return null;
    }
  };

  return {
    posts,
    isLoading,
    error,
    loadPosts,
    createPost,
    updatePost,
    updatePostState,
    deletePost,
    getPostById,
    incrementViews,
  };
};
