import { useEffect, useState } from "react";
import { newsService, type Post } from "../services/newsService";

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

  const createPost = async (postData: Omit<Post, "post_id">) => {
    try {
      const newPost = await newsService.create(postData);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      console.error("Error al crear la novedad:", err);
      setError("No se pudo crear la novedad.");
      return null;
    }
  };

  const updatePost = async (id: string | number, patch: Partial<Post>) => {
    try {
      const updatedPost = await newsService.update(id, patch);
      if (!updatedPost) return null;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id.toString() === id.toString() ? updatedPost : post,
        ),
      );

      return updatedPost;
    } catch (err) {
      console.error("Error al actualizar la novedad:", err);
      setError("No se pudo actualizar la novedad.");
      return null;
    }
  };

  const deletePost = async (id: string | number) => {
    try {
      const success = await newsService.delete(id);
      if (!success) return false;

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.post_id.toString() !== id.toString()),
      );

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
    deletePost,
  };
};