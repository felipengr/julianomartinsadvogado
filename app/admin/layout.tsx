import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel do site",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-bg text-ink">{children}</div>;
}
