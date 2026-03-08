import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/userSlice";

export const getCurrentUser = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/api/user/currentuser");
    dispatch(setUser(res.data));
  } catch (error) {
    console.log("Error fetching current user:", error.response?.status || error.message);
  }
};

export const generateNotes = async (payload) => {
  try {
    const res = await axiosInstance.post("/api/notes/generate", payload);
    return res.data;
  } catch (error) {
    console.log("Error generating notes:", error.response?.status || error.message);
    throw error;
  }
};
