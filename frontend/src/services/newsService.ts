import newsSeed from "../../data/news/newsData.json";

export interface Post {
  post_id: number | string;
  title: string;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD
  image?: string | null;
  url?: string | null;
  post_state_id: string; // 'publico' | 'oculta' | etc.
}

const STORAGE_KEY = "news:mock";

const readStorage = (): Post[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Post[];
  } catch (e) {
    // ignore
  }

  // fallback: seed file
  const seed = (newsSeed as any).posts as Post[];
  return seed ? JSON.parse(JSON.stringify(seed)) : [];
};

const writeStorage = (data: Post[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
};

// Helpers para testing/reset
export const seedMock = (data: Post[]) => {
  writeStorage(JSON.parse(JSON.stringify(data)));
};

export const resetMock = () => {
  const seed = (newsSeed as any).posts as Post[];
  writeStorage(JSON.parse(JSON.stringify(seed)));
};

// Servicio principal
export const newsService = {
  // Consumo público: solo posts con estado 'publico'
  getPublished: async (): Promise<Post[]> => {
    const db = readStorage();
    return db.filter((p) => p.post_state_id === "publico");
  },

  // Consumo admin: todas o filtradas por estado
  getAll: async (filter?: { status?: string }): Promise<Post[]> => {
    const db = readStorage();
    if (!filter || !filter.status) return db;
    return db.filter((p) => p.post_state_id === filter.status);
  },

  getById: async (id: string | number): Promise<Post | null> => {
    const db = readStorage();
    const found = db.find((p) => p.post_id.toString() === id.toString());
    return found ? { ...found } : null;
  },

  create: async (postData: Omit<Post, "post_id">): Promise<Post> => {
    const db = readStorage();
    const maxId = db.reduce((acc, cur) => {
      const n = typeof cur.post_id === "number" ? cur.post_id : parseInt(String(cur.post_id), 10) || 0;
      return Math.max(acc, n);
    }, 0);
    const newPost: Post = { post_id: maxId + 1, ...postData };
    const next = [...db, newPost];
    writeStorage(next);
    return { ...newPost };
  },

  update: async (id: string | number, patch: Partial<Post>): Promise<Post | null> => {
    const db = readStorage();
    const idx = db.findIndex((p) => p.post_id.toString() === id.toString());
    if (idx === -1) return null;
    db[idx] = { ...db[idx], ...patch } as Post;
    writeStorage(db);
    return { ...db[idx] };
  },

  delete: async (id: string | number): Promise<boolean> => {
    const db = readStorage();
    const idx = db.findIndex((p) => p.post_id.toString() === id.toString());
    if (idx === -1) return false;
    db.splice(idx, 1);
    writeStorage(db);
    return true;
  },
};

export default newsService;
