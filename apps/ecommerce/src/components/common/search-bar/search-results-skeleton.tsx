export function SearchResultsSkeleton() {
  return (
    <div
      aria-label="Pesquisando produtos"
      className="space-y-1 p-3 motion-safe:animate-pulse"
      role="status"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div className="flex items-center gap-3 py-1" key={index}>
          <div className="size-14 shrink-0 rounded-md bg-zinc-800" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-4/5 rounded-md bg-zinc-800" />
            <div className="h-3 w-2/5 rounded-md bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}