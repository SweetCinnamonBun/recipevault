import { useMutation } from "@tanstack/react-query"
import agent from "../api/agent"

export const useImages = () => {
    const postImage = useMutation({
        mutationFn: async (imageData: FormData) => {
           const response =  await agent.post("/api/images/upload", imageData)
           return response.data.imageUrl;
        },
        onSuccess: async () => {
            
        },
        onError: async (error) => {
            console.error("Image upload failed:", error)
        }
    })



    return {
        postImage,
    }
}