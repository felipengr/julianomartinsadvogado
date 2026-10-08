import type { Metadata } from "next";
import { ButtonLink, Eyebrow } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center px-5.5">
      <Eyebrow>Erro 404</Eyebrow>
      <h1 className="my-4 font-serif text-[40px] leading-[1.15] font-normal tracking-[-1px]">
        Esta página não foi encontrada.
      </h1>
      <p className="text-[15px] leading-[1.8] text-muted">
        O endereço pode ter mudado. Volte para a página inicial para conhecer as áreas de atuação e falar com o
        escritório.
      </p>
      <ButtonLink href="/" className="mt-8" arrow="none">
        Ir para a página inicial
      </ButtonLink>
    </main>
  );
}
