import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUserActions() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    telefone: "",
    cpf: "",
    rua: "",
    cidade: "",
    estado: "",
    cep: "",
    cargo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createUser = async (e: React.FormEvent) => {
      e.preventDefault();
    
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const result = await res.json();
    
        if (!res.ok) {
          throw new Error(result.error || "Erro desconhecido");
        }
  
        router.push("/users");
    
        toast.success("Usuário cadastrado com sucesso!");
      } catch (error: any) {
        toast.error("Erro ao cadastrar: " + error.message);
      }
    };

  const deleteUser = async (id: unknown) => {
    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Usuário excluído com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao deletar usuário: " + err.message);
    }
  };

  const updateUser = async (
    e: React.FormEvent,
    userId: string | number | undefined
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
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFields, id: userId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Usuário atualizado com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao atualizar usuário: " + err.message);
    }
  };

  return {
    formData,
    createUser,
    handleChange,
    deleteUser,
    updateUser,
  };
}
