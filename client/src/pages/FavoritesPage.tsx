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
          "http://localhost:5028/api/favorites/my-favorites",
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
    <div className="2xl:px-20">
      <h1 className="flex items-center py-2 mt-10 ml-8 text-2xl text-center bg-white rounded-lg w-52">
        <FaHeart className="w-6 h-6 mx-3 text-red-500" /> Your Favorites
      </h1>
      <div className="grid grid-cols-3 mt-14 gap-y-10 justify-items-center">
        {recipes.map((recipe: Recipe) => (
          <Link to={`/recipe/${recipe.id}`} key={recipe.name}>
            <div
              key={recipe.id}
              className=" w-96 h-[382px] bg-white rounded-xl cursor-pointer"
            >
              <figure className="w-full h-60 ">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full rounded-t-xl"
                />
              </figure>
              <div className="px-3">
                <h2 className="py-2 text-xl text-red-700">{recipe.name}</h2>
                <div className="flex gap-5">
                  <div className="flex gap-1">
                    <MdAccessTime className="w-7 h-7" />
                    <p>{recipe.cookingTime}</p>
                  </div>
                  <div className="flex gap-1">
                    <PiForkKnifeFill className="w-7 h-7" />
                    <p>{recipe.cookingTime}</p>
                  </div>
                </div>
                <div className="flex pt-2 ">
                  <RecipeStars averageRating={recipe.averageRating || 4} />
                  {/* <FaStar className="w-6 h-6" fill="#FFF100" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" /> */}
                   
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
