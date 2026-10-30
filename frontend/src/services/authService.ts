import { supabase } from "./supabaseClient";

/**
 * Servicio de Autenticación editorial para IAM FACEA.
 * Conecta con Supabase Auth (email y contraseña).
 * Cumple con el contrato 'frontend-ai-bridge-contract.md' (Sección 3).
 */
export const authService = {
  /**
   * Inicia sesión con email y contraseña mediante Supabase Auth.
   * Maneja errores específicos como 403 Forbidden si el backend rechaza al usuario.
   */
  login: async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.status === 400 || error.message.toLowerCase().includes("invalid login credentials")) {
        throw new Error("Credenciales inválidas");
      }
      if (error.status === 403) {
        throw new Error("Acceso denegado: tu usuario no tiene permisos de edición");
      }
      throw new Error(error.message || "Error al iniciar sesión");
    }

    return !!data.session;
  },

  /**
   * Cierra la sesión en Supabase y limpia el estado local de forma síncrona/inmediata.
   */
  logout: async (): Promise<void> => {
    try {
      // 1. Limpiamos cualquier rastro de tokens de Supabase en localStorage de inmediato
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("sb-") || key === "isAuthenticated")) {
          localStorage.removeItem(key);
        }
      }
      // 2. Avisamos al servidor de Supabase
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[authService] Error al cerrar sesión en Supabase:", err);
    }
  },

  /**
   * Obtiene el token JWT actual (Bearer token) para las peticiones editoriales a las Edge Functions.
   */
  getAccessToken: async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },

  /**
   * Renueva explícitamente la sesión de Supabase si es necesario.
   */
  refreshToken: async (): Promise<string | null> => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      await authService.logout();
      return null;
    }
    return data.session?.access_token ?? null;
  },

  /**
   * Comprueba si existe una sesión activa y no expirada en el cliente.
   */
  isAuthenticated: async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  /**
   * Comprobación sincrónica rápida basada en la clave persistida por Supabase en el storage.
   * Útil para evitar parpadeos en rutas protegidas antes del handshake async.
   */
  hasStoredSession: (): boolean => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed?.access_token) return true;
          } catch {
            return false;
          }
        }
      }
    }
    return false;
  },
};

export default authService;
