import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useOrderActions() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_id: "",
    total: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/orders", {
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

      router.push("/orders");

      toast.success("Pedido cadastrado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar pedido: " + error.message);
    }
  };

  const deleteOrder = async (id: unknown) => {
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Pedido excluído com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao deletar pedido: " + err.message);
    }
  };

  const updateOrder = async (
    e: React.FormEvent,
    orderId: string | number | undefined
  ) => {
    e.preventDefault();

    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        return typeof value === "string" ? value.trim() !== "" : true;
      })
    );

    if (Object.keys(updatedFields).length === 0) {
      toast.warning("Nenhum dado alterado.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFields, id: orderId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erro desconhecido");

      window.location.reload();
      toast.success("Pedido atualizado com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao atualizar pedido: " + err.message);
    }
  };

  return {
    formData,
    createOrder,
    handleStatusChange,
    handleChange,
    deleteOrder,
    updateOrder,
  };
}
