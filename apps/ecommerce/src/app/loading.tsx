const skeletonItems = Array.from({ length: 10 }, (_, index) => index);

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-labelledby="loading-title"
      className="mx-auto min-h-[70vh] w-full max-w-360 px-4 py-10 sm:px-6 lg:py-16"
      role="status"
    >
      <h1 className="sr-only" id="loading-title">
        Carregando conteúdo da loja
      </h1>

      <div className="motion-safe:animate-pulse">
        <div className="h-4 w-28 rounded-md bg-zinc-800" />
        <div className="mt-4 h-9 w-64 max-w-full rounded-md bg-zinc-800" />
        <div className="mt-3 h-4 w-full max-w-md rounded-md bg-zinc-800" />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 xl:grid-cols-5">
          {skeletonItems.map((item) => (
            <div className="min-w-0" key={item}>
              <div className="aspect-square rounded-md bg-zinc-900" />
              <div className="mt-4 h-4 w-4/5 rounded-md bg-zinc-800" />
              <div className="mt-2 h-4 w-3/5 rounded-md bg-zinc-800" />
              <div className="mt-4 h-6 w-2/5 rounded-md bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
