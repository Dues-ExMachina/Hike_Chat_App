import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development"
        ? "http://localhost:5001/api"
        : "https://hike-chat-app-9jml.onrender.com",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
