import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUserProfile: (state, action) => {
      const { user } = action.payload;
    };
  },
});