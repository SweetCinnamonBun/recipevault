import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setRecipe } from '@/store/recipeSlice';

const CreateRecipePage = () => {
    const [name, setName] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const dispatch = useDispatch()
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Create FormData
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("CookingTime", cookingTime);
      formData.append("Description", description);
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
        } else {
          console.error("Failed to create recipe.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Recipe Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cooking Time:</label>
          <input
            type="text"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <button type="submit">Create Recipe</button>
      </form>
    );
  };


export default CreateRecipePage
