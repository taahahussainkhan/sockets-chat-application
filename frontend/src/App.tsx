import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [authUser]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />;
      </div>
    );

  console.log(authUser);

  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/settings"
          element={authUser ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
