import type { SiteContent } from "./types";

// Conteúdo inicial do site. Também é o valor padrão (e o fallback) do que
// estiver salvo no Supabase.
//
// Os textos seguem o Provimento 205/2021 da OAB: são informativos, sem
// promessa de resultado, sem preços e sem chamadas de captação.
export const defaultContent: SiteContent = {
  profile: {
    name: "Juliano Martins",
    role: "Advogado",
    oab: "",
    tagline: "Advocacia · Piracaia/SP",
  },
  contact: {
    phone: "(11) 97472-6844",
    whatsappMessage: "Olá, gostaria de agendar um atendimento jurídico.",
    whatsappButtonLabel: "WhatsApp",
    email: "",
    instagramUrl: "",
    googleBusinessUrl: "",
    street: "Av. Dr. Valentin Del Nero, 240 - A",
    district: "Centro",
    city: "Piracaia",
    state: "SP",
    postalCode: "12970-000",
  },
  hero: {
    eyebrow: "Advocacia em Piracaia · SP",
    title: "Seus direitos.\nSeu futuro.",
    highlight: "Uma orientação\nque faz diferença.",
    text: "Atuação previdenciária e orientação jurídica em diferentes áreas, com escuta, clareza e atenção à sua história.",
    primaryCta: "Conversar sobre meu caso",
    secondaryCta: "Conhecer a atuação",
    note: "Atendimento em Piracaia",
    image: {
      src: "/images/juliano-martins-advogado.jpg",
      alt: "Retrato profissional do advogado Juliano Martins, de terno, na OAB Subseção Piracaia",
    },
  },
  strip: ["Orientação em linguagem clara", "Atenção a cada caso", "Sigilo e responsabilidade"],
  areas: {
    tag: "Áreas de atuação",
    title: "Uma orientação para\ncada momento da vida.",
    intro: "Da aposentadoria às questões do dia a dia: encontre a área relacionada à sua necessidade.",
    cardCta: "Conversar sobre esta área",
    items: [
      {
        title: "Previdenciário",
        text: "Aposentadorias, benefícios do INSS, pensões e planejamento previdenciário.",
        pageText:
          "O direito previdenciário cuida da sua relação com o INSS: aposentadorias, auxílios, pensões e benefícios assistenciais. As regras mudaram bastante nos últimos anos e cada caso depende do histórico de contribuições, da idade e das condições de saúde de cada pessoa.\n\nCom a análise do CNIS, da carteira de trabalho e dos demais documentos, é possível entender quais benefícios podem ser solicitados, em que momento e de que forma, tanto no pedido administrativo junto ao INSS quanto, se for o caso, na Justiça.",
        topics:
          "Aposentadoria por idade, por tempo de contribuição e especial\nAuxílio por incapacidade temporária (antigo auxílio-doença)\nAposentadoria por incapacidade permanente\nBPC/LOAS para idosos e pessoas com deficiência\nPensão por morte e auxílio-reclusão\nRevisão de benefícios e análise do CNIS\nPlanejamento previdenciário\nRecursos contra benefícios negados pelo INSS",
      },
      {
        title: "Trabalhista",
        text: "Orientação sobre relações de trabalho, rescisões e direitos do trabalhador.",
        pageText:
          "As relações de trabalho envolvem direitos e deveres que nem sempre ficam claros no dia a dia, principalmente no momento de uma demissão, de um acidente ou de uma mudança nas condições do emprego.\n\nA orientação trabalhista ajuda a entender o que diz a lei e o contrato, a conferir valores e documentos e a definir o caminho adequado, seja por acordo ou por meio da Justiça do Trabalho.",
        topics:
          "Conferência de rescisão e verbas rescisórias\nHoras extras, adicionais e intervalos\nFGTS, seguro-desemprego e férias\nReconhecimento de vínculo de emprego\nAcidente de trabalho e doença ocupacional\nAssédio moral e condições de trabalho",
      },
      {
        title: "Cível e consumidor",
        text: "Contratos, indenizações, cobranças e relações de consumo.",
        pageText:
          "O direito civil está presente em situações comuns da vida: um contrato que não foi cumprido, um prejuízo causado por terceiros, uma cobrança que não parece correta ou um problema com um produto ou serviço.\n\nCada situação pede uma análise dos documentos e das provas disponíveis para indicar a solução mais adequada, que pode ser uma negociação, uma notificação ou uma ação judicial.",
        topics:
          "Elaboração e revisão de contratos\nIndenizações por danos morais e materiais\nCobranças e negativação indevidas\nProblemas com bancos, empréstimos e cartões\nDefeitos em produtos e falhas na prestação de serviços\nQuestões com planos de saúde\nAções no Juizado Especial Cível",
      },
      {
        title: "Família e sucessões",
        text: "Divórcio, pensão alimentícia, inventário e questões familiares.",
        pageText:
          "Questões de família costumam chegar em momentos delicados. Por isso, a orientação jurídica busca clareza, respeito e, sempre que possível, soluções construídas em acordo, preservando os vínculos e o interesse dos filhos.\n\nNa área de sucessões, o acompanhamento ajuda a organizar a partilha de bens, seja por inventário em cartório ou judicial, e a planejar com antecedência a transmissão do patrimônio.",
        topics:
          "Divórcio consensual e litigioso\nPensão alimentícia: fixação, revisão e cobrança\nGuarda e regime de convivência\nReconhecimento e dissolução de união estável\nInventário judicial e em cartório\nTestamento e planejamento sucessório",
      },
      {
        title: "Criminal",
        text: "Orientação e acompanhamento em questões de natureza criminal.",
        pageText:
          "Em uma situação criminal, contar com orientação desde o primeiro momento faz diferença para que os direitos da pessoa sejam respeitados em cada etapa, da delegacia ao processo.\n\nO acompanhamento envolve a análise dos fatos e dos documentos, a orientação sobre como agir e a atuação técnica ao longo de todo o procedimento.",
        topics:
          "Acompanhamento em delegacia e inquérito policial\nAudiência de custódia\nDefesa em processo criminal\nJuizado Especial Criminal\nOrientação a vítimas",
      },
      {
        title: "Outras demandas",
        text: "Conte sua situação para entender o caminho jurídico adequado.",
        pageText:
          "Nem toda situação se encaixa em uma área específica, e tudo bem. O primeiro passo é contar o que está acontecendo para que o caso seja entendido com calma.\n\nA partir disso, você recebe uma orientação sobre os caminhos possíveis e sobre quais documentos e informações serão necessários.",
        topics:
          "Orientação jurídica inicial\nAnálise de documentos e contratos\nNotificações extrajudiciais\nEncaminhamento para a área adequada",
      },
    ],
  },
  about: {
    tag: "Quem vai ouvir você",
    title: "Direito com proximidade.\nAtuação com propósito.",
    paragraphs: [
      "Advogado em Piracaia, São Paulo, com atendimento voltado especialmente a demandas cíveis e previdenciárias, além de orientação em outras questões jurídicas conforme a necessidade de cada pessoa.",
      "Atendimento com escuta atenta, explicações objetivas e respeito à particularidade de cada caso.",
    ],
    cta: "Agendar uma conversa",
  },
  steps: {
    tag: "Como funciona",
    title: "O primeiro passo pode ser simples.",
    items: [
      {
        title: "Conte sua situação",
        text: "Inicie uma conversa pelo WhatsApp e explique o que você precisa.",
      },
      {
        title: "Receba orientação",
        text: "Saiba quais informações e documentos são necessários para o atendimento.",
      },
      {
        title: "Entenda os próximos passos",
        text: "Seu caso será analisado para definir os caminhos jurídicos possíveis.",
      },
    ],
  },
  faq: {
    tag: "Dúvidas frequentes",
    title: "Mais clareza.\nMenos complicação.",
    text: "Não encontrou sua dúvida?\nEntre em contato com o escritório.",
    items: [
      {
        question: "Como funciona o primeiro contato?",
        answer:
          "Envie uma mensagem no WhatsApp e descreva brevemente sua situação. O escritório orientará sobre os próximos passos e o agendamento.",
      },
      {
        question: "Quais documentos devo separar?",
        answer:
          "A documentação depende do caso. No primeiro contato, você receberá orientações sobre o que levar para o atendimento.",
      },
      {
        question: "Posso tirar dúvidas sobre o INSS?",
        answer:
          "Sim. O atendimento previdenciário abrange orientação sobre benefícios, aposentadorias e planejamento.",
      },
      {
        question: "Como funciona a assistência jurídica?",
        answer:
          "Informe sua situação no contato inicial para receber orientação sobre as modalidades de atendimento e os encaminhamentos disponíveis.",
      },
      {
        question: "Onde fica o escritório?",
        answer:
          "O escritório fica na Av. Dr. Valentin Del Nero, 240 - A, no Centro de Piracaia (SP). Antes de ir, combine o horário pelo WhatsApp.",
      },
    ],
  },
  contactCta: {
    tag: "Vamos conversar?",
    title: "Seu caso começa\ncom uma boa conversa.",
    text: "Entre em contato para solicitar um agendamento.",
    button: "Falar no WhatsApp",
    mapCta: "Ver endereço e traçar rota",
  },
  footer: {
    disclaimer: "Conteúdo informativo. Cada caso exige análise individual.",
  },
};
