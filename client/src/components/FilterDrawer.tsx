import { useState } from "react";
import { type Filters } from "../pages/RecipesPage"; 
import { Category } from "@/types/Recipe";

type Props = {
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
  categoriesList: Category[]; 
};

const FilterDrawer = ({ onApply, initialFilters, categoriesList }: Props) => {
  const [categories, setCategories] = useState<string[]>(initialFilters.categories ?? []);
  const [sortBy, setSortBy] = useState<string>(
    initialFilters.sortBy
      ? `${initialFilters.sortBy}-${initialFilters.isAscending ? "asc" : "desc"}`
      : "createdAt-desc"
  );

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleApply = () => {
    const [sort, direction] = sortBy.split("-");
    onApply({
      ...initialFilters,
      categories,
      sortBy: sort,
      isAscending: direction === "asc",
    });
  };

  return (
    <div className="flex flex-col h-[85vh] p-5  bg-white">
      <h3 className="mb-4 text-xl font-bold">Filter Recipes</h3>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="my-4 text-lg font-semibold">Categories</h4>
        <div className="flex flex-col gap-2 overflow-auto text-lg max-h-60">
          {categoriesList.map((cat) => (
            <label key={cat.id} className="flex items-center">
              <input
                type="checkbox"
                checked={categories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="mr-2 w-7 h-7 accent-black"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold">Sort By</h4>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            name="sort"
            checked={sortBy === "createdAt-desc"}
            onChange={() => setSortBy("createdAt-desc")}
            className="w-6 h-6 mr-2"
          />
          Newest
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="sort"
            checked={sortBy === "createdAt-asc"}
            onChange={() => setSortBy("createdAt-asc")}
            className="w-6 h-6 mr-2"
          />
          Oldest
        </label>
      </div>

      <button
  className="w-full py-2 mt-auto mb-10 font-medium text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 hover:from-orange-600 hover:via-orange-500 hover:to-amber-500 hover:shadow-lg"
  onClick={handleApply}
>
  Apply Filters
</button>
    </div>
  );
};

export default FilterDrawer;
