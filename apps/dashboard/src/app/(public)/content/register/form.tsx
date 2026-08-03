"use client";

import React from "react";
import { Button } from "@/components/ui/buttonUi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSectionActions } from "@/hooks/sections/useSectionActions";

export function RegisterForm() {
  const { createSection, handleChange, formData } = useSectionActions();

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={createSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              name="titulo"
              type="text"
              className="h-11"
              placeholder="Título da seção"
              value={formData.titulo}
              onChange={handleChange}
            />

            <Label htmlFor="tipo">Tipo</Label>
            <Input
              id="tipo"
              name="tipo"
              type="text"
              className="h-11"
              placeholder="Ex: banner, lista, etc"
              value={formData.tipo}
              onChange={handleChange}
            />

            <Label htmlFor="categoriaId">ID da Categoria</Label>
            <Input
              id="categoriaId"
              name="categoriaId"
              type="text"
              className="h-11"
              placeholder="ID da categoria"
              value={formData.categoriaId}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              name="ordem"
              type="number"
              className="h-11"
              placeholder="Ordem de exibição"
              value={formData.ordem}
              onChange={handleChange}
            />

            <div className="flex items-center gap-2 mt-6">
              <input
                id="ativo"
                name="ativo"
                type="checkbox"
                checked={formData.ativo}
                onChange={handleChange}
              />
              <Label htmlFor="ativo" className="cursor-pointer">
                Ativo
              </Label>
            </div>
          </div>
        </div>

        <Button type="submit">Cadastrar Seção</Button>
      </form>
    </>
  );
}
