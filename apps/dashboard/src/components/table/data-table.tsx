import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { TableActions } from "./table-actions";
import { Pagination } from "./pagination";
import { Product, Category, User, Order, Section } from "@/lib/types";
import { getCategoryName, getStatsName } from "@/utils/mappers";

interface Column<T> {
  key: string;
  label: string;

  render: (item: T) => React.ReactNode;
}

const tableConfigs = {
  products: [
    {
      key: "image",
      label: "Img",
      render: (item: Product) => (
        <Image src={item.image} alt={item.nome} width={35} height={35} />
      ),
    },
    {
      key: "nome",
      label: "Nome",
      render: (item: Product) =>
        item.nome.length > 10 ? item.nome.slice(0, 15) + "..." : item.nome,
    },
    {
      key: "specifications",
      label: "Especificações",
      render: (item: Product) =>
        item.specifications.length > 10
          ? item.specifications.slice(0, 10) + "..."
          : item.specifications,
    },
    {
      key: "category",
      label: "Categoria",
      render: (item: Product) => getCategoryName(item.category),
    },
    {
      key: "category2",
      label: "Promoção",
      render: (item: Product) => getCategoryName(item.category2),
    },
    {
      key: "estoque",
      label: "Estoque",
      render: (item: Product) => item.estoque,
    },
    {
      key: "price",
      label: "Preço",
      render: (item: Product) => formatCurrency(item.price),
    },
  ] as Column<Product>[],
  users: [
    {
      key: "nome",
      label: "Nome",
      render: (item: User) => item.nome,
    },
    {
      key: "email",
      label: "Email",
      render: (item: User) => item.email,
    },
    {
      key: "telefone",
      label: "Telefone",
      render: (item: User) => item.telefone,
    },
    {
      key: "cpf",
      label: "CPF",
      render: (item: User) => item.cpf,
    },
    {
      key: "cidade",
      label: "Cidade",
      render: (item: User) => item.cidade,
    },
    {
      key: "cargo",
      label: "Cargo",
      render: (item: User) => item.cargo,
    },
  ] as Column<User>[],
  categories: [
    {
      key: "nome",
      label: "Nome",
      render: (item: Category) => item.nome,
    },
    {
      key: "description",
      label: "Descrição",
      render: (item: Category) => item.description,
    },
    {
      key: "promotion",
      label: "Promoção",
      render: (item: Category) => (item.promotion ? "Sim" : "Não"),
    },
  ] as Column<Category>[],
  orders: [
    {
      key: "user_id",
      label: "User ID",
      render: (item: Order) => item.user_id,
    },
    {
      key: "total",
      label: "Total",
      render: (item: Order) => formatCurrency(item.total),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Order) => getStatsName(item.status),
    },
  ] as Column<Order>[],
  sections: [
    {
      key: "nome",
      label: "Nome",
      render: (item: Section) => item.nome,
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (item: Section) => item.tipo,
    },
    {
      key: "category",
      label: "Categoria",
      render: (item: Section) => getCategoryName(item.categoriaId),
    },
    {
      key: "order",
      label: "Ordem",
      render: (item: Section) => item.ordem,
    },
    {
      key: "active",
      label: "Ativo",
      render: (item: Section) => (item.ativo ? "Sim" : "Não"),
    },
  ] as Column<Section>[],
};
type DataMap = {
  products: Product;
  users: User;
  categories: Category;
  orders: Order;
  sections: Section;
};
interface DataTableProps<K extends keyof DataMap> {
  data: DataMap[K][];
  type: K;
  withPagination?: boolean;
  itemsPerPage?: number;
}

export function DataTable<K extends keyof DataMap>({
  data,
  type,
  withPagination = true,
  itemsPerPage = 5,
}: DataTableProps<K>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((data.length || 0) / itemsPerPage);
  const displayedData = withPagination
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data;

  const columns = tableConfigs[type] as Column<DataMap[K]>[];

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">ID</TableHead>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.key === "nome" ? "w-45" : ""}
              >
                {col.label}
              </TableHead>
            ))}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedData.length > 0 ? (
            displayedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(item)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <TableActions
                    item={
                      {
                        ...(item as Product),
                        categoryName: getCategoryName(
                          (item as Product).category
                        ),
                        category2Name: getCategoryName(
                          (item as Product).category2
                        ),
                      } as Product
                    }
                    type={type}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2}>
                Nenhum dado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {withPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
