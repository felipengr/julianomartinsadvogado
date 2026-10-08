import type { SiteContent } from "./types";

// Descreve o que aparece no painel /admin: nomes amigáveis, ajudas e limites.
// O mesmo esquema valida o conteúdo no servidor antes de publicar.

type BaseField = {
  key: string;
  label: string;
  help?: string;
};

export type TextField = BaseField & {
  kind: "text";
  max: number;
  multiline?: boolean;
  optional?: boolean;
};

export type UrlField = BaseField & {
  kind: "url";
  optional?: boolean;
};

export type EmailField = BaseField & {
  kind: "email";
  optional?: boolean;
};

export type PhoneField = BaseField & {
  kind: "phone";
};

export type ImageFieldSpec = BaseField & {
  kind: "image";
  aspect: string; // proporção mostrada na prévia do recorte, ex.: "4/5"
};

export type StringListField = BaseField & {
  kind: "stringList";
  itemLabel: string;
  max: number;
  multiline?: boolean;
  minItems: number;
  maxItems: number;
};

export type ObjectListField = BaseField & {
  kind: "objectList";
  itemLabel: string;
  fields: TextField[];
  minItems: number;
  maxItems: number;
  // Itens ligados a partes fixas no código (ex.: endereço da página) não podem ser adicionados/removidos.
  fixedLength?: boolean;
  // Nome de cada item no painel (ex.: o título da área), no lugar de "Item 1".
  titleKey?: string;
};

export type Field =
  | TextField
  | UrlField
  | EmailField
  | PhoneField
  | ImageFieldSpec
  | StringListField
  | ObjectListField;

export type SectionSpec = {
  key: keyof SiteContent;
  title: string;
  description: string;
  fields: Field[];
};

const lineBreakHelp = "Para quebrar a linha no site, aperte Enter.";

