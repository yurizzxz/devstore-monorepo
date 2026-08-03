import { useEffect, useState } from "react";
import { Section } from "@/lib/types";

export function useSections() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("/api/sections");
        const data = await response.json();
        console.log(data);

        const userList = data.map((user: any) => ({
          id: user.id,
          nome: user.nome,
          tipo: user.tipo,
          categoriaId: user.categoriaId,
          ordem: user.ordem,
          ativo: user.ativo
        }));

        setSections(userList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchSections();
  }, []);

  return sections;
}
