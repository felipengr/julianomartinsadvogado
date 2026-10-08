"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { uploadImage } from "@/lib/admin/upload-image";
import type {
  Field,
  ImageFieldSpec,
  ObjectListField,
  StringListField,
  TextField,
} from "@/lib/content/schema";
import type { ImageField } from "@/lib/content/types";
import { Button, Help, inputClass, Label } from "./form-ui";

type FieldProps<F, V> = { field: F; value: V; onChange: (value: V) => void };

export function FieldControl({ field, value, onChange }: FieldProps<Field, unknown>) {
  switch (field.kind) {
    case "text":
      return <TextInput field={field} value={value as string} onChange={onChange} />;
    case "url":
      return (
        <SimpleInput
          label={field.label}
          help={field.help}
          type="url"
          inputMode="url"
          placeholder="https://"
          value={value as string}
          onChange={onChange}
        />
      );
    case "email":
      return (
        <SimpleInput
          label={field.label}
          help={field.help}
          type="email"
          inputMode="email"
          placeholder="nome@exemplo.com"
          value={value as string}
          onChange={onChange}
        />
      );
    case "phone":
      return (
        <SimpleInput
          label={field.label}
          help={field.help}
          type="tel"
          inputMode="tel"
          value={value as string}
          onChange={onChange}
        />
      );
    case "image":
      return <ImageInput field={field} value={value as ImageField} onChange={onChange} />;
    case "stringList":
      return <StringListInput field={field} value={value as string[]} onChange={onChange} />;
    case "objectList":
      return (
        <ObjectListInput field={field} value={value as Record<string, string>[]} onChange={onChange} />
      );
  }
}

function Counter({ length, max }: { length: number; max: number }) {
  const near = length > max * 0.9;
  return (
    <span className={`shrink-0 text-xs tabular-nums ${near ? "font-medium text-accent" : "text-muted"}`}>
      {length}/{max}
    </span>
  );
}

const textareaRows = (max: number) => (max > 800 ? 9 : max > 220 ? 5 : 3);

function TextInput({ field, value, onChange, label }: FieldProps<TextField, string> & { label?: string }) {
  const id = useId();
  const common = {
    id,
    value,
    maxLength: field.max,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className: inputClass,
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <Label htmlFor={id}>{label ?? field.label}</Label>
        <Counter length={value.length} max={field.max} />
      </div>
      {field.multiline ? (
        <textarea {...common} rows={textareaRows(field.max)} className={`${inputClass} resize-y leading-relaxed`} />
      ) : (
        <input {...common} type="text" />
      )}
      {field.help && <Help>{field.help}</Help>}
    </div>
  );
}

function SimpleInput({
  label,
  help,
  value,
  onChange,
  ...props
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  inputMode: "url" | "tel" | "email";
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} {...props} />
      {help && <Help>{help}</Help>}
    </div>
  );
}

