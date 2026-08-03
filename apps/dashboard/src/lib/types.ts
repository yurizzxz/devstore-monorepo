export interface Product {
  id: number;
  nome: string;
  specifications: string;
  image: string;
  price: number;
  estoque: number;
  categoryName?: string;
  category2Name?: string;
  category?: number;
  category2?: number;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rua: string;
  cidade: string;
  estado: string;
  cep: string;
  cargo: string;
}

export interface Category {
  id: number;
  nome: string;
  description: string;
  promotion?: boolean
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: number;
}

export interface Section {
  id: number;
  nome: string;
  tipo: string;
  categoriaId: number;
  ordem: number;
  ativo: number;
}