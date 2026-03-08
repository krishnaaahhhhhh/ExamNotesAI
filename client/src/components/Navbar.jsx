import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/books.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/userSlice";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const credits = userData ? userData.credits : 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCredits, setShowCredits] = useState(false);
  const [showProfile, setShowProfile] = useState(false);



  const userInitial = userData?.name
    ? userData.name.charAt(0).toUpperCase()
    : "U";

  const toggleCredits = () => {
    setShowCredits(!showCredits);
    if (showProfile) setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    if (showCredits) setShowCredits(false);
  };

  const handleSignout = async () => {
    try {
      await axiosInstance.get("/api/auth/logout");
      localStorage.removeItem("token");
      dispatch(setUser(null));
      navigate("/auth");
    } catch (error) {
      console.error("Logout Error:", error);
      localStorage.removeItem("token");
      dispatch(setUser(null));
      navigate("/auth");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 relative z-50 mx-6 mt-6 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl flex items-center justify-between px-8 py-4"
    >
      {/* Left: Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-white tracking-tight">
          ExamNotes AI
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* 1. CREDITS SECTION */}
        <div className="relative">
          <motion.div
            onClick={toggleCredits}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-all"
          >
            <span className="text-blue-400">💎</span>
            <span className="text-gray-300 font-medium text-sm">
              {credits} Credits
            </span>
            <span className="text-xs text-gray-500">➕</span>
          </motion.div>

          <AnimatePresence>
            {showCredits && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-14 right-0 w-64 bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl shadow-3xl z-50"
              >
                <h4 className="font-bold text-blue-400 mb-2">Refill Credits</h4>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  AI generation ke liye credits zaroori hain. Boost karein!
                </p>
                <button className="w-full py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-500 transition-all active:scale-95">
                  Buy More Credits
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. PROFILE SECTION */}
        <div className="relative">
          <motion.div
            onClick={toggleProfile}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer border-2 border-white/20 shadow-lg shadow-indigo-500/20"
          >
            {userInitial}
          </motion.div>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-14 right-0 w-56 bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl shadow-3xl z-50"
              >
                <div className="border-b border-white/5 pb-3 mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    Logged in as
                  </p>
                  <p className="text-sm font-medium text-white truncate">
                    {userData?.email || "User"}
                  </p>
                </div>
                <ul className="flex flex-col gap-1">
                  <li className="text-sm text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-all">
                    My Profile
                  </li>
                  <li className="text-sm text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-all">
                    Settings
                  </li>
                  <li
                    onClick={handleSignout}
                    className="mt-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg cursor-pointer transition-all border-t border-white/5 pt-3"
                  >
                    Logout
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
