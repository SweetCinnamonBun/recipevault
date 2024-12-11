import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";


const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />    
    <main className="flex-grow p-4">
      <Outlet /> 
    </main>
  </div>
  );
};

export default RootLayout;
