import Image from "next/image";
import Link from "next/link";
import { resolveAreas } from "@/lib/content/areas";
import type { SiteContent } from "@/lib/content/types";
import { fullAddress, mapsLink, telLink, whatsappAreaLink, whatsappLink } from "@/lib/contact";
import { CodeIcon, InstagramIcon, MailIcon, WhatsappIcon } from "./icons";
import { ButtonLink, Container, Eyebrow, SectionTitle } from "./ui";

type Props = { content: SiteContent };

// "Juliano Martins" -> "JM."
const monogram = (name: string) =>
  `${name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join("")
    .toUpperCase()}.`;

const contactLink = ({ contact }: SiteContent) => whatsappLink(contact.phone, contact.whatsappMessage);

export function Hero({ content }: Props) {
  const { hero, profile, contact } = content;

  return (
    <section
      id="inicio"
      className="grid items-center gap-7.5 pt-11.25 pb-7.5 sm:grid-cols-[1.1fr_1fr] sm:gap-8.75 sm:py-18 lg:gap-18"
    >
      <div>
        <h1>
          <Eyebrow className="block">{hero.eyebrow}</Eyebrow>
          <span className="my-6 block font-serif text-[43px] leading-[1.08] font-normal tracking-[-1.3px] whitespace-pre-line sm:text-[45px] lg:text-[58px] lg:tracking-[-2px]">
            {hero.title}
            {"\n"}
            <em className="text-accent">{hero.highlight}</em>
          </span>
        </h1>
        <p className="max-w-125 text-[15px] leading-[1.8] text-muted sm:text-[17px]">{hero.text}</p>
        <div className="my-7.5 flex flex-col gap-3 lg:flex-row">
          <ButtonLink href={contactLink(content)}>{hero.primaryCta}</ButtonLink>
          <ButtonLink href="#areas" variant="outline" arrow="down">
            {hero.secondaryCta}
          </ButtonLink>
        </div>
        <p className="text-xs text-muted">
          {hero.note} ·{" "}
          <a href={telLink(contact.phone)} className="hover:text-accent">
            {contact.phone}
          </a>
        </p>
      </div>

      <div className="relative">
        <div className="relative h-107.5 overflow-hidden rounded-[90px_12px_12px_12px] bg-soft sm:h-125 sm:rounded-[120px_12px_12px_12px] lg:h-147.5">
          {hero.image ? (
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              preload
              sizes="(min-width: 1200px) 540px, (min-width: 640px) 46vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          ) : (
            <span aria-hidden className="grid h-full place-items-center font-serif text-[110px]">
              {monogram(profile.name)}
            </span>
          )}
        </div>
        <a
          href="#sobre"
          className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-lg bg-surface p-4.5 transition-colors hover:text-accent sm:inset-752.5-6 sm:bottom-6 sm:p-5.5"
        >
          <span>
            <strong className="block font-serif text-lg font-normal sm:text-[21px]">{profile.name}</strong>
            <small className="mt-2 block text-[11px] text-muted">
              {profile.role} · {contact.city}, {contact.state}
              {profile.oab && ` · ${profile.oab}`}
            </small>
          </span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </section>
  );
}

