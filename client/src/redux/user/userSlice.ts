import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  name: string | null;
  isAuthenticated: boolean | null;
  role: string | null;
  id?: string | null;
}

const initialState: userState = {
  name: null,
  isAuthenticated: null,
  role: null,
  id: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<userState>) => {
      return { ...state, ...action.payload };
    },

    clearUser: () => {
      return initialState
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
