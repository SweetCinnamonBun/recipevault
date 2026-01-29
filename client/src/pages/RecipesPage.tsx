import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import FilterDrawer from "@/components/FilterDrawer";
import FiltersModal from "@/components/FilterModal";
import { type Recipe, type Category } from "../types/Recipe";
import agent from "@/lib/api/agent";
import { useFetchRecipes } from "@/lib/hooks/useRecipes";
import RecipeCard from "@/components/RecipeCard";
import { ClipLoader } from "react-spinners";

export type Filters = {
  search?: string;
  page?: number;
  pageSize?: number;
  categories?: string[];
  sortBy?: string;
  isAscending?: boolean;
};

const RecipesPage = () => {
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    page: 1,
    pageSize: 9,
    categories: [],
    sortBy: "createdAt",
    isAscending: false,
  });

  const [query, setQuery] = useState("");
  const [debounceQuery] = useDebounce(query, 500);

  // Use your hook to fetch recipes list
  const { recipes, isLoading } = useFetchRecipes(filters);

  // Fetch categories using agent
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await agent.get("/api/categories");
        setFetchedCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debounceQuery, page: 1 }));
  }, [debounceQuery]);

  const handleSearchChange = (value: string) => setQuery(value);

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const prevCategories = prev.categories ?? [];
      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category];
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, direction] = value.split("-");
    const isAscending = direction === "asc";
    setFilters((prev) => ({ ...prev, sortBy, isAscending }));
  };

  const applyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setDrawerOpen(false);
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      page: 1,
      pageSize: 20,
      categories: [],
      sortBy: "createdAt",
      isAscending: false,
    });
    setQuery("");
  };
  const removeCategoryFilter = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories?.filter((c) => c !== category),
    }));
  };

  const removeSortFilter = () => {
    setFilters((prev) => ({
      ...prev,
      sortBy: "createdAt",
      isAscending: false,
    }));
  };

  const removeSearchFilter = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
    setQuery("");
  };

  return (
    <section className="px-5 mb-40 md:px-12">
      {/* Search Bar + Mobile Filter Button */}
      {/* <div className="flex flex-col gap-4 mt-24 md:flex-row md:justify-end">
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded-lg md:w-96"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <button
          className="px-4 py-2 border rounded-md md:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          Filters
        </button>
      </div> */}
      <div className="flex items-center justify-between pl-5 mt-20">
        <div className="flex items-center justify-center">
          {(filters.search ||
            filters.categories?.length ||
            filters.sortBy !== "createdAt") && (
            <div className="flex flex-wrap gap-3">
              {filters.search && (
                <span className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded-full">
                  Search: "{filters.search}"
                  <button
                    className="ml-2 font-bold text-gray-600"
                    onClick={removeSearchFilter}
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.categories?.map((category) => (
                <span
                  key={category}
                  className="flex items-center px-3 py-1 text-sm bg-green-200 rounded-full"
                >
                  {category}
                  <button
                    className="ml-2 font-bold text-green-700"
                    onClick={() => removeCategoryFilter(category)}
                  >
                    ×
                  </button>
                </span>
              ))}

              {filters.sortBy !== "createdAt" && (
                <span className="flex items-center px-3 py-1 text-sm bg-blue-200 rounded-full">
                  Sort: {filters.sortBy} {filters.isAscending ? "↑" : "↓"}
                  <button
                    className="ml-2 font-bold text-blue-700"
                    onClick={removeSortFilter}
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Clear all button */}
              <button
                className="px-3 py-1 ml-2 text-blue-600 "
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            className="w-full h-10 px-3 border border-gray-300 rounded-lg md:w-96"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="border border-amber-100 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mt-8">
        {/* Sidebar Filters (Desktop Only) */}
        <aside className="flex-col hidden px-5 md:flex gap-y-10">
          <div>
            <h2 className="mb-5 text-2xl font-semibold text-gray-400">
              Filter by:
            </h2>
            <h3 className="text-xl font-semibold">Categories</h3>
            <div className="mt-5 space-y-4">
              {(showAllCategories
                ? fetchedCategories
                : fetchedCategories.slice(0, 5)
              )?.map((c) => (
                <div className="flex gap-x-3" key={c.id}>
                  <input
                    type="checkbox"
                    name={c.slug}
                    className="w-7 h-7 accent-black"
                    checked={filters.categories?.includes(c.name) || false}
                    onChange={() => handleCategoryChange(c.name)}
                  />
                  <label className="text-lg">{c.name}</label>
                </div>
              ))}
              {fetchedCategories.length > 5 && (
                <button
                  className="mt-2 text-blue-600 underline"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  {showAllCategories ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-gray-400">
              Sort by:
            </h2>
            <div className="mt-3 space-y-2">
              <h3 className="mb-4 text-xl font-semibold">Date</h3>
              <div className="flex items-center gap-x-3">
                <input
                  type="radio"
                  name="sort"
                  className="w-6 h-6"
                  value="createdAt-desc"
                  checked={
                    filters.sortBy === "createdAt" &&
                    filters.isAscending === false
                  }
                  onChange={(e) => handleSortChange(e.target.value)}
                />
                <label className="text-lg">Newest</label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  type="radio"
                  name="sort"
                  className="w-6 h-6"
                  value="createdAt-asc"
                  checked={
                    filters.sortBy === "createdAt" &&
                    filters.isAscending === true
                  }
                  onChange={(e) => handleSortChange(e.target.value)}
                />
                <label className="text-lg">Oldest</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 auto-rows-[406px] gap-y-5 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-96">
              <ClipLoader color="#000" size={50} />
            </div>
          ) : (
            recipes?.recipes?.map((recipe: Recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <FiltersModal onClose={() => setDrawerOpen(false)}>
          <FilterDrawer
            initialFilters={filters}
            onApply={applyFilters}
            categoriesList={fetchedCategories}
          />
        </FiltersModal>
      )}
    </section>
  );
};

export default RecipesPage;
