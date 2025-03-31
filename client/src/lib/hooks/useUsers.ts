import { useQuery } from "@tanstack/react-query"
import agent from "../api/agent"
import { Recipe } from "@/types/Recipe"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/authSlice"

export const useUsers = () => {

    const dispatch = useDispatch();

    const { data: usersRecipes, isLoading } = useQuery({
        queryKey: ["users-recipes"],
        queryFn: async () => {
            const response = await agent.get<Recipe[]>("/api/recipes/my-recipes", {
                withCredentials: true,
            })
            return response.data;
        }
    })

    const { data: currentUser, isLoading:isLoadingUser } = useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const response = await agent.get("/api/accounts/user-info", {
                withCredentials: true,
            })
            dispatch(setUser(response.data))
            return response.data;
        }
    })

    return {
        usersRecipes,
        isLoading,
        currentUser,
        isLoadingUser
    }
}