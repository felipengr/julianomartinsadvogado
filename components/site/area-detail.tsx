import Link from "next/link";
import { resolveAreas, toLines, toParagraphs, type ResolvedArea } from "@/lib/content/areas";
import type { SiteContent } from "@/lib/content/types";
import { whatsappAreaLink } from "@/lib/contact";
import { ContactDetails } from "./sections";
import { ButtonLink, Eyebrow, SectionTitle } from "./ui";

type Props = { content: SiteContent; area: ResolvedArea };

export function AreaDetail({ content, area }: Props) {
  const { contact, contactCta } = content;

  return (
    <article className="py-11.25 sm:py-18">
      <nav aria-label="Você está em" className="text-xs text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              Início
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/#areas" className="hover:text-accent">
              Áreas de atuação
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {area.title}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-18">
        <div>
          <h1>
            <Eyebrow className="block">
              {area.keyword} em {contact.city}/{contact.state}
            </Eyebrow>
            <span className="my-6 block font-serif text-[43px] leading-[1.08] font-normal tracking-[-1.3px] lg:text-[58px] lg:tracking-[-2px]">
              {area.title}
            </span>
          </h1>
          <p className="text-[15px] leading-[1.8] text-muted sm:text-[17px]">{area.text}</p>

          <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-muted">
            {toParagraphs(area.pageText).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h2 className="mt-12 font-serif text-[28px] font-normal">Como posso ajudar</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {toLines(area.topics).map((topic) => (
              <li key={topic} className="flex gap-3 rounded-xl border border-line bg-surface p-5 text-sm leading-[1.6]">
                <span aria-hidden className="text-accent">
                  ◦
                </span>
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <aside className="self-start rounded-[18px] bg-ink p-8 text-bg lg:sticky lg:top-30">
          <Eyebrow inverse>{contactCta.tag}</Eyebrow>
          <h2 className="my-4 font-serif text-[28px] leading-[1.2] font-normal">
            Fale sobre {area.title.toLowerCase()}
          </h2>
          <p className="text-sm opacity-80">{contactCta.text}</p>
          <ButtonLink href={whatsappAreaLink(contact, area.title)} variant="gold" className="mt-6 w-full">
            {contactCta.button}
          </ButtonLink>
          <ContactDetails content={content} />
        </aside>
      </div>
    </article>
  );
}

export function OtherAreas({ content, area }: Props) {
  const others = resolveAreas(content).filter((other) => other.slug !== area.slug);

  return (
    <section className="border-t border-line py-13.5 sm:py-21">
      <Eyebrow>{content.areas.tag}</Eyebrow>
      <SectionTitle>Outras áreas</SectionTitle>
      <ul className="mt-9 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {others.map((other) => (
          <li key={other.slug}>
            <Link
              href={other.href}
              className="block h-full rounded-xl border border-line bg-surface p-6.25 transition duration-200 hover:-translate-y-1.25 hover:border-accent"
            >
              <span className="text-xs tracking-[2px] text-accent">{other.number} /</span>
              <span className="mt-4 block font-serif text-[22px]">{other.title}</span>
              <span className="mt-2 block text-sm leading-[1.7] text-muted">{other.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
