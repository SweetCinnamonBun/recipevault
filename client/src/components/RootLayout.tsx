import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "@/store/authSlice";


const RootLayout = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/accounts/user-info", {
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          const user = await response.json();
          dispatch(setUser(user)); // Set the user in the global state
        } else {
          dispatch(setUser(null)); // Clear the user if not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        dispatch(setUser(null));
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />    
    <main className="flex-grow md:p-4">
      <Outlet /> 
    </main>
  </div>
  );
};

export default RootLayout;
