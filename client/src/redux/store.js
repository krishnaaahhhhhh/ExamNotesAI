import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js'; // Check karein 'l' hai ya nahi

export default configureStore({
  reducer: {
    user: userReducer,
  },
});