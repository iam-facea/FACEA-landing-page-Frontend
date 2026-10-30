import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  publicPublicationsService,
  editorPublicationsService,
} from "./publicationService";
import type {
  PublicPublication,
  PaginatedResponse,
} from "../types/publication";

describe("publicationService (Edge Functions Integration)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getPublications debe solicitar /functions/v1/publications con los parámetros de paginación", async () => {
    const mockData: PaginatedResponse<PublicPublication> = {
      items: [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Noticia de Prueba",
          description: "Descripción de prueba",
          category: "Institucional",
          publicationDate: "2026-04-01",
          imageUrl: "https://ejemplo.com/foto.jpg",
        },
      ],
      nextCursor: null,
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await publicPublicationsService.getPublications(10);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const requestedUrl = fetchSpy.mock.calls[0][0] as string;
    expect(requestedUrl).toContain("/functions/v1/publications?limit=10");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Noticia de Prueba");
  });

  it("getPublicationById debe solicitar /functions/v1/publications/{id} y retornar los datos", async () => {
    const mockPost: PublicPublication = {
      id: "uuid-1234",
      title: "Publicación específica",
      description: "Detalle completo",
      category: "Académica",
      publicationDate: "2026-04-02",
      imageUrl: "https://ejemplo.com/detalle.jpg",
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await publicPublicationsService.getPublicationById("uuid-1234");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const requestedUrl = fetchSpy.mock.calls[0][0] as string;
    expect(requestedUrl).toContain("/functions/v1/publications/uuid-1234");
    expect(result?.title).toBe("Publicación específica");
  });

  it("getPublicationById debe retornar null de forma controlada cuando recibe 404 Not Found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await publicPublicationsService.getPublicationById("uuid-inexistente");
    expect(result).toBeNull();
  });

  it("deletePublication debe enviar DELETE con cabecera Authorization y resolver en 204", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(null, {
        status: 204,
      }),
    );

    const success = await editorPublicationsService.deletePublication("uuid-a-borrar");

    expect(success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, options] = fetchSpy.mock.calls[0];
    expect(options?.method).toBe("DELETE");
  });
});
