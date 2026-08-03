"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/dialog";
import { Button } from "@/components/ui/buttonUi";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Product, Category, User, Order, Section } from "@/lib/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { useUserActions } from "@/hooks/users/useUserActions";
import { useProductActions } from "@/hooks/products/useProductActions";
import { useCategoryActions } from "@/hooks/categories/useCategoryActions";
import { useOrderActions } from "@/hooks/orders/useOrdersActions";
import { useSectionActions } from "@/hooks/sections/useSectionActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryName } from "@/utils/mappers";
import { useCategories } from "@/hooks/categories/useCategories";

interface TableActionsProps {
  item: Product | User | Category | Order | Section;
  type: "products" | "users" | "categories" | "orders" | "sections";
}

export function TableActions({ item, type }: TableActionsProps) {
  const categories = useCategories();
  const {
    handleChange: handleUserChange,
    deleteUser,
    updateUser,
  } = useUserActions();
  const {
    deleteProduct,
    updateProduct,
    handlePromoChange,
    handleCatChange,
    handleChange: handleProductChange,
  } = useProductActions();
  const {
    deleteCategory,
    updateCategory,
    handlePromotionChange,
    handleChange: handleCategoryChange,
  } = useCategoryActions();
  const {
    deleteOrder,
    updateOrder,
    handleStatusChange,
    handleChange: handleOrderChange,
  } = useOrderActions();

  const {
    deleteSection,
    updateSection,
    handleChange: handleSectionChange,
    handleSeleChange,
  } = useSectionActions();

  return (
    <div className="flex justify-end items-center gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer w-8 h-8">
            <Pencil className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar{" "}
              {type === "products"
                ? "Produto"
                : type === "categories"
                ? "Categoria"
                : type === "users"
                ? "Usuário"
                : type === "orders"
                ? "Pedido"
                : type === "sections"
                ? "Seção"
                : "Erro"}{" "}
            </DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias e salve.
            </DialogDescription>
          </DialogHeader>

          {type === "categories" && (
            <>
              <Label className="-mb-1.5">Nome</Label>
              <Input
                name="nome"
                onChange={handleCategoryChange}
                className="h-11"
                type="text"
                defaultValue={(item as Category).nome}
              />
              <Label className="-mb-1.5">Descrição</Label>
              <Input
                type="text"
                name="description"
                onChange={handleCategoryChange}
                className="h-11"
                defaultValue={(item as Category).description}
              />
              <Label className="-mb-1.5">Promoção</Label>
              <Select
                name="ativo"
                defaultValue={String((item as Category).promotion)}
                onValueChange={handlePromotionChange}
              >
                <SelectTrigger className="h-14  w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sim</SelectItem>
                  <SelectItem value="0">Não</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {type === "products" && (
            <>
              <Label className="-mb-1.5">Nome</Label>
              <Input
                name="nome"
                onChange={handleProductChange}
                className="h-11"
                type="text"
                defaultValue={(item as Product).nome}
              />
              <Label className="-mb-1.5">Especificações</Label>
              <Input
                type="text"
                name="specifications"
                onChange={handleProductChange}
                defaultValue={(item as Product).specifications}
              />
              <Label className="-mb-1.5">Preço</Label>
              <Input
                type="text"
                name="price"
                onChange={handleProductChange}
                className="h-11"
                defaultValue={(item as Product).price}
              />
              <Label className="-mb-1.5">Categoria</Label>
              <Select
                name="categoryName"
                defaultValue={
                  Object.keys(categories)
                    .filter((id) => Number(id) <= 5)
                    .includes(String((item as Product).categoryName))
                    ? String((item as Product).categoryName)
                    : ""
                }
                onValueChange={handleCatChange}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories)
                    .filter((id) => Number(id) > 0 && Number(id) <= 5)
                    .map((id) => (
                      <SelectItem key={id} value={id}>
                        {getCategoryName(Number(id))}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Label className="-mb-1.5">Promoção</Label>
              <Select
                name="category2Name"
                defaultValue={
                  Object.keys(categories)
                    .filter((id) => Number(id) >= 6)
                    .includes(String((item as Product).category2Name))
                    ? String((item as Product).category2Name)
                    : ""
                }
                onValueChange={handlePromoChange}
              >
                <SelectTrigger className="h-14 w-full">
                  <SelectValue placeholder="Selecione uma promoção" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories)
                    .filter((id) => Number(id) >= 6)
                    .map((id) => (
                      <SelectItem key={id} value={id}>
                        {getCategoryName(Number(id))}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </>
          )}

          {type === "users" && (
            <>
              <Label className="-mb-1.5">Nome</Label>
              <Input
                className="h-11"
                type="text"
                name="nome"
                onChange={handleUserChange}
                defaultValue={(item as User).nome}
              />
              <Label className="-mb-1.5">Email</Label>
              <Input
                className="h-11"
                name="email"
                type="email"
                defaultValue={(item as User).email}
              />
              <Label className="-mb-1.5">CPF</Label>
              <Input
                className="h-11"
                name="cpf"
                onChange={handleUserChange}
                defaultValue={(item as User).cpf}
              />
              <Label className="-mb-1.5">Telefone</Label>
              <Input
                className="h-11"
                type="text"
                name="telefone"
                onChange={handleUserChange}
                defaultValue={(item as User).telefone}
              />
              <Label className="-mb-1.5">Cidade</Label>
              <Input
                className="h-11"
                type="text"
                name="cidade"
                onChange={handleUserChange}
                defaultValue={(item as User).cidade}
              />
              <Label className="-mb-1.5">Cargo</Label>
              <Input
                className="h-11"
                type="text"
                name="cargo"
                onChange={handleUserChange}
                defaultValue={(item as User).cargo}
              />
            </>
          )}

          {type === "orders" && (
            <>
              <Label className="-mb-1.5">Total</Label>
              <Input
                className="h-11"
                type="text"
                name="total"
                onChange={handleOrderChange}
                defaultValue={(item as Order).total}
              />
              <Label className="-mb-1.5">Status</Label>
              <Select
                name="status"
                defaultValue={String((item as Order).status)}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="h-14 w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Pendente</SelectItem>
                  <SelectItem value="1">Ativo</SelectItem>
                  <SelectItem value="2">Cancelado</SelectItem>
                  <SelectItem value="3">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {type === "sections" && (
            <>
              <Label className="-mb-1.5">Nome</Label>
              <Input
                className="h-11"
                type="text"
                name="nome"
                onChange={handleSectionChange}
                defaultValue={(item as Section).nome}
              />

              <Label className="-mb-1.5">Tipo</Label>
              <Input
                className="h-11"
                type="text"
                name="tipo"
                onChange={handleSectionChange}
                defaultValue={(item as Section).tipo}
              />

              <Label className="-mb-1.5">Categoria</Label>
              <Input
                className="h-11"
                type="text"
                name="categoriaId"
                onChange={handleSectionChange}
                defaultValue={(item as Section).categoriaId}
              />

              <Label className="-mb-1.5">Ordem</Label>
              <Input
                className="h-11"
                type="text"
                name="ordem"
                onChange={handleSectionChange}
                defaultValue={(item as Section).ordem}
              />

              <Label className="-mb-1.5">Ativo</Label>
              <Select
                name="ativo"
                defaultValue={String((item as Section).ativo)}
                onValueChange={handleSeleChange}
              >
                <SelectTrigger className="h-14  w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sim</SelectItem>
                  <SelectItem value="0">Não</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          <DialogFooter>
            <Button
              onClick={(e) =>
                type === "users"
                  ? updateUser(e, (item as User).id)
                  : type === "products"
                  ? updateProduct(e, (item as Product).id)
                  : type === "categories"
                  ? updateCategory(e, (item as Category).id)
                  : type === "orders"
                  ? updateOrder(e, (item as Order).id)
                  : updateSection(e, (item as Section).id)
              }
              className="text-white"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer w-8 h-8 hover:bg-[#f50000]"
          >
            <Trash2 className="size" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tem certeza?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() =>
                type === "users"
                  ? deleteUser((item as User).id)
                  : type === "products"
                  ? deleteProduct((item as Product).id)
                  : type === "categories"
                  ? deleteCategory((item as Category).id)
                  : type === "orders"
                  ? deleteOrder((item as Order).id)
                  : deleteSection((item as Section).id)
              }
              className="text-white"
              variant={"destructive"}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
