"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/buttonUi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone] = useState("");
  const [cpf] = useState("");
  const [rua] = useState("");
  const [cidade] = useState("");
  const [estado] = useState("");
  const [cep] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || (isRegister && !nome)) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          password,
          telefone,
          cpf,
          rua,
          cidade,
          estado,
          cep,
          type: isRegister ? "register" : "login",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      login(data.token);

      if (isRegister) {
        toast.success("Cadastro realizado com sucesso! Agora faça login.");
        setTimeout(() => {
          router.push("/");
        }, 2200);
        setIsRegister(false);
      } else {
        router.push("/");
        toast.success("Login realizado com sucesso!");
        setTimeout(() => {
          router.push("/");
        }, 2200);
      }
    } catch (error) {
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          
          <CardTitle className="text-2xl">
            {isRegister ? "Cadastro" : "Login"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Preencha seus dados para criar uma conta"
              : "Entre com seu email para acessar sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {isRegister && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite seu nome..."
                      required
                    />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  {!isRegister && (
                    <a
                      href="#"
                      className="ml-auto cursor-pointer inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isRegister ? "Cadastrar" : "Login"}
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            {message && (
              <div className="mt-2 text-center text-sm text-green-500">
                {message}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="cursor-pointer text-primary underline underline-offset-4"
              >
                {isRegister ? "Faça login" : "Cadastre-se"}
              </button>
            </div>
          </form>
          
        </CardContent>
      </Card>
    </div>
  );
}
