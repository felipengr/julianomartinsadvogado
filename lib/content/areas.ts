import type { PracticeArea, SiteContent } from "./types";

// Cada área de atuação tem uma página própria, pensada para buscas locais
// ("advogado previdenciário em Piracaia"). Endereço e palavra-chave ficam no
// código para os links nunca quebrarem; os textos vêm do painel, na mesma ordem.
export const areaPages = [
  { slug: "direito-previdenciario", keyword: "Advogado previdenciário", serviceType: "Direito Previdenciário" },
  { slug: "direito-trabalhista", keyword: "Advogado trabalhista", serviceType: "Direito do Trabalho" },
  { slug: "direito-civil-e-consumidor", keyword: "Advogado cível e do consumidor", serviceType: "Direito Civil e do Consumidor" },
  { slug: "direito-de-familia-e-sucessoes", keyword: "Advogado de família e sucessões", serviceType: "Direito de Família e Sucessões" },
  { slug: "direito-criminal", keyword: "Advogado criminal", serviceType: "Direito Penal" },
  { slug: "orientacao-juridica", keyword: "Orientação jurídica", serviceType: "Consultoria Jurídica" },
] as const;

export type AreaPage = (typeof areaPages)[number];

export type ResolvedArea = AreaPage & PracticeArea & { href: string; number: string };

export const areaHref = (slug: string) => `/areas/${slug}`;

export function resolveAreas(content: SiteContent): ResolvedArea[] {
  return areaPages.map((page, i) => ({
    ...page,
    ...content.areas.items[i],
    href: areaHref(page.slug),
    number: String(i + 1).padStart(2, "0"),
  }));
}

export function findArea(content: SiteContent, slug: string) {
  return resolveAreas(content).find((area) => area.slug === slug) ?? null;
}

// Textos com várias linhas digitados no painel.
export const toParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const toLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
