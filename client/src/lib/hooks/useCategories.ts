import { Category } from "@/types/Recipe";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import agent from "../api/agent";

export const useCategories = () => {
    const { data: categories, isPending } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await agent.get<Category[]>("/api/categories");
            return response.data; 
        }
    })

    return {
        categories,
        isPending
    }
}