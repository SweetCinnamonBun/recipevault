import { RecipeCreate } from "@/types/Recipe"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent"
import { toast } from "react-toastify";

export const useRecipes = () => {

    const queryClient = useQueryClient();

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

    const deleteRecipe = useMutation({
        mutationFn: async (recipeId:number) => {
            await agent.delete(`api/recipes/${recipeId}`, {
                withCredentials: true,
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["users-recipes"]
            })
            toast("Recipe deleted successfully!");
        },
        onError: async (error) => {
            console.error("something went wrong...", error)
        }
    })

    return {
        createRecipe,
        deleteRecipe
    }
}