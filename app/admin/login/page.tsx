import { Notice } from "@/components/admin/form-ui";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-3xl font-medium">Painel do site</p>
          <p className="mt-2 text-sm text-muted">Entre para editar textos e fotos do seu site.</p>
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-sm">
          {isSupabaseConfigured ? (
            <LoginForm />
          ) : (
            <Notice tone="error">
              O painel ainda não foi configurado (faltam as chaves do Supabase no arquivo .env.local).
            </Notice>
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          Esqueceu a senha? Fale com o Felipe que ele cria uma nova para você.
        </p>
      </div>
    </main>
  );
}
