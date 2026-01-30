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
import TestPfpImg from "@/assets/images/pexels-ella-olsson-572949-1640777.jpg";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const DashboardPage = () => {
  const { deleteRecipe } = useRecipes();
  const { deleteImage } = useImages();

  const user = useSelector((state: RootState) => state.auth.user);

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
    <section className="grid grid-cols-[270px_1fr] min-h-screen">
      <aside className="bg-white">
        <div className="sticky top-0 flex flex-col h-screen px-2">
          <Link to="/" className="p-10 text-2xl text-center">
            RecipeVault
          </Link>

          <ul className="flex flex-col flex-1 gap-y-3">
            <li className="px-2 py-3 rounded-lg bg-amber-200">
              <Link
                to="/dashboard"
                className="grid grid-cols-[auto_1fr] gap-2 items-center text-md"
              >
                <FaBook className="w-6 h-6" />
                <span>Your recipes</span>
              </Link>
            </li>
            <li className="px-2 py-3 rounded-lg bg-amber-200 hover:bg-amber-100">
              <Link
                to="/dashboard/create-recipe"
                className="grid grid-cols-[auto_1fr] gap-2 items-center text-md"
              >
                <FaPlus className="w-6 h-6" />
                <span>Create recipe</span>
              </Link>
            </li>
            <li className="px-2 py-3 rounded-lg bg-amber-200">
              <Link
                to="/dashboard/analytics"
                className="grid grid-cols-[auto_1fr] gap-2 items-center text-md"
              >
                <GrAnalytics className="w-6 h-6" />
                <span>Analytics</span>
              </Link>
            </li>
          </ul>

          <div className="grid mt-auto border-t border-gray-300 h-28 place-items-center">
            <div className="flex items-center gap-4">
              <figure className="overflow-hidden rounded-full w-14 h-14">
                <img
                  src={TestPfpImg}
                  alt="profile-img"
                  className="object-cover w-full h-full"
                />
              </figure>
              <span>{user?.profileName}</span>
            </div>
          </div>
        </div>
      </aside>
      <section>
        <Outlet />
      </section>
    </section>
  );
};

export default DashboardPage;
