import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { FaBook, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Category, Recipe, RecipeUpdate } from "@/types/Recipe";
import Modal from "@/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "@/lib/api/agent";
import { toast } from "react-toastify";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecipeSchema, recipeSchema } from "@/lib/schemas/recipeSchema";
import { useCategories } from "@/lib/hooks/useCategories";
import { useDropzone } from "react-dropzone";
import { ClipLoader } from "react-spinners";
import { useImages } from "@/lib/hooks/useImages";

type AddIngredient = { quantity: string; unit: string; name: string };
type AddInstruction = { text: string };

const UpdateRecipePage = () => {
    const { id } = useParams();
  const { recipe, updateRecipe } = useRecipes(id);
  const { categories } = useCategories();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [servingSize, setServingSize] = useState(1);
  const [cookingTimeValue, setCookingTimeValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState("min");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<AddIngredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<AddIngredient>({
    quantity: "",
    unit: "",
    name: "",
  });
  const [instructions, setInstructions] = useState<AddInstruction[]>([]);
  const [newInstruction, setNewInstruction] = useState<AddInstruction>({ text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const {postImage} = useImages()

  // Load recipe into state
  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setDescription(recipe.description);
      setDifficulty(recipe.difficulty);
      setServingSize(recipe.servingSize);
      setSelectedCategories(recipe.categories || []);
      setIngredients(recipe.ingredients || []);
      setInstructions(recipe.instructions || []);
      setExistingImageUrl(recipe.imageUrl ?? null);

      if (recipe.cookingTime) {
        const [value, unit] = recipe.cookingTime.split(" ");
        setCookingTimeValue(parseInt(value, 10) || 0);
        setTimeUnit(unit || "min");
      }
    }
  }, [recipe]);

  // Dropzone for image
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) setImageFile(acceptedFiles[0]);
    },
  });

  // Helper functions
  const deleteImageByUrl = async (imageUrl: string) => {
    try {
      const fileName = imageUrl.split("/").pop();
      if (!fileName) return;
      const res = await fetch(`/api/images/delete?fileName=${fileName}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete image");
    } catch (err) {
      console.error("Image delete failed:", err);
    }
  };

  const handleCategorySelection = (category: Category) => {
    if (!selectedCategories.find((c) => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryRemoval = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter((c) => c.id !== categoryId));
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity || !newIngredient.unit) return;
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({ quantity: "", unit: "", name: "" });
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    if (!newInstruction.text) return;
    setInstructions([...instructions, newInstruction]);
    setNewInstruction({ text: "" });
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = existingImageUrl || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("ImageFile", imageFile);
        imageUrl = await postImage.mutateAsync(formData);
        if (existingImageUrl) await deleteImageByUrl(existingImageUrl);
      }

      const fullCookingTime = `${cookingTimeValue} ${timeUnit}`;

      const updatedData: RecipeUpdate = {
        name,
        description,
        difficulty,
        servingSize,
        cookingTime: fullCookingTime,
        imageUrl,
        categories: selectedCategories,
        ingredients,
        instructions,
      };

      await updateRecipe.mutateAsync(updatedData);
     
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative">
      <nav className="px-10">
        <h1 className="flex items-center py-2 mt-8 text-2xl text-center bg-white rounded-lg w-52 ">
          <FaPlus className="w-6 h-6 mx-3 text-purple-500" /> Update Recipe
        </h1>
      </nav>

      <div className="flex items-center justify-center  mb-[100px] px-14">
        <form
          encType="multipart/form-data"
          className="w-full px-10 py-4 mt-10 bg-white rounded-lg 2xl:w-10/12"
          onSubmit={handleSubmit}
        >
           {/* Name */}
          <div className="flex flex-col my-4">
            <label className="mb-2 text-lg font-medium">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-300"
              required
            />
          </div>

          {/* Image */}
          <div className="my-4">
            <label className="text-lg font-medium">Upload Image:</label>
            <div
              {...getRootProps()}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center w-full lg:w-1/2 min-h-[300px] hover:bg-green-50 transition relative overflow-hidden my-4"
            >
              <input {...getInputProps()} />
              {imageFile || existingImageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : existingImageUrl!}
                    alt="Recipe"
                    className="object-contain w-full h-full rounded-lg max-h-64"
                  />
                  <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
                      }}
                      className="flex items-center justify-center w-12 h-12 text-white bg-orange-400 rounded hover:bg-orange-500"
                    >
                      <FaEdit className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Drag & drop or click to select an image</span>
              )}
            </div>
          </div>

          {/* Cooking time */}
          <div className="my-4">
            <label className="flex items-center gap-2 mb-2 text-lg font-medium">Cooking Time:</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                className="w-24 px-4 py-3 transition-shadow border border-gray-300 rounded-lg"
                value={cookingTimeValue}
                onChange={(e) => setCookingTimeValue(Number(e.target.value))}
                required
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="min">Minutes</option>
                <option value="h">Hours</option>
              </select>
            </div>
          </div>

          {/* Difficulty */}
          <div className="my-4">
            <label className="text-lg font-medium">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded-lg"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Serving size */}
          <div className="flex flex-col my-4">
            <label className="text-lg font-medium">Serving Size:</label>
            <input
              type="number"
              value={servingSize}
              onChange={(e) => setServingSize(Number(e.target.value))}
              className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="my-4">
            <label className="text-lg font-medium">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <h2 className="mt-10 mb-2 text-2xl underline">Categories</h2>
          <div className="">
            <div className="w-[550px] bg-white  h-full py-4 ">
              <h1 className="text-lg">Selected Categories:</h1>
              <div className="flex flex-wrap gap-2 my-5 gap-y-3">
                {selectedCategories?.map((category, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-lg cursor-pointer text-md bg-gradient-to-r from-green-300 to-green-400 hover:bg-red-400"
                    onClick={() => handleCategoryRemoval(category.id)}
                  >
                    {category.name} ✕
                  </span>
                ))}
              </div>
              <p className="mx-2 mt-5 italic">Choose categories:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories?.map((category: Category, index: number) => (
                  <span
                    key={index}
                    onClick={() => handleCategorySelection(category)}
                    className="px-4 py-2 rounded-lg cursor-pointer text-md from-orange-200 to-orange-300 bg-gradient-to-r hover:from-orange-200 hover:to-orange-200"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full min-h-screen ">
            <h1 className="w-full py-2 mb-8 text-2xl underline bg-white rounded-lg">
              Create Ingredients and Instructions
            </h1>
            <section className="grid w-full grid-cols-2  gap-x-8 min-h-[700px]">
              {/* Ingredients Section */}
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="my-2 text-2xl font-bold">Ingredients</h2>
                {/* Preview Section */}
                <ul className="p-2 space-y-4">
                  {ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-xl"
                    >
                      <div className="space-x-2">
                        <span>{ingredient.quantity}</span>
                        <span>{ingredient.unit}</span>
                        <span>{ingredient.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                {/* Input Section */}
                <div className="flex flex-col mt-4 gap-y-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newIngredient.name}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        name: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-400 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={newIngredient.quantity}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        quantity: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-400 rounded"
                  />
                  <select
                    value={newIngredient.unit}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        unit: e.target.value,
                      })
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

                  <button
                    type="button"
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

                <ul className="p-2 space-y-4">
                  {instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-xl"
                    >
                      <span>{instruction.text}</span>

                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col mt-4 gap-y-2">
                  <textarea
                    placeholder="Instruction"
                    value={newInstruction.text}
                    onChange={(e) =>
                      setNewInstruction({
                        ...newInstruction,
                        text: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-400 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Add Instruction
                  </button>
                </div>
              </div>
            </section>
          </div>
          <button
            type="submit"
            className={`w-full p-3 text-white transition  rounded-lg hover:bg-blue-600 ${
              isLoading ? "bg-green-100" : "bg-green-500"
            } `}
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              "Update Recipe"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRecipePage;
