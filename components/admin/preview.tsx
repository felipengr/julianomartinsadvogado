"use client";

import { useEffect } from "react";
import { HomePage } from "@/components/site/home-page";
import type { SiteContent } from "@/lib/content/types";
import { Button } from "./form-ui";

// Mostra a página inicial com o conteúdo ainda não publicado.
export function Preview({
  content,
  onClose,
  onPublish,
  canPublish,
}: {
  content: SiteContent;
  onClose: () => void;
  onPublish: () => void;
  canPublish: boolean;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Prévia do site" className="fixed inset-0 z-60 flex flex-col bg-bg">
      <div className="flex items-center justify-between gap-3 bg-night px-4 py-3 text-white">
        <p className="text-sm">
          <strong className="font-semibold">Prévia</strong>
          <span className="hidden sm:inline"> · é assim que o site vai ficar</span>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="px-4 py-2" onClick={onClose}>
            Voltar a editar
          </Button>
          {canPublish && (
            <button
              type="button"
              onClick={onPublish}
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-night hover:bg-gold/90"
            >
              Publicar
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <HomePage content={content} year={new Date().getFullYear()} />
      </div>
    </div>
  );
}
