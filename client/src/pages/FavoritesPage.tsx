import RecipeStars from "@/components/RecipeStars";
import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { FaHeart, FaStar, FaTrash } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "/api/favorites/my-favorites",
          {
            method: "GET",
            credentials: "include", // Ensures cookies are sent
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="px-4 2xl:px-20">
          <h1 className="flex items-center py-2 mt-10 text-2xl text-center bg-white rounded-lg w-52 ">
            <FaHeart className="w-6 h-6 mx-3 text-red-500" /> Your Favorites
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-14 justify-items-center">
            {recipes.map((recipe: Recipe) => (
              <div
                key={recipe.id}
                className="w-full max-w-sm h-[382px] bg-white rounded-xl cursor-pointer"
              >
                <Link to={`/recipe/${recipe.id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  <figure className="w-full h-60">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="object-cover w-full h-full rounded-t-xl"
                    />
                  </figure>
                </Link>
                <div className="px-3 py-2">
                  <h2 className="text-xl text-red-700">{recipe.name}</h2>
                  <div className="flex gap-5 mt-2">
                    <div className="flex items-center gap-1">
                      <MdAccessTime className="w-7 h-7" />
                      <p>{recipe.cookingTime}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiForkKnifeFill className="w-7 h-7" />
                      <p>{recipe.cookingTime}</p>
                    </div>
                  </div>
                  <div className="flex pt-2 ">
                    <RecipeStars averageRating={recipe.averageRating || 0} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
};

export default FavoritesPage;
