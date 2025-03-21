import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setRecipe } from "@/store/recipeSlice";
import { useNavigate } from "react-router";
import { FaRegClock } from "react-icons/fa";

const CreateRecipePage = () => {
  const [name, setName] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [imageFile, setImageFile] = useState(null);
  const [timeUnit, setTimeUnit] = useState("min");
  const [servingSize, setServingSize] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;

    // Step 1: Upload the image (if provided)
    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append("ImageFile", imageFile);

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
          imageUrl = imageData.imageUrl; // Get the image URL
        } else {
          console.error("Failed to upload image.");
          return;
        }
      } catch (error) {
        console.error("An error occurred while uploading the image:", error);
        return;
      }
    }

    const fullCookingTime = `${cookingTime} ${timeUnit}`;
    // Step 2: Create the recipe with the image URL
    const recipeData = {
      name: name,
      cookingTime: fullCookingTime,
      description: description,
      difficulty: difficulty,
      imageUrl: imageUrl,
      servingSize: servingSize, // Include the image URL in the recipe data
    };

    try {
      const recipeResponse = await fetch("/api/recipes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(recipeData), // Send the recipe data as JSON
      });

      if (recipeResponse.ok) {
        const data = await recipeResponse.json();
        dispatch(setRecipe(data));
        console.log("Recipe created successfully!");

        window.scrollTo({ top: 0, behavior: "smooth" });

        navigate("/add-categories");
      } else {
        console.error("Failed to create recipe.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleTimeChange = (e) => {
    setCookingTime(e.target.value);
  };

  const handleUnitChange = (e) => {
    setTimeUnit(e.target.value);
    setCookingTime(""); // Clear previous value when switching units
  };

  return (
    <>
      <div className="flex items-center justify-center  mb-[100px]">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-3/5 px-10 py-4 mt-20 bg-white rounded-lg"
        >
          <h1 className="text-2xl text-center">Create Recipe</h1>
          <div className="flex flex-col">
            <label className="mb-2 text-lg font-medium">Recipe Name:</label>
            <input
              className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-300"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="my-4">
            <label className="text-lg font-medium">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer border border-gray-300 rounded-lg p-2 flex items-center justify-center w-full min-h-[300px] max-h-[300px] bg-orange-50 hover:bg-green-50 transition relative overflow-hidden my-4"
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected"
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <span className="text-gray-500">Click to select an image</span>
              )}
            </label>
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
                  value={cookingTime}
                  onChange={handleTimeChange}
                  required
                />
                <span className="absolute inset-y-0 flex items-center text-gray-400 left-3"></span>
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
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
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
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)} // Update the state when serving size changes
              required
            />
          </div>

          <div className="my-4">
            <label className="text-lg font-medium">Description:</label>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white transition bg-green-500 rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRecipePage;
