import { HomePage } from "@/components/site/home-page";
import { JsonLd } from "@/components/site/json-ld";
import { WhatsappFloatingButton } from "@/components/site/sections";
import { getCurrentYear, getSiteContent } from "@/lib/content/get-site-content";
import { homeStructuredData } from "@/lib/structured-data";

// Página estática: o conteúdo vem de um cache que o painel atualiza ao publicar.
export default async function Home() {
  const [content, year] = await Promise.all([getSiteContent(), getCurrentYear()]);

  return (
    <>
      <HomePage content={content} year={year} />
      <WhatsappFloatingButton content={content} />
      <JsonLd graph={homeStructuredData(content)} />
    </>
  );
}
