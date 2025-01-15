import { Button } from "@/components/ui/button";
import { Category, Recipe } from "@/types/Recipe";
import React, { useEffect, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import SearchBox from "@/components/SearchBox";
import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";
import Modal from "@/components/Modal";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState<string>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchRecipes = async () => {
      const categoryQuery = appliedCategories
        .map((category: string) => `categories=${category}`)
        .join("&");
      try {
        const response = await fetch(
          `http://localhost:5028/api/recipes?${categoryQuery}&pageSize=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchRecipes();
  }, [appliedCategories, itemsPerPage]); // Trigger only when appliedCategories changes

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5028/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categories = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleFiltersModalClose = () => {
    setIsFiltersModalOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    );
  };

  const applyFilters = () => {
    setAppliedCategories(selectedCategories); // Apply filters to trigger API call
    setIsFiltersModalOpen(false);
  };

  const handlePageSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value))
  }

  return (
    <div>
      <section className="flex items-center justify-between mt-10 mb-16">
        <div className="space-x-2">
          <label htmlFor="itemsPerPage">Items per page: </label>
          <select
            name="itemsPerPage"
            id="itemsPerPage"
            className="px-2 py-3 bg-white border border-gray-600 rounded-lg"
            onChange={handlePageSize}
            value={itemsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBox />
          <button
            className="flex items-center px-4 py-2 space-x-1 bg-blue-400 rounded-lg"
            onClick={() => setIsFiltersModalOpen(true)}
          >
            <CiFilter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <button className="flex items-center px-4 py-2 space-x-1 bg-blue-400 rounded-lg">
            <FaSort className="w-5 h-5" />
            <span>Sort</span>
          </button>
        </div>
      </section>
      <div className="h-screen 2xl:px-20">
        <div className="grid h-full grid-cols-3 border border-blue-700 justify-items-center">
          {recipes.map((recipe: Recipe) => (
            <Link to={`/recipe/${recipe.id}`} key={recipe.name}>
              <div
                key={recipe.id}
                className=" w-96 h-[382px] bg-white rounded-xl cursor-pointer"
              >
                <figure className="w-full h-60 ">
                  <img
                    src={`http://localhost:5028/images/recipes/${recipe.imageFileName}`}
                    alt={recipe.name}
                    className="w-full h-full rounded-t-xl"
                  />
                </figure>
                <div className="px-3">
                  <h2 className="py-2 text-xl text-red-700">{recipe.name}</h2>
                  <div className="flex gap-5">
                    <div className="flex gap-1">
                      <MdAccessTime className="w-7 h-7" />
                      <p>{recipe.cookingTime}</p>
                    </div>
                    <div className="flex gap-1">
                      <PiForkKnifeFill className="w-7 h-7" />
                      <p>{recipe.cookingTime}</p>
                    </div>
                  </div>
                  <div className="flex pt-2 ">
                    <FaStar className="w-6 h-6" fill="#FFF100" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                    <FaStar className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* MODALS */}
      {isFiltersModalOpen && (
        <Modal onClose={handleFiltersModalClose}>
          <h1 className="mb-4 text-2xl font-bold">Filter by Categories</h1>
          <div className="grid grid-cols-4 my-16 gap-y-4">
            {categories.map((category: Category) => (
              <div key={category.id} className="flex items-center text-lg">
                <input
                  type="checkbox"
                  id={category.name}
                  value={category.name}
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                  className="w-5 h-5 mr-2"
                />
                <label htmlFor={category.name}>{category.name}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-lg"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
