import axios from "axios";
import { setUser } from "../redux/userSlice"; 

export const getCurrentUser = async (dispatch) => {
  try {
    const res = await axios.get(
      "http://localhost:5008/api/user/currentuser", // ✅ Sahi URL: /user/currentuser
      { withCredentials: true }
    );
    
    dispatch(setUser(res.data)); 
    
  } catch (error) {
    // Agar abhi bhi error aaye toh yahan check hoga
    console.log("Error fetching current user:", error.response?.status || error.message);
  }
};
export const generateNotes = async (payload) => {
  try {
    const res = await axios.post(
      "http://localhost:5008/api/notes/generate",
      payload,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.log("Error generating notes:", error.response?.status || error.message);
    throw error;
  }
};