// Tudo o que o Juliano poderá editar pelo painel /admin.
// Layout, cores, endereços das páginas (URLs) e a ordem das seções ficam no código.

export type ImageField = {
  src: string;
  alt: string;
} | null;

export type PracticeArea = {
  title: string;
  text: string;
  pageText: string; // parágrafos separados por linha em branco
  topics: string; // um tópico por linha
};

export type SiteContent = {
  profile: {
    name: string;
    role: string;
    oab: string;
    tagline: string;
  };
  contact: {
    phone: string;
    whatsappMessage: string;
    whatsappButtonLabel: string;
    email: string;
    instagramUrl: string;
    googleBusinessUrl: string;
    street: string;
    district: string;
    city: string;
    state: string;
    postalCode: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
    image: ImageField;
  };
  strip: string[];
  areas: {
    tag: string;
    title: string;
    intro: string;
    cardCta: string;
    items: PracticeArea[];
  };
  about: {
    tag: string;
    title: string;
    paragraphs: string[];
    cta: string;
  };
  steps: {
    tag: string;
    title: string;
    items: {
      title: string;
      text: string;
    }[];
  };
  faq: {
    tag: string;
    title: string;
    text: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  contactCta: {
    tag: string;
    title: string;
    text: string;
    button: string;
    mapCta: string;
  };
  footer: {
    disclaimer: string;
  };
};
