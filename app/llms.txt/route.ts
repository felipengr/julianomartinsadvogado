import { resolveAreas } from "@/lib/content/areas";
import { getSiteContent } from "@/lib/content/get-site-content";
import { fullAddress } from "@/lib/contact";
import { absoluteUrl, businessName, seo } from "@/lib/seo";

// Resumo em texto para assistentes de IA (ChatGPT, Perplexity, Gemini…),
// no formato proposto em https://llmstxt.org.
export async function GET() {
  const content = await getSiteContent();
  const { profile, contact, faq } = content;

  const lines = [
    `# ${businessName}`,
    "",
    `> ${seo.description}`,
    "",
    `${profile.name} é ${profile.role.toLowerCase()} em ${contact.city}/${contact.state}${profile.oab ? ` (${profile.oab})` : ""}.`,
    "",
    "## Contato",
    "",
    `- WhatsApp e telefone: ${contact.phone}`,
    ...(contact.email ? [`- E-mail: ${contact.email}`] : []),
    `- Endereço: ${fullAddress(contact)}`,
    "",
    "## Áreas de atuação",
    "",
    ...resolveAreas(content).map((area) => `- [${area.title}](${absoluteUrl(area.href)}): ${area.text}`),
    "",
    "## Dúvidas frequentes",
    "",
    ...faq.items.flatMap((item) => [`### ${item.question}`, "", item.answer, ""]),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
