export type Recipe = {
  id: number;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
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


export type Category = {
  id: number;
  name: string;
  slug: string;
}

export type AddIngredient = {
  name: string;
  quantity: string;
  unit: string;
}

export type AddInstruction = {
  text: string;
}