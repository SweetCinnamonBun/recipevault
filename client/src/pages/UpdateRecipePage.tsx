import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MdAccessTime } from "react-icons/md";
import { PiShootingStarLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaHeart, FaStar } from "react-icons/fa";
import { Recipe } from "@/types/Recipe";

const UpdateRecipePage = () => {
  type AddIngredient = {
    quantity: string;
    unit: string;
    name: string;
  };

  type AddInstruction = {
    text: string;
  };

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [newIngredient, setNewIngredient] = useState<AddIngredient>({
    quantity: "",
    unit: "",
    name: "",
  });
  const [newInstruction, setNewInstruction] = useState<AddInstruction>({
    text: "",
  });

  const navigate = useNavigate();

  const { id } = useParams();

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


  const handleUpdateRecipe = async () => {
    if (!recipe) return;
  
    // Ensure all required fields are present
    if (!recipe.name || !recipe.difficulty || !recipe.cookingTime || !recipe.description) {
      console.error("Missing required fields");
      return;
    }
  
    // Create FormData object
    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("description", recipe.description);
    formData.append("cookingTime", recipe.cookingTime);
    formData.append("difficulty", recipe.difficulty);
  
    // Append image file only if it exists
    if (recipe.imageFileName) {
      formData.append("imageFile", recipe.imageFileName);
    }
  
    try {
      const response = await fetch(`http://localhost:5028/api/recipes/${id}`, {
        method: "PUT",
        body: formData, // No need to set Content-Type; fetch will handle it
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update recipe:", errorData);
        return;
      }
  
      console.log("Recipe updated successfully");
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };
  
  

  const handleDeleteIngredient = (indexToDelete: number) => {
    if (!recipe) return;

    const updatedIngredients = recipe.ingredients.filter(
      (_, index) => index !== indexToDelete
    );
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleDeleteInstruction = (indexToDelete: number) => {
    if (!recipe) return;

    const updatedInstructions = recipe.instructions.filter(
      (_, index) => index !== indexToDelete
    );
    setRecipe({ ...recipe, instructions: updatedInstructions });
  };


  const handleAddIngredient = () => {
    if (!recipe || !newIngredient.name.trim()) return;

    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newIngredient]
    });
    setNewIngredient({ quantity: "", unit: "", name: "" });
  }

  const handleAddInstruction = () => {
    if (!recipe || !newInstruction.text.trim()) return;

    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, newInstruction]
    })
    setNewInstruction({ text: "" });
  }

  
  return (
    <div className="flex flex-col items-center">
      <h1 className="w-full py-2 mt-5 mb-20 text-4xl italic text-center bg-white rounded-lg">
        Update Recipe
      </h1>
      <input type="text" value={recipe?.name} className="w-3/4 px-4 py-2 my-5 text-3xl" onChange={(e) => {
        if (!recipe) return;
        setRecipe({...recipe, name: e.target.value})
      }}/>

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

      <section className="w-11/12 mb-20 mt-28">
        <textarea
          className="w-full p-4 text-xl bg-white shadow-lg rounded-xl h-96"
          value={recipe?.description}
          onChange={(e) => {
            if (!recipe) return;
            setRecipe({ ...recipe, description: e.target.value });
          }}
          placeholder="Recipe description"
        />
      </section>
      <section className="grid w-11/12 grid-cols-2 p-4 gap-x-8">
        <div className="flex flex-col mt-4 gap-y-2">
          <input
            type="text"
            placeholder="Quantity"
            value={newIngredient.quantity}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, quantity: e.target.value })
            }
            className="p-2 border border-gray-400 rounded"
          />
          <select
            value={newIngredient.unit}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, unit: e.target.value })
            }
            className="h-10 p-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="" disabled>
              Select Unit
            </option>
            <option value="g">Grams (g)</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="ml">Milliliters (ml)</option>
            <option value="L">Liters (L)</option>
            <option value="tsp">Teaspoon (tsp)</option>
            <option value="tbsp">Tablespoon (tbsp)</option>
            <option value="cup">Cup</option>
            <option value="oz">Ounces (oz)</option>
            <option value="lb">Pounds (lb)</option>
            <option value="pcs">Pieces (pcs)</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={newIngredient.name}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, name: e.target.value })
            }
            className="p-2 border border-gray-400 rounded"
          />
          <button
            onClick={handleAddIngredient}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Add Ingredient
          </button>
        </div>
        <div className="flex flex-col justify-between mt-4 gap-y-2">
            <textarea
              placeholder="Instruction"
              value={newInstruction.text}
              onChange={(e) =>
                setNewInstruction({ ...newInstruction, text: e.target.value })
              }
              className="w-full h-full p-2 border border-gray-400 rounded"
            />
            <button
              onClick={handleAddInstruction}
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Instruction
            </button>
          </div>
      </section>
      <section className="grid w-11/12 grid-cols-2 gap-x-8 p-4 h-[750px]">
        {/* Ingredients Section */}
        <div className="p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
          <h2 className="my-2 text-2xl font-bold">Ingredients</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between text-xl">
                <div>
                  <span>{ingredient.quantity} </span>
                  <span>{ingredient.unit} </span>
                  <span>{ingredient.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteIngredient(index)}
                  className="px-2 py-1 ml-4 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
          <h2 className="my-2 text-2xl font-bold">Instructions</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.instructions.map((instruction, index) => (
              <li key={index} className="text-xl">
                <div className="flex justify-between">
                  <span>{instruction.text}</span>
                  <button
                    onClick={() => handleDeleteInstruction(index)}
                    className="px-2 py-1 ml-4 text-white bg-red-500 rounded"
                  >
                    Delete
                  </button>
                </div>
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
