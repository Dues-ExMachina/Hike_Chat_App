import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from './useAuthStore.js';

//get is used to get the data under here to sendMessage function
export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,




    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users")
            set({ users: res.data })
        } catch (error) {
            toast.error(error.reaponse.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },


    //for geting msg
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.reaponse.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },


    //for sending msg
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            // ...messages will keep the previous data and update the new one at the same time
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.reaponse.data.message)
        }
    },

    //for Real time messeging
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        //getting sokect from authStore using zustand
        const socket = useAuthStore.getState().socket;



        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if (!isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    //when we dont want the messeges in realtime
    unsubscribeFromMessages: () => {


        //getting sokect from authStore using zustand
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },


    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    }
}))