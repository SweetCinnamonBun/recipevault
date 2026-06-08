import RecipeCard from "@/components/RecipeCard";
import RecipeStars from "@/components/RecipeStars";
import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { FaHeart, FaStar, FaTrash } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/favorites/my-favorites", {
          method: "GET",
          credentials: "include", // Ensures cookies are sent
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="px-4 mb-20 md:px-14 lg:px-24 xl:px-44 2xl:px-60">
      <h1 className="flex items-center py-2 mt-10 text-2xl text-center bg-white rounded-lg w-52 ">
        <FaHeart className="w-6 h-6 mx-3 text-red-500" /> Your Favorites
      </h1>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[70vh]">
          <ClipLoader color="#0a0301" size={50} />
        </div>
      ) : recipes.length === 0 ? (
         <div className="grid place-items-center h-96">
              <h2 className="text-xl font-semibold">Your favorites will be listed here.</h2>
            </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-14 ">
          {recipes.map((recipe: Recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
