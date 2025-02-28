import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setRecipe } from "@/store/recipeSlice";
import { useNavigate } from "react-router";

const CreateRecipePage = () => {
  const [name, setName] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("CookingTime", cookingTime);
    formData.append("Description", description);
    formData.append("Difficulty", difficulty);
    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }

    try {
      const response = await fetch("http://localhost:5028/api/recipes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setRecipe(data));
        console.log("Recipe created successfully!");
        navigate("/add-categories");
      } else {
        console.error("Failed to create recipe.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center  mb-[100px]">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-3/5 px-6 py-4 mt-20 border border-blue-200 rounded-lg"
        >
          <h1 className="text-2xl text-center">Create Recipe</h1>
          <div className="flex flex-col">
            <label className="mb-2 text-lg font-medium">Recipe Name:</label>
            <input
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="cursor-pointer border border-gray-300 rounded-lg p-2 flex items-center justify-center w-full min-h-[300px] max-h-[300px] bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden my-4"
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
            <label className="text-lg font-medium">Cooking Time:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              required
            />
          </div>

          <div className="my-4">
            <label className="text-lg font-medium">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
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

