import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import FilterDrawer from "@/components/FilterDrawer";
import FiltersModal from "@/components/FiltersModal";
import { type Recipe, type Category } from "../types/Recipe";
import agent from "@/lib/api/agent";
import { useFetchRecipes } from "@/lib/hooks/useRecipes";
import RecipeCard from "@/components/RecipeCard";
import { ClipLoader, GridLoader } from "react-spinners";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import clsx from "clsx";

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

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-5 mb-40 sm:px-6 md:px-14 lg:px-24 xl:px-44 2xl:px-60">
      <h1 className="mt-8 text-2xl font-semibold lg:text-3xl lg:ml-5">
        All recipes
      </h1>
      {/* Desktop search bar */}
      <div className="relative hidden w-full ml-auto -mb-6 md:w-96 lg:block">
        <FaSearch className="absolute text-gray-700 -translate-y-1/2 left-5 top-1/2" />
        <input
          type="text"
          className="w-full h-12 pl-12 pr-3 border border-gray-300 rounded-3xl"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      {/* Search Bar + Mobile Filter Button */}
      <div className="flex flex-col gap-4 mt-6 md:flex-row md:justify-between lg:hidden">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute text-gray-700 -translate-y-1/2 left-5 top-1/2" />
          <input
            type="text"
            className="w-full h-12 pl-12 pr-3 border border-gray-300 rounded-lg"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-lg font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm lg:hidden hover:bg-gray-50 active:bg-gray-100"
          onClick={() => setDrawerOpen(true)}
        >
          <HiOutlineAdjustmentsHorizontal className="w-6 h-6" />
          Filters
        </button>
      </div>
      <div className="flex items-center justify-between pl-5 mt-6">
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
          <div className="relative hidden w-full lg:relative md:w-96">
            <FaSearch className="absolute text-gray-700 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="border border-amber-100 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 mt-8">
        {/* Sidebar Filters (Desktop Only) */}
        <aside className="flex-col hidden px-5 lg:flex gap-y-10">
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
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 2xl:grid-cols-3 gap-x-6 lg:mt-0 auto-rows-[404px]">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-96 col-span-full">
              <GridLoader color="#f97316"  />
            </div>
          ) : recipes?.recipes?.length === 0 ? (
            <div className="flex flex-col items-center justify-center col-span-full h-96">
              <h2 className="text-xl font-semibold">No recipes found</h2>
              <p className="text-gray-500">
                Try changing your filters or search criteria.
              </p>
            </div>
          ) : (
            recipes?.recipes?.map((recipe: Recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </div>
      {recipes?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-20">
          <button
            disabled={filters.page === 1}
            onClick={() => handlePageChange((filters.page || 1) - 1)}
            className="p-2 text-sm font-medium bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>

          <div className="flex items-center gap-2 overflow-x-auto">
            {Array.from({ length: recipes.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={clsx(
                    "min-w-[40px] h-10 rounded-full text-sm font-medium transition",
                    page === filters.page
                      ? "bg-black text-white"
                      : "bg-white border hover:bg-gray-50",
                  )}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            disabled={filters.page === recipes.totalPages}
            onClick={() => handlePageChange((filters.page || 1) + 1)}
            className="p-2 text-sm font-medium bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

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
