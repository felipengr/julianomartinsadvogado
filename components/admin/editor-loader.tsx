"use client";

import dynamic from "next/dynamic";

// O editor lê o rascunho do localStorage logo ao abrir, então só renderiza no navegador.
export const Editor = dynamic(() => import("./editor").then((m) => m.Editor), {
  ssr: false,
  loading: () => <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted">Carregando o editor…</p>,
});
