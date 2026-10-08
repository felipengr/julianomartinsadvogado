import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Cores fixas da marca para as imagens geradas (ícone e card de compartilhamento).
export const brand = {
  bg: "#f6f5f0",
  ink: "#172d2b",
  muted: "#5c706c",
  gold: "#d1b17b",
  accent: "#8c6d3f",
  line: "#dce2dc",
};

export const loadFont = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

// Ícone "JM" (aba do navegador, resultados do Google e tela inicial do celular).
export async function monogramIcon(size: number, rounded: boolean) {
  const serif = await loadFont("SourceSerif4-500.ttf");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: brand.ink,
          borderRadius: rounded ? size * 0.22 : 0,
          color: brand.gold,
          fontFamily: "Serif",
          fontSize: size * 0.48,
          letterSpacing: -size * 0.01,
        }}
      >
        JM
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Serif", data: serif, style: "normal", weight: 500 }],
    },
  );
}
