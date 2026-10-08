import { Suspense, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "./admin-header";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// Páginas do painel leem a sessão (cookies) a cada visita. Com Cache Components
// essa leitura fica dentro de um Suspense; o resto da página continua estático.
export function AdminPage({
  current,
  children,
}: {
  current: string;
  children: (supabase: SupabaseClient) => Promise<ReactNode>;
}) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted">Carregando…</p>}>
      <SessionContent current={current}>{children}</SessionContent>
    </Suspense>
  );
}

async function SessionContent({
  current,
  children,
}: {
  current: string;
  children: (supabase: SupabaseClient) => Promise<ReactNode>;
}) {
  const supabase = await createClient();
  const [{ data }, content] = await Promise.all([supabase.auth.getClaims(), children(supabase)]);

  return (
    <>
      <AdminHeader email={data?.claims.email as string | undefined} current={current} />
      {content}
    </>
  );
}
