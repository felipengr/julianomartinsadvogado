import { monogramIcon } from "@/lib/brand-assets";

// O Google mostra o ícone nos resultados: precisa ser quadrado e ter 48px ou mais.
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function Icon() {
  return monogramIcon(size.width, true);
}
