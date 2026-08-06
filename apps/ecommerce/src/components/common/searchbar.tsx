import { Input } from "@repo/ui/components/input";

export default function SearchBar() {
  return (
    <div className="flex flex-col items-center w-full">
      <Input
        className="w-full h-11 rounded-md"
        placeholder="O que você procura?"
      />
    </div>
  );
}
