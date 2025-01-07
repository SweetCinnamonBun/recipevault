import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MdAccessTime } from "react-icons/md";
import { PiShootingStarLight } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

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

  return (
    <div className="flex flex-col items-center">
      <h1 className="my-5 text-3xl">{recipe?.name}</h1>
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
            <span className="text-lg">Easy</span>
            <span className="text-md">Difficulty</span>
          </div>
        </div>
      </div>
      <figure className="w-3/4">
        <img
          src={`http://localhost:5028/images/recipes/${recipe?.imageFileName}`}
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
        <FaHeart className="w-7 h-7" />
        <span>Add to your favorites</span>
      </div>
    </div>
  );
};

export default RecipePage;