function ImageInput({ field, value, onChange }: FieldProps<ImageFieldSpec, ImageField>) {
  const fileRef = useRef<HTMLInputElement>(null);
  const altId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const src = await uploadImage(file);
      onChange({ src, alt: value?.alt ?? "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar a foto.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <Label>{field.label}</Label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className="relative w-40 shrink-0 overflow-hidden rounded-2xl bg-soft"
          style={{ aspectRatio: field.aspect }}
        >
          {value && <Image src={value.src} alt="" fill sizes="160px" className="object-cover" />}
          {uploading && (
            <div className="absolute inset-0 grid place-items-center bg-surface/80 text-xs font-medium text-ink">
              Enviando…
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? "Enviando foto…" : "Trocar foto"}
          </Button>
          <Help>A foto é ajustada automaticamente. O recorte ao lado mostra como ela aparece no site.</Help>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      </div>

      {value && (
        <div className="mt-4">
          <div className="flex items-end justify-between gap-3">
            <Label htmlFor={altId}>Descrição da foto</Label>
            <Counter length={value.alt.length} max={160} />
          </div>
          <input
            id={altId}
            value={value.alt}
            maxLength={160}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            className={inputClass}
          />
          <Help>Usada por leitores de tela e pelo Google. Ex.: “Juliano Martins, advogado, de terno na OAB Piracaia”.</Help>
        </div>
      )}
    </div>
  );
}

function move<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ItemActions({
  index,
  count,
  canRemove,
  onMove,
  onRemove,
  itemLabel,
}: {
  index: number;
  count: number;
  canRemove: boolean;
  onMove: (to: number) => void;
  onRemove: () => void;
  itemLabel: string;
}) {
  const small = "px-3 py-1.5 text-xs";
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        className={small}
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
        aria-label={`Subir ${itemLabel} ${index + 1}`}
      >
        ↑ Subir
      </Button>
      <Button
        variant="ghost"
        className={small}
        disabled={index === count - 1}
        onClick={() => onMove(index + 1)}
        aria-label={`Descer ${itemLabel} ${index + 1}`}
      >
        ↓ Descer
      </Button>
      <Button
        variant="danger"
        className={small}
        disabled={!canRemove}
        onClick={() => {
          if (confirm(`Remover ${itemLabel.toLowerCase()} ${index + 1}?`)) onRemove();
        }}
      >
        Remover
      </Button>
    </div>
  );
}

function StringListInput({ field, value, onChange }: FieldProps<StringListField, string[]>) {
  const textField: TextField = { kind: "text", key: "", label: "", max: field.max, multiline: field.multiline };

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{field.label}</legend>
      <div className="space-y-4">
        {value.map((item, i) => (
          <div key={i} className="rounded-2xl border border-line bg-bg/60 p-4">
            <TextInput
              field={textField}
              label={`${field.itemLabel} ${i + 1}`}
              value={item}
              onChange={(text) => onChange(value.map((v, j) => (j === i ? text : v)))}
            />
            <div className="mt-2 flex justify-end">
              <ItemActions
                index={i}
                count={value.length}
                itemLabel={field.itemLabel}
                canRemove={value.length > field.minItems}
                onMove={(to) => onChange(move(value, i, to))}
                onRemove={() => onChange(value.filter((_, j) => j !== i))}
              />
            </div>
          </div>
        ))}
      </div>
      {value.length < field.maxItems && (
        <Button variant="outline" className="mt-4" onClick={() => onChange([...value, ""])}>
          + Adicionar {field.itemLabel.toLowerCase()}
        </Button>
      )}
      {field.help && <Help>{field.help}</Help>}
    </fieldset>
  );
}

function ObjectListInput({ field, value, onChange }: FieldProps<ObjectListField, Record<string, string>[]>) {
  const emptyItem = () => Object.fromEntries(field.fields.map((f) => [f.key, ""]));

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{field.label}</legend>
      <div className="space-y-4">
        {value.map((item, i) => (
          <div key={i} className="rounded-2xl border border-line bg-bg/60 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                {field.itemLabel} {i + 1}
                {field.titleKey && item[field.titleKey] && (
                  <span className="font-normal text-muted"> · {item[field.titleKey]}</span>
                )}
              </p>
              {!field.fixedLength && (
                <ItemActions
                  index={i}
                  count={value.length}
                  itemLabel={field.itemLabel}
                  canRemove={value.length > field.minItems}
                  onMove={(to) => onChange(move(value, i, to))}
                  onRemove={() => onChange(value.filter((_, j) => j !== i))}
                />
              )}
            </div>
            <div className="space-y-4">
              {field.fields.map((sub) => (
                <TextInput
                  key={sub.key}
                  field={sub}
                  value={item[sub.key] ?? ""}
                  onChange={(text) => onChange(value.map((v, j) => (j === i ? { ...v, [sub.key]: text } : v)))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {!field.fixedLength && value.length < field.maxItems && (
        <Button variant="outline" className="mt-4" onClick={() => onChange([...value, emptyItem()])}>
          + Adicionar {field.itemLabel.toLowerCase()}
        </Button>
      )}
    </fieldset>
  );
}
