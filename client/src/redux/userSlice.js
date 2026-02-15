import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions; // Check karein 'setUser' hi likha hai
export default userSlice.reducer;