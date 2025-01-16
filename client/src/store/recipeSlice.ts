import { Ingredient, Instruction, Recipe } from "@/types/Recipe";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Recipe = {
  id: 0,
  name: "",
  description: "",
  cookingTime: "",
  imageFileName: "",
  createdAt: "",
  categories: [],
  ingredients: [],
  instructions: [],
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setRecipe(state, action) {
      return { ...state, ...action.payload };
    },
    addIngredients: (state, action: PayloadAction<Ingredient[]>) => {
        state.ingredients = [...state.ingredients, ...action.payload]
    },
    addInstructions: (state, action: PayloadAction<Instruction[]>) => {
        state.instructions = [...state.instructions, ...action.payload]
    },
  },
});

export const { setRecipe, addIngredients, addInstructions } = recipeSlice.actions;

export default recipeSlice.reducer;