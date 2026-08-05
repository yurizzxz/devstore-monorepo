"use client";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/ui/button";

export default function Profile() {
  const router = useRouter();
  const loginRedirect = () => router.push("/login");

  return (
    <div className="min-h-screen mx-auto pt-45 md:pt-55 bg-white rounded-lg">
      <h1 className="text-4xl font-bold mb-8">Perfil</h1>
      <div className="flex flex-col mx-auto items-center space-y-3">
        <p className="text-3xl font-bold text-center">
          Ops! Parece que você não está logado.
        </p>
        <ButtonPrimary className="font-bold w-70" onClick={loginRedirect}>
          Comece agora!
        </ButtonPrimary>
      </div>
    </div>
  );
}
