import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setRecipe } from "@/store/recipeSlice";
import { useNavigate } from "react-router";
import { FaRegClock } from "react-icons/fa";
import { useImages } from "@/lib/hooks/useImages";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { ClipLoader } from "react-spinners";
import {FieldValues, useForm} from "react-hook-form"
import { recipeSchema, RecipeSchema } from "@/lib/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod"

const CreateRecipePage = () => {
  const [name, setName] = useState("");
  // const [cookingTime, setCookingTime] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [imageFile, setImageFile] = useState(null);
  const [timeUnit, setTimeUnit] = useState("min");
  const [servingSize, setServingSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { postImage } = useImages();
  const { createRecipe } = useRecipes();
  const {register, reset, handleSubmit, formState: { errors }} = useForm<RecipeSchema>({
    mode: 'onTouched',
    resolver: zodResolver(recipeSchema)
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSubmit = async (data:RecipeSchema) => {
    setIsLoading(true);
    let imageUrl = null;
  
    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append("ImageFile", imageFile);
  
      try {
        const res = await postImage.mutateAsync(imageFormData);
        imageUrl = res;
      } catch (error) {
        console.error("Image upload failed:", error);
        setIsLoading(false);
        return;
      }
    }
  
    const fullCookingTime = `${data.cookingTime} ${timeUnit}`;
  
    const recipeData = {
      ...data,
      cookingTime: fullCookingTime,
      imageUrl,
    };
  
    try {
      const response = await createRecipe.mutateAsync(recipeData);
      dispatch(setRecipe(response));
      navigate("/add-categories");
      reset(); // Reset form values
    } catch (error) {
      console.error("Recipe creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  }


  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   setIsLoading(true);
  //   let imageUrl = null;

  //   // Step 1: Upload the image (if provided)
  //   if (imageFile) {
  //     const imageFormData = new FormData();
  //     imageFormData.append("ImageFile", imageFile);

  //     try {
  //      const data = await postImage.mutateAsync(imageFormData);
  //      imageUrl = data;

  //     } catch (error) {
  //       console.error("An error occurred while uploading the image:", error);
  //       return;
  //     } 
  //   }

  //   const fullCookingTime = `${cookingTime} ${timeUnit}`;
  //   const recipeData = {
  //     name: name,
  //     cookingTime: fullCookingTime,
  //     description: description,
  //     difficulty: difficulty,
  //     imageUrl: imageUrl,
  //     servingSize: servingSize, 
  //   };

  //   try {

  //       const response = await createRecipe.mutateAsync(recipeData)
  //       dispatch(setRecipe(response));
  //       console.log("Recipe created successfully!");
  //       window.scrollTo({ top: 0, behavior: "smooth" });
  //       navigate("/add-categories");
  //       setIsLoading(false);
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="w-3/5 px-10 py-4 mt-20 bg-white rounded-lg"
        >
          <h1 className="text-2xl text-center">Create Recipe</h1>
          <div className="flex flex-col">
            <label className="mb-2 text-lg font-medium">Recipe Name:</label>
            <input
              className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-300"
              type="text"
              {...register("name")}
              required
            />
            {errors.name && (
    <span className="mt-1 text-sm text-red-500">{errors.name.message}</span>
  )}
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
              className="cursor-pointer border border-gray-300 rounded-lg p-2 flex items-center justify-center w-full min-h-[459px] max-h-[459px] bg-orange-50 hover:bg-green-50 transition relative overflow-hidden my-4"
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected"
                  className="object-contain w-full h-full rounded-lg"
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
                  {...register("cookingTime")}
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
          </div>

          <button
            type="submit"
            className={`w-full p-2 text-white transition  rounded-lg hover:bg-blue-600 ${ isLoading ? "bg-green-100" : "bg-green-500"} `}
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader color="#fff" size={20}/>
            ) : (
            "Next"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRecipePage;
