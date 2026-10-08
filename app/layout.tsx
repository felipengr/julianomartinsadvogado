import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { businessName, seo, siteUrl } from "@/lib/seo";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: `%s | ${businessName}`,
  },
  description: seo.description,
  keywords: seo.keywords,
  applicationName: businessName,
  authors: [{ name: "Juliano Martins" }],
  creator: "Felipe Nogueira",
  category: "legal",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: businessName,
    title: seo.shareTitle,
    description: seo.shareDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.shareTitle,
    description: seo.shareDescription,
  },
  formatDetection: { telephone: false },
  other: {
    "geo.region": "BR-SP",
    "geo.placename": "Piracaia",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#101e1d" },
  ],
};

// Aplica o tema salvo (ou o do sistema) antes da página aparecer, sem "piscar".
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      className={`${sourceSerif.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Extensões do navegador adicionam atributos no <body> antes do React
          carregar; isso evita um falso alerta de hidratação. */}
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
