import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';

interface User {
  id: string;
  email: string;
  
}

interface AuthStore {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;F
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    F: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check-auth");
            set({ authUser: response.data });
        } catch (error) {
            set({ authUser: null });
            console.log(error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => { 
        set({ isSigningUp: true });
    },
    login: async () => { },
    logout: async () => { },
    updateProfile: async () => { },
}));