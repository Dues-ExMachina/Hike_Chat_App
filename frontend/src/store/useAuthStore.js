
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

//For localdevelopment
//const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"; 

const BASE_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:5001" 
    : "https://hikechatapp-production.up.railway.app";

export const useAuthStore = create((set, get) => ({
    //initially we dont know if user is authenticated so null
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,

    // ✅ Add this default to prevent "undefined.includes" error
    onlineUsers: [],

    // ✅ Optional: Function to update online users
    setOnlineUsers: (users) => set({ onlineUsers: users }),

    //now we are checking the auth hence loading
    isCheckingAuth: true,


    //checking authentication
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
            //connect with the socket imidiatly after authentication success
            get().connectSoket();
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    //Signing Up
    signup: async (data) => {
        set({ isSigningUp: true })
        // WHY THIS IS NOT WORKING?????? // i think it is working now
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account Created!!")
            //connect with the socket imidiatly after authentication success
            get().connectSoket();
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in singingup:", error)
        } finally {
            set({ isSigningUp: false })
        }
    },

    //Now logging out
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast('Logged out!', {
                icon: '👋',
            });
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    //Now logging in 
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            //connect with the socket imidiatly after authentication success
            get().connectSoket();
        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isLoggingIn: false });
        }
    },


    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile Updated!")
        } catch (error) {
            console.log("error in updateProfile: ", error)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    //connect with the soket server
    connectSoket: () => {
        //get auth user 
        const { authUser } = get();
        //getout of the funtion if not authuser or already connected
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect();

        set({ socket: socket });

        //Listen to the broadcast
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        }
        )
    },
    //Disconnect from the soket server
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket && socket.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}))
