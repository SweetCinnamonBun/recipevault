import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { MdAccessTime } from "react-icons/md";
import { PiShootingStarLight } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5028/api/recipes/${id}`);
        const data = await response.json();
        console.log(data);
        setRecipe(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) return; // Exit early if no user
  
      try {
        const response = await fetch("http://localhost:5028/api/favorites/my-favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials (cookies or session)
        });
  
        if (!response.ok) {
          console.error("Failed to fetch favorites");
          return;
        }
  
        const favorites = await response.json();
        setIsFavorite(favorites.some((fav: Recipe) => fav.id === parseInt(id!)));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
  
    checkIfFavorite();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    const url = `http://localhost:5028/api/favorites/${id}`;
    const method = isFavorite ? "DELETE" : "POST"; // Toggle between POST (add) and DELETE (remove)

    try {
      const response = await fetch(url, {
        method: method,
        credentials: "include", // Include credentials (cookies) for authentication
      });

      if (response.ok) {
        setIsFavorite((prev) => !prev); // Toggle the state
        alert(isFavorite ? "Recipe removed from favorites" : "Recipe added to favorites");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to toggle favorite.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="my-5 text-3xl">{recipe?.name}</h1>
      <Link to={`/update-recipe/${recipe?.id}`}>
      Update Recipe
      </Link>
      <div className="flex justify-between px-5 py-5 mt-2 mb-8 w-72">
        <div className="">
          <div className="flex flex-col items-center">
            <MdAccessTime className="w-8 h-8" />
            <span className="text-lg">{recipe?.cookingTime}</span>
            <span className="text-md">Cooking time</span>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col items-center">
            <PiShootingStarLight className="w-8 h-8" />
            <span className="text-lg">{recipe?.difficulty}</span>
            <span className="text-md">Difficulty</span>
          </div>
        </div>
      </div>
      <figure className="w-3/5">
        <img
          src={recipe?.imageUrl}
          alt={recipe?.name}
          className="w-full h-full rounded-xl"
        />
      </figure>
      <div>
        <div className="flex mt-5">
          <FaStar className="w-8 h-8" fill="#FFF100" />
          <FaStar className="w-8 h-8" />
          <FaStar className="w-8 h-8" />
          <FaStar className="w-8 h-8" />
          <FaStar className="w-8 h-8" />
        </div>
      </div>
      <div className="flex gap-2 my-8">
        <FaHeart
          className={`w-7 h-7 cursor-pointer ${isFavorite ? "text-red-500" : "text-gray-400"}`}
          onClick={handleFavoriteToggle}
        />
        <span>{isFavorite ? "Remove from favorites" : "Add to your favorites"}</span>
      </div>
      <section className="w-11/12 my-10">
        <div className="w-full p-8 mx-auto text-xl border border-yellow-600 h-96 rounded-xl">
          {recipe?.description}
        </div>
      </section>
      <section className="grid w-11/12 grid-cols-2 border border-blue-500 h-[750px] gap-x-8 p-4">
        <div className="p-6 border border-red-600 rounded-lg">
          <h2 className="my-2 text-2xl font-bold">Ingredients</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.ingredients.map((ingredient) => (
              <li className="space-x-2 text-xl">
                <span>{ingredient.quantity}</span>
                <span>{ingredient.unit}</span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 border border-green-700 rounded-lg ">
          <h2 className="my-2 text-2xl font-bold">Instructions</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.instructions.map((instruction) => (
              <li className="text-xl">{instruction.text}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="w-full my-10 border border-blue-600">
        <div className="w-11/12 p-8 mx-auto border border-red-700 rounded-lg">
          <h2 className="text-2xl font-bold">Shopping List</h2>
          <ul className="mt-6 space-y-3">
            {recipe?.ingredients.map((ingredient) => (
              <li className="text-xl list-square">

                <span>{ingredient.name}</span>
                <span className="ml-2 mr-1">({ingredient.quantity} {ingredient.unit})</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default RecipePage;
