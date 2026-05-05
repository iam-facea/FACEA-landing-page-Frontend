// src/services/newsService.ts

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

// Nuestra "Base de Datos" temporal en memoria
let mockDatabase: NewsPost[] = [
  {
    id: "1",
    title: "Inicio de actividades 2026",
    content: "Damos la bienvenida a los nuevos integrantes...",
    date: "2026-05-05",
  },
];

export const newsService = {
  // TU TURNO: Retornar mockDatabase simulando 1 segundo de latencia con una Promise y setTimeout
  getAll: async (): Promise<NewsPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDatabase);
      }, 1000);
    });
  },

  // TU TURNO: Generar un ID (puedes usar Date.now().toString()), armar el objeto NewsPost, 
  // pushearlo a mockDatabase y retornarlo con latencia.
  create: async (postData: Omit<NewsPost, "id" | "date">): Promise<NewsPost> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost: NewsPost = {
          id: Date.now().toString(),
          title: postData.title,
          content: postData.content,
          date: new Date().toISOString().split("T")[0],
        };
        mockDatabase.push(newPost);
        resolve(newPost);
      }, 1000);
    });
  },

  // TU TURNO: Filtrar mockDatabase para quitar el post con el ID recibido, y retornar true con latencia.
  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockDatabase = mockDatabase.filter((post) => post.id !== id);
        resolve(true);
      }, 1000);
    });
    // Escribe tu lógica aquí
  },
};