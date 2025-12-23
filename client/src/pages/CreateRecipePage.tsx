import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategories, addIngredients, addInstructions, setRecipe } from "@/store/recipeSlice";
import { useNavigate } from "react-router";
import { useImages } from "@/lib/hooks/useImages";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { recipeSchema, RecipeSchema } from "@/lib/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { Category } from "@/types/Recipe";
import { useCategories } from "@/lib/hooks/useCategories";
import { RootState } from "@/store/store";

type AddIngredient = {
  quantity: string;
  unit: string;
  name: string;
};

type AddInstruction = {
  text: string;
};

const CreateRecipePage = () => {
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
  
  
    const handleSubmit2 = () => {
      dispatch(addIngredients(ingredients));
      dispatch(addInstructions(instructions));
      console.log("Ingredients and instructions added to Redux store!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/recipe-preview");
    };
  
    // const recipeId = useSelector((state: RootState) => state.recipe.id);

  
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
  
    const handleSubmit3 = async () => {
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [timeUnit, setTimeUnit] = useState("min");
  const [isLoading, setIsLoading] = useState(false);

  const { postImage } = useImages();
  const { createRecipe } = useRecipes();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeSchema>({
    mode: "onTouched",
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      difficulty: "Easy",
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        setImageFile(acceptedFiles[0]);
      }
    },
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSubmit = async (data: RecipeSchema) => {
    setIsLoading(true);
    let imageUrl = null;

    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append("ImageFile", imageFile);

      try {
        const res = await postImage.mutateAsync(imageFormData);
        imageUrl = res;
      } catch (error) {
        console.error("Image upload failed:", error);
        setIsLoading(false);
        return;
      }
    }

    const fullCookingTime = `${data.cookingTime} ${timeUnit}`;

    const recipeData = {
      ...data,
      cookingTime: fullCookingTime,
      imageUrl,
    };

    try {
      const response = await createRecipe.mutateAsync(recipeData);
      dispatch(setRecipe(response));
      navigate("/add-categories");
      reset(); // Reset form values
    } catch (error) {
      console.error("Recipe creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeUnit(e.target.value);
  };

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const recipeId = useSelector((state: RootState) => state.recipe.id);

  const { categories, addCategoriesToRecipe } = useCategories();

  const handleCategorySelection = (category: Category) => {
    if (!selectedCategories.some((c) => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryRemoval = (categoryId: number | undefined) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c.id !== categoryId)
    );
  };

  const handleSubmitCategories = async () => {
    // Extract selected category IDs
    const categoryIds = selectedCategories.map((category) => category.id);

    // Create the JSON body
    const requestBody = {
      recipeId: recipeId,
      categoryIds: categoryIds,
    };

    try {
      await addCategoriesToRecipe.mutateAsync(requestBody);
      const categoriesResponse = await fetch(
        `/api/categories/recipes-categories/${recipeId}`
      );

      if (!categoriesResponse.ok) {
        console.error("Failed to fetch updated categories.");
        return;
      }
      const updatedCategories = await categoriesResponse.json();
      dispatch(addCategories(updatedCategories));
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/ingredients-and-instructions");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center  mb-[100px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="w-3/5 px-10 py-4 mt-20 bg-white rounded-lg"
        >
          <div className="flex flex-col">
            <h2 className="mt-4 mb-4 text-2xl underline">Recipe details</h2>
            <label className="mb-2 text-lg font-medium">Name:</label>
            <input
              className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-300"
              type="text"
              {...register("name")}
              required
            />
            {errors.name && (
              <span className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="my-4">
            <label className="text-lg font-medium">Upload Image:</label>
            <div
              {...getRootProps()}
              className="cursor-pointer border border-gray-300 rounded-lg p-2 flex items-center justify-center w-full min-h-[459px] max-h-[459px] bg-orange-50 hover:bg-green-50 transition relative overflow-hidden my-4"
            >
              <input {...getInputProps()} />
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="object-contain w-full h-full rounded-lg"
                />
              ) : (
                <span className="text-gray-500">
                  Drag & drop or click to select an image
                </span>
              )}
            </div>
          </div>

          <div className="my-4">
            <label className="flex items-center gap-2 mb-2 text-lg font-medium">
              Cooking Time:
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative w-24">
                <input
                  type="number"
                  className="w-full px-4 py-3 transition-shadow border border-gray-300 rounded-lg"
                  {...register("cookingTime")}
                  required
                />
              </div>

              <select
                value={timeUnit}
                onChange={handleUnitChange}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="min">Minutes</option>
                <option value="h">Hours</option>
              </select>
            </div>
          </div>

          <div className="my-4">
            <label className="text-lg font-medium">Difficulty:</label>
            <select
              {...register("difficulty")}
              className="w-full p-2 bg-white border border-gray-300 rounded-lg"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex flex-col my-4">
            <label className="text-lg font-medium">Serving Size:</label>
            <input
              type="number"
              className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              {...register("servingSize")} // Update the state when serving size changes
              required
            />
          </div>

          <div className="my-4">
            <label className="text-lg font-medium">Description:</label>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              {...register("description")}
              required
            />
            {errors.description && (
              <span className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>
          <h2 className="mt-10 mb-2 text-2xl underline">Categories</h2>
          <div className="">
            <div className="w-[550px] bg-white  h-full py-4 ">
              <h1 className="text-lg">Select Categories:</h1>
              <div className="flex flex-wrap gap-2 my-5 gap-y-3">
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
              <p className="mx-2 mt-5 italic">Selected categories:</p>
              <div className="flex flex-wrap gap-2 p-4">
                {selectedCategories.map((category) => (
                  <span
                    key={category.id}
                    className="px-4 py-2 rounded-lg cursor-pointer text-md bg-gradient-to-r from-green-300 to-green-400 hover:bg-red-400"
                    onClick={() => handleCategoryRemoval(category.id)}
                  >
                    {category.name} ✕
                  </span>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitCategories}
                  disabled={addCategoriesToRecipe.isPending}
                  className={`px-4 py-2 mr-5 text-lg rounded-lg ${
                    addCategoriesToRecipe.isPending
                      ? "bg-green-100"
                      : "bg-green-500"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
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
                      setNewInstruction({
                        ...newInstruction,
                        text: e.target.value,
                      })
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
              <button
                onClick={handleSubmit3}
                className="px-4 py-2 text-lg bg-green-400 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full p-2 text-white transition  rounded-lg hover:bg-blue-600 ${
              isLoading ? "bg-green-100" : "bg-green-500"
            } `}
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader color="#fff" size={20} /> : "Next"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRecipePage;
