"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { publishContent } from "@/app/admin/actions";
import { contentSchema, type Field, type SectionSpec } from "@/lib/content/schema";
import type { SiteContent } from "@/lib/content/types";
import { getFieldValue } from "@/lib/content/validate";
import { FieldControl } from "./fields";
import { Button, Notice } from "./form-ui";
import { Preview } from "./preview";

const DRAFT_KEY = "painel-rascunho";

type Draft = { content: SiteContent; savedAt: string };

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft | null) {
  try {
    if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Sem localStorage (modo anônimo): o rascunho só não fica salvo.
  }
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

function setFieldValue(content: SiteContent, section: SectionSpec, field: Field, value: unknown): SiteContent {
  const current = content[section.key];
  const next = field.key ? { ...(current as object), [field.key]: value } : value;
  return { ...content, [section.key]: next } as SiteContent;
}

type Status =
  | { kind: "idle" }
  | { kind: "publishing" }
  | { kind: "published" }
  | { kind: "error"; errors: string[] };

export function Editor({ initialContent, publishedAt }: { initialContent: SiteContent; publishedAt: string | null }) {
  const [published, setPublished] = useState(initialContent);
  const [content, setContent] = useState(initialContent);
  const [lastPublishedAt, setLastPublishedAt] = useState(publishedAt);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [previewOpen, setPreviewOpen] = useState(false);
  // Rascunho de uma visita anterior (ex.: fechou a aba sem publicar).
  // O editor só roda no navegador (ver editor-loader), então dá para ler aqui.
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(() => {
    const draft = readDraft();
    return draft && JSON.stringify(draft.content) !== JSON.stringify(initialContent) ? draft : null;
  });

  const publishedJson = useMemo(() => JSON.stringify(published), [published]);
  const dirty = JSON.stringify(content) !== publishedJson;

  useEffect(() => {
    if (pendingDraft) return;
    const timer = setTimeout(() => {
      writeDraft(dirty ? { content, savedAt: new Date().toISOString() } : null);
    }, 400);
    return () => clearTimeout(timer);
  }, [content, dirty, pendingDraft]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (section: SectionSpec, field: Field, value: unknown) => {
    setContent((c) => setFieldValue(c, section, field, value));
    if (status.kind !== "publishing") setStatus({ kind: "idle" });
  };

  const publish = useCallback(async () => {
    setPreviewOpen(false);
    setStatus({ kind: "publishing" });
    try {
      const result = await publishContent(content);
      if (result.ok) {
        setPublished(content);
        setLastPublishedAt(result.publishedAt);
        writeDraft(null);
        setStatus({ kind: "published" });
      } else {
        setStatus({ kind: "error", errors: result.errors });
      }
    } catch {
      setStatus({ kind: "error", errors: ["Sem conexão com o servidor. Confira sua internet e tente de novo."] });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [content]);

  const discardChanges = () => {
    if (!confirm("Desfazer todas as alterações que ainda não foram publicadas?")) return;
    setContent(published);
    writeDraft(null);
    setStatus({ kind: "idle" });
  };

  const changedSections = new Set(
    contentSchema
      .filter((s) => JSON.stringify(content[s.key]) !== JSON.stringify(published[s.key]))
      .map((s) => s.key),
  );

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-6 pb-40">
        {pendingDraft && (
          <Notice tone="info">
            <p>
              Você tem alterações não publicadas de <strong>{formatDate(pendingDraft.savedAt)}</strong>.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                className="px-4 py-2"
                onClick={() => {
                  setContent(pendingDraft.content);
                  setPendingDraft(null);
                }}
              >
                Continuar de onde parei
              </Button>
              <Button
                variant="outline"
                className="px-4 py-2"
                onClick={() => {
                  writeDraft(null);
                  setPendingDraft(null);
                }}
              >
                Descartar
              </Button>
            </div>
          </Notice>
        )}

        {status.kind === "published" && (
          <Notice tone="success">
            <strong>Pronto! Seu site foi atualizado.</strong>{" "}
            <a href="/" target="_blank" rel="noopener noreferrer" className="underline">
              Ver o site
            </a>
          </Notice>
        )}

        {status.kind === "error" && (
          <Notice tone="error">
            <p className="font-semibold">Não deu para publicar. Confira:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {status.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </Notice>
        )}

        <p className="px-1 text-sm text-muted">
          Toque em uma parte do site para editar. Nada muda no site até você tocar em <strong>Publicar</strong>.
        </p>

        {contentSchema.map((section) => (
          <details
            key={section.key}
            className="group rounded-3xl border border-line bg-surface open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <div>
                <p className="flex items-center gap-2 font-serif text-xl font-medium">
                  {section.title}
                  {changedSections.has(section.key) && (
                    <span className="rounded-full bg-soft px-2 py-0.5 font-sans text-[0.65rem] font-semibold tracking-wide text-accent uppercase">
                      alterado
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-muted">{section.description}</p>
              </div>
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-full bg-soft text-lg text-ink transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="space-y-6 border-t border-line px-5 pt-5 pb-6">
              {section.fields.map((field) => (
                <FieldControl
                  key={field.key || field.label}
                  field={field}
                  value={getFieldValue(content[section.key], field)}
                  onChange={(value) => update(section, field, value)}
                />
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            {dirty ? (
              <p className="font-medium text-accent">
                Alterações não publicadas ·{" "}
                <button type="button" onClick={discardChanges} className="font-normal text-muted underline">
                  desfazer
                </button>
              </p>
            ) : (
              <p className="text-muted">
                Tudo publicado{lastPublishedAt ? ` · última vez em ${formatDate(lastPublishedAt)}` : ""}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button variant="outline" onClick={() => setPreviewOpen(true)}>
              Ver prévia
            </Button>
            <Button onClick={publish} disabled={!dirty || status.kind === "publishing"}>
              {status.kind === "publishing" ? "Publicando…" : "Publicar"}
            </Button>
          </div>
        </div>
      </div>

      {previewOpen && (
        <Preview
          content={content}
          onClose={() => setPreviewOpen(false)}
          onPublish={publish}
          canPublish={dirty && status.kind !== "publishing"}
        />
      )}
    </>
  );
}
