import type { ReactNode } from "react";

type WithChildren = { children: ReactNode; className?: string };

export function Container({ children, className = "" }: WithChildren) {
  return <div className={`mx-auto w-full max-w-300 px-5.5 sm:px-6 ${className}`}>{children}</div>;
}

// inverse: sobre os blocos escuros (contato, cartão em destaque).
export function Eyebrow({ children, className = "", inverse = false }: WithChildren & { inverse?: boolean }) {
  const color = inverse ? "text-accent-inverse" : "text-accent";
  return (
    <span className={`text-[11px] font-bold tracking-[2px] uppercase ${color} ${className}`}>{children}</span>
  );
}

// Os títulos aceitam quebras de linha digitadas no painel (Enter).
export function SectionTitle({ children, className = "", large = false }: WithChildren & { large?: boolean }) {
  const size = large ? "text-[34px] sm:text-[42px]" : "text-[33px] sm:text-[40px]";
  return (
    <h2
      className={`my-4 font-serif leading-[1.18] font-normal tracking-[-1px] whitespace-pre-line ${size} ${className}`}
    >
      {children}
    </h2>
  );
}

const buttonStyles = {
  primary: "bg-ink text-bg hover:bg-ink/90",
  outline: "border border-line text-ink hover:border-accent",
  gold: "bg-gold text-night hover:bg-gold/90",
} as const;

const arrows = { external: "↗", down: "↓", none: "" } as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
  arrow?: keyof typeof arrows;
  className?: string;
}) {
  const external = href.startsWith("http");
  const icon = arrows[arrow ?? (external ? "external" : "none")];

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-3.75 rounded-[7px] px-6 py-4.5 text-sm font-bold transition-colors ${buttonStyles[variant]} ${className}`}
    >
      {children}
      {icon && <span aria-hidden>{icon}</span>}
    </a>
  );
}
