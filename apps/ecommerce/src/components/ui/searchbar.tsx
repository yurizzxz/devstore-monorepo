import { useState } from "react";
import { Search } from "lucide-react";
import { InputRoot, InputField, InputIcon } from "./input";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="flex flex-col items-center w-full">
      <InputRoot>
        <InputField
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputIcon>
          <Search />
        </InputIcon>
      </InputRoot>
    </div>
  );
}
