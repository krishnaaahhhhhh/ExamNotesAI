import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { 
  FaBoltLightning, 
  FaVault, 
  FaRocket, 
  FaArrowRight, 
  FaClockRotateLeft,
  FaShieldHalved,
  FaMicrochip,
  FaSignal
} from "react-icons/fa6";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const userName = userData?.name || "Scholar";
  
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalNotes, setTotalNotes] = useState(0);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get("/api/notes/my-notes");
        if (res.data.success) {
          setRecentNotes(res.data.notes.slice(0, 4));
          setTotalNotes(res.data.notes.length);
        }
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#020202] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden"
    >
      <Navbar />

      <motion.main 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-6 py-24 relative"
      >
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* --- TOP ROW: GREETING & STATUS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
            <motion.div 
              variants={itemVars}
              className="lg:col-span-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 backdrop-blur-xl">
                <FaBoltLightning className="animate-pulse" /> Neural Command Established
              </span>
              <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.85] mb-6 italic uppercase">
                Welcome,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white to-white/20">
                  {userName.split(" ")[0]} Bhai.
                </span>
              </h1>
              <p className="text-gray-500 text-lg font-medium max-w-xl border-l-2 border-white/5 pl-6 mt-10">
                Aapka academic neural network 100% active hai. Taiyaar ho aaj optimize karne ke liye?
              </p>
            </motion.div>

            <motion.div 
              variants={itemVars}
              className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-700"
            >
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[50px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                    <FaShieldHalved /> System Status
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase">Online</span>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <FaMicrochip className="text-indigo-400" /> Processing
                    </span>
                    <span className="text-white font-black text-sm">ELITE-V2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <FaSignal className="text-indigo-400" /> Latency
                    </span>
                    <span className="text-white font-black text-sm">24ms</span>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Academic Mastery</div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-500"
                      />
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* --- MIDDLE ROW: STATS & CREDITS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <motion.div 
               variants={itemVars}
               whileHover={{ y: -5 }}
               className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden"
            >
               <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Neural Credits</div>
               <div className="text-6xl font-black text-white tracking-tighter italic">
                 {userData?.credits || 0}
               </div>
               <button 
                  onClick={() => navigate("/credits")}
                  className="mt-8 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-3 w-full justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]"
               >
                 Boost Kapacity <FaRocket />
               </button>
            </motion.div>

            <motion.div 
               variants={itemVars}
               whileHover={{ y: -5 }}
               className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 flex flex-col justify-between"
            >
               <div>
                 <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                   <FaVault /> Study Vault
                 </div>
                 <div className="text-6xl font-black text-white tracking-tighter">
                   {totalNotes}
                 </div>
                 <div className="text-xs text-gray-600 font-bold mt-2 uppercase tracking-widest italic">Modules Archived</div>
               </div>
               <button 
                  onClick={() => navigate("/my-notes")}
                  className="mt-8 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors text-left flex items-center gap-2"
               >
                 View All Records <FaArrowRight />
               </button>
            </motion.div>

            <motion.div 
               variants={itemVars}
               whileHover={{ y: -5 }}
               className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 flex flex-col justify-center text-center group"
            >
               <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
               <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Exam Mode: {userData?.examType || "Global"}</h4>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">Auto-optimizing every note for your upcoming tests.</p>
               <button 
                  onClick={() => navigate("/notes")}
                  className="mt-6 mx-auto w-fit text-[9px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all underline decoration-white/10 underline-offset-8"
               >
                 Change Target
               </button>
            </motion.div>
          </div>

          {/* --- BOTTOM ROW: RECENTLY FORGED --- */}
          <div>
            <div className="flex items-center justify-between mb-10 px-4">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                <FaClockRotateLeft className="text-indigo-500" /> Recently Forged
              </h2>
              <button 
                onClick={() => navigate("/my-notes")}
                className="text-xs font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors"
              >
                Browse All
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 rounded-[2.5rem] bg-white/[0.03] animate-pulse" />
                ))}
              </div>
            ) : recentNotes.length === 0 ? (
              <div className="p-20 rounded-[3rem] border-2 border-dashed border-white/5 text-center flex flex-col items-center">
                 <div className="text-4xl mb-4 opacity-20">📭</div>
                 <p className="text-gray-600 font-bold uppercase tracking-widest text-xs mb-8">No modules forged yet.</p>
                 <button 
                    onClick={() => navigate("/notes")}
                    className="px-8 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-500 transition-all shadow-lg"
                 >
                   Forge First Module
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {recentNotes.map((note, i) => (
                  <motion.div
                    key={note._id}
                    variants={itemVars}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/notes/${note._id}`)}
                    className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/[0.02] transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[280px]"
                  >
                     <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaArrowRight className="text-indigo-400 -rotate-45" />
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-indigo-500/50 uppercase tracking-widest mb-4">{note.classLevel}</div>
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight uppercase italic tracking-tighter">
                          {note.topic}
                        </h3>
                     </div>
                     <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-600 font-medium">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Open</span>
                     </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
    </motion.main>
    <Footer />
  </motion.div>
  );
};

export default Dashboard;
