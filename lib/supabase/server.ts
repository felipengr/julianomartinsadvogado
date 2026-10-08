import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

// Cliente com a sessão do usuário (painel /admin e server actions).
export async function createClient() {
  // Sem chaves configuradas, a tela de login explica o que falta.
  if (!isSupabaseConfigured) redirect("/admin/login");

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado de um Server Component: o proxy já renova a sessão.
        }
      },
    },
  });
}
