import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import SearchBox from "@/components/SearchBox";
import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";

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
      <section className="flex items-center justify-between mt-10 mb-16">
        <div className="space-x-2">
          <label htmlFor="itemsPerPage">Items per page: </label>
          <select
            name="itemsPerPage"
            id="itemsPerPage"
            className="px-2 py-3 bg-white border border-gray-600 rounded-lg"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="flex items-center space-x-3">
        <SearchBox />
          <div className="flex items-center px-4 py-2 space-x-1 bg-blue-400 rounded-lg">
            <CiFilter className="w-5 h-5" />
            <span>Filters</span>
          </div>
          <div className="flex items-center px-4 py-2 space-x-1 bg-blue-400 rounded-lg">
            <FaSort className="w-5 h-5" />
            <span>Sort</span>
          </div>
        </div>
      </section>
      <div className="h-screen 2xl:px-20">
        <div className="grid h-full grid-cols-3 border border-blue-700 justify-items-center">
          {recipes.map((recipe: Recipe) => (
            <Link to={`/recipe/${recipe.id}`} key={recipe.name}>
              <div
                key={recipe.id}
                className=" w-96 h-[382px] bg-white rounded-xl cursor-pointer"
              >
                <figure className="w-full h-60 ">
                  <img
                    src={`http://localhost:5028/images/recipes/${recipe.imageFileName}`}
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
                    <FaStar className="w-6 h-6" fill="#FFF100" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
