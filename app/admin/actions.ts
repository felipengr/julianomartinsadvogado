"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CONTENT_TAG } from "@/lib/content/get-site-content";
import { normalizeContent, validateContent } from "@/lib/content/validate";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string };

export type PublishResult =
  | { ok: true; versionId: number; publishedAt: string }
  | { ok: false; errors: string[] };

async function getAdminClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { supabase, error: "Sua sessão expirou. Entre novamente." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return { supabase, error: "Este e-mail não tem permissão para editar o site." };

  return { supabase, error: null };
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Preencha e-mail e senha." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.code === "invalid_credentials"
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar agora. Tente de novo em instantes.",
    };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function publishContent(raw: unknown, note?: string): Promise<PublishResult> {
  const { supabase, error } = await getAdminClient();
  if (error) return { ok: false, errors: [error] };

  const content = normalizeContent(raw);
  const errors = validateContent(content);
  if (errors.length) return { ok: false, errors };

  const { data, error: insertError } = await supabase
    .from("site_versions")
    .insert({ content, note: note?.slice(0, 120) || null })
    .select("id, created_at")
    .single();

  if (insertError || !data) {
    console.error("Erro ao publicar:", insertError?.message);
    return { ok: false, errors: ["Não foi possível publicar agora. Tente de novo em instantes."] };
  }

  // Regera o site, as páginas das áreas, o sitemap e o llms.txt na hora.
  updateTag(CONTENT_TAG);
  return { ok: true, versionId: data.id, publishedAt: data.created_at };
}

export async function restoreVersion(versionId: number): Promise<PublishResult> {
  const { supabase, error } = await getAdminClient();
  if (error) return { ok: false, errors: [error] };

  const { data: version } = await supabase
    .from("site_versions")
    .select("content, created_at")
    .eq("id", versionId)
    .single();
  if (!version) return { ok: false, errors: ["Versão não encontrada."] };

  const date = new Date(version.created_at).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });
  return publishContent(version.content, `Restaurada a versão de ${date}`);
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== confirm) return { error: "As duas senhas não são iguais." };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { error: "Sua sessão expirou. Entre novamente." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "A nova senha precisa ser diferente da atual."
          : error.code === "weak_password"
            ? "Essa senha é muito fraca. Tente uma mais longa."
            : "Não foi possível trocar a senha agora.",
    };
  }
  return { success: "Senha alterada!" };
}
