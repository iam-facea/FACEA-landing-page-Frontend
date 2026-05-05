import { useState, useEffect } from "react";
import { newsService, type NewsPost } from "../services/newsService";

export const useNews = () => {
  // Estados de dominio (los datos reales de tu aplicación)
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // MISIÓN 1: La carga inicial
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await newsService.getAll();
        setPosts(data);
      } catch (error) {
        console.error("Error al cargar las novedades:", error);
      } finally {
        setIsLoading(false); // Ya sea que falle o tenga éxito, quitamos el loader
      }
    };

    fetchPosts();
  }, []);

  // MISIÓN 2: Crear la novedad
  const createPost = async (title: string, content: string) => {
    try {
      const newPost = await newsService.create({ title, content });
      // Actualizamos el estado insertando la nueva novedad al principio del arreglo
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return true; // Retornamos true para avisarle a la vista que todo salió bien
    } catch (error) {
      console.error("Error al crear la novedad:", error);
      return false;
    }
  };

  // MISIÓN 3: Eliminar la novedad
  const deletePost = async (id: string) => {
    try {
      const success = await newsService.delete(id);
      if (success) {
        // Filtramos el arreglo para quitar el post que coincide con el ID
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar la novedad:", error);
    }
  };

  // Exponemos hacia afuera solo lo que la vista necesita
  return {
    posts,
    isLoading,
    createPost,
    deletePost,
  };
};