import { useUsers } from "@/lib/hooks/useUsers";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const FakeProtectedRoute = () => {

//   const {isLoadingUser} = useUsers();

  const user = true; // Get the user from the auth state

//   if (isLoadingUser) {
//     return <p>Loading user!!</p>
//   }


  // If the user exists, they are authenticated; otherwise, redirect to login
  return user ? <Outlet /> : user;
};

export default FakeProtectedRoute;
