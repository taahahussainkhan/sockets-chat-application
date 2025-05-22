import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  createdAt?: string;
}

interface AuthStore {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ authUser: response.data });
      // toast.success("User authenticated successfully");
    } catch (error) {
      set({ authUser: null });
      console.log(error);
      toast.error("User not authenticated(store)");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      console.log("User create");
      toast.success("Account created successfully");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      console.log("Error creating user (store)" + error);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log("User Logged in(Store)");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      console.log("Error logging in (store)" + error);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
