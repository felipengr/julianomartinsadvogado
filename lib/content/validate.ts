import { IMAGES_BUCKET, supabaseUrl } from "@/lib/supabase/env";
import { defaultContent } from "./default-content";
import { contentSchema, type Field } from "./schema";
import type { SiteContent } from "./types";

type Json = unknown;

const isObject = (v: Json): v is Record<string, Json> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// Encaixa o que veio do banco no formato atual do site, usando o conteúdo
// padrão para qualquer campo que falte ou tenha o tipo errado. Assim, campos
// novos adicionados no código aparecem sem quebrar versões antigas.
function mergeWithShape(shape: Json, raw: Json): Json {
  if (Array.isArray(shape)) {
    if (!Array.isArray(raw)) return shape;
    const itemShape = shape[0];
    return itemShape === undefined ? raw : raw.map((item, i) => mergeWithShape(shape[i] ?? itemShape, item));
  }
  if (shape === null) {
    return isObject(raw) && typeof raw.src === "string" && typeof raw.alt === "string"
      ? { src: raw.src, alt: raw.alt }
      : null;
  }
  if (isObject(shape)) {
    if (!isObject(raw)) return shape;
    return Object.fromEntries(Object.keys(shape).map((key) => [key, mergeWithShape(shape[key], raw[key])]));
  }
  return typeof raw === typeof shape ? raw : shape;
}

export function getFieldValue(sectionValue: Json, field: Field): Json {
  return field.key ? (sectionValue as Record<string, Json>)[field.key] : sectionValue;
}

export function normalizeContent(raw: Json): SiteContent {
  const content = mergeWithShape(defaultContent, raw) as SiteContent;

  // Listas ligadas a partes fixas do código (ex.: páginas das áreas) mantêm
  // sempre o mesmo número de itens.
  for (const section of contentSchema) {
    for (const field of section.fields) {
      if (field.kind !== "objectList" || !field.fixedLength) continue;
      const items = getFieldValue(content[section.key], field) as Json[];
      const defaults = getFieldValue(defaultContent[section.key], field) as Json[];
      const fixed = defaults.map((fallback, i) => items[i] ?? fallback);
      const container = content[section.key] as Record<string, Json>;
      container[field.key] = fixed;
    }
  }

  return content;
}

// ---------------------------------------------------------------------------

const isHttpUrl = (value: string) => /^https?:\/\/\S+\.\S+/.test(value);
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
// Só fotos do próprio site ou do bucket do Supabase (o next/image recusa outros hosts).
const isAllowedImageSrc = (src: string) =>
  src.startsWith("/images/") ||
  (Boolean(supabaseUrl) && src.startsWith(`${supabaseUrl}/storage/v1/object/public/${IMAGES_BUCKET}/`));

export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

const asText = (value: Json) => (typeof value === "string" ? value.trim() : "");

// Devolve mensagens em português, prontas para mostrar no painel.
export function validateContent(content: SiteContent): string[] {
  const errors: string[] = [];

  for (const section of contentSchema) {
    const sectionValue = content[section.key];

    for (const field of section.fields) {
      const where = `${section.title} › ${field.label}`;
      const value = getFieldValue(sectionValue, field);

      switch (field.kind) {
        case "text": {
          const text = asText(value);
          if (!text && !field.optional) errors.push(`${where}: não pode ficar vazio.`);
          if (text.length > field.max) errors.push(`${where}: passou de ${field.max} caracteres.`);
          break;
        }
        case "url": {
          const url = asText(value);
          if (!url && !field.optional) errors.push(`${where}: não pode ficar vazio.`);
          if (url && !isHttpUrl(url)) errors.push(`${where}: o link precisa começar com https://`);
          break;
        }
        case "email": {
          const email = asText(value);
          if (!email && !field.optional) errors.push(`${where}: não pode ficar vazio.`);
          if (email && !isEmail(email)) errors.push(`${where}: confira o e-mail.`);
          break;
        }
        case "phone": {
          const digits = phoneDigits(typeof value === "string" ? value : "");
          if (digits.length < 10 || digits.length > 13) {
            errors.push(`${where}: confira o número, com DDD.`);
          }
          break;
        }
        case "image": {
          const image = value as SiteContent["hero"]["image"];
          if (!image || !isAllowedImageSrc(image.src)) errors.push(`${where}: escolha uma foto.`);
          else if (!image.alt.trim()) errors.push(`${where}: descreva a foto em poucas palavras.`);
          else if (image.alt.length > 160) errors.push(`${where}: a descrição da foto passou de 160 caracteres.`);
          break;
        }
        case "stringList": {
          const items = Array.isArray(value) ? (value as string[]) : [];
          if (items.length < field.minItems) errors.push(`${where}: precisa de pelo menos ${field.minItems}.`);
          if (items.length > field.maxItems) errors.push(`${where}: no máximo ${field.maxItems}.`);
          items.forEach((item, i) => {
            const text = item.trim();
            if (!text) errors.push(`${where} › ${field.itemLabel} ${i + 1}: não pode ficar vazio.`);
            if (text.length > field.max) {
              errors.push(`${where} › ${field.itemLabel} ${i + 1}: passou de ${field.max} caracteres.`);
            }
          });
          break;
        }
        case "objectList": {
          const items = Array.isArray(value) ? (value as Record<string, string>[]) : [];
          if (items.length < field.minItems) errors.push(`${where}: precisa de pelo menos ${field.minItems}.`);
          if (items.length > field.maxItems) errors.push(`${where}: no máximo ${field.maxItems}.`);
          items.forEach((item, i) => {
            for (const sub of field.fields) {
              const text = (item[sub.key] ?? "").trim();
              const subWhere = `${where} › ${field.itemLabel} ${i + 1} › ${sub.label}`;
              if (!text && !sub.optional) errors.push(`${subWhere}: não pode ficar vazio.`);
              if (text.length > sub.max) errors.push(`${subWhere}: passou de ${sub.max} caracteres.`);
            }
          });
          break;
        }
      }
    }
  }

  return errors;
}
