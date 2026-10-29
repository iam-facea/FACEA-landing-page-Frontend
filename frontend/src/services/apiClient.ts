const DEFAULT_API_BASE_URL = "http://localhost:5107";

const getBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return configuredBaseUrl?.trim() || DEFAULT_API_BASE_URL;
};

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${normalizedPath}`;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    let message = fallbackMessage;

    try {
      const body = await response.json();
      
      // 1. Intentamos leer el formato clásico
      if (typeof body?.message === "string") {
        message = body.message;
      } 
      // 2. MAGIA PARA .NET: Leemos los errores de validación (400 Bad Request)
      else if (body?.errors && typeof body.errors === 'object') {
        const errorMessages = Object.entries(body.errors)
          .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
          .join(' | ');
        message = `Error de Validación Backend -> ${errorMessages}`;
      } 
      // 3. Fallback genérico de .NET
      else if (typeof body?.title === "string") {
        message = body.title;
      }
    } catch {
      try {
        const text = await response.text();
        if (text.trim()) message = text;
      } catch {
        // Mantenemos el fallback
      }
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}