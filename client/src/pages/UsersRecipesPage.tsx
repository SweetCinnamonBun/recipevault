import RecipeStars from "@/components/RecipeStars";
import { useImages } from "@/lib/hooks/useImages";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { useUsers } from "@/lib/hooks/useUsers";
import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UsersRecipesPage = () => {
  const { usersRecipes, isLoading } = useUsers();
  const { deleteRecipe } = useRecipes();
  const { deleteImage } = useImages();

  const handleDeleteRecipe = async (recipeId: number, imageUrl: string) => {
    try {
      const fileName = imageUrl.split("/").pop();

      if (fileName) {
        await deleteImage.mutateAsync(fileName);
        await deleteRecipe.mutateAsync(recipeId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the recipe or image.";
      toast.error(errorMessage);
    }
  };

  console.log(usersRecipes);

  return (
    <div className="px-4 2xl:px-20">
      <h1 className="flex items-center py-2 mt-10 text-2xl text-center bg-white rounded-lg w-52 ">
        <FaBook className="w-6 h-6 mx-3 text-green-500" /> Your Recipes
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-14 justify-items-center">
        {isLoading ? (
          <p>Loading users recipes...</p>
        ) : (
          <>
            {usersRecipes?.map((recipe: Recipe) => (
              <div
                key={recipe.id}
                className="w-full max-w-sm h-[420px] bg-white rounded-xl cursor-pointer"
              >
                <Link
                  to={`/recipe/${recipe.id}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <figure className="w-full h-60">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="object-cover w-full h-full rounded-t-xl"
                    />
                  </figure>
                </Link>

                <div className="px-3 py-2">
                  <h2 className="py-2 text-xl text-red-700">{recipe.name}</h2>
                  <div className="flex items-center gap-2">
                    {recipe.categories?.slice(0, 2).map((category) => (
                      <span className="px-3 py-1 bg-[#00FF9C] rounded-lg">
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-5 mt-2">
                    <div className="flex items-center gap-1">
                      <MdAccessTime className="w-7 h-7" />
                      <p>{recipe.cookingTime}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiForkKnifeFill className="w-7 h-7" />
                      <p>{recipe.servingSize}</p>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <RecipeStars averageRating={recipe.averageRating || 0} />
                    <div className="flex">
                      <Link to={`/update-recipe/${recipe.id}`}>
                        <div className="flex justify-center py-2 mr-5 bg-green-100 rounded-lg cursor-pointer w-11 hover:bg-green-500">
                          <FaEdit className="w-6 h-6 text-black" />
                        </div>
                      </Link>
                      <div className="flex justify-center py-2 mr-5 bg-red-100 rounded-lg cursor-pointer w-11 hover:bg-red-500">
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
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersRecipesPage;
