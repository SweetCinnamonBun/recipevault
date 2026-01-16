import { Category, Recipe } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router";
import SearchBox from "@/components/SearchBox";
import { CiFilter } from "react-icons/ci";
import { FaSort, FaStar } from "react-icons/fa";
import Modal from "@/components/Modal";
import RecipeStars from "@/components/RecipeStars";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CgSpinner } from "react-icons/cg";
import { useCategories } from "@/lib/hooks/useCategories";
import { ClipLoader } from "react-spinners";
import HeroImg from "@/assets/images/pexels-ella-olsson-572949-1640777.jpg";
import { FaChevronDown } from "react-icons/fa6";

const HomePage = () => {
  // const [error, setError] = useState<string>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const { ref, inView } = useInView();
  const [showSpinner, setShowSpinner] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [isAscending, setIsAscending] = useState(false);
  const [isSortingOpen, setIsSortingOpen] = useState(false);

  const { categories, isPending } = useCategories();

  const fetchRecipes = async (
    page: number,
    pageSize: number,
    categories: string[],
    sortBy: string,
    isAscending: boolean
  ) => {
    const categoryQuery = categories
      .map((category) => `categories=${encodeURIComponent(category)}`)
      .join("&");

    const response = await fetch(
      `/api/recipes?page=${page}&pageSize=${pageSize}&${categoryQuery}&sortBy=${sortBy}&isAscending=${isAscending}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    return data;
  };

  const handleFiltersModalClose = () => {
    setIsFiltersModalOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    );
  };

  const applyFilters = () => {
    setAppliedCategories(selectedCategories);
    setIsFiltersModalOpen(false);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["recipes", appliedCategories, sortBy, isAscending],
      queryFn: ({ pageParam = 1 }) =>
        fetchRecipes(pageParam, 5, appliedCategories, sortBy, isAscending),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = lastPage?.totalPages;

        console.log("Current Page:", currentPage, "Total Pages:", totalPages);

        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      refetchOnWindowFocus: false,
      staleTime: 20_000,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      setShowSpinner(true);
      setTimeout(() => {
        fetchNextPage();
        setShowSpinner(false);
      }, 100); // Adjust delay time as needed
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const recipes = data?.pages.flatMap((page) => page.recipes) || [];

  const handleSortChange = (criteria: string) => {
    setSortBy(criteria);
    setIsSortingOpen(false);
  };

  const handleSortOrderChange = (order: boolean) => {
    setIsAscending(order);
  };

  const categoriesDropdown = [
    "Meal types",
    "Baking",
    "Diets",
    "Ingredients",
    "Themes",
    "Cuisine",
    "Product",
    "Preparation",
    "Created by",
  ];

  return (
    <section>
      {/* Hero section */}
      <section className="w-full bg-[#fcfafa] h-[580px] flex items-center px-14">
        <div className="w-full">
          <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
            {/* Left content */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                RecipeVault
              </h1>

              <p className="max-w-md text-lg text-gray-700">
                Save, organize, and access your favorite recipes anytime. Build
                your personal recipe collection in one secure place.
              </p>

              <Link
                to="/register"
                className="inline-block px-6 py-3 font-medium text-white transition bg-black rounded-lg hover:bg-gray-800"
              >
                Create Account
              </Link>
            </div>

            {/* Right image */}
            <figure className="justify-center hidden md:flex md:justify-end">
              <img
                src={HeroImg}
                alt="hero-image"
                className="w-full max-w-[700px] mix-blend-multiply"
              />
            </figure>
          </div>
        </div>
      </section>
      {/* <section className="flex items-center justify-between px-14 mt-10 mb-16 2xl:px-40 [@media(min-width:1750px)]:px-52 [@media(min-width:1900px)]:px-64">
        <div className="w-full">
          <SearchBox />
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center px-5 py-2 space-x-1 bg-[#DE3163] rounded-lg text-white"
            onClick={() => setIsFiltersModalOpen(true)}
          >
            <CiFilter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <div className="relative">
            <button
              className="flex items-center px-5 py-2 space-x-1 bg-[#DE3163] rounded-lg text-white"
              onClick={() => setIsSortingOpen((prev) => !prev)}
            >
              <FaSort className="w-5 h-5" />
              <span>Sort</span>
            </button>

            {isSortingOpen && (
              <div className="absolute right-0 w-56 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                  onClick={() => handleSortChange("name")}
                >
                  Sort by Name
                </button>
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                  onClick={() => handleSortChange("createdAt")}
                >
                  Sort by Date
                </button>
                <div className="px-4 py-2 mt-1">
                  <label className="block text-left">Sort Order</label>
                  <div className="flex mt-3 space-x-4">
                    <label className="text-center">
                      <input
                        type="radio"
                        value="asc"
                        checked={isAscending === true}
                        onChange={() => handleSortOrderChange(true)}
                        className="mr-2"
                      />
                      Ascending
                    </label>
                    <label className="text-center">
                      <input
                        type="radio"
                        value="desc"
                        checked={isAscending === false}
                        onChange={() => handleSortOrderChange(false)}
                        className="mr-2"
                      />
                      Descending
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}

      <section className="mt-20 mb-6 px-14">
        <div className="flex items-center justify-between my-10">
          <h2 className="text-3xl font-semibold">Recipes</h2>
          <div className="w-1/2">
            <SearchBox />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between w-full gap-3">
          {categoriesDropdown.map((category) => (
            <button
              key={category}
              className="flex items-center px-4 py-2 space-x-1   bg-[#DE3163] rounded-lg text-white hover:bg-[#c52a56] transition"
              onClick={() => setIsFiltersModalOpen(true)}
            >
              <span>{category}</span>
              <FaChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
      </section>
      <section className="flex justify-between my-8 px-14">
        <div className="flex items-center gap-2 text-sm">
          <span className="px-4 py-2 bg-green-200 rounded-2xl">Breakfast</span>
          <span className="px-4 py-2 bg-green-200 rounded-2xl">
            Slow Cooker
          </span>
          <span className="px-4 py-2 bg-green-200 rounded-2xl">Beverages</span>
        </div>
        <div>
          <select
            name="light-sorting"
            className="px-6 py-3 text-base transition bg-white border rounded-lg shadow-sm cursor-pointer b focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </section>
      <div className=" xl:px-10  2xl:px-36 [@media(min-width:1000px)]: [@media(min-width:1750px)]:px-48 [@media(min-width:1900px)]:px-56">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-[70vh]">
            <ClipLoader color="#0a0301" size={50} />
          </div>
        ) : (
          <div className="grid px-4 gap-x-6 md:grid-cols-2 xl:grid-cols-3 gap-y-10 ">
            <>
              {recipes?.map((recipe: Recipe, index: number) => (
                <Link
                  className=""
                  to={`/recipe/${recipe.id}`}
                  key={index}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <div className="w-full h-full bg-white rounded-2xl hover:shadow-md hover:bg-gray-50">
                    <figure className="h-72 rounded-2xl">
                      <img
                        src={recipe?.imageUrl}
                        alt="recipe image"
                        className="object-cover w-full h-full rounded-t-2xl"
                      />
                    </figure>
                    <div className="px-3 pb-4 mt-2 space-y-2 card-body">
                      <h3 className="text-xl ">{recipe?.name}</h3>
                      <div className="flex items-center gap-2">
                        {recipe.categories
                          ?.slice(0, 2)
                          .map((category: Category) => (
                            <span
                              key={category.slug}
                              className="px-3 py-1 text-sm bg-green-300 rounded-xl"
                            >
                              {category.name}
                            </span>
                          ))}
                      </div>
                      <div className="flex gap-3 basic-info ">
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <MdAccessTime className="w-4 h-4" />
                          </div>
                          <span>{recipe?.cookingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <PiForkKnifeFill className="w-4 h-4" />
                          </div>
                          <span>{recipe?.servingSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <FaStar className="w-4 h-4" fill="yellow" />
                          </div>
                          <span>{recipe?.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          </div>
        )}
        <div ref={ref} className="flex justify-center my-4">
          {showSpinner || isFetchingNextPage ? (
            <CgSpinner className="w-10 h-10 mr-3 animate-spin" fill="orange" />
          ) : null}
        </div>
      </div>
      {/* MODALS */}
      {isFiltersModalOpen && (
        <Modal onClose={handleFiltersModalClose}>
          <h1 className="mb-4 ml-5 text-2xl font-bold">Filter by Categories</h1>
          <div className="grid grid-cols-4 px-6 my-16 gap-y-4">
            {!categories || isPending ? (
              <p>Loading...</p>
            ) : (
              <>
                {categories.map((category: Category) => (
                  <div key={category.id} className="flex items-center text-lg">
                    <input
                      type="checkbox"
                      id={category.name}
                      value={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                      className="w-5 h-5 mr-2"
                    />
                    <label htmlFor={category.name}>{category.name}</label>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 text-white bg-green-500 rounded-lg"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default HomePage;
