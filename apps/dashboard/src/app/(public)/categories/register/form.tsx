"use client";
import { Button } from "@/components/ui/buttonUi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryActions } from "@/hooks/categories/useCategoryActions";

export function RegisterForm() {
  const { createCategory, handleChange } = useCategoryActions();

  return (
    <form className="flex flex-col gap-4" onSubmit={createCategory}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            className="h-11"
            placeholder="Insira o nome da categoria"
            type="text"
            id="nome"
            name="nome"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            className="h-11"
            placeholder="Insira a descrição da categoria"
            type="text"
            id="description"
            name="description"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="promotion">Promoção</Label>
          <Input
            className="h-11"
            placeholder="1 Sim, 0 Não"
            type="text"
            id="promotion"
            name="promotion"
            onChange={handleChange}
          />
        </div>
      </div>

      <Button>Cadastrar Categoria</Button>
    </form>
  );
}
