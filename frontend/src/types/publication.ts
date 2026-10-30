/**
 * Contratos de Datos estrictos para IAM FACEA - Backend Supabase / Edge Functions
 * Basado en la especificación: frontend-ai-bridge-contract.md
 */

export type PublicationStatus = "draft" | "published";

// Respuesta pública para visitantes (sin datos de auditoría ni borrador)
export interface PublicPublication {
  id: string;              // UUID
  title: string;
  description: string;
  category: string;
  publicationDate: string; // Formato YYYY-MM-DD
  imageUrl: string;        // URL pública servida desde CDN / Vercel Blob
}

// Respuesta editorial completa para el panel de administración
export interface EditorPublication {
  id: string;              // UUID
  title: string;
  description: string;
  category: string;
  publicationDate: string; // Formato YYYY-MM-DD
  status: PublicationStatus;
  createdAt: string;       // Timestamp ISO 8601 UTC (ej. 2026-10-29T16:00:00Z)
  updatedAt: string;       // Timestamp ISO 8601 UTC
  publishedAt: string | null;
  image: {
    id: string;            // UUID del registro content
    url: string;           // URL pública de la imagen
  };
}

// Payload para crear una nueva publicación (POST /editor-publications)
export interface PublicationCreatePayload {
  title: string;                 // 1 a 160 caracteres (trim)
  description: string;           // 1 a 1000 caracteres (trim)
  category: string;              // 1 a 80 caracteres (trim)
  publicationDate?: string;      // Opcional en creación: YYYY-MM-DD (por defecto hoy en Arg)
  status?: PublicationStatus;    // Opcional en creación: default "draft"
  imageContentId: string;        // UUID obtenido previamente de /functions/v1/images
}

// Payload para reemplazar completamente una publicación (PUT /editor-publications/{id})
export interface PublicationReplacePayload {
  title: string;                 // Obligatorio: 1 a 160 caracteres
  description: string;           // Obligatorio: 1 a 1000 caracteres
  category: string;              // Obligatorio: 1 a 80 caracteres
  publicationDate: string;       // Obligatorio: YYYY-MM-DD
  status: PublicationStatus;     // Obligatorio: "draft" | "published"
  imageContentId: string;        // Obligatorio: UUID del contenido de imagen
}

// Respuesta al subir una imagen (POST /images)
export interface ImageUploadResponse {
  id: string;        // UUID del contenido de imagen (usar como imageContentId)
  url: string;       // URL pública de previsualización
  createdAt: string; // Timestamp ISO 8601 UTC
}

// Envoltorio de paginación para listados
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null; // Cadena opaca base64url o null si no hay más páginas
}

// Formato unificado de error del backend
export interface ApiErrorResponse {
  error: string;
}

// Configuración y validaciones de imágenes en cliente (Sección 6)
export const IMAGE_UPLOAD_CONSTRAINTS = {
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5 MiB
  MAX_DIMENSION_PX: 4096,
} as const;
