import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5028/api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const recipes = await response.json();
        setRecipes(recipes);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); // Access the `message` property safely
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Hello there, this is the home page!</h1>
      <Button variant="destructive" className="bg-blue-600">
        Click me
      </Button>

      <div className="h-screen px-20">
        <div className="grid h-full grid-cols-3 border border-blue-700 justify-items-center">
          {recipes.map((recipe: Recipe) => (
            <div key={recipe.id} className="border border-black w-96 h-[370px]">
              <figure className="w-full h-64 border border-red-700">
                <img
                  src={`http://localhost:5028/images/recipes/${recipe.imageFileName}`}
                  alt={recipe.name}
                  className="w-full h-full rounded"
                />
              </figure>

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
                <FaStar className="w-6 h-6" fill="#FFF100" />
                <FaStar className="w-6 h-6" />
                <FaStar className="w-6 h-6" />
                <FaStar className="w-6 h-6" />
                <FaStar className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
