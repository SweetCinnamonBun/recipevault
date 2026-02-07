import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaBook, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Category, Recipe } from "@/types/Recipe";
import Modal from "@/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "@/lib/api/agent";
import { toast } from "react-toastify";

type AddIngredient = { quantity: string; unit: string; name: string };
type AddInstruction = { text: string };

const UpdateRecipePage = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [timeUnit, setTimeUnit] = useState("min");
  const [imageFile, setImageFile] = useState<File | null>(null);

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
  const queryClient = useQueryClient();

  // ---------- Fetch Recipe ----------
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();
        setRecipe(data);
        setSelectedCategories(data.categories || []);

        // Parse cooking time
        if (data.cookingTime) {
          const [value, unit] = data.cookingTime.split(" ");
          setTimeUnit(unit || "min");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipe();
  }, [id]);

  // ---------- Fetch Categories ----------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // ---------- Mutation ----------
  const updateRecipe = useMutation({
    mutationFn: async (updatedRecipe: Recipe) => {
      // Handle image upload if a new image is selected
      let imageUrl = updatedRecipe.imageUrl || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("ImageFile", imageFile);
        const uploadRes = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;

        // Delete old image
        if (updatedRecipe.imageUrl) {
          const oldFile = updatedRecipe.imageUrl.split("/").pop();
          await fetch(`/api/images/delete?fileName=${oldFile}`, {
            method: "DELETE",
          });
        }
      }

      await agent.put(`/api/recipes/${id}`, { ...updatedRecipe, imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      toast.success("Recipe updated!");
      navigate(`/recipe/${id}`);
    },
    onError: () => {
      console.error("Failed to update recipe");
      toast.error("Failed to update recipe...");
    },
  });

  // ---------- Handlers ----------
  const handleChange = (field: keyof Recipe, value: any) => {
    if (!recipe) return;
    setRecipe({ ...recipe, [field]: value });
  };

  const handleAddIngredient = () => {
    if (!recipe || !newIngredient.name.trim()) return;
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newIngredient],
    });
    setNewIngredient({ quantity: "", unit: "", name: "" });
  };

  const handleDeleteIngredient = (index: number) => {
    if (!recipe) return;
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleAddInstruction = () => {
    if (!recipe || !newInstruction.text.trim()) return;
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, newInstruction],
    });
    setNewInstruction({ text: "" });
  };

  const handleDeleteInstruction = (index: number) => {
    if (!recipe) return;
    setRecipe({
      ...recipe,
      instructions: recipe.instructions.filter((_, i) => i !== index),
    });
  };

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

  const handleUpdateClick = () => {
    if (!recipe) return;
    updateRecipe.mutate({ ...recipe, categories: selectedCategories });
  };

  return (
    <div className="min-h-screen px-10 py-10 bg-gray-50">
      <h1 className="flex items-center w-64 py-2 mb-8 text-2xl bg-white rounded-lg">
        <FaBook className="w-6 h-6 mx-3 text-purple-500" />
        Update Recipe
      </h1>

      {recipe && (
        <>
          {/* Recipe Name */}
          <div className="mb-4">
            <label className="text-lg font-medium">Name:</label>
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label className="text-lg font-medium">Recipe Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setImageFile(e.target.files[0])
              }
              className="block w-full p-2 border border-gray-300 rounded-lg"
            />
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="New"
                className="mt-2 max-h-64"
              />
            ) : recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt="Current" className="mt-2 max-h-64" />
            ) : null}
          </div>

          {/* Cooking Time & Difficulty */}
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="text-lg font-medium">Cooking Time:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={parseInt(recipe.cookingTime) || ""}
                  onChange={(e) =>
                    handleChange(
                      "cookingTime",
                      `${e.target.value} ${timeUnit}`,
                    )
                  }
                  className="w-24 p-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => {
                    setTimeUnit(e.target.value);
                    handleChange(
                      "cookingTime",
                      `${parseInt(recipe.cookingTime) || 0} ${e.target.value}`,
                    );
                  }}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="min">Minutes</option>
                  <option value="h">Hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-lg font-medium">Difficulty:</label>
              <select
                value={recipe.difficulty}
                onChange={(e) => handleChange("difficulty", e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-lg font-medium">Serving Size:</label>
              <input
                type="number"
                value={recipe.servingSize}
                onChange={(e) =>
                  handleChange("servingSize", Number(e.target.value))
                }
                className="w-24 p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-lg font-medium">Description:</label>
            <textarea
              value={recipe.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-bold">Categories</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
                  onClick={() => handleCategorySelection(category)}
                >
                  {category.name}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category: Category) => (
                <span
                  key={category.id}
                  className="px-4 py-2 bg-green-300 rounded-lg cursor-pointer"
                  onClick={() => category.id !== undefined && handleCategoryRemoval(category.id)}
                >
                  {category.name} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients & Instructions */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Ingredients */}
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <h2 className="mb-2 text-xl font-bold">Ingredients</h2>
              <ul className="pl-5 mb-2 list-disc">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {ing.quantity} {ing.unit} {ing.name}
                    </span>
                    <button
                      onClick={() => handleDeleteIngredient(i)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
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
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={newIngredient.unit}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, unit: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, name: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-4 py-2 text-white bg-green-500 rounded-lg"
                >
                  Add Ingredient
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <h2 className="mb-2 text-xl font-bold">Instructions</h2>
              <ul className="pl-5 mb-2 list-disc">
                {recipe.instructions.map((inst, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{inst.text}</span>
                    <button
                      onClick={() => handleDeleteInstruction(i)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
              <textarea
                placeholder="Instruction"
                value={newInstruction.text}
                onChange={(e) =>
                  setNewInstruction({ text: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-4 py-2 mt-2 text-white bg-green-500 rounded-lg"
              >
                Add Instruction
              </button>
            </div>
          </div>

          <button
            onClick={handleUpdateClick}
            className="px-6 py-3 text-white bg-green-500 rounded-lg"
          >
            Update Recipe
          </button>
        </>
      )}
    </div>
  );
};

export default UpdateRecipePage;
