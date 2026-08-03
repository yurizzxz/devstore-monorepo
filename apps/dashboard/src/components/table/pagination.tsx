import { Button } from "@/components/ui/buttonUi";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end gap-1 mt-4">
      <Button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
        <ChevronsLeft size={23} />
      </Button>
      <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
        <ChevronLeft size={23} />
      </Button>
      <span className="flex text-sm mx-2 items-center">
        Página {currentPage} de {totalPages}
      </span>
      <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
        <ChevronRight size={23} />
      </Button>
      <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
        <ChevronsRight size={23} />
      </Button>
    </div>
  );
}
