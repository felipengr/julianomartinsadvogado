import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";
import { defaultContent } from "./default-content";
import type { SiteContent } from "./types";
import { normalizeContent } from "./validate";

// Ao publicar, o painel chama updateTag(CONTENT_TAG) e o site é regerado na hora.
export const CONTENT_TAG = "site-content";

export type PublishedVersion = {
  id: number;
  content: SiteContent;
  createdAt: string;
};

// Leitura pública (sem cookies), cacheada para as páginas continuarem estáticas.
// O cacheLife "hours" é só uma rede de segurança: se o Supabase falhar no
// build, o site se corrige sozinho em até 1 hora.
export async function getPublishedVersion(): Promise<PublishedVersion | null> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  if (!isSupabaseConfigured) return null;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("site_versions")
    .select("id, content, created_at")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao ler o conteúdo publicado:", error.message);
    return null;
  }
  if (!data) return null;

  return { id: data.id, content: normalizeContent(data.content), createdAt: data.created_at };
}

export async function getSiteContent(): Promise<SiteContent> {
  const version = await getPublishedVersion();
  return version?.content ?? defaultContent;
}

// Ano do rodapé. Datas não podem ser lidas durante a pré-renderização fora de um cache.
export async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
