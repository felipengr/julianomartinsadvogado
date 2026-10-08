import Link from "next/link";
import type { SiteContent } from "@/lib/content/types";
import { whatsappLink } from "@/lib/contact";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { ButtonLink, Container } from "./ui";

export type NavItem = { label: string; href: string };

// Links com "/" na frente para funcionarem também nas páginas das áreas.
const navItems: NavItem[] = [
  { label: "Áreas de atuação", href: "/#areas" },
  { label: "O advogado", href: "/#sobre" },
  { label: "Dúvidas", href: "/#duvidas" },
  { label: "Contato", href: "/#contato" },
];

const CTA_LABEL = "Falar no WhatsApp";

export function SiteHeader({ content }: { content: SiteContent }) {
  const { profile, contact } = content;
  const ctaHref = whatsappLink(contact.phone, contact.whatsappMessage);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <Container className="relative flex h-19 items-center gap-3 lg:h-23 lg:gap-7.5">
        <Link href="/" className="mr-auto font-serif text-[17px] leading-none tracking-[1px] uppercase sm:text-xl">
          {profile.name}
          <small className="mt-1.75 block font-sans text-[9px] tracking-[1.4px] sm:text-[10px] sm:tracking-[2px]">
            {profile.tagline}
          </small>
        </Link>

        <nav aria-label="Principal" className="hidden gap-6 text-sm lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </a>
          ))}
        </nav>

        <ThemeToggle />
        <MobileMenu items={navItems} ctaLabel={CTA_LABEL} ctaHref={ctaHref} />
        <div className="hidden lg:block">
          <ButtonLink href={ctaHref}>{CTA_LABEL}</ButtonLink>
        </div>
      </Container>
    </header>
  );
}
