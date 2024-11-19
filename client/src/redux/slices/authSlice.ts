import login from "@/components/feature/authentication/api/login";
import { Blogger } from "@/data/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  isAuth: boolean;
  user: Partial<Blogger> | null;
  isVerified: boolean;
} = {
  isAuth: false,
  user: null,
  isVerified: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUserCreds: (state, action) => {
      const { user } = action.payload;
      if (!user) throw new Error("ReduxError: User missing in payload");

      state.user = user;
      state.isAuth = true;
      state.isVerified = user.isEmailVerified;
    },
    logout: (state) => {
      state.isAuth = false;
      state.isVerified = false;
      state.user = null;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    updateAvatar: (state, action) => {
      if (state.user === null)
        throw new Error("ReduxError: User missing in state");
      state.user.avatar = action.payload;
    },
  },
});

// selectors
export const selectCurrentUser = (state: any) =>
  state.auth.user as Partial<Blogger>;
export const selectIsAuth = (state: any) => state.auth.isAuth;
export const selectIsVerified = (state: any) => state.auth.isVerified;

export const { setUserCreds, logout, setIsVerified, updateAvatar } =
  authSlice.actions;
export default authSlice.reducer;
