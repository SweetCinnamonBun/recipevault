import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [memories, setMemories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      const controller = new AbortController();
      (async () => {
        const url =
          "http://localhost:5100/api/memories?filterColumn=title&filterValue=" +
          encodeURIComponent(debouncedQuery);
        const response = await fetch(url, { signal: controller.signal });
        const memories = await response.json();
        setMemories(memories.data);
      })();
      return () => controller.abort();
    } else {
      setMemories([]);
    }
  }, [debouncedQuery]);

  const handleSelect = (recipe) => {
    navigate(`/memory-view/${recipe._id}`);
  };

  return (
    <div className="w-full">
      <Combobox onChange={handleSelect} onClose={() => setQuery("")}>
        <div className="relative">
          <FaSearch className="absolute left-4 top-[16px] h-6 w-6" />
          <ComboboxInput
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-14 w-full rounded-full border border-[#D3CECE] bg-[#e9e7e7] px-12 text-lg leading-8 tracking-tight text-black placeholder:text-black max-sm:pr-4"
          />
        </div>
        <ComboboxOptions className="absolute w-full py-2 mt-3 overflow-y-scroll text-lg bg-white border border-gray-400 max-h-80 rounded-xl">
          {memories.map((memory, index) => (
            <ComboboxOption
              key={memory.title}
              value={memory}
              className={`group flex gap-2 px-5 py-2 bg-white data-[focus]:bg-blue-100 ${
                index !== memories.length - 1 ? 'border-b-2' : ''
              }`}
            >
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="object-cover w-10 h-10 border border-gray-200 rounded-full"
              />
              {memory.title}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}