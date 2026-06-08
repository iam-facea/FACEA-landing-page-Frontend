import { useEffect, useState } from "react";
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

  const loadPosts = async (nextMode: NewsMode = mode) => {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        nextMode === "published"
          ? await newsService.getPublished()
          : await newsService.getAll();

      setPosts(data);
    } catch (err) {
      console.error("Error al cargar las novedades:", err);
      setError("No se pudieron cargar las novedades.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts(mode);
  }, [mode]);

  const createPost = async (postData: CreatePostInput) => {
    try {
      const newPost = await newsService.create(postData);
      await loadPosts(mode);
      return newPost;
    } catch (err) {
      console.error("Error al crear la novedad:", err);
      setError("No se pudo crear la novedad.");
      return null;
    }
  };

  const updatePost = async (id: string | number, patch: UpdatePostInput) => {
    try {
      const updatedPost = await newsService.update(id, patch);
      if (!updatedPost) return null;

      await loadPosts(mode);

      return updatedPost;
    } catch (err) {
      console.error("Error al actualizar la novedad:", err);
      setError("No se pudo actualizar la novedad.");
      return null;
    }
  };

  const updatePostState = async (id: string | number, postStateId: number) => {
    try {
      const updatedPost = await newsService.updateState(id, postStateId);
      if (!updatedPost) return null;

      await loadPosts(mode);

      return updatedPost;
    } catch (err) {
      console.error("Error al cambiar el estado de la novedad:", err);
      setError("No se pudo cambiar el estado de la novedad.");
      return null;
    }
  };

  const deletePost = async (id: string | number) => {
    try {
      const success = await newsService.delete(id);
      if (!success) return false;

      await loadPosts(mode);

      return true;
    } catch (err) {
      console.error("Error al eliminar la novedad:", err);
      setError("No se pudo eliminar la novedad.");
      return false;
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
  };
};