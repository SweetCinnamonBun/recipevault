import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    cookingTime: "",
    difficulty: "Easy",
    imageFileName: "",
    categories: [], // Array of category IDs or names
    ingredients: [], // Array of ingredients
    instructions: [], // Array of instructions
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch recipe details by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5028/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await response.json();
        setRecipe({
          name: data.name,
          description: data.description,
          cookingTime: data.cookingTime,
          difficulty: data.difficulty,
          imageFileName: data.imageFileName,
          categories: data.categories || [],
          ingredients: data.ingredients || [],
          instructions: data.instructions || [],
        });
  
        if (data.imageFileName) {
          setImagePreview(`http://localhost:5028/uploads/${data.imageFileName}`);
        }
  
        setLoading(false);
      } catch (err) {
        setError("Error fetching recipe data.");
        setLoading(false);
      }
    };
  
    fetchRecipe();
  }, [id]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      [name]: value,
    });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = e.target;
    setRecipe({
      ...recipe,
      [field]: value.split('\n'), // Split by newline for textarea inputs
    });
  };
  

  // Handle file upload & preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show new image preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("Name", recipe.name);
    formData.append("Description", recipe.description);
    formData.append("CookingTime", recipe.cookingTime);
    formData.append("Difficulty", recipe.difficulty);
    formData.append("Categories", JSON.stringify(recipe.categories));
    formData.append("Ingredients", JSON.stringify(recipe.ingredients));
    formData.append("Instructions", JSON.stringify(recipe.instructions));
  
    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }
  
    try {
      const response = await fetch(`http://localhost:5028/api/recipes/${id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        console.log("Recipe updated successfully!");
        navigate("/");
      } else {
        setError("Failed to update recipe.");
      }
    } catch (err) {
      setError("An error occurred while updating.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex items-center justify-center mb-[100px]">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-3/5 px-6 py-4 mt-20 border border-blue-200 rounded-lg">
        <h1 className="text-2xl text-center">Update Recipe</h1>
  
        {/* Recipe Name */}
        <div className="flex flex-col">
          <label className="mb-2 text-lg font-medium">Recipe Name:</label>
          <input
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            type="text"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Image Upload & Preview */}
        <div className="my-4">
          <label className="text-lg font-medium">Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="imageUpload" />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer border border-gray-300 rounded-lg p-2 flex items-center justify-center w-full min-h-[300px] max-h-[300px] bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden my-4"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Selected" className="object-cover w-full h-full rounded-lg" />
            ) : (
              <span className="text-gray-500">Click to select an image</span>
            )}
          </label>
        </div>
  
        {/* Cooking Time */}
        <div className="my-4">
          <label className="text-lg font-medium">Cooking Time:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            type="text"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Difficulty Selection */}
        <div className="my-4">
          <label className="text-lg font-medium">Difficulty:</label>
          <select
            name="difficulty"
            value={recipe.difficulty}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
  
        {/* Description */}
        <div className="my-4">
          <label className="text-lg font-medium">Description:</label>
          <textarea
            className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            name="description"
            value={recipe.description}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Categories */}
        <div className="my-4">
          <label className="text-lg font-medium">Categories:</label>
          <textarea
            className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            name="categories"
            value={recipe.categories.join('\n')}
            onChange={(e) => handleArrayChange(e, 'categories')}
            placeholder="Enter categories, one per line"
          />
        </div>
  
        {/* Ingredients */}
        <div className="my-4">
          <label className="text-lg font-medium">Ingredients:</label>
          <textarea
            className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            name="ingredients"
            value={recipe.ingredients.join('\n')}
            onChange={(e) => handleArrayChange(e, 'ingredients')}
            placeholder="Enter ingredients, one per line"
          />
        </div>
  
        {/* Instructions */}
        <div className="my-4">
          <label className="text-lg font-medium">Instructions:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg h-60 focus:ring-2 focus:ring-blue-500"
            name="instructions"
            value={recipe.instructions.join('\n')}
            onChange={(e) => handleArrayChange(e, 'instructions')}
            placeholder="Enter instructions, one per line"
          />
        </div>
  
        {/* Submit Button */}
        <button type="submit" className="w-full p-2 text-white transition bg-green-500 rounded-lg hover:bg-blue-600">
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipePage;
