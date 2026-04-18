import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/books.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/userSlice";
import { 
  FaRocket, 
  FaVault, 
  FaUser, 
  FaGear, 
  FaRightFromBracket, 
  FaGem, 
  FaShieldHalved 
} from "react-icons/fa6";

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
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="absolute top-16 right-0 w-72 bg-[#080808]/95 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
              >
                {/* 1. Header: User Identity */}
                <div className="p-5 mb-1 bg-white/[0.03] rounded-[1.5rem] border border-white/5">
                   <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                         <p className="text-sm font-black text-white truncate italic uppercase tracking-tighter">
                            {userData?.name || "Bhai"}
                         </p>
                         <div className="flex items-center gap-1.5">
                            <FaShieldHalved className="text-indigo-400 text-[10px]" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Scholar Elite</span>
                         </div>
                      </div>
                   </div>
                   <p className="text-[10px] text-gray-500 font-medium truncate opacity-60">
                      {userData?.email}
                   </p>
                </div>

                <div className="p-2 space-y-1">
                  {/* 2. Commands Section */}
                  <div className="px-3 py-2 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Neural Commands</div>
                  <li
                    onClick={() => { navigate("/dashboard"); setShowProfile(false); }}
                    className="group text-sm text-gray-400 hover:text-white hover:bg-indigo-500/10 p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between list-none"
                  >
                    <div className="flex items-center gap-3">
                      <FaRocket className="text-indigo-500 transition-transform group-hover:scale-110" />
                      <span className="font-bold">Command Center</span>
                    </div>
                    <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-black italic">PRO</span>
                  </li>
                  <li
                    onClick={() => { navigate("/my-notes"); setShowProfile(false); }}
                    className="group text-sm text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 list-none"
                  >
                    <FaVault className="text-gray-600 group-hover:text-white transition-colors" />
                    <span className="font-bold">The Study Vault</span>
                  </li>

                  {/* 3. Account Section */}
                  <div className="px-3 py-2 mt-2 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Account Config</div>
                  <li 
                    onClick={() => { navigate("/profile"); setShowProfile(false); }}
                    className="group text-sm text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 list-none"
                  >
                    <FaUser className="text-gray-600 group-hover:text-white transition-colors" />
                    <span className="font-bold">Profile Config</span>
                  </li>
                  <li 
                    onClick={() => { navigate("/credits"); setShowProfile(false); }}
                    className="group text-sm text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between list-none"
                  >
                    <div className="flex items-center gap-3">
                      <FaGem className="text-blue-400 group-hover:animate-pulse" />
                      <span className="font-bold">Neural Bank</span>
                    </div>
                    <span className="text-[10px] font-black text-white">{credits}</span>
                  </li>

                  {/* 4. Logout Section */}
                  <li
                    onClick={handleSignout}
                    className="mt-2 text-sm text-red-500 hover:text-white hover:bg-red-500 p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 list-none border-t border-white/5 pt-4"
                  >
                    <FaRightFromBracket />
                    <span className="font-black italic uppercase tracking-tight">Initiate Logout</span>
                  </li>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
