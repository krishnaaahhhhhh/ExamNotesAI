import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaArrowRight,
  FaVault,
  FaRegFileLines,
  FaClockRotateLeft,
} from "react-icons/fa6";

const MyNotes = () => {
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyNotes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5008/api/notes/my-notes",
          { withCredentials: true },
        );

        if (res.data.success) {
          setUserNotes(res.data.notes);
        } else {
          setError("Failed to load notes");
        }
      } catch (err) {
        console.error("Vault Fetch Error:", err);
        setError("Server error while fetching notes");
      } finally {
        setLoading(false);
      }
    };

    fetchMyNotes();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col overflow-x-hidden relative selection:bg-indigo-500/30">
      <Navbar />

      {/* --- Premium Background Layering --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-28 relative z-10">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
              <FaVault className="animate-pulse" /> Secure Archive
            </div>
            <h1 className="text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none">
              THE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-white">
                VAULT
              </span>
            </h1>
            <p className="text-gray-500 mt-6 font-medium text-lg leading-relaxed border-l-2 border-white/5 pl-6">
              Krishna bhai, aapke AI-generated{" "}
              <span className="text-white italic font-bold">God-Level</span>{" "}
              notes yahan safe hain. Efficiency archived. Excellence ready.
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-5xl font-black text-white/5 select-none leading-none tracking-tighter uppercase italic">
              Records: {userNotes.length}
            </div>
          </div>
        </motion.div>

        {/* --- Content Area --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-[3rem] bg-white/[0.03] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-10 rounded-[3rem] bg-red-500/10 border border-red-500/20 text-red-400 text-center font-bold">
            {error}
          </div>
        ) : userNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 bg-white/[0.01] rounded-[4rem] border border-dashed border-white/10 backdrop-blur-sm"
          >
            <FaRegFileLines className="mx-auto text-4xl text-gray-800 mb-6" />
            <p className="text-gray-500 text-2xl font-black italic uppercase tracking-tighter">
              Vault khali hai Krishna bhai.
            </p>
            <p className="text-gray-700 text-xs uppercase tracking-widest mt-2">
              Generate something legendary to populate the archive.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {userNotes.map((note, index) => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -10 }}
                  className="group relative p-10 rounded-[3rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 hover:border-indigo-500/40 transition-all duration-700 backdrop-blur-3xl overflow-hidden flex flex-col justify-between min-h-[400px]"
                >
                  {/* Hover Glow Component */}
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-xl text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all duration-500 shadow-inner">
                        <FaRegFileLines />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-indigo-400/50 uppercase tracking-widest bg-indigo-500/5 px-3 py-1 rounded-full group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                          {note.classLevel || "Pro"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4 group-hover:text-indigo-400 transition-colors leading-tight">
                      {note.topic || "Untitled Note"}
                    </h3>

                    <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      {typeof note.content === "string"
                        ? note.content.substring(0, 180)
                        : "Advanced AI analysis processed and ready for your review."}
                      ...
                    </p>
                  </div>

                  <div className="relative z-10 pt-10 flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/notes/${note._id}`)}
                      className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-white/30 group-hover:text-white transition-all duration-300"
                    >
                      OPEN MODULE{" "}
                      <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
                    </button>

                    <div className="flex items-center gap-2 text-[10px] text-gray-700 font-bold uppercase group-hover:text-gray-500 transition-colors">
                      <FaClockRotateLeft />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyNotes;
