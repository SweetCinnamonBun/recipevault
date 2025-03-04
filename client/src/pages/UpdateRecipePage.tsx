import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MdAccessTime } from "react-icons/md";
import { PiShootingStarLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaHeart, FaStar } from "react-icons/fa";
import { Recipe } from "@/types/Recipe";

const UpdateRecipePage = () => {


  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const navigate = useNavigate();

  const {id} = useParams();

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
    }
    fetchRecipe();
  }, [id])

  const handleUpdateRecipe = async () => {
    try {
      // Handle recipe update logic
      const recipeResponse = await fetch(`http://localhost:5028/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (recipeResponse.ok) {
        // Update ingredients and instructions as well
        const [ingredientsResponse, instructionsResponse] = await Promise.all([
          fetch(`http://localhost:5028/api/ingredients/bulk?recipeId=${recipeId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ingredients),
          }),
          fetch(`http://localhost:5028/api/instructions/bulk?recipeId=${recipeId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(instructions),
          }),
        ]);

        if (ingredientsResponse.ok && instructionsResponse.ok) {
          console.log("Ingredients and instructions updated successfully!");
          navigate(`/recipe/${recipeId}`);
        } else {
          console.error("Failed to update ingredients or instructions.");
        }
      } else {
        console.error("Failed to update the recipe.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="w-full py-2 mt-5 mb-20 text-4xl italic text-center bg-white rounded-lg">Update Recipe</h1>
      <h1 className="my-5 text-3xl">{recipe?.name}</h1>

      <div className="flex justify-between px-5 py-5 mt-2 mb-8 w-72">
        <div className="flex flex-col items-center">
          <MdAccessTime className="w-8 h-8" />
          <span className="text-lg">{recipe?.cookingTime}</span>
          <span className="text-md">Cooking time</span>
        </div>
        <div className="flex flex-col items-center">
          <PiShootingStarLight className="w-8 h-8" />
          <span className="text-lg">{recipe?.difficulty}</span>
          <span className="text-md">Difficulty</span>
        </div>
      </div>

      <figure className="w-3/5">
        <img
          src={`http://localhost:5028/images/recipes/${recipe?.imageFileName}`}
          alt={recipe?.name}
          className="w-full h-full rounded-xl"
        />
      </figure>

      <section className="w-11/12 my-10">
        <textarea
          className="w-full p-4 text-xl bg-white shadow-lg h-36 rounded-xl"
          value={recipe?.description}
          onChange={(e) => setUpdatedRecipe({ ...recipe, description: e.target.value })}
          placeholder="Recipe description"
        />
      </section>

      <section className="grid w-11/12 grid-cols-2 gap-x-8 p-4 h-[750px]">
        <div className="p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
          <h2 className="my-2 text-2xl font-bold">Ingredients</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.ingredients.map((ingredient, index) => (
              <li key={index} className="space-x-2 text-xl">
                <span>{ingredient.quantity}</span>
                <span>{ingredient.unit}</span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
          <h2 className="my-2 text-2xl font-bold">Instructions</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.instructions.map((instruction, index) => (
              <li key={index} className="text-xl">{instruction.text}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full my-10">
        <div className="w-11/12 p-8 mx-auto rounded-lg bg-[#FFF7F3] shadow-lg">
          <h2 className="text-2xl font-bold">Shopping List</h2>
          <ul className="mt-6 space-y-3">
            {recipe?.ingredients.map((ingredient, index) => (
              <li key={index} className="text-xl list-square">
                <span>{ingredient.name}</span>
                <span className="ml-2 mr-1">
                  ({ingredient.quantity} {ingredient.unit})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <button
        className="px-6 py-3 my-5 text-xl bg-blue-500 rounded-lg"
        onClick={handleUpdateRecipe}
      >
        Update Recipe
      </button>
    </div>
  );
};

export default UpdateRecipePage;
