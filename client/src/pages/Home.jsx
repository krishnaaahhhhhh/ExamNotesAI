import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import {
  FaArrowDown,
  FaBookOpen,
  FaDiagramProject,
  FaFilePdf,
  FaCompass,
  FaBoltLightning,
} from "react-icons/fa6";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto mt-8 px-6">
        <div className="rounded-[4rem] p-12 lg:p-32 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 relative overflow-hidden shadow-2xl">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-12 backdrop-blur-xl"
            >
              <FaBoltLightning className="animate-pulse" /> Gemini 3.0 Flash
              Core
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter mb-12"
            >
              CRAFT YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white to-white/20 italic">
                INTELLECT.
              </span>
            </motion.h1>

            {/* --- ATTRACTIVE MESSAGE UPGRADE --- */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <p className="text-gray-400 text-lg lg:text-2xl font-medium leading-relaxed italic">
                "Ideas are cheap, execution is everything."
              </p>
              <p className="text-gray-500 text-base lg:text-xl font-medium leading-relaxed">
                Welcome to a sanctuary for{" "}
                <span className="text-white">creators and doers</span>. This
                isn't just a tool; it's an engine where raw potential is forged
                into
                <span className="text-indigo-400"> peak performance</span>.
                Here, we don’t wait for opportunity—we{" "}
                <span className="italic text-white underline decoration-indigo-500/50 underline-offset-8">
                  generate
                </span>{" "}
                it. Every circuit of this ecosystem is engineered to give you
                absolute control to build, scale, and dominate your academic
                legacy.
              </p>
              <div className="pt-4">
                <span className="text-xs font-black tracking-[0.3em] uppercase text-gray-600">
                  The future belongs to the builders. — Krishna
                </span>
              </div>
            </motion.div>

            {/* --- SERVICE INDICATOR --- */}
            <div className="flex flex-col items-center gap-4 mt-20">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500/80">
                Dive into the Services
              </span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES: BENTO GRID --- */}
      <section className="max-w-7xl mx-auto py-40 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <BentoCard
            cols="md:col-span-8"
            icon={<FaBookOpen />}
            title="Exam Engineering"
            desc="Synthesize complex syllabi into high-retention wisdom. Designed for those who aim for the top tier."
            tag="Popular"
          />

          <BentoCard
            cols="md:col-span-4"
            icon={<FaCompass />}
            title="Syllabus Sync"
            desc="Real-time academic goal tracking powered by multimodal AI logic."
            tag="Smart"
          />

          <BentoCard
            cols="md:col-span-4"
            icon={<FaDiagramProject />}
            title="Visual Logic"
            desc="Transmuting chaotic data into elegant flowcharts and diagrams."
            tag="AI Viz"
          />

          <BentoCard
            cols="md:col-span-8"
            icon={<FaFilePdf />}
            title="Vector Exports"
            desc="Master-grade PDFs. Optimized for clarity, built for the professional aesthetic."
            tag="Pro"
          />
        </div>

        {/* --- FINAL DIRECTION SECTION --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-16 lg:p-24 rounded-[4rem] bg-indigo-600/5 border border-indigo-500/10 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic select-none text-white">
            NEXT
          </div>

          <h3 className="text-4xl lg:text-6xl font-black mb-8 italic uppercase tracking-tighter">
            Ready to Forge?
          </h3>

          <p className="text-gray-400 mb-12 font-medium max-w-lg mx-auto leading-relaxed text-lg">
            Bhai, ab seedha{" "}
            <span className="text-white font-bold underline decoration-indigo-500 underline-offset-4">
              Footer
            </span>{" "}
            par jaao, wahan ek{" "}
            <span className="text-indigo-400 font-bold italic">
              "Generate Notes"
            </span>{" "}
            gateway milega. Hit that and let the AI build your wisdom.
          </p>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white text-black text-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            <FaArrowDown />
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

// --- BENTO CARD SUB-COMPONENT ---
const BentoCard = ({ icon, title, desc, cols, tag }) => (
  <motion.div
    whileHover={{ y: -10, borderColor: "rgba(99, 102, 241, 0.3)" }}
    className={`${cols} p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between min-h-[350px] transition-all group relative overflow-hidden`}
  >
    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    <div className="flex justify-between items-start">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all duration-500">
        {icon}
      </div>
      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
        {tag}
      </span>
    </div>

    <div className="relative z-10">
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic transition-all group-hover:tracking-normal group-hover:text-indigo-400">
        {title}
      </h3>
      <p className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-300 transition-colors">
        {desc}
      </p>
    </div>
  </motion.div>
);

export default Home;
