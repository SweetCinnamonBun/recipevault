import { Link } from "react-router-dom";
import clsx from "clsx";
import { FaBook, FaPlus } from "react-icons/fa";

type Props = {
  showSidebar: boolean;
  toggleSidebar: () => void;
};

const DashboardSmallSidebar = ({ showSidebar, toggleSidebar }: Props) => {
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={toggleSidebar}
        className={clsx(
          "fixed inset-0 bg-black/40 z-40 transition-opacity lg:hidden",
          showSidebar
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      />

      {/* DRAWER (RIGHT SIDE SLIDE-IN) */}
      <aside
        className={clsx(
    "fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transition-transform duration-300 lg:hidden",
    showSidebar ? "translate-x-0" : "-translate-x-full"
  )}
      >
        <div className="relative flex flex-col h-full gap-4 p-3 text-xl">

          {/* CLOSE */}
          <button
            onClick={toggleSidebar}
            className="absolute text-2xl font-bold top-4 right-4"
          >
            ✕
          </button>

          {/* LOGO */}
          <Link
            to="/"
            onClick={toggleSidebar}
            className="flex items-center mt-6 text-xl"
          >
            <div className="w-10 h-10 bg-black rounded-full" />
            <span className="ml-2 italic font-bold">RecipeVault</span>
          </Link>

          {/* LINKS */}
          <Link
            to="/dashboard"
            onClick={toggleSidebar}
            className="flex items-center gap-3 px-2 py-3 font-semibold rounded-lg bg-amber-200 hover:bg-amber-100 mt-7"
          >
            <FaBook className="w-6 h-6" />
            <span>Your recipes</span>
          </Link>

          <Link
            to="/dashboard/create-recipe"
            onClick={toggleSidebar}
            className="flex items-center gap-3 px-2 py-3 font-semibold rounded-lg bg-amber-200 hover:bg-amber-100"
          >
            <FaPlus className="w-6 h-6" />
            <span>Create Recipe</span>
          </Link>

        </div>
      </aside>
    </>
  );
};

export default DashboardSmallSidebar;