import RecipeStars from "@/components/RecipeStars";
import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { FaBook, FaHeart, FaStar, FaTrash } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router-dom";

const UsersRecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5028/api/recipes/my-recipes",
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

  const handleDeleteRecipe = async (recipeId: number, imageUrl: string) => {
    try {
      const fileName = imageUrl.split("/").pop();
      const response = await fetch(
        `http://localhost:5028/api/images/delete?fileName=${fileName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const recipeDeletion = await fetch(
          `http://localhost:5028/api/recipes/${recipeId}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (recipeDeletion.ok) {
          setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
          alert("Recipe deleted successfully");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="2xl:px-20">
      <h1 className="flex items-center py-2 mt-10 ml-8 text-2xl text-center bg-white rounded-lg w-52">
        <FaBook className="w-6 h-6 mx-3 text-green-500" /> Your Recipes
      </h1>
      <div className="grid grid-cols-3 mt-14 gap-y-10 justify-items-center">
        {recipes.map((recipe: Recipe) => (
          <div
            key={recipe.id}
            className=" w-96 h-[382px] bg-white rounded-xl cursor-pointer"
          >
            <Link to={`/recipe/${recipe.id}`}>
              <figure className="w-full h-60 ">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full rounded-t-xl"
                />
              </figure>
            </Link>
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
              <div className="flex justify-between pt-2">
                <RecipeStars averageRating={recipe.averageRating || 4} />

                <div className="flex justify-center py-2 mr-5 bg-red-100 rounded-lg w-11 hover:bg-red-500">
                  <FaTrash
                    className="w-6 h-6 text-black"
                    onClick={() =>
                      handleDeleteRecipe(recipe.id, recipe.imageUrl)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersRecipesPage;
