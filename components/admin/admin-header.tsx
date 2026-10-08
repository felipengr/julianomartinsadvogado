import Link from "next/link";
import { signOut } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Editar site" },
  { href: "/admin/historico", label: "Histórico" },
  { href: "/admin/senha", label: "Senha" },
];

export function AdminHeader({ email, current }: { email?: string; current: string }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4">
        <div>
          <p className="font-serif text-xl font-medium">Painel do site</p>
          {email && <p className="text-xs text-muted">{email}</p>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line bg-surface px-4 py-2 hover:border-ink"
          >
            Ver site
          </a>
          <form action={signOut}>
            <button type="submit" className="rounded-full px-3 py-2 text-muted hover:text-ink">
              Sair
            </button>
          </form>
        </div>
        <nav className="-mb-4 flex w-full gap-1 overflow-x-auto text-sm" aria-label="Painel">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current === link.href ? "page" : undefined}
              className="border-b-2 border-transparent px-3 py-2.5 whitespace-nowrap text-muted hover:text-ink aria-[current=page]:border-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
