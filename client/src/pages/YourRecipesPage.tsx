import RecipeStars from "@/components/RecipeStars";
import UsersRecipes from "@/components/UsersRecipes";
import UsersRecipesSkeleton from "@/components/UsersRecipesSkeleton";
import { useImages } from "@/lib/hooks/useImages";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { useUsers } from "@/lib/hooks/useUsers";
import { Recipe } from "@/types/Recipe";
import React, { Suspense } from "react";
import { FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router";
import { toast } from "react-toastify";

const YourRecipesPage = () => {
  //  const { usersRecipes, isLoading } = useUsers();
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
  return (
    <>
      <nav className="px-10">
        <h1 className="flex items-center py-2 mt-8 text-2xl text-center bg-white rounded-lg w-52 ">
          <FaBook className="w-6 h-6 mx-3 text-green-500" /> Your Recipes
        </h1>
      </nav>
      <main className="px-10 mt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 justify-items-center">
          <>
            <Suspense fallback={<UsersRecipesSkeleton />}>
              <UsersRecipes handleDelete={handleDeleteRecipe} />
            </Suspense>
          </>
        </div>
      </main>
    </>
  );
};

export default YourRecipesPage;
