export type Recipe = {
  id: number;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  servingSize: number;
  averageRating: number;
  ratingCount: number;
  imageUrl: string;
  createdAt: string;
  categories: Category[];
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export type RecipeCreate = {
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  servingSize: string;
  imageUrl: string;
};


export type Ingredient = {
  id?: number;
  name: string;
  quantity: string;
  unit: string;
  recipeId?: number;
};

export type Instruction = {
  id?: number;
  text: string;
  recipeId?: number;
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

export type User = {
  id?: string;
  userName?: string;
  profileName?: string;
}

export type RecipeComment = {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
  user: User;
}

export type RecipeUpdate = {
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  servingSize: number;
  imageUrl: string;
  categories: []
  instructions: []
  ingredients: []
};