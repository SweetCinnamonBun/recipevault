import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import CreateRecipePage from "./pages/CreateRecipePage";
import SelectCategoriesPage from "./pages/SelectCategoriesPage";
import CreateIngredientsAndInstructionsPage from "./pages/CreateIngredientsAndInstructionsPage";
import { Provider } from "react-redux";
import store from "./store/store";
import RecipePreviewPage from "./pages/RecipePreviewPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/recipe/:id",
        element: <RecipePage />,
      },
      {
        path: "/create-recipe",
        element: <CreateRecipePage />
      },
      {
        path: "/add-categories",
        element: <SelectCategoriesPage />
      },
      {
        path: "/ingredients-and-instructions",
        element: <CreateIngredientsAndInstructionsPage />
      },
      {
        path: "/recipe-preview",
        element: <RecipePreviewPage />
      },
    ],
  },
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
  // {
  //   path: "/register",
  //   element: <RegisterPage />,
  // },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

