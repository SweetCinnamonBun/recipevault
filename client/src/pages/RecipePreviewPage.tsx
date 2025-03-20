import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill, PiShootingStarLight } from "react-icons/pi";
import { FaHeart, FaStar } from "react-icons/fa";
import { Recipe } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const RecipePreviewPage = () => {
  const recipe = useSelector((state: RootState) => state.recipe);
  const ingredients = useSelector((state:RootState) => state.recipe.ingredients)
  const instructions = useSelector((state:RootState) => state.recipe.instructions);
  const recipeId = useSelector((state: RootState) => state.recipe.id);

  const navigate = useNavigate();

  // const [recipe, setRecipe] = useState<Recipe | null>(null);
  // const id = 1;

  // useEffect(() => {
  //   const fetchRecipe = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5028/api/recipes/${id}`);
  //       const data = await response.json();
  //       console.log(data);
  //       setRecipe(data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchRecipe();
  // }, [id]);

  const handleSubmit = async () => {
    try {
      // Make POST requests for ingredients and instructions
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
        console.log("Ingredients and instructions added successfully!");
        toast("Recipe created successfully!");
        navigate("/");
      } else {
        console.error("Failed to add ingredients or instructions.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="w-full py-2 mt-5 mb-20 text-4xl italic text-center bg-white rounded-lg">Recipe Preview</h1>
      <h1 className="my-5 text-3xl">{recipe?.name}</h1>
      <div className="flex justify-between px-5 py-5 mt-2 mb-8 w-96 gap-x-5">
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
              <div className="">
                <div className="flex flex-col items-center">
                  <PiForkKnifeFill className="w-8 h-8" />
                  <span className="text-lg">{recipe?.servingSize}</span>
                  <span className="text-md">Serving Size</span>
                </div>
              </div>
            </div>
      <figure className="w-3/5">
        <img
          src={recipe?.imageUrl}
          alt={recipe?.name}
          className="w-full h-[520px] rounded-xl"
        />
      </figure>
      <section className="w-11/12 mb-20 mt-14">
        <div className="w-full p-8 mx-auto text-xl bg-white shadow-lg h-96 rounded-xl">
          {recipe?.description}
        </div>
      </section>
      <section className="grid w-11/12 grid-cols-2  h-[750px] gap-x-8">
        <div className="p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
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
        <div className="p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
          <h2 className="my-2 text-2xl font-bold">Instructions</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.instructions.map((instruction) => (
              <li className="text-xl">{instruction.text}</li>
            ))}
          </ul>
        </div>
      </section>
      <button className="px-6 py-3 text-xl bg-green-400 rounded-lg my-14" onClick={handleSubmit}>Create Recipe</button>
    </div>
  );
};

export default RecipePreviewPage;
