import { FaBook, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { GrAnalytics } from "react-icons/gr";
import { Link, Outlet } from "react-router";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { useImages } from "@/lib/hooks/useImages";
import { toast } from "react-toastify";
import { useUsers } from "@/lib/hooks/useUsers";
import { Recipe } from "@/types/Recipe";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import RecipeStars from "@/components/RecipeStars";
const DashboardPage = () => {
  const { usersRecipes, isLoading } = useUsers();
  const { deleteRecipe } = useRecipes();
  const { deleteImage } = useImages();

  const handleDeleteRecipe = async (recipeId: number, imageUrl: string) => {
    try {
      const fileName = imageUrl.split("/").pop();

      if (fileName) {
        await deleteImage.mutateAsync(fileName);
        await deleteRecipe.mutateAsync(recipeId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the recipe or image.";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="grid grid-cols-[222px_1fr] min-h-screen">
      <aside className="bg-white">
        <div className="sticky top-0 flex flex-col items-center">
          <Link to="/" className="p-10 text-2xl">
            RecipeVault
          </Link>
          <ul className="flex flex-col w-full px-1 gap-y-3">
            <li className="px-2 py-2 mx-1 rounded-lg bg-amber-200">
              <Link
                to="/dashboard"
                className="grid grid-cols-[auto_1fr] gap-2 text-md items-center"
              >
                <FaBook className="w-7 h-7" />
                <span>Your recipes</span>
              </Link>
            </li>
            <li className="px-2 py-2 mx-1 rounded-lg bg-amber-200 hover:bg-amber-100">
              <Link
                to="/dashboard/create-recipe"
                className="grid grid-cols-[auto_1fr] gap-2 text-md items-center"
              >
                <FaPlus className="w-7 h-7" />
                <span>Create recipe</span>
              </Link>
            </li>
            <li className="px-2 py-2 mx-1 rounded-lg bg-amber-200">
              <Link
                to="/dashboard"
                className="grid grid-cols-[auto_1fr] gap-2 text-md items-center"
              >
                <GrAnalytics className="w-7 h-7" />
                <span>Analytics</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      <section>
       <Outlet />
      </section>
    </section>
  );
};

export default DashboardPage;
