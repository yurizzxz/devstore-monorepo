import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Separator } from "@repo/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Slider } from "@repo/ui/components/slider";
import { SlidersHorizontal } from "lucide-react";

type FilterOption = {
  id: string;
  label: string;
};

const filterGroups: Array<{
  id: string;
  label: string;
  options: FilterOption[];
}> = [
  {
    id: "offers",
    label: "Oferta",
    options: [{ id: "on-sale", label: "Em promoção" }],
  },
  {
    id: "brand",
    label: "Marca",
    options: [
      { id: "amd", label: "AMD" },
      { id: "intel", label: "Intel" },
      { id: "nvidia", label: "NVIDIA" },
      { id: "asus", label: "ASUS" },
      { id: "gigabyte", label: "Gigabyte" },
    ],
  },
  {
    id: "socket",
    label: "Socket",
    options: [
      { id: "am4", label: "AM4" },
      { id: "am5", label: "AM5" },
      { id: "lga1700", label: "LGA 1700" },
    ],
  },
  {
    id: "chipset",
    label: "Chipset",
    options: [
      { id: "a520", label: "A520" },
      { id: "b550", label: "B550" },
      { id: "b650", label: "B650" },
      { id: "z790", label: "Z790" },
    ],
  },
  {
    id: "memory",
    label: "Memória RAM",
    options: [
      { id: "8gb", label: "8 GB" },
      { id: "16gb", label: "16 GB" },
      { id: "32gb", label: "32 GB" },
      { id: "ddr4", label: "DDR4" },
      { id: "ddr5", label: "DDR5" },
    ],
  },
  {
    id: "storage",
    label: "Armazenamento",
    options: [
      { id: "500gb", label: "500 GB" },
      { id: "1tb", label: "1 TB" },
      { id: "2tb", label: "2 TB" },
      { id: "nvme", label: "NVMe" },
    ],
  },
  {
    id: "features",
    label: "Recursos",
    options: [
      { id: "integrated-video", label: "Vídeo integrado" },
      { id: "with-cooler", label: "Acompanha cooler" },
    ],
  },
];

function FilterOptions({
  idPrefix,
  options,
}: {
  idPrefix: string;
  options: FilterOption[];
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          className="flex cursor-pointer items-center gap-3 text-sm text-zinc-300"
          htmlFor={`${idPrefix}-${option.id}`}
          key={option.id}
        >
          <Checkbox id={`${idPrefix}-${option.id}`} />
          {option.label}
        </label>
      ))}
    </div>
  );
}

function FilterContent({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="space-y-5">
      <Card className="flex flex-col w-full gap-3 rounded-xl border border-white/10 bg-zinc-950/50 p-5">
        <div className="">
          <div className="flex items-center gap-2 text-base font-semibold">
            <SlidersHorizontal className="size-4 text-purple-400" />
            Filtros
          </div>
        </div>

        <Separator className="my-5 bg-white/10" />

        <div>
          <p className="mb-4 text-sm font-medium">Faixa de preço</p>
          <Slider defaultValue={[0, 100]} max={100} step={1} />
          <div className="mt-3 flex justify-between text-xs text-zinc-400">
            <span>R$ 0</span>
            <span>R$ 20.000+</span>
          </div>
        </div>
      </Card>

      <Card className="border border-white/10 bg-zinc-950/50 p-5">
        <Accordion
          defaultValue={filterGroups.map((group) => group.id)}
          type="multiple"
        >
          {filterGroups.map((group) => (
            <AccordionItem key={group.id} value={group.id}>
              <AccordionTrigger className="py-4 hover:no-underline">
                {group.label}
              </AccordionTrigger>
              <AccordionContent>
                <FilterOptions idPrefix={idPrefix} options={group.options} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}

export function ProductFilters() {
  return (
    <>
      <aside className="hidden lg:block">
        <FilterContent idPrefix="desktop" />
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full" type="button" variant="outline">
              <SlidersHorizontal className="size-4" />
              Filtrar produtos
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto p-4 sm:max-w-md" side="left">
            <SheetHeader className="px-0 pb-5">
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <FilterContent idPrefix="mobile" />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
