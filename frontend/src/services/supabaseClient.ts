import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el Frontend (IAM FACEA).
 * Cumple con la restricción no negociable: Cero claves privilegiadas en el cliente.
 * Solo utiliza VITE_SUPABASE_ANON_KEY.
 */

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || "";

if (!supabaseUrl || !supabaseAnonKey) {
  // Advertencia formativa para desarrollo si aún no se configuraron las variables
  console.warn(
    "[Supabase] VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están definidas en el entorno.",
  );
}

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
  if (!supabaseUrl) return "/functions/v1";
  const normalized = supabaseUrl.endsWith("/") ? supabaseUrl.slice(0, -1) : supabaseUrl;
  return `${normalized}/functions/v1`;
};
