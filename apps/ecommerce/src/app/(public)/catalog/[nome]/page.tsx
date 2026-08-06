import CardList from "@/components/Cards";

interface Params {
  nome: string;
}

interface Props {
  params: Params;
}

export default function Catalog({ params }: Props) {
  const { nome } = params;
  const nomeTratado = decodeURIComponent(nome);

  return (
    <main className="min-h-screen py-8 pt-60 md:pt-60 ">
      <div className="flex flex-row gap-4 overflow-x-hidden">
        <div className="w-full">
          <h1 className="text-4xl mb-3 font-bold">{nomeTratado}</h1>
          <CardList
            className="space-x-5 flex flex-wrap justify-start w-full"
          />
        </div>
      </div>
    </main>
  );
}
