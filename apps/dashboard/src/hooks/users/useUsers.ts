import { useEffect, useState } from "react";
import { User } from "@/lib/types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        console.log(data);

        const userList = data.map((user: any) => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          cpf: user.cpf,
          rua: user.rua,
          cidade: user.cidade,
          estado: user.estado,
          cep: user.cep,
          cargo: user.cargo,
        }));

        setUsers(userList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  return users;
}
