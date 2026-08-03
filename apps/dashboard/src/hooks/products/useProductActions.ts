'use client'
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useProductActions() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    description: "",
    foto: "",
    categoriaId: "",
    specifications: "",
    preco: "",
    estrelas: "",
    categoriaId2: "",
    estoque: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCatChange = (value: string) => {
    setFormData({ ...formData, categoriaId: value });
  };

  const handlePromoChange = (value: string) => {
    setFormData({ ...formData, categoriaId2: value });
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/produto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro desconhecido");
      }

      router.push("/products");

      toast.success("Produto cadastrado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar produto: " + error.message);
    }
  };

  const deleteProduct = async (id: unknown) => {
    try {
      const res = await fetch("/api/produto", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Produto excluído com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao deletar produto: " + err.message);
    }
  };

  const updateProduct = async (
    e: React.FormEvent,
    productId: string | number | undefined
  ) => {
    e.preventDefault();

    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== "")
    );

    if (Object.keys(updatedFields).length === 0) {
      toast.warning("Nenhum dado alterado.");
      return;
    }

    try {
      const res = await fetch("/api/produto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFields, id: productId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Produto atualizado com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao atualizar produto: " + err.message);
    }
  };

  return {
    formData,
    handleCatChange,
    handlePromoChange,
    setFormData,
    createProduct,
    handleChange,
    deleteProduct,
    updateProduct,
  };
}
