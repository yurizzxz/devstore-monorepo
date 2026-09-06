import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/header/header";
import { Footer } from "@/components/common/footer";
import { Toaster } from "sonner";
import { getCategories } from "@/data/get-categories";

export const metadata: Metadata = {
  title: {
    default: "DevStore - Seu marketplace de tecnologia",
    template: "%s | DevStore - Seu marketplace de tecnologia",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="pt-BR">
      <body className="text-[#f5eeff]">
        <main>
          <Header categories={categories} />

          <div className="md:py-0">{children}</div>
          <Toaster position="top-center" />
          <Footer />
        </main>
      </body>
    </html>
  );
}
