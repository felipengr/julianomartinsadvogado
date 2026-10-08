import { monogramIcon } from "@/lib/brand-assets";

// Ícone quando alguém salva o site na tela inicial do iPhone (o iOS arredonda sozinho).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogramIcon(size.width, false);
}
