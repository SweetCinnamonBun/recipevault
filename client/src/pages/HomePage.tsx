import { Category, Recipe } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CgSpinner } from "react-icons/cg";
import { ClipLoader } from "react-spinners";
import HeroImg from "@/assets/images/pexels-ella-olsson-572949-1640777.jpg";
import { IoFastFood } from "react-icons/io5";

const HomePage = () => {
  const { ref, inView } = useInView();
  const [showSpinner, setShowSpinner] = useState(false);

  const fetchRecipes = async (page: number, pageSize: number) => {
    const response = await fetch(
      `/api/recipes?page=${page}&pageSize=${pageSize}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    return response.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["popular-recipes"],
      queryFn: ({ pageParam = 1 }) => fetchRecipes(pageParam, 6),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = lastPage?.totalPages;
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
      }, 100);
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const recipes: Recipe[] = data?.pages.flatMap((page) => page.recipes) ?? [];

  return (
    <section>
      {/* HERO */}
      <section className="w-full bg-[#fcfafa] h-[580px] flex items-center px-14">
        <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] w-full">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
              RecipeVault
            </h1>

            <p className="max-w-md text-lg text-gray-700">
              Save, organize, and access your favorite recipes anytime. Build
              your personal recipe collection in one secure place.
            </p>

            <Link
              to="/register"
              className="inline-block px-6 py-3 text-white transition bg-black rounded-lg hover:bg-gray-800"
            >
              Create Account
            </Link>
          </div>

          <figure className="justify-end hidden md:flex">
            <img
              src={HeroImg}
              alt="Hero"
              className="w-full max-w-[700px] mix-blend-multiply"
            />
          </figure>
        </div>
      </section>

      {/* POPULAR RECIPES */}
      <section className="mt-20 mb-10 px-14">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold">Popular Recipes</h2>

          <Link
            to="/all-recipes"
            className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-white transition bg-red-600 rounded-xl hover:bg-red-300 hover:text-black"
          >
            Explore Recipes
            <IoFastFood className="w-6 h-6"  />
          </Link>
        </div>

        <div className="">
          {isLoading ? (
            <div className="flex items-center justify-center h-[70vh]">
              <ClipLoader color="#0a0301" size={50} />
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.id}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <div className="h-full bg-white rounded-2xl hover:shadow-md hover:bg-gray-50">
                    <figure className="h-72">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="object-cover w-full h-full rounded-t-2xl"
                      />
                    </figure>

                    <div className="px-4 pb-4 mt-2 space-y-2">
                      <h3 className="text-xl font-medium">{recipe.name}</h3>

                      <div className="flex gap-2">
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

                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MdAccessTime />
                          <span>{recipe.cookingTime}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <PiForkKnifeFill />
                          <span>{recipe.servingSize}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          <span>{recipe.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div ref={ref} className="flex justify-center my-6">
            {(showSpinner || isFetchingNextPage) && (
              <CgSpinner className="w-10 h-10 animate-spin" />
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default HomePage;
