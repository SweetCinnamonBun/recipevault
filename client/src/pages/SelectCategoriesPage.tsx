import { Category } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "@/store/store";

const SelectCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const recipeId = useSelector((state: RootState) => state.recipe.id);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:5028/api/categories");
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleCategorySelection = (category: Category) => {
    if (!selectedCategories.some((c) => c.id === category.id)) {
        setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleCategoryRemoval = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter((c) => c.id !== categoryId));
  };

  const handleSubmit = async () => {
    // Extract selected category IDs
    const categoryIds = selectedCategories.map((category) => category.id);

    // Create the JSON body
    const requestBody = {
      recipeId: recipeId, // Replace with the actual recipe ID
      categoryIds: categoryIds,
    };

    try {
      const response = await fetch("http://localhost:5028/api/categories/add-to-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Categories added successfully!");
        navigate("/ingredients-and-instructions");

      } else {
        console.error("Failed to add categories.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center h-screen">
      <div className="w-2/5 bg-white -mt-44 h-[500px]">
        <h1 className="py-5 text-2xl font-semibold text-center">Select Categories</h1>
        <div className="flex flex-wrap justify-center gap-2 my-5 gap-y-3">
          {categories?.map((category: Category) => (
            <span onClick={() => handleCategorySelection(category)} className="px-4 py-2 text-lg bg-yellow-400 rounded-lg">{category.name}</span>
          ))}
        </div>
        <p className="mx-2 mt-5 italic">Selected categories:</p>
        <div className="flex flex-wrap gap-2 p-4">
            {selectedCategories.map((category) => (
              <span
                key={category.id}
                className="px-4 py-2 text-lg bg-green-500 rounded cursor-pointer hover:bg-red-500"
                onClick={() => handleCategoryRemoval(category.id)}
              >
                {category.name} ✕
              </span>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={handleSubmit} className="px-4 py-2 mr-5 text-lg bg-green-200 rounded-lg">Confirm</button>
          </div>
      </div>
    </div>
    </>
  );
};

export default SelectCategoriesPage;
