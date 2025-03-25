import { useQuery } from "@tanstack/react-query"
import agent from "../api/agent"
import { Recipe } from "@/types/Recipe"

export const useUsers = () => {
    const { data: usersRecipes, isLoading } = useQuery({
        queryKey: ["users-recipes"],
        queryFn: async () => {
            const response = await agent.get<Recipe[]>("/api/recipes/my-recipes", {
                withCredentials: true,
            })
            return response.data;
        }
    })

    return {
        usersRecipes,
        isLoading
    }
}