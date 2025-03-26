import { Category } from "@/types/Recipe";
import { useMutation, useQuery } from "@tanstack/react-query"
import agent from "../api/agent";


type CategoryAddition = {
    recipeId: number,
    categoryIds: (number | undefined)[];
}

export const useCategories = () => {
    const { data: categories, isPending } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await agent.get<Category[]>("/api/categories");
            return response.data; 
        },
        staleTime: 20_000,
        refetchOnWindowFocus: false
    })

    const addCategoriesToRecipe = useMutation({
        mutationFn: async (requestBody: CategoryAddition) => {
             await agent.post("/api/categories/add-to-recipe", requestBody)
            
        },
        onError: async () => {
            console.error("Problem occurred when adding categories to recipe");
        }
    })

    return {
        categories,
        isPending,
        addCategoriesToRecipe
    }
}