import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberShop Elite | Barbearia Premium",
  description: "Barbearia premium com agenda online e painel administrativo seguro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
