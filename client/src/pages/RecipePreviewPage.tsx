import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MdAccessTime } from "react-icons/md";
import { PiShootingStarLight } from "react-icons/pi";
import { FaHeart, FaStar } from "react-icons/fa";
import { Recipe } from "@/types/Recipe";
import { useEffect, useState } from "react";

const RecipePreviewPage = () => {
  const recipes = useSelector((state: RootState) => state.recipe);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const id = 1;

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
            <span className="text-lg">{recipe?.difficulty}</span>
            <span className="text-md">Difficulty</span>
          </div>
        </div>
      </div>
      <figure className="w-3/5">
        <img
          src={`http://localhost:5028/images/recipes/${recipe?.imageFileName}`}
          alt={recipe?.name}
          className="w-full h-full rounded-xl"
        />
      </figure>
      <section className="my-10">
        <div className="w-11/12 p-8 mx-auto text-xl bg-white shadow-lg h-96 rounded-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis officia
          maiores repellat hic reiciendis delectus magnam quisquam! Ipsum magni
          recusandae accusamus exercitationem repellat. Libero reprehenderit hic
          laborum expedita, ab eaque. Quod, sequi.
        </div>
      </section>
      <section className="grid w-11/12 grid-cols-2  h-[750px] gap-x-8 p-4 ">
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
      <section className="w-full my-10">
        <div className="w-11/12 p-8 mx-auto rounded-lg bg-[#FFF7F3] shadow-lg">
          <h2 className="text-2xl font-bold">Shopping List</h2>
          <ul className="mt-6 space-y-3">
            {recipe?.ingredients.map((ingredient) => (
              <li className="text-xl list-square">
                <span>{ingredient.name}</span>
                <span className="ml-2 mr-1">
                  ({ingredient.quantity} {ingredient.unit})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default RecipePreviewPage;
