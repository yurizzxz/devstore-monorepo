import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Section } from "@/lib/types";

export function useSectionActions() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "",
    categoriaId: "",
    ordem: "",
    ativo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type} = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? e.target.checked : value });
  };

  const handleSeleChange = (value: string) => {
    setFormData({ ...formData, ativo: value === "1" });
  };

  const createSection = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      router.push("/content");
      toast.success("Seção criada com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao criar seção: " + error.message);
    }
  };

  const updateSection = async (e: React.FormEvent, sectionId: string | number | undefined) => {
    e.preventDefault();

    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (typeof value === "string") return value.trim() !== "";
        return true;
      })
    );

    if (Object.keys(updatedFields).length === 0) {
      toast.warning("Nenhum dado alterado.");
      return;
    }

    try {
      const res = await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedFields, id: sectionId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Seção atualizada com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao atualizar seção: " + err.message);
    }
  };

  const deleteSection = async (id: unknown) => {
    try {
      const res = await fetch("/api/sections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Seção excluída com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao deletar seção: " + err.message);
    }
  };

  return {
    sections,
    formData,
    handleSeleChange,
    handleChange,
    createSection,
    updateSection,
    deleteSection,
  };
}
