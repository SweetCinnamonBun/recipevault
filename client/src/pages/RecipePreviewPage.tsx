import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill, PiShootingStarLight } from "react-icons/pi";
import { FaHeart, FaStar } from "react-icons/fa";
import { Category, Recipe } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const RecipePreviewPage = () => {
  const recipe = useSelector((state: RootState) => state.recipe);
  const ingredients = useSelector(
    (state: RootState) => state.recipe.ingredients
  );
  const instructions = useSelector(
    (state: RootState) => state.recipe.instructions
  );
  const recipeId = useSelector((state: RootState) => state.recipe.id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setIsLoading(true);
      const [ingredientsResponse, instructionsResponse] = await Promise.all([
        fetch(`/api/ingredients/bulk?recipeId=${recipeId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ingredients),
        }),
        fetch(`/api/instructions/bulk?recipeId=${recipeId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(instructions),
        }),
      ]);

      if (ingredientsResponse.ok && instructionsResponse.ok) {
        setIsLoading(false);
        console.log("Ingredients and instructions added successfully!");
        toast("Recipe created successfully!");
        navigate("/");
      } else {
        console.error("Failed to add ingredients or instructions.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="w-full py-2 mt-5 mb-20 text-4xl italic text-center bg-white rounded-lg">
        Recipe Preview
      </h1>
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
      <figure className="w-full sm:w-3/4 px-1 lg:w-[70%] [@media(min-width:1100px)]:w-[60%] [@media(min-width:1300px)]:w-[50%] 2xl:w-[50%] [@media(min-width:1750px)]:w-[40%]">
        <img
          src={recipe?.imageUrl}
          alt={recipe?.name}
          className="w-full h-[380px] md:h-[520px] rounded-xl"
        />
      </figure>
      <div className="flex flex-wrap justify-center mt-12 gap-y-5">
        {recipe?.categories.map((category: Category, index: number) => (
          <span key={index} className="px-4 py-2 ml-4 bg-[#00FF9C] rounded-lg">
            {category.name}
          </span>
        ))}
      </div>
      <section className="w-11/12 my-10 2xl:px-52">
        <div className="w-full p-8 text-xl bg-white shadow-lg rounded-xl h-96">
          {recipe?.description}
        </div>
      </section>
      <section className="grid w-11/12 gap-y-4 grid-cols-1 md:grid-cols-2  md:h-[750px] gap-x-8 2xl:px-52">
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
      <button
        className={`px-6 py-3 text-xl  rounded-lg my-14 ${
          isLoading ? "bg-green-100" : "bg-green-400"
        }`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        Create Recipe
      </button>
    </div>
  );
};

export default RecipePreviewPage;
