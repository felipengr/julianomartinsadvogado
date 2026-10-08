import { AdminPage } from "@/components/admin/admin-page";
import { Editor } from "@/components/admin/editor-loader";
import { Notice } from "@/components/admin/form-ui";
import { defaultContent } from "@/lib/content/default-content";
import { getPublishedVersion } from "@/lib/content/get-site-content";

export default function EditorPage() {
  return (
    <AdminPage current="/admin">
      {async (supabase) => {
        const [{ data: isAdmin }, version] = await Promise.all([supabase.rpc("is_admin"), getPublishedVersion()]);

        return isAdmin ? (
          <Editor initialContent={version?.content ?? defaultContent} publishedAt={version?.createdAt ?? null} />
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-10">
            <Notice tone="error">
              Este e-mail ainda não tem permissão para editar o site. Fale com o Felipe para liberar o acesso.
            </Notice>
          </div>
        );
      }}
    </AdminPage>
  );
}
