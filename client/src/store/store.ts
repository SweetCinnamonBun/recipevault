import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from './recipeSlice';
import authReducer from './authSlice';

// Create the store
const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    auth: authReducer,
  },
});

// Export the store
export default store;

// Export the RootState type
export type RootState = ReturnType<typeof store.getState>;