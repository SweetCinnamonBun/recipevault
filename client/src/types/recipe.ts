export type Recipe = {
  id: number;
  name: string;
  cookingTime: string;
  imageFileName: string;
  createdAt: string;
  categories: [];
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export type Ingredient = {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  recipeId: number;
};

export type Instruction = {
  id: number;
  step: number;
  text: string;
  recipeId: number;
};
