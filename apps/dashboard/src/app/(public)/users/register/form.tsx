"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/buttonUi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserActions } from "@/hooks/users/useUserActions"; 

export function RegisterForm() {
  const { createUser, handleChange } = useUserActions();
  
  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={createUser}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <Label>Nome</Label>
            <Input name="nome" type="text" className="h-11" placeholder="Nome completo" onChange={handleChange} />

            <Label>Email</Label>
            <Input name="email" type="email" className="h-11" placeholder="Email" onChange={handleChange} />

            <Label>Senha</Label>
            <Input name="password" type="password" className="h-11" placeholder="Senha" onChange={handleChange} />

            <Label>Telefone</Label>
            <Input name="telefone" type="text" className="h-11" placeholder="Telefone" onChange={handleChange} />

            <Label>CPF</Label>
            <Input name="cpf" type="text" className="h-11" placeholder="CPF" onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Rua</Label>
            <Input name="rua" type="text" className="h-11" placeholder="Rua" onChange={handleChange} />

            <Label>Cidade</Label>
            <Input name="cidade" type="text" className="h-11" placeholder="Cidade" onChange={handleChange} />

            <Label>Estado</Label>
            <Input name="estado" type="text" className="h-11" placeholder="Estado" onChange={handleChange} />

            <Label>CEP</Label>
            <Input name="cep" type="text" className="h-11" placeholder="CEP" onChange={handleChange} />

            <Label>Cargo</Label>
            <Input name="cargo" type="text" className="h-11" placeholder="Cargo" onChange={handleChange} />
          </div>
        </div>

        <Button type="submit">Cadastrar</Button>
      </form>
    </>
  );
}
