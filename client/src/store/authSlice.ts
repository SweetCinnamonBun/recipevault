import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the User type (adjust based on your backend response)
type User = {
  firstName: string;
  lastName: string;
  email: string;
  profileName: string;
};

// Define the initial state
type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to directly set the user
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

// Export the action
export const { setUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;