import { FaBook, FaEdit, FaPlus, FaSearch, FaTrash, FaUserCircle } from "react-icons/fa";
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

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardPage = () => {

  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <section className="grid grid-cols-[270px_1fr] min-h-screen">
      <DashboardSidebar user={user} />
      <section>
      <header className="flex items-center justify-between h-20 px-10 bg-white ">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute text-gray-600 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary "
            />
          </div>
          <div className="flex items-center gap-3 ml-6">
            <FaUserCircle size={34} className="text-gray-600" />
            <span className="font-medium text-gray-700">
              {user?.profileName ?? "Guest"}
            </span>
          </div>
        </header>
        <Outlet />
      </section>
    </section>
  );
};

export default DashboardPage;
