import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AreaDetail, OtherAreas } from "@/components/site/area-detail";
import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter, WhatsappFloatingButton } from "@/components/site/sections";
import { SiteHeader } from "@/components/site/site-header";
import { Container } from "@/components/site/ui";
import { areaPages, findArea } from "@/lib/content/areas";
import { getCurrentYear, getSiteContent } from "@/lib/content/get-site-content";
import type { SiteContent } from "@/lib/content/types";
import { businessName } from "@/lib/seo";
import { areaStructuredData } from "@/lib/structured-data";

export function generateStaticParams() {
  return areaPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/areas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const area = findArea(content, slug);
  if (!area) return {};

  const { city, state } = content.contact;
  const title = `${area.keyword} em ${city}/${state}`;
  const description = `${area.text} Atendimento com ${content.profile.name} em ${city}/${state}.`;

  return {
    title,
    description,
    alternates: { canonical: area.href },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: businessName,
      url: area.href,
      title: `${title} | ${businessName}`,
      description,
    },
  };
}

// O endereço (params) é lido dentro do Suspense para o topo e o rodapé
// entrarem no HTML estático. As seis áreas já saem prontas no build.
export default async function AreaPage({ params }: PageProps<"/areas/[slug]">) {
  const [content, year] = await Promise.all([getSiteContent(), getCurrentYear()]);

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <Container>
          <Suspense fallback={<div className="min-h-[70vh]" />}>
            <AreaContent params={params} content={content} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter content={content} year={year} />
      <WhatsappFloatingButton content={content} />
    </>
  );
}

async function AreaContent({ params, content }: { params: Promise<{ slug: string }>; content: SiteContent }) {
  const { slug } = await params;
  const area = findArea(content, slug);
  if (!area) notFound();

  return (
    <>
      <AreaDetail content={content} area={area} />
      <OtherAreas content={content} area={area} />
      <JsonLd graph={areaStructuredData(content, area)} />
    </>
  );
}
