import axios from "axios";

// In dev: Vite proxy handles /api → localhost:5008 (no CORS issue)
// In prod: Direct URL from env variable
const API_BASE_URL = import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5008");

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Attach token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
