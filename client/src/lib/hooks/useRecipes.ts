import { RecipeCreate, RecipeUpdate } from "@/types/Recipe"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent"
import { toast } from "react-toastify";

export const useRecipes = (id?: string) => {

    const queryClient = useQueryClient();

    const { data: recipe, isLoading:isLoadingRecipe } = useQuery({
        queryKey: ["recipe", id],
        queryFn: async () => {
            const response = await agent.get(`/api/recipes/${id}`)
            return response.data;
        },
        staleTime: 20_000,
        refetchOnWindowFocus: false
    })

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

    const updateRecipe = useMutation({
        mutationFn: async (recipe: RecipeUpdate) => {
            await agent.put(`/api/recipes/${id}`, recipe, {
                withCredentials: true
            })
        },
        onSuccess: async () => {
           await queryClient.invalidateQueries({
            queryKey: ["recipe", id]
           }) 
           toast.success("Recipe updated!")
        },
        onError: async () => {
            console.error("Failed to create recipe")
            toast.error("Failed to update recipe...")
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
        deleteRecipe,
        recipe,
        isLoadingRecipe,
        updateRecipe
    }
}