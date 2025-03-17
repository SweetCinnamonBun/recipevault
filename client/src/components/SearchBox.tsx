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
import { Recipe } from "@/types/Recipe";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      const controller = new AbortController();
      (async () => {
        const url =
          "http://localhost:5028/api/recipes?search=" +
          encodeURIComponent(debouncedQuery);
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        setRecipes(data.recipes);
      })();
      return () => controller.abort();
    } else {
      setRecipes([]);
    }
  }, [debouncedQuery]);

  const handleSelect = (recipe: Recipe) => {
    if (recipe?.id)
    {
      navigate(`/recipe/${recipe?.id}`);
    }
  };

  return (
    <div className="relative mr-3">
      <Combobox onChange={handleSelect} onClose={() => setQuery("")}>
        <div className="relative">
          <FaSearch className="absolute left-4 top-[12px] h-6 w-6" />
          <ComboboxInput
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full h-12 px-12 text-lg leading-8 tracking-tight text-black bg-white rounded-full placeholder:text-black max-sm:pr-4"
          />
        </div>
        <ComboboxOptions className="absolute w-full py-2 mt-3 overflow-y-scroll text-lg bg-white border border-gray-400 max-h-80 rounded-xl">
          {recipes?.map((recipe: Recipe, index) => (
            <ComboboxOption
              key={recipe.name}
              value={recipe}
              className={`group flex gap-2 px-5 py-2 bg-white data-[focus]:bg-blue-100 ${
                index !== recipes.length - 1 ? 'border-b-2' : ''
              }`}
            >
              {recipe.name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}