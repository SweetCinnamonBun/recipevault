import { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";


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

  const recipeId = useSelector((state: RootState) => state.recipe.id)


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
        // Navigate or update state as needed
      } else {
        console.error("Failed to add ingredients or instructions.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  

  return (
    <div className="flex flex-col items-center w-full">
      <section className="grid w-11/12 h-auto grid-cols-2 p-4 border border-blue-500 gap-x-8">
        {/* Ingredients Section */}
        <div className="p-6 border border-red-600 rounded-lg">
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
            <input
              type="text"
              placeholder="Unit"
              value={newIngredient.unit}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, unit: e.target.value })
              }
              className="p-2 border border-gray-400 rounded"
            />
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
        </div>

        {/* Instructions Section */}
        <div className="p-6 border border-green-700 rounded-lg">
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
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Instruction
            </button>
          </div>
        </div>
      </section>
      <div className="my-5 ">
        <button onClick={handleSubmit} className="px-4 py-2 text-lg bg-green-400">Confirm</button>
      </div>
      {JSON.stringify(ingredients)}
      {JSON.stringify(instructions)}
    </div>
  );
};

export default CreateIngredientsAndInstructionsPage;
