import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    <motion.nav
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-6 mx-auto max-w-[95%] z-[100] rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between px-8 py-4 transition-all hover:border-indigo-500/30"
    >
      {/* 1. Left: Logo with Shine & Neural Subtitle */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-4 cursor-pointer group relative"
        onClick={() => navigate("/")}
      >
        <div className="relative">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-11 h-11 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:rotate-[15deg] transition-all duration-500" 
          />
          {/* Subtle Glow Behind Logo */}
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-white tracking-tighter leading-none italic uppercase">
            ExamNotes <span className="text-indigo-500 not-italic">AI</span>
          </span>
          <span className="text-[9px] font-black text-indigo-400 tracking-[0.3em] uppercase opacity-60 mt-1">Neural Engine v2.0</span>
        </div>
      </motion.div>

      {/* 2. Right: Interactive Action Cluster */}
      <div className="flex items-center gap-6">
        {/* Credits Section with Pulsing Core */}
        <div className="relative group">
          <motion.div
            onClick={toggleCredits}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-white/[0.04] border border-white/5 px-5 py-2.5 rounded-full cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          >
            <div className="relative flex items-center justify-center">
              <span className="text-sm">💎</span>
              <span className="absolute inset-0 bg-blue-400/40 blur-sm rounded-full animate-pulse" />
            </div>
            <span className="text-white font-black text-xs tracking-widest uppercase">
              {credits} <span className="text-gray-500 font-medium">Neural Credits</span>
            </span>
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping ml-1" />
          </motion.div>

          <AnimatePresence>
            {showCredits && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="absolute top-16 right-0 w-72 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[110]"
              >
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-indigo-500/20 rounded-lg"><FaGem className="text-indigo-400" /></div>
                   <h4 className="font-black text-white uppercase tracking-tighter">Neural Refill</h4>
                </div>
                <p className="text-[11px] text-gray-400 mb-5 leading-relaxed font-medium">
                  Boost your exam engineering capacity with premium credits. Unlock high-depth analysis.
                </p>
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95">
                  Expand Intelligence
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Section with Squircle Gradient Border */}
        <div className="relative group">
          <motion.div
            onClick={toggleProfile}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] cursor-pointer shadow-[0_10px_20px_rgba(99,102,241,0.3)] group-hover:shadow-indigo-500/50 transition-all duration-300"
          >
            <div className="w-full h-full bg-[#080808] rounded-[12px] flex items-center justify-center text-white font-black text-lg border border-white/10">
              {userInitial}
            </div>
          </motion.div>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute top-16 right-0 w-80 bg-[#080808]/95 backdrop-blur-3xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] z-[110] overflow-hidden"
              >
                {/* Profile Identity Card */}
                <div className="p-6 mb-2 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[2rem] border border-white/5 relative overflow-hidden group">
                   <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl border border-white/20">
                        {userInitial}
                      </div>
                      <div className="flex flex-col">
                         <p className="text-base font-black text-white italic uppercase tracking-tighter leading-none mb-1">
                            {userData?.name || "Neural User"}
                         </p>
                         <div className="flex items-center gap-2">
                            <FaShieldHalved className="text-indigo-400 text-[10px]" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Scholar Elite</span>
                         </div>
                      </div>
                   </div>
                   {/* Background Decorative Glow */}
                   <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-all" />
                </div>

                <div className="p-2 space-y-1.5">
                  <div className="px-4 py-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Subsystem Commands</div>
                  
                  <motion.li
                    whileHover={{ x: 5, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                    onClick={() => { navigate("/dashboard"); setShowProfile(false); }}
                    className="group text-[13px] text-gray-400 hover:text-white p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between list-none"
                  >
                    <div className="flex items-center gap-4">
                      <FaRocket className="text-indigo-500 text-lg" />
                      <span className="font-bold tracking-tight">Command Center</span>
                    </div>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md font-black italic">ACTIVE</span>
                  </motion.li>

                  <motion.li
                    whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    onClick={() => { navigate("/my-notes"); setShowProfile(false); }}
                    className="group text-[13px] text-gray-400 hover:text-white p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-4 list-none"
                  >
                    <FaVault className="text-gray-500 group-hover:text-white text-lg" />
                    <span className="font-bold tracking-tight">The Study Vault</span>
                  </motion.li>

                  <div className="px-4 py-2 mt-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Account Matrix</div>
                  
                  <motion.li 
                    whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    onClick={() => { navigate("/profile"); setShowProfile(false); }}
                    className="group text-[13px] text-gray-400 hover:text-white p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-4 list-none"
                  >
                    <FaUser className="text-gray-500 group-hover:text-white text-lg" />
                    <span className="font-bold tracking-tight">Profile Config</span>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleSignout}
                    className="mt-4 text-xs text-red-500 hover:text-white hover:bg-red-500 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-3 list-none border border-red-500/20 bg-red-500/5 group"
                  >
                    <FaRightFromBracket className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-black italic uppercase tracking-widest">Terminate Session</span>
                  </motion.li>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Background Glow Layer */}
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </motion.nav>

  );
};

export default Navbar;
