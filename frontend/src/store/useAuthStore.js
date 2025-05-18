import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSiginingUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
        } catch (error) {
            set({ authUser: null });
            console.log(error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async () => { },
    login: async () => { },
    logout: async () => { },
    updateProfile: async () => { },
}));


