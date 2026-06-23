import { apiRequest } from "./apiClient";

interface ApiPost {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  views?: number;
  imageUrl?: string | null;
  postStateId: number; 
}

export interface Post {
  post_id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  post_state_id: number;
  state?: string;
  views?: number;
}

export interface CreatePostInput {
  title: string;
  description: string;
  category: string;
  date: string;
  url?: string;
  postStateId: number;
  file: File;
}

export interface UpdatePostInput {
  title: string;
  description: string;
  category: string;
  date: string;
  url?: string;
  postStateId: number;
  file?: File | null;
}

const POSTS_PATH = "/api/Posts";

const toPost = (post: ApiPost): Post => ({
  post_id: post.id,
  title: post.title,
  description: post.description,
  category: post.category,
  date: post.date,
  image: post.imageUrl ?? null,
  imageUrl: post.imageUrl ?? null,
  url: null,
  // ¡AQUÍ ESTÁ LA MAGIA! Leemos el número directamente del backend
  post_state_id: post.postStateId, 
  state: post.postStateId === 1 ? "Público" : "Oculto",
  views: post.views,
});

const buildFormData = (data: CreatePostInput | UpdatePostInput) => {
  const formData = new FormData();
  formData.append("Title", data.title);
  formData.append("Description", data.description);
  formData.append("Category", data.category);
  formData.append("PostStateId", String(data.postStateId));
  formData.append("Date", data.date);

  if (data.url) {
    formData.append("Url", data.url);
  }

  if (data.file) {
    formData.append("File", data.file);
  }

  return formData;
};

const requestPosts = async (path: string) => {
  const posts = await apiRequest<ApiPost[]>(path);
  return posts.map(toPost);
};

export const newsService = {
  getPublished: async (): Promise<Post[]> => requestPosts(`${POSTS_PATH}/public`),

  getAll: async (): Promise<Post[]> => requestPosts(POSTS_PATH),

  getById: async (id: string | number): Promise<Post | null> => {
    try {
      const post = await apiRequest<ApiPost>(`${POSTS_PATH}/${id}`);
      return toPost(post);
    } catch (error) {
      if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
        return null;
      }

      throw error;
    }
  },

  create: async (postData: CreatePostInput): Promise<Post> => {
    const createdPost = await apiRequest<ApiPost>(POSTS_PATH, {
      method: "POST",
      body: buildFormData(postData),
    });

    return toPost(createdPost);
  },

  update: async (id: string | number, postData: UpdatePostInput): Promise<Post | null> => {
    try {
      const updatedPost = await apiRequest<ApiPost>(`${POSTS_PATH}/${id}`, {
        method: "PUT",
        body: buildFormData(postData),
      });

      return toPost(updatedPost);
    } catch (error) {
      if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
        return null;
      }

      throw error;
    }
  },

  updateState: async (id: string | number, postStateId: number): Promise<Post | null> => {
    try {
      const updatedPost = await apiRequest<ApiPost>(`${POSTS_PATH}/${id}/state`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postStateId }),
      });

      return toPost(updatedPost);
    } catch (error) {
      if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
        return null;
      }

      throw error;
    }
  },

  delete: async (id: string | number): Promise<boolean> => {
    await apiRequest<void>(`${POSTS_PATH}/${id}`, {
      method: "DELETE",
    });

    return true;
  },
};

export default newsService;
