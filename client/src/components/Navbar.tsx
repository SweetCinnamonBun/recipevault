import React from "react";
import SearchBox from "./SearchBox";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5028/api/accounts/logout", {
        method: "POST", // Assuming logout requires a POST request
        credentials: "include", // Include cookies if needed for authentication
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if required (e.g., authorization tokens)
        },
      });
  
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
    <div className="flex justify-between px-20 py-4 bg-white">
      <div className="flex items-center">
        <figure>
          <Link to="/">- Logo</Link>
        </figure>
      </div>
      {/* <div>
        <SearchBox />
      </div> */}
      <div className="flex items-center space-x-3 font-semibold text-md">
        <span>Home</span>
        <Link to="/favorites">Favorites</Link>
        <span>Profile</span>
        <Link to="/create-recipe">Create Recipe</Link>
        <Link to="/add-categories">Category selection</Link>
        <Link to="/ingredients-and-instructions">
          Instructions and Ingredients
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
