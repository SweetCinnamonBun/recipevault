import { useMutation } from "@tanstack/react-query"
import agent from "../api/agent"
import { toast } from "react-toastify"

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

    const deleteImage = useMutation({
        mutationFn: async (fileName:string) => {
            await agent.delete(`/api/images/delete?fileName=${fileName}`)
        },
        onSuccess: async () => {
            
        },
        onError: async (error) => {
            console.error("Image deletion failed...", error);
        }
    })


    return {
        postImage,
        deleteImage
    }
}