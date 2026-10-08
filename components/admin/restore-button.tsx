"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { restoreVersion } from "@/app/admin/actions";
import { Button } from "./form-ui";

export function RestoreButton({ versionId }: { versionId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function restore() {
    if (!confirm("Voltar o site para esta versão? A versão atual continua guardada no histórico.")) return;
    setError(null);
    startTransition(async () => {
      const result = await restoreVersion(versionId);
      if (result.ok) router.refresh();
      else setError(result.errors[0]);
    });
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <Button variant="outline" className="px-4 py-2" disabled={pending} onClick={restore}>
        {pending ? "Restaurando…" : "Voltar para esta versão"}
      </Button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