export function Strip({ content }: Props) {
  return (
    <ul className="flex flex-col gap-4.5 border-y border-line py-6 text-[13px] sm:flex-row sm:justify-between sm:py-6.5">
      {content.strip.map((item) => (
        <li key={item}>
          <span aria-hidden className="mr-2.5 text-accent">
            ◦
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Areas({ content }: Props) {
  const { areas, contact } = content;

  return (
    <section id="areas" className="py-13.5 sm:py-21">
      <div className="mb-9 gap-10 sm:flex sm:items-end sm:justify-between">
        <div>
          <Eyebrow>{areas.tag}</Eyebrow>
          <SectionTitle>{areas.title}</SectionTitle>
        </div>
        <p className="text-sm leading-[1.7] text-muted sm:max-w-87.5">{areas.intro}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {resolveAreas(content).map((area, i) => {
          const featured = i === 0;
          return (
            <li
              key={area.slug}
              className={`flex flex-col rounded-xl border border-line p-6.25 transition duration-200 hover:-translate-y-1.25 hover:border-accent sm:p-7 ${featured ? "bg-ink text-bg" : "bg-surface"}`}
            >
              <span className={`text-xs tracking-[2px] ${featured ? "text-accent-inverse" : "text-accent"}`}>
                {area.number} /
              </span>
              <h3 className="mt-5.5 mb-4 font-serif text-2xl font-normal sm:mt-7.5">
                <Link href={area.href} className="hover:underline hover:underline-offset-4">
                  {area.title}
                </Link>
              </h3>
              <p className={`flex-1 text-sm leading-[1.7] ${featured ? "text-bg/80" : "text-muted"}`}>{area.text}</p>
              <div className="mt-6.5 flex flex-wrap justify-between gap-x-5 gap-y-3 text-xs">
                <Link href={area.href} className="font-bold hover:underline hover:underline-offset-4">
                  Saiba mais <span aria-hidden>→</span>
                  <span className="sr-only"> sobre {area.title}</span>
                </Link>
                <a
                  href={whatsappAreaLink(contact, area.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:underline-offset-4"
                >
                  {areas.cardCta} <span aria-hidden>↗</span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function About({ content }: Props) {
  const { about, profile, contact } = content;

  return (
    <section
      id="sobre"
      className="grid gap-6.25 rounded-2xl bg-soft p-7.5 sm:grid-cols-[1fr_1.4fr] sm:gap-7.5 lg:gap-17.5 lg:p-14"
    >
      <div
        aria-hidden
        className="flex h-45 items-center justify-center rounded-[100px_100px_10px_10px] border border-line font-serif text-[80px] sm:h-auto lg:text-[110px]"
      >
        {monogram(profile.name)}
      </div>
      <div>
        <Eyebrow>{about.tag}</Eyebrow>
        <SectionTitle>{about.title}</SectionTitle>
        <p className="mt-4 text-[15px] leading-[1.85] text-ink">
          {profile.name} · {profile.role} em {contact.city}, {contact.state}
          {profile.oab && ` · ${profile.oab}`}
        </p>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-[15px] leading-[1.85] text-muted">
            {paragraph}
          </p>
        ))}
        <ButtonLink href={contactLink(content)} variant="outline" className="mt-6">
          {about.cta}
        </ButtonLink>
      </div>
    </section>
  );
}

export function Steps({ content }: Props) {
  const { steps } = content;

  return (
    <section id="como-funciona" className="py-13.5 sm:py-21">
      <Eyebrow>{steps.tag}</Eyebrow>
      <SectionTitle>{steps.title}</SectionTitle>
      <ol className="mt-9 grid gap-5 sm:grid-cols-3 lg:gap-10">
        {steps.items.map((step, i) => (
          <li key={step.title} className="border-t border-line pt-6">
            <span className="font-serif text-[28px] text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="my-4 font-serif text-[22px] font-normal">{step.title}</h3>
            <p className="text-sm leading-[1.7] text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Faq({ content }: Props) {
  const { faq } = content;

  return (
    <section
      id="duvidas"
      className="grid gap-4 py-13.5 sm:grid-cols-[1fr_1.35fr] sm:gap-10 sm:py-21 lg:gap-22.5"
    >
      <div>
        <Eyebrow>{faq.tag}</Eyebrow>
        <SectionTitle>{faq.title}</SectionTitle>
        <p className="text-[15px] leading-[1.8] whitespace-pre-line text-muted sm:text-[17px]">{faq.text}</p>
      </div>
      <div>
        {faq.items.map((item) => (
          <details key={item.question} className="group border-b border-line py-5.75">
            <summary className="flex cursor-pointer list-none justify-between gap-5 [&::-webkit-details-marker]:hidden">
              <h3 className="text-[15px] font-normal">{item.question}</h3>
              <span aria-hidden className="text-[23px] leading-none text-accent">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-[1.8] text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ContactDetails({ content, className = "" }: Props & { className?: string }) {
  const { contact, contactCta } = content;

  return (
    <div className={className}>
      <a href={telLink(contact.phone)} className="mt-5 block font-serif text-[22px] whitespace-nowrap">
        {contact.phone}
      </a>
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="mt-3 flex items-center gap-2 text-sm opacity-90">
          <MailIcon className="size-4" />
          {contact.email}
        </a>
      )}
      <address className="mt-3 text-sm leading-[1.7] not-italic opacity-[.88] sm:max-w-75">
        {fullAddress(contact)}
      </address>
      <a
        href={mapsLink(contact)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 inline-flex text-[13px] text-accent-inverse underline underline-offset-4"
      >
        {contactCta.mapCta} <span aria-hidden>&nbsp;↗</span>
      </a>
    </div>
  );
}

export function ContactSection({ content }: Props) {
  const { contactCta } = content;

  return (
    <section
      id="contato"
      className="mb-16 rounded-[18px] bg-ink p-8 text-bg sm:flex sm:items-center sm:justify-between sm:gap-10 lg:p-15"
    >
      <div>
        <Eyebrow inverse>{contactCta.tag}</Eyebrow>
        <SectionTitle large>{contactCta.title}</SectionTitle>
        <p className="text-sm opacity-80">{contactCta.text}</p>
      </div>
      <div className="shrink-0">
        <ButtonLink href={contactLink(content)} variant="gold" className="mt-5 w-full sm:mt-0 sm:w-auto">
          {contactCta.button}
        </ButtonLink>
        <ContactDetails content={content} />
      </div>
    </section>
  );
}

export function SiteFooter({ content, year }: Props & { year: number }) {
  const { profile, contact, footer } = content;

  return (
    <footer className="border-t border-line pt-10 pb-24 text-xs text-muted sm:pb-10">
      <Container className="flex flex-col gap-6.25 sm:flex-row sm:justify-between">
        <span className="uppercase">
          {profile.name} · Advocacia
          {profile.oab && <span className="mt-2 block normal-case">{profile.oab}</span>}
        </span>
        <span>{footer.disclaimer}</span>
        {contact.instagramUrl && (
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-accent"
          >
            <InstagramIcon className="size-4" />
            Instagram
          </a>
        )}
        <span>© {year}</span>
      </Container>
      <Container className="mt-8">
        <p className="flex items-center gap-1.5 border-t border-line pt-6">
          <CodeIcon className="size-3.5" />
          Desenvolvido por
          <a
            href="https://nogueiradev.com.br"
            target="_blank"
            rel="noopener"
            className="font-medium text-accent transition-colors hover:text-ink"
          >
            Felipe Nogueira
          </a>
        </p>
      </Container>
    </footer>
  );
}

export function WhatsappFloatingButton({ content }: Props) {
  const { contact } = content;

  return (
    <a
      href={contactLink(content)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${contact.whatsappButtonLabel}: falar com o escritório`}
      className="fixed right-4 bottom-4 z-30 flex items-center gap-2 rounded-[40px] bg-whatsapp px-5 py-3.5 text-sm text-white shadow-[0_7px_25px_#0002] transition-transform hover:scale-105 sm:right-6.25 sm:bottom-6.25 sm:px-5.75 sm:py-4"
    >
      <WhatsappIcon className="size-5" />
      {contact.whatsappButtonLabel}
      <span aria-hidden>↗</span>
    </a>
  );
}
