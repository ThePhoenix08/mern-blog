import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  isAuth: boolean;
  user: any;
  userSettings: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
  publiclyVisibleInfo: {
    email: boolean;
    fullname: boolean;
    savedBlogs: boolean;
    subscribedTo: boolean;
  };
  isVerified: boolean;
} = {
  /* isAuth: false,
  user: null,
  isVerified: false,
  userSettings: {
    emailNotifications: false,
    darkMode: false,
    language: "en",
  },
  publiclyVisibleInfo: {
    email: false,
    fullname: false,
    savedBlogs: false,
    subscribedTo: false,
  }, */

  // DUMMY DATA BELOW
  isAuth: true,
  isVerified: true,
  userSettings: {
    emailNotifications: false,
    darkMode: false,
    language: "en",
  },
  publiclyVisibleInfo: {
    email: false,
    fullname: false,
    savedBlogs: false,
    subscribedTo: false,
  },
  user: {
    _id: "671f779457e92dca865d09bc",
    username: "johndoe08",
    email: "johndoe@gmail.com",
    role: "user",
    fullname: "John Doe",
    bio: "Hey, I am on Bloggy",
    subscribedTo: [],
    isEmailVerified: false,
    createdAt: "2024-10-28T11:37:56.874Z",
    updatedAt: "2024-10-28T11:46:26.038Z",
    __v: 0,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUserCreds: (state, action) => {
      const { user, isVerified } = action.payload;
      const { userSettings } = user;
      const { publiclyVisibleInfo } = userSettings;

      delete userSettings.publiclyVisibleInfo;
      delete user.userSettings;

      state.user = user;
      state.isVerified = isVerified;
      state.isAuth = true;
      state.userSettings = userSettings;
      state.publiclyVisibleInfo = publiclyVisibleInfo;
      state.isVerified = user.isEmailVerified;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.isVerified = false;
      state.userSettings = {
        emailNotifications: false,
        darkMode: false,
        language: "en",
      };
      state.publiclyVisibleInfo = {
        email: false,
        fullname: false,
        savedBlogs: false,
        subscribedTo: false,
      };
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
  },
});

// selectors
export const selectCurrentUser = (state: any) => state.auth.user;
export const selectIsAuth = (state: any) => state.auth.isAuth;
export const selectIsVerified = (state: any) => state.auth.isVerified;

export const { setUserCreds, logout, setIsVerified } = authSlice.actions;
export default authSlice.reducer;
