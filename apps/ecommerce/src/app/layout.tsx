import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/header/header";
import { Footer } from "@/components/common/footer";

export const metadata: Metadata = {
  title: {
    default: "DevStore - Seu marketplace de tecnologia",
    template: "%s | DevStore - Seu marketplace de tecnologia",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="text-[#f5eeff]">
        <main>
          <Header />

          <div className="md:py-0">{children}</div>

          <Footer />
        </main>
      </body>
    </html>
  );
}
