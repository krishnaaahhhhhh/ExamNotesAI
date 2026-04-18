import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { 
  FaShieldHalved, 
  FaBoltLightning, 
  FaVault, 
  FaCircleUser,
  FaAward,
  FaArrowRightFromBracket,
  FaGear,
  FaPenNib
} from "react-icons/fa6";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/api/notes/my-notes");
        if (res.data.success) {
          setTotalNotes(res.data.notes.length);
        }
      } catch (err) {
        console.error("Profile Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const badges = [
    { name: "Zero-Day Scout", icon: <FaBoltLightning />, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    { name: "Vault Chronicler", icon: <FaVault />, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
    { name: "Logic Architect", icon: <FaAward />, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-28 relative">
        {/* Ambient Glows */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* --- HERO SECTION: IDENTITY --- */}
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative group"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="w-56 h-56 rounded-[3rem] bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-7xl font-black text-white relative z-10 border-4 border-white/10 shadow-2xl">
                  {userData?.name?.charAt(0).toUpperCase() || "S"}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-black border-4 border-[#020202] rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl">
                    <FaShieldHalved />
                  </div>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-6">
                Neural Identity Verified
              </span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 italic uppercase">
                {userData?.name || "Global Scholar"}
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Rank</span>
                    <span className="text-sm font-black text-white italic">GOD-MODE SCHOLAR</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Legacy</span>
                    <span className="text-sm font-black text-white">{totalNotes} Modules</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* --- CONTENT GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Scholar Settings */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 space-y-10"
            >
               <section className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                        <FaGear className="text-indigo-500" /> Account Protocols
                     </h3>
                     <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <FaPenNib />
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                           type="text" 
                           disabled 
                           value={userData?.name || ""} 
                           className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[1.5rem] text-sm font-bold text-white/50 cursor-not-allowed"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Secure Email</label>
                        <input 
                           type="email" 
                           disabled 
                           value={userData?.email || ""} 
                           className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[1.5rem] text-sm font-bold text-white/50 cursor-not-allowed"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Preferred Exam Target</label>
                        <div className="w-full bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-[1.5rem] text-sm font-black text-indigo-400 italic">
                           2026 PREDICTIVE MODE ACTIVE
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Account Security</label>
                        <button className="w-full bg-white text-black py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
                           Update Credentials
                        </button>
                     </div>
                  </div>
               </section>

               {/* Achievements Section */}
               <section className="p-12 rounded-[4rem] bg-indigo-500/5 border border-indigo-500/10">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                    <FaAward className="text-amber-500" /> Scholar Milestones
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {badges.map((badge, i) => (
                      <div key={i} className={`p-8 rounded-[2rem] ${badge.bg} border ${badge.border} flex flex-col items-center text-center group hover:scale-105 transition-transform cursor-pointer`}>
                        <div className={`text-4xl mb-4 ${badge.color} group-hover:scale-125 transition-transform duration-500`}>
                          {badge.icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${badge.color}`}>
                          {badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
               </section>
            </motion.div>

            {/* Right: Summary & Danger Zone */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="lg:col-span-4 space-y-8"
            >
               <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl flex">
                    <FaCircleUser />
                  </div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Account Status</h4>
                  <div className="space-y-6 relative z-10">
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Member Since</span>
                        <span className="text-white font-black text-sm italic">{new Date(userData?.createdAt).getFullYear() || "2026"}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Credits Spent</span>
                        <span className="text-white font-black text-sm italic">4.2K Units</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">API Connection</span>
                        <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Encrypted</span>
                     </div>
                  </div>
               </div>

               <div className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/10 group hover:border-red-500/30 transition-all">
                  <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-6">Danger Protocol</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8">
                    Deleting the neural link will permanently wipe all forged modules and credits. This action is irreversible.
                  </p>
                  <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3">
                    <FaArrowRightFromBracket /> Terminate Session
                  </button>
               </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
