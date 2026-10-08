import { AdminPage } from "@/components/admin/admin-page";
import { PasswordForm } from "@/components/admin/password-form";

export default function PasswordPage() {
  return (
    <AdminPage current="/admin/senha">
      {async () => (
        <main className="mx-auto max-w-md px-4 py-8">
          <h1 className="font-serif text-3xl font-medium">Trocar senha</h1>
          <p className="mt-1 text-sm text-muted">Use pelo menos 8 caracteres.</p>
          <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
            <PasswordForm />
          </div>
        </main>
      )}
    </AdminPage>
  );
}
