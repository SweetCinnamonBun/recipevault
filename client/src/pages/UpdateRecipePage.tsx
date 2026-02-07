import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { FaBook, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Category, Recipe } from "@/types/Recipe";
import Modal from "@/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "@/lib/api/agent";
import { toast } from "react-toastify";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeSchema } from "@/lib/schemas/recipeSchema";
import { useCategories } from "@/lib/hooks/useCategories";

type AddIngredient = { quantity: string; unit: string; name: string };
type AddInstruction = { text: string };

const UpdateRecipePage = () => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched", resolver: zodResolver(recipeSchema) });
  const [updateRecipe, setUpdateRecipe] = useState<Recipe | null>(null);
  const [timeUnit, setTimeUnit] = useState("min");
  const [cookingTimeValue, setCookingTimeValue] = useState<number>();

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<AddIngredient>({
    quantity: "",
    unit: "",
    name: "",
  });

  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [newInstruction, setNewInstruction] = useState<AddInstruction>({
    text: "",
  });

  const { id } = useParams();

  const { recipe } = useRecipes(id);

  useEffect(() => {
    if (recipe) {
      setSelectedCategories(recipe.categories || []);
      if (recipe.cookingTime) {
        const [value, unit] = recipe.cookingTime.split(" ");
        setTimeUnit(unit || "min");
        const numericValue = parseInt(value, 10);
        setCookingTimeValue(isNaN(numericValue) ? 0 : numericValue);
      }

      reset({
        name: recipe.name,
        description: recipe.description,
        difficulty: recipe.difficulty,
        servingSize: recipe.servingSize,
      });

      setIngredients(recipe.ingredients || []);
      setInstructions(recipe.instructions || []);
    }
  }, [recipe, reset]);

  const { categories } = useCategories();

  const handleCategorySelection = (category: Category) => {
    if (!selectedCategories.find((c) => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryRemoval = (categoryId: number) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c.id !== categoryId),
    );
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleRemoveInstruction = (indexToRemove: number) => {
    setInstructions((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // const [categories, setCategories] = useState<Category[]>([]);
  // const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  // const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // const [imageFile, setImageFile] = useState<File | null>(null);

  // const [newIngredient, setNewIngredient] = useState<AddIngredient>({
  //   quantity: "",
  //   unit: "",
  //   name: "",
  // });
  // const [newInstruction, setNewInstruction] = useState<AddInstruction>({
  //   text: "",
  // });

  // const navigate = useNavigate();
  // const { id } = useParams();
  // const queryClient = useQueryClient();

  // // ---------- Fetch Recipe ----------
  // useEffect(() => {
  //   const fetchRecipe = async () => {
  //     try {
  //       const res = await fetch(`/api/recipes/${id}`);
  //       const data = await res.json();
  //       setRecipe(data);
  //       setSelectedCategories(data.categories || []);

  //       // Parse cooking time
  //       if (data.cookingTime) {
  //         const [value, unit] = data.cookingTime.split(" ");
  //         setTimeUnit(unit || "min");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchRecipe();
  // }, [id]);

  // // ---------- Fetch Categories ----------
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await fetch("/api/categories");
  //       const data = await res.json();
  //       setCategories(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  // // ---------- Mutation ----------
  // const updateRecipe = useMutation({
  //   mutationFn: async (updatedRecipe: Recipe) => {
  //     // Handle image upload if a new image is selected
  //     let imageUrl = updatedRecipe.imageUrl || "";
  //     if (imageFile) {
  //       const formData = new FormData();
  //       formData.append("ImageFile", imageFile);
  //       const uploadRes = await fetch("/api/images/upload", {
  //         method: "POST",
  //         body: formData,
  //       });
  //       const uploadData = await uploadRes.json();
  //       imageUrl = uploadData.imageUrl;

  //       // Delete old image
  //       if (updatedRecipe.imageUrl) {
  //         const oldFile = updatedRecipe.imageUrl.split("/").pop();
  //         await fetch(`/api/images/delete?fileName=${oldFile}`, {
  //           method: "DELETE",
  //         });
  //       }
  //     }

  //     await agent.put(`/api/recipes/${id}`, { ...updatedRecipe, imageUrl });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["recipe", id] });
  //     toast.success("Recipe updated!");
  //     navigate(`/recipe/${id}`);
  //   },
  //   onError: () => {
  //     console.error("Failed to update recipe");
  //     toast.error("Failed to update recipe...");
  //   },
  // });

  // // ---------- Handlers ----------
  // const handleChange = (field: keyof Recipe, value: any) => {
  //   if (!recipe) return;
  //   setRecipe({ ...recipe, [field]: value });
  // };

  // const handleAddIngredient = () => {
  //   if (!recipe || !newIngredient.name.trim()) return;
  //   setRecipe({
  //     ...recipe,
  //     ingredients: [...recipe.ingredients, newIngredient],
  //   });
  //   setNewIngredient({ quantity: "", unit: "", name: "" });
  // };

  // const handleDeleteIngredient = (index: number) => {
  //   if (!recipe) return;
  //   setRecipe({
  //     ...recipe,
  //     ingredients: recipe.ingredients.filter((_, i) => i !== index),
  //   });
  // };

  // const handleAddInstruction = () => {
  //   if (!recipe || !newInstruction.text.trim()) return;
  //   setRecipe({
  //     ...recipe,
  //     instructions: [...recipe.instructions, newInstruction],
  //   });
  //   setNewInstruction({ text: "" });
  // };

  // const handleDeleteInstruction = (index: number) => {
  //   if (!recipe) return;
  //   setRecipe({
  //     ...recipe,
  //     instructions: recipe.instructions.filter((_, i) => i !== index),
  //   });
  // };

  // const handleCategorySelection = (category: Category) => {
  //   if (!selectedCategories.find((c) => c.id === category.id)) {
  //     setSelectedCategories([...selectedCategories, category]);
  //   }
  // };

  // const handleCategoryRemoval = (categoryId: number) => {
  //   setSelectedCategories(
  //     selectedCategories.filter((c) => c.id !== categoryId),
  //   );
  // };

  // const handleUpdateClick = () => {
  //   if (!recipe) return;
  //   updateRecipe.mutate({ ...recipe, categories: selectedCategories });
  // };

  const handleAddIngredient = () => {
    if (
      !newIngredient.quantity.trim() ||
      !newIngredient.unit ||
      !newIngredient.name.trim()
    ) {
      return;
    }

    setIngredients((prev) => [...prev, newIngredient]);

    setNewIngredient({
      quantity: "",
      unit: "",
      name: "",
    });
  };

  const handleAddInstruction = () => {
    if (!newInstruction.text.trim()) {
      return;
    }

    setInstructions((prev) => [...prev, newInstruction]);

    setNewInstruction({ text: "" });
  };

  const onSubmit = (data) => console.log(data);

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
          // onSubmit={handleSubmit(onSubmit)}
        >
          {/* Name */}
          <div className="flex flex-col my-4">
            <label className="mb-2 text-lg font-medium">Name:</label>
            <input
              type="text"
              {...register("name")}
              defaultValue={recipe?.name ?? ""}
              className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-300"
              required
            />
            {errors.name && (
              <span className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Cooking Time */}
          <div className="my-4">
            <label className="flex items-center gap-2 mb-2 text-lg font-medium">
              Cooking Time:
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative w-24">
                <input
                  type="number"
                  className="w-full px-4 py-3 transition-shadow border border-gray-300 rounded-lg"
                  value={cookingTimeValue}
                  onChange={(e) => setCookingTimeValue(Number(e.target.value))}
                  required
                />
              </div>
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
              {...register("difficulty")}
              defaultValue={recipe?.difficulty ?? "Easy"}
              className="w-full p-2 bg-white border border-gray-300 rounded-lg"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Serving Size */}
          <div className="flex flex-col my-4">
            <label className="text-lg font-medium">Serving Size:</label>
            <input
              type="number"
              {...register("servingSize")}
              defaultValue={recipe?.servingSize ?? 1}
              className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="my-4">
            <label className="text-lg font-medium">Description:</label>
            <textarea
              {...register("description")}
              className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              defaultValue={recipe?.description ?? ""}
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
          {/* <button
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
            {isLoading ? <ClipLoader color="#fff" size={20} /> : "Create Recipe"}
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default UpdateRecipePage;
