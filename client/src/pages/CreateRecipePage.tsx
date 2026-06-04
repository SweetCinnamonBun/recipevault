import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useImages } from "@/lib/hooks/useImages";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { recipeSchema, RecipeSchema } from "@/lib/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { Category, Ingredient, Instruction } from "@/types/Recipe";
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
import { MdAccessTime, MdOutlinePreview } from "react-icons/md";
import { PiForkKnifeFill, PiShootingStarLight } from "react-icons/pi";
import RecipePreviewModal from "@/components/RecipePreviewModal";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CreatingRecipeModal from "@/components/CreatingRecipeModal";

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

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const user = useSelector((state) => state.auth.user)

  const DEFAULT_RECIPE_IMAGE =
    "https://recipevaultstorage.blob.core.windows.net/recipevaultcontainer/0qC8V5ex.jpg";

  const recipePreview = useSelector((state: RootState) => state.recipe);
  const ingredientsPreview = useSelector(
    (state: RootState) => state.recipe.ingredients,
  );
  const instructionsPreview = useSelector(
    (state: RootState) => state.recipe.instructions,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
      selectedCategories.filter((c) => c.id !== categoryId),
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
    setIsCreating(true);
    setIsLoading(true);

    try {
      let imageUrl: string = DEFAULT_RECIPE_IMAGE;

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
          },
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
          },
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
      setIsCreating(false);
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
      }),
    );

    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative">
        <nav className="px-4 lg:px-10">
          <h1 className="flex items-center py-2 mt-8 text-2xl text-center bg-white rounded-lg w-52 ">
            <FaPlus className="w-6 h-6 mx-3 text-red-500" /> Create Recipe
          </h1>
        </nav>
        <div className="px-4 flex items-center justify-center  mb-[100px] lg:px-14">
          <form
            onSubmit={handleSubmit(handleCreateRecipe)}
            encType="multipart/form-data"
            className="w-full px-4 py-4 mt-10 bg-white rounded-lg lg:px-10 2xl:w-10/12 "
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
            {/* Image selection */}
            <div className="my-4">
              <label className="text-lg font-medium">Upload Image:</label>
              <div
                {...getRootProps()}
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg
                 p-2 flex items-center justify-center w-full lg:w-1/2 min-h-[300px] max-h-[305px] 
                 hover:bg-green-50 transition relative overflow-hidden my-4"
              >
                <input {...getInputProps()} />

                {imageFile ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="object-contain w-full h-full rounded-lg max-h-64"
                    />
                    <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                        }}
                        className="flex items-center justify-center w-12 h-12 text-white bg-orange-400 rounded hover:bg-red-600"
                      >
                        <FaTrash className="w-6 h-6" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          document
                            .querySelector<HTMLInputElement>(
                              'input[type="file"]',
                            )
                            ?.click();
                        }}
                        className="flex items-center justify-center w-12 h-12 text-white bg-orange-400 rounded hover:bg-blue-600"
                      >
                        <FaEdit className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      src={DEFAULT_RECIPE_IMAGE}
                      alt="Placeholder"
                      className="object-contain w-full h-full rounded-lg max-h-64 opacity-80"
                    />
                  </div>
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
              <div className="max-w-[550px] bg-white  h-full py-4 ">
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
            <div className="flex flex-col w-full min-h-screen ">
              <h1 className="w-full py-2 mb-8 text-2xl underline bg-white rounded-lg">
                Create Ingredients and Instructions
              </h1>
              <section className="grid w-full gap-y-4 grid-cols-1 lg:grid-cols-2  gap-x-8 min-h-[700px]">
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

                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="px-2 text-red-500 hover:text-red-700"
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
                        <button
                          type="button"
                          onClick={() => handleRemoveInstruction(index)}
                          className="px-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
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
              className="flex items-center justify-center gap-2 p-3 mt-10 text-white bg-blue-500 rounded-2xl w-52 mb-14 hover:bg-blue-600"
            >
              {" "}
              <MdOutlinePreview className="w-6 h-6" />
              Preview Recipe
            </button>
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
                "Create Recipe"
              )}
            </button>
          </form>
        </div>
        {isModalOpen && (
          <RecipePreviewModal onClose={() => setIsModalOpen(false)}>
            <section className="flex flex-col items-center px-3 max-h-[90vh] overflow-y-auto bg-[#FFF1DB]">
                    <div className="grid w-full gap-6 lg:gap-16 xl:grid-cols-1 xl:mt-20 xl:px-36 2xl:px-64">
                      <figure className="w-full px-1 mt-8 lg:mt-0  h-80 md:h-[596px] ">
                        <img
                          src={recipePreview?.imageUrl || DEFAULT_RECIPE_IMAGE}
                          alt={recipePreview?.name}
                          className="object-center w-full h-full rounded-xl"
                        />
                      </figure>
            
                      <div className="px-2 bg-orange-200 lg:p-4 rounded-xl">
                        <h1 className="self-start mx-2 mt-4 text-2xl md:text-3xl xl:mt-2">
                          {recipePreview?.name}
                        </h1>
                        {/* Categories */}
                        <div className="flex flex-wrap self-start gap-1 mt-10">
                          {recipePreview?.categories.map((category: Category, index: number) => (
                            <span
                              key={index}
                              className="px-4 py-2 text-sm ml-1 bg-[#00FF9C] rounded-3xl"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                        {/* Recipe basic info */}
                        <div className="flex flex-wrap w-full py-5 mt-2 gap-y-3 gap-x-2">
                          <div className="">
                            <div className="grid grid-cols-[max-content_1fr] items-center gap-2">
                              <div className="px-2 py-2 bg-white rounded-full">
                                <MdAccessTime className="w-6 h-6 " />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm md:text-md">Cooking time</span>
                                <span className="text-md md:text-lg">
                                  {recipePreview?.cookingTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <div className="grid grid-cols-[max-content_1fr] items-center gap-2">
                              <div className="px-2 py-2 bg-white rounded-full">
                                <PiShootingStarLight className="w-6 h-6" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm md:text-md">Difficulty</span>
                                <span className="text-md md:text-lg">
                                  {recipePreview?.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <div className="grid grid-cols-[max-content_1fr] items-center gap-2">
                              <div className="px-2 py-2 bg-white rounded-full">
                                <PiForkKnifeFill className="w-6 h-6" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm md:text-md">Serving Size</span>
                                <span className="text-md md:text-lg">
                                  {recipePreview?.servingSize}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex self-start mb-4">
                          <span className="text-md">
                            <em>Recipe by:</em> <strong>{user.profileName}</strong>
                          </span>
                        </div>
                        <section className="w-full">
                          <div className="w-full p-6 text-lg bg-white shadow-lg rounded-xl h-96 lg:h-56">
                            {recipePreview?.description}
                          </div>
                        </section>
            
                        {/* <div className="flex flex-col items-center mt-20">
                      {isLoadingRatings ? (
                        <p>loading ratings...</p>
                      ) : (
                        <RecipePageStars averageRating={recipeRatings} />
                      )}
            
                      <div className="mt-3">
                        {recipe?.ratingCount === 0 ? (
                          <span>No ratings for this recipe</span>
                        ) : (
                          <span className="">
                            {recipe?.ratingCount} ratings. Average: {recipe?.averageRating}
                          </span>
                        )}
                      </div>
                      <div className="mt-8">
                        <button
                          className="px-4 py-2 font-bold bg-yellow-300 rounded-lg"
                          onClick={() => setIsRatingModalOpen(true)}
                        >
                          Rate this recipe
                        </button>
                        {isRatingModalOpen && (
                          <RatingModal
                            onSubmit={handleRatingSubmit}
                            onClose={() => setIsRatingModalOpen(false)}
                          />
                        )}
                      </div>
                    </div> */}
                        <section className="flex items-center justify-end w-full my-6">
                          {/* <button
                            type="button"
                            className="px-3 py-2 text-sm text-white bg-red-600 rounded-2xl"
                          >
                            Download Recipe PDF
                          </button> */}
                        </section>
                        {/* <div className="flex flex-col items-center gap-2 mt-14">
                      <FaHeart
                        className={`w-7 h-7 cursor-pointer ${
                          isFavorite ? "text-red-500" : "text-black"
                        }`}
                        onClick={handleFavoriteToggle}
                      />
                      <span>
                        {isFavorite ? "Remove from favorites" : "Add to your favorites"}
                      </span>
                    </div> */}
                      </div>
                    </div>
                    {/* Ingredients section */}
                    <div className="grid w-full grid-cols-1 gap-6 mt-14 md:grid-cols-2 xl:px-44">
                      <section className="w-full min-w-0">
                        <h2 className="text-xl font-bold">Ingredients</h2>
            
                        <div className="py-2 rounded-lg">
                          <ul className="mt-4 space-y-2">
                            {recipePreview?.ingredients.map(
                              (ingredient: Ingredient, index: number) => (
                                <li
                                  key={index}
                                  className="
                            px-4 py-3
                            text-base md:text-lg
                            bg-white
                            rounded-md
                            grid
                            grid-cols-[max-content_1fr]
                            items-start
                            gap-3
                          "
                                >
                                  <span className="px-1 font-semibold">•</span>
                                  <p className="min-w-0 break-words">
                                    {[ingredient.quantity, ingredient.unit, ingredient.name]
                                      .filter(Boolean)
                                      .join(" ")}
                                  </p>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </section>
            
                      <section className="w-full min-w-0">
                        <h2 className="text-xl font-bold">Cooking instructions</h2>
            
                        <div className="py-2 rounded-lg">
                          <ul className="mt-4 space-y-2">
                            {recipePreview?.instructions.map(
                              (instruction: Instruction, index: number) => (
                                <li
                                  key={instruction.id}
                                  className="
                            px-4 py-3
                            text-base md:text-lg
                            bg-white
                            rounded-md
                            grid
                            grid-cols-[max-content_1fr]
                            items-start
                            gap-3
                          "
                                >
                                  <span className="px-1 font-semibold">{index + 1}.</span>
                                  <p className="min-w-0 break-words">{instruction.text}</p>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </section>
                    </div>
            
                    {/* More recipes from author */}
                    <section className="mt-60 card-carousel">
                      {/* <CardCarousel title="More Recipes from author"  /> */}
                    </section>
                  </section>
          </RecipePreviewModal>
        )}
        <CreatingRecipeModal isOpen={isCreating} />
      </div>
    </>
  );
};

export default CreateRecipePage;
