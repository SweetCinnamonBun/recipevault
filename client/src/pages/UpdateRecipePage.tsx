import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MdAccessTime } from "react-icons/md";
import { PiShootingStarLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaHeart, FaPlus, FaStar } from "react-icons/fa";
import { Category, Recipe } from "@/types/Recipe";
import Modal from "@/components/Modal";
import { useRecipes } from "@/lib/hooks/useRecipes";

const UpdateRecipePage = () => {
  type AddIngredient = {
    quantity: string;
    unit: string;
    name: string;
  };

  type AddInstruction = {
    text: string;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [timeUnit, setTimeUnit] = useState("min");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [newIngredient, setNewIngredient] = useState<AddIngredient>({
    quantity: "",
    unit: "",
    name: "",
  });
  const [newInstruction, setNewInstruction] = useState<AddInstruction>({
    text: "",
  });

  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const { id } = useParams();
  const { updateRecipe } = useRecipes(id);

  const handleCategoryModalOpen = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        console.log(data);
        setRecipe(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    // Fetch available categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (recipe) {
      setSelectedCategories(recipe.categories || []);
    }
  }, [recipe]);

  const handleUpdateRecipe = async () => {
    if (!recipe) return;

    // Ensure all required fields are present
    if (
      !recipe.name ||
      !recipe.difficulty ||
      !recipe.cookingTime ||
      !recipe.description
    ) {
      console.error("Missing required fields");
      return;
    }

    let newImageUrl = recipe.imageUrl; // Default to the existing image URL

    // Step 1: Upload the new image (if provided)
    if (newImageFile) {
      const imageFormData = new FormData();
      imageFormData.append("ImageFile", newImageFile);

      try {
        const imageResponse = await fetch(
          "/api/images/upload",
          {
            method: "POST",
            body: imageFormData,
          }
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          newImageUrl = imageData.imageUrl; // Get the new image URL

          // Step 2: Delete the previous image (if it exists)
          if (recipe.imageUrl) {
            const previousImageName = recipe.imageUrl.split("/").pop(); // Extract the file name from the URL
            await fetch(
              `/api/images/delete?fileName=${previousImageName}`,
              {
                method: "DELETE",
              }
            );
          }
        } else {
          console.error("Failed to upload new image.");
          return;
        }
      } catch (error) {
        console.error(
          "An error occurred while uploading the new image:",
          error
        );
        return;
      }
    }


    // Step 3: Prepare the JSON payload
    const requestData = {
      name: recipe.name,
      description: recipe.description,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      servingSize: recipe.servingSize,
      imageUrl: newImageUrl, // Use the new image URL
      categories: recipe.categories || [],
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
    };

    // Step 4: Update the recipe
    try {
      // const response = await fetch(`/api/recipes/${id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(requestData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error("Failed to update recipe:", errorData);
      //   return;
      // }

      // console.log("Recipe updated successfully");

      await updateRecipe.mutateAsync(requestData);
      
      navigate(`/recipe/${id}`,  { replace: true });
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
      ingredients: [...recipe.ingredients, newIngredient],
    });
    setNewIngredient({ quantity: "", unit: "", name: "" });
  };

  const handleAddInstruction = () => {
    if (!recipe || !newInstruction.text.trim()) return;

    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, newInstruction],
    });
    setNewInstruction({ text: "" });
  };

  const handleAddCategory = (category: Category) => {
    if (!recipe) return;

    setRecipe({
      ...recipe,
      categories: [...recipe.categories, category],
    });
  };

  const handleRemoveCategory = (categoryId: number) => {
    if (!recipe) return;

    setRecipe({
      ...recipe,
      categories: recipe.categories.filter((c) => c.id !== categoryId),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="w-full py-2 mt-5 mb-20 text-4xl italic text-center bg-white rounded-lg">
        Update Recipe
      </h1>
      <input
        type="text"
        value={recipe?.name}
        className="w-3/4 px-4 py-2 my-5 text-3xl"
        onChange={(e) => {
          if (!recipe) return;
          setRecipe({ ...recipe, name: e.target.value });
        }}
      />

      <div className="flex items-center justify-between my-4 gap-x-10">
        <div className="">
          <p className="my-2 text-lg font-medium">Cooking Time:</p>
          <div className="flex gap-x-2">
            <input
              type="number"
              className="w-32 px-4 py-3 text-black transition-shadow border border-gray-300 rounded-lg"
              value={recipe?.cookingTime}
              onChange={(e) => {
                if (!recipe) return;
                setRecipe({ ...recipe, cookingTime: e.target.value });
              }}
              required
            />
            <select value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)} className="px-4 py-3 bg-white border border-gray-300 rounded-lg">
              <option value="min">Minutes</option>
              <option value="h">Hours</option>
            </select>
          </div>
        </div>
        <div className="">
          <p className="my-2 text-lg font-medium">Difficulty:</p>
          <select
            value={recipe?.difficulty}
            onChange={(e) => {
              if (!recipe) return;
              setRecipe({ ...recipe, difficulty: e.target.value });
            }}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="flex flex-col my-4">
            <p className="my-2 text-lg font-medium ">Serving Size:</p>
            <input
              type="number"
              className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={recipe?.servingSize}
              onChange={(e) => {
                if (!recipe) return;
                setRecipe({...recipe, servingSize: e.target.value})
              }} 
            
            />
          </div>
      </div>

      <div className="w-full  my-4   sm:w-3/4 px-1 lg:w-[70%] [@media(min-width:1100px)]:w-[60%] [@media(min-width:1300px)]:w-[50%] 2xl:w-[50%] [@media(min-width:1750px)]:w-[40%]">
        <label className="text-lg font-medium">Recipe Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setNewImageFile(e.target.files[0]); // Store the new image file
            }
          }}
          className="hidden"
          id="imageUpload"
        />
        <label
          htmlFor="imageUpload"
          className="cursor-pointer border border-gray-300 rounded-lg p-2 flex items-center justify-center w-full h-[380px] md:h-[520px]  bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden my-4"
        >
          {/* Display the new image if selected, otherwise display the current image */}
          {newImageFile ? (
            <img
              src={URL.createObjectURL(newImageFile)}
              alt="New Recipe"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : recipe?.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt="Current Recipe"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <span className="text-gray-500">Click to upload an image</span>
          )}
        </label>
      </div>

      <div className="flex mt-12 ">
        {recipe?.categories.map((category, index) => (
          <span key={index} className="px-4 py-2 ml-4 bg-[#00FF9C] rounded-lg">
            {category.name}
          </span>
        ))}
        <FaPlus
          className="ml-5 w-9 h-9"
          onClick={() => setIsCategoryModalOpen(true)}
        />
      </div>

      <section className="w-11/12 px-3 mb-20 mt-28 2xl:px-52">
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
      <section className="grid w-11/12 grid-cols-2 py-4 gap-x-8 2xl:px-52">
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
            className="h-10 p-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Add Instruction
          </button>
        </div>
      </section>
      <section className="grid w-11/12 gap-y-4 grid-cols-1 md:grid-cols-2  md:h-[750px] gap-x-8 2xl:px-52">
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
                  className="px-2 py-1 ml-4 text-white bg-red-600 rounded"
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
              <li key={index} className="text-xl ">
                <div className="flex justify-between">
                  <span className="min-w-0 break-words">{instruction.text}</span>
                  <button
                    onClick={() => handleDeleteInstruction(index)}
                    className="self-center px-2 py-1 ml-4 text-white bg-red-600 rounded"
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
  className="px-6 py-3 my-20 text-xl text-white bg-green-500 rounded-lg"
  onClick={() => {
    // Scroll to the top smoothly before updating the recipe
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Call the handleUpdateRecipe function after scrolling
    handleUpdateRecipe();
  }}
>
  Update Recipe
</button>
      {/* MODAL */}
      {isCategoryModalOpen && (
        <Modal onClose={handleCategoryModalClose}>
          <h1 className="mb-4 text-2xl font-bold">Update Categories</h1>
          <p className="my-5">Current Categories:</p>
          <div className="flex flex-wrap gap-y-4">
            {recipe?.categories.map((category, index) => (
              <span
                key={index}
                className="px-4 py-2 ml-4 bg-[#00FF9C] rounded-lg  gap-2"
              >
                {category.name}
                <button
                  className="ml-2 font-bold text-red-500"
                  onClick={() =>
                    category.id && handleRemoveCategory(category.id)
                  }
                >
                  ❌
                </button>
              </span>
            ))}
          </div>

          <p className="my-5">Add categories:</p>
          <div className="flex flex-wrap w-full gap-3">
            {categories.map((c, i) => (
              <span
                key={i}
                className="px-4 py-2 ml-4 bg-[#00FF9C] rounded-lg cursor-pointer"
                onClick={() => handleAddCategory(c)}
              >
                {c.name}
              </span>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 text-white bg-black rounded-lg"
              onClick={handleCategoryModalClose}
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UpdateRecipePage;
