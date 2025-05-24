import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = create((set) => ({
    messages:{},
    users:[],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading:false,


    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const response = await axiosInstance.get("/messages/users");
            set({ users: response.data });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId: string ) => {
        set({ isMessageLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set((state: any) => ({
                messages: { ...state.messages, [userId]: response.data }
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to fetch messages");
        } finally {
            set({ isMessageLoading: false });
        }
    },
    setSelectedUser:(selectedUser:any) => set({ selectedUser}),
    
}));