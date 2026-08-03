'use client'
import { Button } from "@/components/ui/buttonUi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useProductActions } from "@/hooks/products/useProductActions";

export function RegisterForm() {
  const { createProduct, handleChange } = useProductActions();

  return (
    <form className="flex flex-col gap-4" onSubmit={createProduct}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            className="h-11"
            placeholder="Insira o nome do produto"
            type="text"
            id="nome"
            name="nome"
            onChange={handleChange}
          />

          <Label htmlFor="description">Descrição</Label>
          <Input
            className="h-11"
            placeholder="Insira a descrição"
            type="text"
            id="description"
            name="description"
            onChange={handleChange}
          />

          <Label htmlFor="foto">Foto (URL)</Label>
          <Input
            className="h-11"
            placeholder="Insira a URL da imagem"
            type="text"
            id="foto"
            name="foto"
            onChange={handleChange}
          />

          <Label htmlFor="categoriaId">Categoria</Label>
          <Input
            className="h-11"
            placeholder="Insira a categoria principal"
            type="text"
            id="categoriaId"
            name="categoriaId"
            onChange={handleChange}
          />

          <Label htmlFor="categoriaId2">Promoção</Label>
          <Input
            className="h-11"
            placeholder="Insira o ID da promoção"
            type="text"
            id="categoriaId2"
            name="categoriaId2"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="specifications">Especificações</Label>
          <Input
            className="h-11"
            placeholder="Insira as especificações"
            type="text"
            id="specifications"
            name="specifications"
            onChange={handleChange}
          />

          <Label htmlFor="preco">Preço</Label>
          <Input
            className="h-11"
            placeholder="Insira o preço"
            type="text"
            id="preco"
            name="preco"
            onChange={handleChange}
          />

          <Label htmlFor="estoque">Estoque</Label>
          <Input
            className="h-11"
            placeholder="Quantidade em estoque"
            type="text"
            id="estoque"
            name="estoque"
            onChange={handleChange}
          />

          <Label htmlFor="estrelas">Estrelas</Label>
          <Input
            className="h-11"
            placeholder="Nota do produto (0 a 5)"
            type="text"
            id="estrelas"
            name="estrelas"
            onChange={handleChange}
          />
        </div>
      </div>

      <Button>Cadastrar Produto</Button>
    </form>
  );
}
