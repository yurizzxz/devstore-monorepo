import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/header/header";
import { Footer } from "@/components/common/footer";
import { auth } from "@repo/auth/lib/auth";
import { prisma } from "@repo/prisma/client";
import { headers } from "next/headers";
import { Toaster } from "sonner";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <html lang="pt-BR">
      <body className="text-[#f5eeff]">
        <main>
          <Header
            user={session?.user ?? null}
            categories={categories}
          />

          <div className="md:py-0">{children}</div>
          <Toaster />
          <Footer />
        </main>
      </body>
    </html>
  );
}
