import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el Frontend (IAM FACEA).
 * Cumple con la restricción no negociable: Cero claves privilegiadas en el cliente.
 * Solo utiliza VITE_SUPABASE_ANON_KEY.
 */

const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const envAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const isConfigured = !!(envUrl && envAnonKey);

if (!isConfigured) {
  // Advertencia formativa para desarrollo si aún no se configuraron las variables
  console.warn(
    "[Supabase] VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están definidas en el entorno. Utilizando valores de inicialización segura para entorno local/test.",
  );
}

// Fallback seguro y sintácticamente válido para permitir tests y renders sin variables cargadas
const supabaseUrl = envUrl || "https://placeholder-project.supabase.co";
const supabaseAnonKey = envAnonKey || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/**
 * URL base para invocar las Edge Functions:
 * ${VITE_SUPABASE_URL}/functions/v1/
 */
export const getFunctionsBaseUrl = (): string => {
  const base = envUrl || supabaseUrl;
  const normalized = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalized}/functions/v1`;
};
