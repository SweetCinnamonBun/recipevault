import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDebounce } from "use-debounce";
import FilterDrawer from "@/components/FilterDrawer";
import FiltersModal from "@/components/FilterModal";
import { type Recipe, type Category } from "../types/Recipe";
import agent from "@/lib/api/agent";
import { useFetchRecipes } from "@/lib/hooks/useRecipes";
import RecipeCard from "@/components/RecipeCard";


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
  const [filters, setFilters] = useState<Filters>({
    search: "",
    page: 1,
    pageSize: 20,
    categories: [],
    sortBy: "createdAt",
    isAscending: false,
  });

  const [query, setQuery] = useState("");
  const [debounceQuery] = useDebounce(query, 500);

  // Use your hook to fetch recipes list
 const { recipes, isLoading } = useFetchRecipes(filters)

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

  return (
    <section className="px-5 mb-40 md:px-32">
      {/* Search Bar + Mobile Filter Button */}
      <div className="flex flex-col gap-4 mt-24 md:flex-row md:justify-end">
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
      </div>

      {/* Main Layout */}
      <div className="border border-amber-100 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mt-8">
        {/* Sidebar Filters (Desktop Only) */}
        <aside className="flex-col hidden px-5 md:flex gap-y-10">
          <div>
            <h3 className="text-xl font-semibold">Categories</h3>
            <div className="mt-5 space-y-4">
              {fetchedCategories?.map((c) => (
                <div className="flex gap-x-3" key={c.id}>
                  <input
                    type="checkbox"
                    name={c.slug}
                    className="w-7 h-7 accent-black"
                    onClick={() => handleCategoryChange(c.name)}
                  />
                  <label className="text-lg">{c.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Sort By</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-x-3">
                <input
                  type="radio"
                  name="sort"
                  className="w-6 h-6"
                  value="createdAt-desc"
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
                  onChange={(e) => handleSortChange(e.target.value)}
                />
                <label className="text-lg">Oldest</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {isLoading ? (
            <p>Loading recipes...</p>
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
