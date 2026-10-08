"use client";

import { MoonIcon, SunIcon } from "./icons";

// O tema inicial é aplicado por um script no <head> (app/layout.tsx).
// Os dois ícones ficam no HTML e o CSS mostra o certo: sem estado, sem "piscar".
export function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Sem localStorage (modo anônimo): o tema só não fica salvo.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema claro e escuro"
      className="grid size-10.5 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent"
    >
      <MoonIcon className="size-4.5 dark:hidden" />
      <SunIcon className="hidden size-4.5 dark:block" />
    </button>
  );
}
