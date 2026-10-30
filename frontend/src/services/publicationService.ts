import { getFunctionsBaseUrl } from "./supabaseClient";
import { authService } from "./authService";
import type {
  PublicPublication,
  EditorPublication,
  PublicationCreatePayload,
  PublicationReplacePayload,
  ImageUploadResponse,
  PaginatedResponse,
  ApiErrorResponse,
} from "../types/publication";

/**
 * Cliente HTTP unificado para invocar las Edge Functions de IAM FACEA.
 * Maneja los códigos de estado y errores descriptivos según la Sección 8 del contrato:
 * 400, 401, 403, 404, 405, 409, 413, 422, 500.
 */

export class EdgeFunctionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "EdgeFunctionError";
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
  requiresAuth?: boolean;
}

export async function edgeFunctionRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = getFunctionsBaseUrl();
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${normalizedEndpoint}`;

  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Si requiere autenticación o viene token explícito
  if (options.requiresAuth || options.token) {
    const token = options.token ?? (await authService.getAccessToken());
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Timeout preventivo de 15 segundos para que la UI jamás quede congelada si la red cuelga
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (fetchErr: unknown) {
    clearTimeout(timeoutId);
    if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
      throw new EdgeFunctionError(
        "Tiempo de espera agotado al conectar con el servidor (timeout 15s).",
        408,
      );
    }
    // Error de red típico (CORS o sin conexión)
    throw new EdgeFunctionError(
      "Error de conexión con el servidor. Verifica las políticas CORS o tu conexión de red.",
      0,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorMessage = `Error en el servidor (${response.status})`;

    try {
      const errorJson = (await response.json()) as ApiErrorResponse;
      if (errorJson?.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      try {
        const errorText = await response.text();
        if (errorText.trim()) errorMessage = errorText;
      } catch {
        // Fallback
      }
    }

    // Mapeo semántico de errores del contrato
    switch (response.status) {
      case 401:
        errorMessage = "Sesión expirada o no autorizada. Por favor iniciá sesión nuevamente.";
        break;
      case 403:
        errorMessage = "Acceso denegado: tu usuario no tiene permisos de edición (403 Forbidden).";
        break;
      case 404:
        errorMessage = "La publicación solicitada no fue encontrada.";
        break;
      case 409:
        errorMessage = "La imagen seleccionada ya no está disponible. Por favor subí una nueva.";
        break;
      case 413:
        errorMessage = "El archivo supera el tamaño máximo permitido de 5 MB.";
        break;
      case 422:
        errorMessage = "Formato de imagen no soportado o dimensiones inválidas (use JPG, PNG o WebP).";
        break;
      case 500:
        errorMessage = "Ocurrió un error en el servidor. Intentá nuevamente más tarde.";
        break;
    }

    throw new EdgeFunctionError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * Servicio público de publicaciones (consumo anónimo, sin Bearer token).
 * Operaciones 1 y 2 del contrato backend:
 * 1. GET /functions/v1/publications?limit=&cursor=
 * 2. GET /functions/v1/publications/{id}
 */
export const publicPublicationsService = {
  /**
   * Obtiene una página de publicaciones públicas mediante cursor opaco.
   */
  getPublications: async (
    limit = 20,
    cursor?: string | null,
  ): Promise<PaginatedResponse<PublicPublication>> => {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);

    const query = params.toString() ? `?${params.toString()}` : "";
    return edgeFunctionRequest<PaginatedResponse<PublicPublication>>(
      `/publications${query}`,
    );
  },

  /**
   * Obtiene el detalle público de una publicación por su UUID.
   */
  getPublicationById: async (id: string): Promise<PublicPublication | null> => {
    try {
      return await edgeFunctionRequest<PublicPublication>(`/publications/${id}`);
    } catch (err) {
      if (err instanceof EdgeFunctionError && err.status === 404) {
        return null;
      }
      throw err;
    }
  },
};

/**
 * Servicio editorial de publicaciones (requiere Bearer token del editor).
 * Operaciones 3, 4, 5, 6, 7 y 8 del contrato backend:
 * 3. GET /functions/v1/editor-publications
 * 4. GET /functions/v1/editor-publications/{id}
 * 5. POST /functions/v1/editor-publications
 * 6. PUT /functions/v1/editor-publications/{id}
 * 7. DELETE /functions/v1/editor-publications/{id}
 * 8. POST /functions/v1/images (multipart/form-data)
 */
export const editorPublicationsService = {
  /**
   * Obtiene el listado editorial completo (borradores y publicadas) con cursor.
   */
  getPublications: async (
    limit = 20,
    cursor?: string | null,
  ): Promise<PaginatedResponse<EditorPublication>> => {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);

    const query = params.toString() ? `?${params.toString()}` : "";
    return edgeFunctionRequest<PaginatedResponse<EditorPublication>>(
      `/editor-publications${query}`,
      { requiresAuth: true },
    );
  },

  /**
   * Obtiene una publicación editorial por UUID.
   */
  getPublicationById: async (id: string): Promise<EditorPublication | null> => {
    try {
      return await edgeFunctionRequest<EditorPublication>(
        `/editor-publications/${id}`,
        { requiresAuth: true },
      );
    } catch (err) {
      if (err instanceof EdgeFunctionError && err.status === 404) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Sube una imagen en multipart/form-data (Paso 1 del flujo de imágenes).
   */
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return edgeFunctionRequest<ImageUploadResponse>("/images", {
      method: "POST",
      body: formData,
      requiresAuth: true,
    });
  },

  /**
   * Crea una nueva publicación con su imageContentId asociado (Paso 2).
   */
  createPublication: async (
    payload: PublicationCreatePayload,
  ): Promise<EditorPublication> => {
    return edgeFunctionRequest<EditorPublication>("/editor-publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  /**
   * Reemplaza completamente una publicación existente por su UUID.
   */
  replacePublication: async (
    id: string,
    payload: PublicationReplacePayload,
  ): Promise<EditorPublication> => {
    return edgeFunctionRequest<EditorPublication>(`/editor-publications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  /**
   * Elimina lógicamente una publicación (retorna 204 No Content).
   */
  deletePublication: async (id: string): Promise<boolean> => {
    await edgeFunctionRequest<void>(`/editor-publications/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });
    return true;
  },
};
