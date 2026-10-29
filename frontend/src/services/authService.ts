// src/services/authService.ts

const MOCK_ADMIN = {
  username: "admin",
  password: "123",
};

export const authService = {
  login: async (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
          localStorage.setItem("isAuthenticated", "true");
          resolve(true);
        } else {
          reject("Credenciales inválidas");
        }
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem("isAuthenticated");
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("isAuthenticated") === "true";
  }
};