import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  fullName: string;
  otp: string;
  isVerified: Boolean;
  
  profilePicture?: string;
  createdAt?: string;
}

interface AuthStore {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isVerifyingOTP: boolean,
  isUpdatingProfile: boolean;
  onlineUsers: [],
  checkAuth: () => Promise<void>;
  signUp: (data: any) => Promise<boolean>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  verifyOTP: (data: { email: string; otp: string }) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  isVerifyingOTP:false,

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
      toast.success("OTP sent to your email for verification")
      // toast.success("Account created successfully");
      // set({ authUser: res.data });
      return true
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      console.log("Error creating user (store)" + error);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyOTP: async({email, otp}: { email: string; otp: string }) => {
    set({isVerifyingOTP: true});
    try{
      const res = await axiosInstance.post("/auth/verify-otp", {email, otp});
      toast.success("Account verified successfully!")
      set({authUser:res.data})
      return true
    } catch(error: any){
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "OTP verification failed");
      return false;
    }finally {
      set({ isVerifyingOTP: false });
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
