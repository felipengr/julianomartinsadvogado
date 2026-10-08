import type { SiteContent } from "@/lib/content/types";
import { About, Areas, ContactSection, Faq, Hero, SiteFooter, Steps, Strip } from "./sections";
import { SiteHeader } from "./site-header";
import { Container } from "./ui";

// A página inicial inteira. Usada pelo site e pela prévia do painel.
export function HomePage({ content, year }: { content: SiteContent; year: number }) {
  return (
    <>
      <SiteHeader content={content} />
      <main>
        <Container>
          <Hero content={content} />
          <Strip content={content} />
          <Areas content={content} />
          <About content={content} />
          <Steps content={content} />
          <Faq content={content} />
          <ContactSection content={content} />
        </Container>
      </main>
      <SiteFooter content={content} year={year} />
    </>
  );
}
