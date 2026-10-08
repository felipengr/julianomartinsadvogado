// Endereço público do site, usado em links absolutos (Google, WhatsApp, sitemap).
// Fica sempre no domínio oficial, inclusive em testes, para o Google nunca
// indexar endereços provisórios. NEXT_PUBLIC_SITE_URL só serve para trocar o domínio.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://advjulianomartins.com.br").replace(/\/+$/, "");

// Use o mesmo nome no Perfil da Empresa no Google, para o Google ligar os dois.
export const businessName = "Juliano Martins Advocacia";

export const seo = {
  title: "Advogado em Piracaia/SP | Juliano Martins – Previdenciário e INSS",
  description:
    "Advogado em Piracaia/SP: aposentadoria e benefícios do INSS, trabalhista, cível, família e criminal. Orientação clara e atenta ao seu caso. Fale pelo WhatsApp.",
  shareTitle: "Juliano Martins · Advogado em Piracaia/SP",
  shareDescription:
    "Direito previdenciário, trabalhista, cível, família e criminal. Seus direitos, seu futuro: uma orientação que faz diferença.",
  keywords: [
    "advogado em Piracaia",
    "advogado Piracaia SP",
    "advogado previdenciário Piracaia",
    "advogado INSS Piracaia",
    "aposentadoria Piracaia",
    "BPC LOAS Piracaia",
    "advogado trabalhista Piracaia",
    "advogado de família Piracaia",
    "advogado criminal Piracaia",
    "Juliano Martins advogado",
  ],
};

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);
