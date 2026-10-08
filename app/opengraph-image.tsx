import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand, loadFont } from "@/lib/brand-assets";
import { defaultContent } from "@/lib/content/default-content";

// Imagem que aparece ao compartilhar o link (WhatsApp, Instagram, Facebook…).
export const alt = "Juliano Martins, advogado em Piracaia/SP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [serif, sans, portrait] = await Promise.all([
    loadFont("SourceSerif4-500.ttf"),
    loadFont("Inter-500.ttf"),
    readFile(join(process.cwd(), "public/images/juliano-martins-advogado.jpg")),
  ]);
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;
  const { contact } = defaultContent;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: brand.bg, padding: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Sans", fontSize: 22, letterSpacing: 4, color: brand.accent }}>
              ADVOCACIA EM PIRACAIA · SP
            </div>
            <div style={{ marginTop: 32, fontFamily: "Serif", fontSize: 92, lineHeight: 1, letterSpacing: -3, color: brand.ink }}>
              Juliano Martins
            </div>
            <div style={{ marginTop: 28, fontFamily: "Sans", fontSize: 29, lineHeight: 1.45, color: brand.muted }}>
              Previdenciário e INSS · Trabalhista · Cível e consumidor · Família e sucessões · Criminal
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: brand.ink,
              color: brand.bg,
              borderRadius: 10,
              padding: "20px 30px",
              fontFamily: "Sans",
              fontSize: 26,
            }}
          >
            {`Fale pelo WhatsApp · ${contact.phone}`}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portraitSrc}
          alt=""
          width={400}
          height={518}
          style={{ borderRadius: "110px 14px 14px 14px", objectFit: "cover", objectPosition: "50% 25%" }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, style: "normal", weight: 500 },
        { name: "Sans", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
