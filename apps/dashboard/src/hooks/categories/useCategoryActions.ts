'use client'
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCategoryActions() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    description: "",
    promotion: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePromotionChange = (value: string) => {
    setFormData({ ...formData, promotion: value === "1" });
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/categoria", {
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

      router.push("/categories");

      toast.success("Categoria cadastrada com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar categoria: " + error.message);
    }
  };

  const deleteCategory = async (id: unknown) => {
    try {
      const res = await fetch("/api/categoria", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Categoria excluída com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao deletar categoria: " + err.message);
    }
  };

  const updateCategory = async (
    e: React.FormEvent,
    categoryId: string | number | undefined
  ) => {
    e.preventDefault();

    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (typeof value === "string") return value.trim() !== "";
        return value;
      })
    );

    if (Object.keys(updatedFields).length === 0) {
      toast.warning("Nenhum dado alterado.");
      return;
    }

    try {
      const res = await fetch("/api/categoria", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFields, id: categoryId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Categoria atualizada com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao atualizar categoria: " + err.message);
    }
  };

  return {
    formData,
    setFormData,
    createCategory,
    handlePromotionChange,
    handleChange,
    deleteCategory,
    updateCategory,
  };
}
