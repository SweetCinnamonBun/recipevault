import React from "react";
import SearchBox from "./SearchBox";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { FaHome, FaHeart, FaUser, FaBook, FaPlus } from "react-icons/fa";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5028/api/accounts/logout",
        {
          method: "POST", // Assuming logout requires a POST request
          credentials: "include", // Include cookies if needed for authentication
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if required (e.g., authorization tokens)
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
      dispatch(setUser(null));
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-20 py-4 bg-white">
      <div className="flex items-center">
        <figure>
          <Link to="/">
            <div className="w-10 h-10 bg-black rounded-full">

            </div>
          </Link>
        </figure>
      </div>
      {/* <div>
        <SearchBox />
      </div> */}
      <div className="flex items-center font-semibold space-x-7 text-md">
        <Link
          to="/"
          className="flex flex-col items-center space-x-1 hover:text-yellow-500"
        >
          <FaHome className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/favorites"
          className="flex flex-col items-center space-x-1 hover:text-red-500"
        >
          <FaHeart className="w-5 h-5" />
          <span>Favorites</span>
        </Link>

        {/* <Link
          to="/profile"
          className="flex flex-col items-center space-x-1 hover:text-blue-500"
        >
          <FaUser className="w-5 h-5" />
          <span>Profile</span>
        </Link> */}

        <Link
          to="/your-recipes"
          className="flex flex-col items-center space-x-1 hover:text-green-500"
        >
          <FaBook className="w-5 h-5" />
          <span>Your Recipes</span>
        </Link>

        <Link
          to="/create-recipe"
          className="flex flex-col items-center space-x-1 hover:text-purple-500"
        >
          <FaPlus className="w-5 h-5" />
          <span>Create Recipe</span>
        </Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <Link
            className="px-4 py-2 border border-blue-600 rounded-full text-md"
            to="/register"
            onClick={logout}
          >
            Logout
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              className="px-4 py-2 border border-blue-600 rounded-full text-md"
              to="/register"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-white bg-blue-600 rounded-full text-md"
            >
              login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
