import { resolveAreas, toLines, type ResolvedArea } from "./content/areas";
import type { SiteContent } from "./content/types";
import { phoneDigits } from "./content/validate";
import { absoluteUrl, businessName, seo, siteUrl } from "./seo";

// Dados estruturados (schema.org): ajudam o Google e os assistentes de IA a
// entender quem é o advogado, onde fica o escritório e o que ele atende.

const ids = {
  site: `${siteUrl}/#site`,
  office: `${siteUrl}/#escritorio`,
  lawyer: `${siteUrl}/#advogado`,
};

const telephone = (phone: string) => {
  const digits = phoneDigits(phone);
  return `+${digits.startsWith("55") ? digits : `55${digits}`}`;
};

const sameAs = ({ contact }: SiteContent) => [contact.instagramUrl, contact.googleBusinessUrl].filter(Boolean);

function postalAddress({ contact }: SiteContent) {
  return {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    addressLocality: contact.city,
    addressRegion: contact.state,
    postalCode: contact.postalCode,
    addressCountry: "BR",
  };
}

const city = ({ contact }: SiteContent) => ({ "@type": "City", name: `${contact.city}, ${contact.state}` });

function office(content: SiteContent) {
  const { contact, hero } = content;
  return {
    "@type": "LegalService",
    "@id": ids.office,
    name: businessName,
    description: seo.description,
    url: siteUrl,
    telephone: telephone(contact.phone),
    ...(contact.email && { email: contact.email }),
    image: hero.image ? absoluteUrl(hero.image.src) : undefined,
    logo: absoluteUrl("/icon"),
    address: postalAddress(content),
    areaServed: city(content),
    availableLanguage: "pt-BR",
    founder: { "@id": ids.lawyer },
    employee: { "@id": ids.lawyer },
    sameAs: sameAs(content),
    knowsAbout: resolveAreas(content).map((area) => area.serviceType),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Áreas de atuação",
      itemListElement: resolveAreas(content).map((area) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: area.title, description: area.text, url: absoluteUrl(area.href) },
      })),
    },
  };
}

function lawyer(content: SiteContent) {
  const { profile, hero } = content;
  return {
    "@type": "Person",
    "@id": ids.lawyer,
    name: profile.name,
    jobTitle: profile.role,
    image: hero.image ? absoluteUrl(hero.image.src) : undefined,
    url: siteUrl,
    worksFor: { "@id": ids.office },
    sameAs: sameAs(content),
    knowsAbout: resolveAreas(content).map((area) => area.serviceType),
    ...(profile.oab && {
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Registro profissional",
        name: profile.oab,
        recognizedBy: { "@type": "Organization", name: "Ordem dos Advogados do Brasil – Seção São Paulo (OAB/SP)" },
      },
    }),
  };
}

export function homeStructuredData(content: SiteContent) {
  return [
    { "@type": "WebSite", "@id": ids.site, url: siteUrl, name: businessName, inLanguage: "pt-BR", publisher: { "@id": ids.office } },
    office(content),
    lawyer(content),
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#duvidas`,
      mainEntity: content.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
}

export function areaStructuredData(content: SiteContent, area: ResolvedArea) {
  const url = absoluteUrl(area.href);
  return [
    {
      "@type": "Service",
      "@id": `${url}#servico`,
      name: `${area.keyword} em ${content.contact.city}/${content.contact.state}`,
      serviceType: area.serviceType,
      description: area.text,
      url,
      provider: { "@id": ids.office },
      areaServed: city(content),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: area.title,
        itemListElement: toLines(area.topics).map((topic) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: topic },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Áreas de atuação", item: `${siteUrl}/#areas` },
        { "@type": "ListItem", position: 3, name: area.title, item: url },
      ],
    },
  ];
}
