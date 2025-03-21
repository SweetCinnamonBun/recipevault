import { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addIngredients, addInstructions } from "@/store/recipeSlice";
import { useDispatch } from "react-redux";

type AddIngredient = {
  quantity: string;
  unit: string;
  name: string;
};

type AddInstruction = {
  text: string;
};

const CreateIngredientsAndInstructionsPage = () => {
  const [ingredients, setIngredients] = useState<AddIngredient[]>([]);
  const [instructions, setInstructions] = useState<AddInstruction[]>([]);
  const [newIngredient, setNewIngredient] = useState<AddIngredient>({
    quantity: "",
    unit: "",
    name: "",
  });
  const [newInstruction, setNewInstruction] = useState<AddInstruction>({
    text: "",
  });

  const dispatch = useDispatch();

  const handleSubmit2 = () => {
    dispatch(addIngredients(ingredients));
    dispatch(addInstructions(instructions));
    console.log("Ingredients and instructions added to Redux store!");
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/recipe-preview");
  };

  const recipeId = useSelector((state: RootState) => state.recipe.id);
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({ quantity: "", unit: "", name: "" });
    }
  };

  const handleAddInstruction = () => {
    if (newInstruction.text.trim()) {
      setInstructions([...instructions, newInstruction]);
      setNewInstruction({ text: "" });
    }
  };

  const handleSubmit = async () => {
    try {
      // Make POST requests for ingredients and instructions
      const [ingredientsResponse, instructionsResponse] = await Promise.all([
        fetch(
          `/api/ingredients/bulk?recipeId=${recipeId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ingredients),
          }
        ),
        fetch(
          `/api/instructions/bulk?recipeId=${recipeId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(instructions),
          }
        ),
      ]);

      if (ingredientsResponse.ok && instructionsResponse.ok) {
        console.log("Ingredients and instructions added successfully!");
        // Navigate or update state as needed
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate("/recipe-preview");
        
      } else {
        console.error("Failed to add ingredients or instructions.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4">
      <h1 className="w-full py-2 mt-5 text-4xl italic text-center bg-white rounded-lg mb-14">
        Create Ingredients and Instructions
      </h1>
      <section className="grid w-11/12 grid-cols-2 p-4  gap-x-8 min-h-[700px]">
        {/* Ingredients Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="my-2 text-2xl font-bold">Ingredients</h2>
          {/* Preview Section */}
          <ul className="p-2 space-y-4 list-disc">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="space-x-2 text-xl">
                <span>{ingredient.quantity}</span>
                <span>{ingredient.unit}</span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
          {/* Input Section */}
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
              className="h-10 p-2 bg-white border border-gray-400 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
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
              className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Add Ingredient
            </button>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="my-2 text-2xl font-bold">Instructions</h2>
          {/* Preview Section */}
          <ul className="p-2 space-y-4 list-disc">
            {instructions.map((instruction, index) => (
              <li key={index} className="text-xl">
                {instruction.text}
              </li>
            ))}
          </ul>
          {/* Input Section */}
          <div className="flex flex-col mt-4 gap-y-2">
            <textarea
              placeholder="Instruction"
              value={newInstruction.text}
              onChange={(e) =>
                setNewInstruction({ ...newInstruction, text: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded"
            />
            <button
              onClick={handleAddInstruction}
              className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Add Instruction
            </button>
          </div>
        </div>
      </section>
      <div className="my-10">
        <button onClick={handleSubmit2} className="px-4 py-2 text-lg bg-green-400 rounded-lg">Confirm</button>
      </div>
    </div>
  );
};

export default CreateIngredientsAndInstructionsPage;
