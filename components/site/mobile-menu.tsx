"use client";

import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";
import type { NavItem } from "./site-header";

export function MobileMenu({ items, ctaLabel, ctaHref }: { items: NavItem[]; ctaLabel: string; ctaHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="grid size-10.5 place-items-center rounded-full border border-line bg-surface text-ink"
      >
        {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="absolute inset-x-0 top-full border-b border-line bg-surface px-5.5 pt-2 pb-6 shadow-lg shadow-black/5"
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={close} className="block border-b border-line py-4 text-base text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="mt-5 flex justify-center gap-3 rounded-[7px] bg-ink px-6 py-4 text-sm font-bold text-bg"
          >
            {ctaLabel}
            <span aria-hidden>↗</span>
          </a>
        </nav>
      )}
    </div>
  );
}
