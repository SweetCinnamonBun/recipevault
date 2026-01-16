import { useUsers } from "@/lib/hooks/useUsers";
import { Recipe } from "@/types/Recipe";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router";

type UsersRecipesProps = {
  handleDelete: (recipeId: number, imageUrl: string) => Promise<void>;
};

const UsersRecipes = ({ handleDelete }: UsersRecipesProps) => {
  const { usersRecipes } = useUsers();

  return (
    <>
      {usersRecipes?.map((recipe: Recipe) => (
        <div
          key={recipe.id}
          className="w-full h-[402px] bg-white rounded-xl cursor-pointer"
        >
          <Link
            to={`/recipe/${recipe.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <figure className="w-full h-52">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-t-xl "
              />
            </figure>
          </Link>

          <div className="px-3 py-2">
            <h2 className="py-2 text-xl text-red-700">{recipe.name}</h2>
            <div className="flex items-center gap-2">
              {recipe.categories?.slice(0, 2).map((category) => (
                <span
                  className="px-2 py-1 text-sm bg-[#00FF9C] rounded-lg"
                  key={category.id}
                >
                  {category.name}
                </span>
              ))}
            </div>
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-1">
                <MdAccessTime className="w-5 h-5" />
                <p>{recipe.cookingTime}</p>
              </div>
              <div className="flex items-center gap-1">
                <PiForkKnifeFill className="w-5 h-5" />
                <p>{recipe.servingSize}</p>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <div className="flex justify-end w-full">
                <Link to={`/update-recipe/${recipe.id}`}>
                  <div className="flex justify-center py-2 mr-5 bg-green-100 rounded-lg cursor-pointer w-11 hover:bg-green-500">
                    <FaEdit className="w-5 h-5 text-black" />
                  </div>
                </Link>
                <div className="flex justify-center py-2 mr-5 bg-red-100 rounded-lg cursor-pointer w-11 hover:bg-red-500">
                  <FaTrash
                    className="w-5 h-5 text-black"
                    onClick={() => handleDelete(recipe.id, recipe.imageUrl)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UsersRecipes;