export const contentSchema: SectionSpec[] = [
  {
    key: "hero",
    title: "Topo da página",
    description: "A primeira coisa que as pessoas veem: título, foto e botões principais.",
    fields: [
      { kind: "image", key: "image", label: "Foto principal", aspect: "4/5" },
      {
        kind: "text",
        key: "eyebrow",
        label: "Frase curta acima do título",
        max: 50,
        help: "Ajuda o Google a entender o que você faz e onde. Ex.: “Advocacia em Piracaia · SP”.",
      },
      { kind: "text", key: "title", label: "Título", max: 60, multiline: true, help: lineBreakHelp },
      {
        kind: "text",
        key: "highlight",
        label: "Título em destaque (dourado)",
        max: 60,
        multiline: true,
        help: lineBreakHelp,
      },
      { kind: "text", key: "text", label: "Texto de apresentação", max: 240, multiline: true },
      { kind: "text", key: "primaryCta", label: "Botão do WhatsApp", max: 32 },
      { kind: "text", key: "secondaryCta", label: "Botão “conhecer a atuação”", max: 32 },
      {
        kind: "text",
        key: "note",
        label: "Linha abaixo dos botões",
        max: 40,
        help: "O telefone é colocado automaticamente no final.",
      },
    ],
  },
  {
    key: "strip",
    title: "Faixa de destaques",
    description: "As frases curtas logo abaixo do topo.",
    fields: [
      {
        kind: "stringList",
        key: "",
        label: "Destaques",
        itemLabel: "Destaque",
        max: 40,
        minItems: 1,
        maxItems: 4,
      },
    ],
  },
  {
    key: "areas",
    title: "Áreas de atuação",
    description: "Os cartões da página inicial e o texto da página de cada área.",
    fields: [
      { kind: "text", key: "tag", label: "Etiqueta", max: 30 },
      { kind: "text", key: "title", label: "Título", max: 70, multiline: true, help: lineBreakHelp },
      { kind: "text", key: "intro", label: "Texto ao lado do título", max: 160, multiline: true },
      { kind: "text", key: "cardCta", label: "Link do WhatsApp nos cartões", max: 36 },
      {
        kind: "objectList",
        key: "items",
        label: "Áreas",
        itemLabel: "Área",
        titleKey: "title",
        minItems: 6,
        maxItems: 6,
        fixedLength: true,
        fields: [
          { kind: "text", key: "title", label: "Nome da área", max: 30 },
          {
            kind: "text",
            key: "text",
            label: "Resumo (cartão)",
            max: 110,
            multiline: true,
            help: "Aparece no cartão e também no Google, como descrição da página da área.",
          },
          {
            kind: "text",
            key: "pageText",
            label: "Texto da página da área",
            max: 1400,
            multiline: true,
            help: "Para começar um novo parágrafo, deixe uma linha em branco.",
          },
          {
            kind: "text",
            key: "topics",
            label: "Como posso ajudar (lista)",
            max: 900,
            multiline: true,
            help: "Um item por linha.",
          },
        ],
      },
    ],
  },
  {
    key: "about",
    title: "O advogado",
    description: "Sua apresentação.",
    fields: [
      { kind: "text", key: "tag", label: "Etiqueta", max: 30 },
      { kind: "text", key: "title", label: "Título", max: 70, multiline: true, help: lineBreakHelp },
      {
        kind: "stringList",
        key: "paragraphs",
        label: "Parágrafos",
        itemLabel: "Parágrafo",
        max: 450,
        multiline: true,
        minItems: 1,
        maxItems: 4,
      },
      { kind: "text", key: "cta", label: "Botão do WhatsApp", max: 32 },
    ],
  },
  {
    key: "steps",
    title: "Como funciona",
    description: "Os três passos do atendimento.",
    fields: [
      { kind: "text", key: "tag", label: "Etiqueta", max: 30 },
      { kind: "text", key: "title", label: "Título", max: 60 },
      {
        kind: "objectList",
        key: "items",
        label: "Passos",
        itemLabel: "Passo",
        minItems: 3,
        maxItems: 3,
        fixedLength: true,
        fields: [
          { kind: "text", key: "title", label: "Título", max: 40 },
          { kind: "text", key: "text", label: "Texto", max: 140, multiline: true },
        ],
      },
    ],
  },
  {
    key: "faq",
    title: "Dúvidas frequentes",
    description: "Perguntas e respostas. Ajudam quem está decidindo e também aparecem no Google.",
    fields: [
      { kind: "text", key: "tag", label: "Etiqueta", max: 30 },
      { kind: "text", key: "title", label: "Título", max: 60, multiline: true, help: lineBreakHelp },
      { kind: "text", key: "text", label: "Texto abaixo do título", max: 120, multiline: true },
      {
        kind: "objectList",
        key: "items",
        label: "Perguntas",
        itemLabel: "Pergunta",
        titleKey: "question",
        minItems: 1,
        maxItems: 12,
        fields: [
          { kind: "text", key: "question", label: "Pergunta", max: 90 },
          { kind: "text", key: "answer", label: "Resposta", max: 500, multiline: true },
        ],
      },
    ],
  },
  {
    key: "contactCta",
    title: "Faixa de contato",
    description: "O convite escuro no fim da página, com telefone e endereço.",
    fields: [
      { kind: "text", key: "tag", label: "Etiqueta", max: 30 },
      { kind: "text", key: "title", label: "Título", max: 60, multiline: true, help: lineBreakHelp },
      { kind: "text", key: "text", label: "Texto", max: 160, multiline: true },
      { kind: "text", key: "button", label: "Botão do WhatsApp", max: 32 },
      { kind: "text", key: "mapCta", label: "Link do mapa", max: 40 },
    ],
  },
  {
    key: "contact",
    title: "Contato, endereço e redes",
    description: "WhatsApp, mensagem pronta, endereço do escritório e links.",
    fields: [
      {
        kind: "phone",
        key: "phone",
        label: "WhatsApp / telefone",
        help: "Com DDD. Ex.: (11) 97472-6844",
      },
      {
        kind: "text",
        key: "whatsappMessage",
        label: "Mensagem pronta do WhatsApp",
        max: 250,
        multiline: true,
        help: "Texto que já aparece escrito quando a pessoa abre o WhatsApp. Nos cartões das áreas, o nome da área é adicionado no final.",
      },
      { kind: "text", key: "whatsappButtonLabel", label: "Texto do botão flutuante", max: 24 },
      { kind: "email", key: "email", label: "E-mail", optional: true },
      { kind: "text", key: "street", label: "Endereço (rua e número)", max: 80 },
      { kind: "text", key: "district", label: "Bairro", max: 40 },
      { kind: "text", key: "city", label: "Cidade", max: 40 },
      { kind: "text", key: "state", label: "Estado (sigla)", max: 2 },
      { kind: "text", key: "postalCode", label: "CEP", max: 9 },
      { kind: "url", key: "instagramUrl", label: "Link do Instagram", optional: true },
      {
        kind: "url",
        key: "googleBusinessUrl",
        label: "Link do Perfil da Empresa no Google",
        optional: true,
        help: "O link do escritório no Google Maps. Ajuda o Google a ligar o site ao perfil.",
      },
    ],
  },
  {
    key: "profile",
    title: "Nome e registro",
    description: "Como seu nome aparece no topo, no rodapé e no Google.",
    fields: [
      { kind: "text", key: "name", label: "Nome", max: 40 },
      { kind: "text", key: "role", label: "Profissão", max: 30 },
      {
        kind: "text",
        key: "oab",
        label: "Número da OAB",
        max: 24,
        optional: true,
        help: "Ex.: OAB/SP 123.456. O Código de Ética pede que o número apareça na divulgação.",
      },
      { kind: "text", key: "tagline", label: "Linha abaixo do nome (topo)", max: 32 },
    ],
  },
  {
    key: "footer",
    title: "Rodapé",
    description: "O aviso no rodapé do site.",
    fields: [{ kind: "text", key: "disclaimer", label: "Aviso", max: 100 }],
  },
];
