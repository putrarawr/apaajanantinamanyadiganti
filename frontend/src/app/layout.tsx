import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sentra - Kriya, Tradisi & Produk UMKM Indonesia",
  description:
    "Pasar daring produk kriya, tenun nusantara, kopi lokal, gerabah kasongan, dan kerajinan asli UMKM Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#222222] antialiased">
        {children}
      </body>
    </html>
  );
}
