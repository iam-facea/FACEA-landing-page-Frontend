// src/services/newsService.ts

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

let mockDatabase: NewsPost[] = [
  {
    id: "1",
    title: "Inicio de actividades 2026",
    content: "Damos la bienvenida a los nuevos integrantes...",
    date: "2026-05-05",
  },
];

export const newsService = {
  getAll: async (): Promise<NewsPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDatabase);
      }, 1000);
    });
  },

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

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockDatabase = mockDatabase.filter((post) => post.id !== id);
        resolve(true);
      }, 1000);
    });
  },
};