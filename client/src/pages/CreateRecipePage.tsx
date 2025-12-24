import React, { useState } from "react";
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
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  addCategories,
  addIngredients,
  addInstructions,
  setRecipe,
  setRecipeDraft,
} from "@/store/recipeSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Modal from "@/components/Modal";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill, PiShootingStarLight } from "react-icons/pi";
import RecipePreviewModal from "@/components/RecipePreviewModal";

type AddIngredient = {
  quantity: string;
  unit: string;
  name: string;
};

type AddInstruction = {
  text: string;
};

const CreateRecipePage = () => {
  // const recipeId = useSelector((state: RootState) => state.recipe.id);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [timeUnit, setTimeUnit] = useState("min");
  const [isLoading, setIsLoading] = useState(false);
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

  const recipePreview = useSelector((state: RootState) => state.recipe);
  const ingredientsPreview = useSelector(
    (state: RootState) => state.recipe.ingredients
  );
  const instructionsPreview = useSelector(
    (state: RootState) => state.recipe.instructions
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { postImage } = useImages();
  const { createRecipe } = useRecipes();
  const {
    register,
    handleSubmit,
    getValues,
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

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeUnit(e.target.value);
  };

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

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

  const handleCreateRecipe = async (data: RecipeSchema) => {
    setIsLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("ImageFile", imageFile);
        imageUrl = await postImage.mutateAsync(imageFormData);
      }

      const fullCookingTime = `${data.cookingTime} ${timeUnit}`;
      const recipeData = {
        ...data,
        cookingTime: fullCookingTime,
        imageUrl,
      };
      const createdRecipe = await createRecipe.mutateAsync(recipeData);
      const recipeId = createdRecipe.id;

      dispatch(setRecipe(createdRecipe));

      if (selectedCategories.length > 0) {
        await addCategoriesToRecipe.mutateAsync({
          recipeId,
          categoryIds: selectedCategories.map((x) => x.id),
        });
        dispatch(addCategories(selectedCategories));
      }

      if (ingredients.length > 0) {
        const ingredientsResponse = await fetch(
          `/api/ingredients/bulk?recipeId=${recipeId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ingredients),
          }
        );

        if (!ingredientsResponse.ok) {
          throw new Error("Failed to add ingredients");
        }

        dispatch(addIngredients(ingredients));
      }

      if (instructions.length > 0) {
        const instructionsResponse = await fetch(
          `/api/instructions/bulk?recipeId=${recipeId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(instructions),
          }
        );

        if (!instructionsResponse.ok) {
          throw new Error("Failed to add instructions");
        }

        // Save to Redux
        dispatch(addInstructions(instructions));
      }

      navigate("/dashboard");
      toast.success("Recipe created");
    } catch (error) {
      console.log(" ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    const values = getValues();

    dispatch(
      setRecipeDraft({
        ...values,
        cookingTime: `${values.cookingTime} ${timeUnit}`,
        ingredients,
        instructions,
        categories: selectedCategories,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
      })
    );

    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-center  mb-[100px]">
        <form
          onSubmit={handleSubmit(handleCreateRecipe)}
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
            type="button"
            onClick={handlePreview}
            className="w-full p-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Preview Recipe
          </button>
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
      {isModalOpen && (
        <RecipePreviewModal onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <h1 className="w-full py-2 mt-5 mb-20 text-3xl italic text-center underline bg-white rounded-lg">
              Recipe Preview
            </h1>
            <h1 className="my-5 text-3xl">{recipePreview?.name}</h1>
            <div className="flex justify-between px-5 py-5 mt-2 mb-8 w-96 gap-x-5">
              <div className="">
                <div className="flex flex-col items-center">
                  <MdAccessTime className="w-8 h-8" />
                  <span className="text-lg">{recipePreview?.cookingTime}</span>
                  <span className="text-md">Cooking time</span>
                </div>
              </div>
              <div className="">
                <div className="flex flex-col items-center">
                  <PiShootingStarLight className="w-8 h-8" />
                  <span className="text-lg">{recipePreview?.difficulty}</span>
                  <span className="text-md">Difficulty</span>
                </div>
              </div>
              <div className="">
                <div className="flex flex-col items-center">
                  <PiForkKnifeFill className="w-8 h-8" />
                  <span className="text-lg">{recipePreview?.servingSize}</span>
                  <span className="text-md">Serving Size</span>
                </div>
              </div>
            </div>
            <figure className="w-full sm:w-3/4 px-1 lg:w-[70%] [@media(min-width:1100px)]:w-[70%] [@media(min-width:1300px)]:w-[70%] 2xl:w-[50%] [@media(min-width:1750px)]:w-[70%]">
              <img
                src={recipePreview?.imageUrl}
                alt={recipePreview?.name}
                className="w-full h-[380px] md:h-[520px] rounded-xl"
              />
            </figure>
            <div className="flex flex-wrap justify-center mt-12 gap-y-5">
              {recipePreview?.categories.map(
                (category: Category, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 ml-4 bg-[#00FF9C] rounded-lg"
                  >
                    {category.name}
                  </span>
                )
              )}
            </div>
            <section className="w-11/12 my-10 2xl:px-52">
              <div className="w-full p-8 text-xl bg-white shadow-lg rounded-xl h-96">
                {recipePreview?.description}
              </div>
            </section>
            <section className="grid w-11/12 grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 h-[750px] 2xl:px-52">
  {/* Ingredients */}
  <div className="flex flex-col p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
    <h2 className="my-2 text-2xl font-bold">Ingredients</h2>
    <ul className="flex-1 p-2 space-y-4 overflow-y-auto list-disc">
      {recipePreview?.ingredients.map((ingredient, index) => (
        <li key={index} className="space-x-2 text-xl">
          <span>{ingredient.quantity}</span>
          <span>{ingredient.unit}</span>
          <span>{ingredient.name}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* Instructions */}
  <div className="flex flex-col p-6 shadow-lg rounded-lg bg-[#F8FAE5]">
    <h2 className="my-2 text-2xl font-bold">Instructions</h2>
    <ul className="flex-1 p-2 space-y-4 overflow-y-auto list-disc">
      {recipePreview?.instructions.map((instruction, index) => (
        <li key={index} className="text-xl">
          {instruction.text}
        </li>
      ))}
    </ul>
  </div>
</section>
            {/* <button
                className={`px-6 py-3 text-xl  rounded-lg my-14 ${
                  isLoading ? "bg-green-100" : "bg-green-400"
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Create Recipe
              </button> */}
          </div>
        </RecipePreviewModal>
      )}
    </>
  );
};

export default CreateRecipePage;
