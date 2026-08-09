import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/header/header";
import { Footer } from "@/components/common/footer";
import { prisma } from "../../../../packages/prisma/client";

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
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <html lang="pt-BR">
      <body className="text-[#f5eeff]">
        <main>
          <Header
            user={null}
            categories={categories}
          />

          <div className="md:py-0">{children}</div>

          <Footer />
        </main>
      </body>
    </html>
  );
}
