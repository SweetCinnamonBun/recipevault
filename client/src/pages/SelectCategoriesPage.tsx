import { Category } from "@/types/Recipe";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "@/store/store";
import { addCategories } from "@/store/recipeSlice";
import { useCategories } from "@/lib/hooks/useCategories";


const SelectCategoriesPage = () => {
  
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const recipeId = useSelector((state: RootState) => state.recipe.id);

  const { categories, addCategoriesToRecipe } = useCategories();

  const dispatch = useDispatch();

  const handleCategorySelection = (category: Category) => {
    if (!selectedCategories.some((c) => c.id === category.id)) {
        setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleCategoryRemoval = (categoryId: number | undefined) => {
    setSelectedCategories(selectedCategories.filter((c) => c.id !== categoryId));
  };

  const handleSubmit = async () => {
    // Extract selected category IDs
    const categoryIds = selectedCategories.map((category) => category.id);
  
    // Create the JSON body
    const requestBody = {
      recipeId: recipeId,
      categoryIds: categoryIds,
    };
  
    try {
     
      
      await addCategoriesToRecipe.mutateAsync(requestBody)
      const categoriesResponse = await fetch(`/api/categories/recipes-categories/${recipeId}`);
      
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
    <div className="flex items-center justify-center h-screen">
      <div className="w-[550px] bg-white  h-full py-5 px-10">
        <h1 className="py-5 text-2xl font-semibold text-center">Select Categories</h1>
        <div className="flex flex-wrap justify-center gap-2 my-5 gap-y-3">
          {categories?.map((category: Category, index) => (
            <span key={index} onClick={() => handleCategorySelection(category)} className="px-4 py-2 text-lg bg-orange-200 rounded-lg cursor-pointer hover:bg-yellow-200">{category.name}</span>
          ))}
        </div>
        <p className="mx-2 mt-5 italic">Selected categories:</p>
        <div className="flex flex-wrap gap-2 p-4">
            {selectedCategories.map((category) => (
              <span
                key={category.id}
                className="px-4 py-2 text-lg bg-green-200 rounded cursor-pointer hover:bg-red-400"
                onClick={() => handleCategoryRemoval(category.id)}
              >
                {category.name} ✕
              </span>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={handleSubmit} disabled={addCategoriesToRecipe.isPending} className={`px-4 py-2 mr-5 text-lg rounded-lg ${addCategoriesToRecipe.isPending ? "bg-green-100" : "bg-green-500"}`}>Confirm</button>
          </div>
      </div>
    </div>
    </>
  );
};

export default SelectCategoriesPage;
