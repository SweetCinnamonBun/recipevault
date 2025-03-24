import { RecipeCreate } from "@/types/Recipe"
import { useMutation } from "@tanstack/react-query"
import agent from "../api/agent"

export const useRecipes = () => {

    const createRecipe = useMutation({
        mutationFn: async (recipe: RecipeCreate) => {
            const response = await agent.post("/api/recipes", recipe, {
                withCredentials: true,
            })
            return response.data;
        },
        onSuccess: async () => {
           
        },
        onError: async () => {
            console.error("Failed to create recipe")
        }   
    })

    return {
        createRecipe,
    }
}