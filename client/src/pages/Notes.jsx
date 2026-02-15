import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import mermaid from "mermaid";

// --- Mermaid Component for Visuals ---
const MermaidChart = ({ chartData }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (chartData) {
      mermaid.initialize({
        startOnLoad: true,
        theme: "dark",
        securityLevel: "loose",
      });
      mermaid.contentLoaded();
    }
  }, [chartData]);

  return (
    <div
      className="mermaid bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-center overflow-x-auto"
      ref={ref}
    >
      {chartData}
    </div>
  );
};

const Notes = () => {
  const [formData, setFormData] = useState({
    topic: "",
    classLevel: "",
    examType: "",
    revisionMode: false,
    includeDiagram: false,
    includeCharts: false,
  });

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [notesData, setNotesData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleGenerate = async () => {
    if (!formData.topic) return alert("Bhai, topic toh likho!");
    setLoading(true);
    setNotesData(null);
    try {
      const response = await axios.post(
        "http://localhost:5008/api/notes/generate",
        formData,
        { withCredentials: true },
      );

      if (response.data.success) {
        setNotesData(response.data.notesContent);
        setTimeout(() => {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Internal server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await axios.post(
        "http://localhost:5008/api/notes/download-pdf",
        { notesData },
        { responseType: "blob", withCredentials: true },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${notesData.metadata?.topic || "Notes"}_AI_Module.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("PDF download failed!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-grow px-6 py-20 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto w-full">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase mb-4 text-indigo-400">
              AI-Powered Study Engine
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Elevate Your <span className="text-indigo-500">Learning</span>
            </h2>
          </motion.div>

          {/* 🔥 Dashboard Cards: Toggle & Vault */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Card 1: Active Generator Info */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-indigo-400 text-3xl">✨</span>
                <h3 className="text-2xl font-black mt-4 text-white">
                  Create New Notes
                </h3>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                  Fill the details below to conjure expert-level academic
                  modules in seconds.
                </p>
              </div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
            </motion.div>

            {/* Card 2: My Study Vault 🔥 */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => (window.location.href = "/my-notes")}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 cursor-pointer group relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-indigo-400 text-3xl">🗂️</span>
                  <h3 className="text-2xl font-black mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    My Study Vault
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 font-medium">
                    Aapke saare "God-Level" notes yahan safe hain. Puraane
                    chapters revise karein.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  View Archive{" "}
                  <span className="group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/40 transition-all" />
            </motion.div>
          </div>

          {/* Existing Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-8 md:p-14 border border-white/10 shadow-2xl relative"
          >
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">
                  Target Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  placeholder="e.g. Frontend Core Concepts"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-8 py-6 text-xl outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup
                  label="Academic Level"
                  name="classLevel"
                  value={formData.classLevel}
                  onChange={handleInputChange}
                />
                <InputGroup
                  label="Exam Category"
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-white/5">
                <ToggleButton
                  label="Revision Mode"
                  active={formData.revisionMode}
                  onClick={() => handleToggle("revisionMode")}
                />
                <ToggleButton
                  label="AI Diagrams"
                  active={formData.includeDiagram}
                  onClick={() => handleToggle("includeDiagram")}
                />
                <ToggleButton
                  label="Smart Charts"
                  active={formData.includeCharts}
                  onClick={() => handleToggle("includeCharts")}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-6 bg-white text-black font-black text-xl rounded-2xl disabled:opacity-50"
              >
                {loading ? "Conjuring Notes..." : "Generate AI Notes 🧠"}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {notesData && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto mt-32 space-y-12 pb-20"
            >
              <div className="text-center">
                <h3 className="text-4xl font-black mb-4">
                  Study Material for{" "}
                  <span className="text-indigo-500">
                    {notesData.metadata?.topic}
                  </span>
                </h3>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  <span className="bg-indigo-500/20 text-indigo-400 px-4 py-1 rounded-full text-sm font-bold border border-indigo-500/30">
                    Difficulty: {notesData.metadata?.difficulty}
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 px-4 py-1 rounded-full text-sm font-bold border border-purple-500/30">
                    Time: {notesData.metadata?.studyTime}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    className="bg-white text-black px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-tighter flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {downloading ? "Preparing..." : "Download PDF 📥"}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
                    <h4 className="text-2xl font-bold mb-6 text-indigo-400">
                      Detailed Notes
                    </h4>
                    <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {notesData.notes?.content}
                    </div>
                  </section>

                  {notesData.visuals?.mermaidData && (
                    <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                      <h4 className="text-2xl font-bold mb-6 text-indigo-400">
                        Visual Flowchart
                      </h4>
                      <MermaidChart chartData={notesData.visuals.mermaidData} />
                    </section>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 p-8 rounded-[2rem]">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">
                      Mnemonics
                    </h4>
                    {notesData.mnemonics?.map((m, i) => (
                      <div key={i} className="mb-6 last:mb-0">
                        <p className="text-lg font-bold text-white">{m.word}</p>
                        <p className="text-sm text-gray-400">{m.meaning}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 p-8 rounded-[2rem]">
                    <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-6">
                      Flashcards
                    </h4>
                    {notesData.flashcards?.map((f, i) => (
                      <div
                        key={i}
                        className="mb-4 p-4 bg-white/5 rounded-xl border border-white/5"
                      >
                        <p className="text-sm font-bold text-white mb-1">
                          Q: {f.front}
                        </p>
                        <p className="text-xs text-gray-400 italic">
                          A: {f.back}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50 transition-all"
    />
  </div>
);

const ToggleButton = ({ label, active, onClick }) => (
  <div
    className="flex items-center gap-4 cursor-pointer group"
    onClick={onClick}
  >
    <div
      className={`w-14 h-7 rounded-full relative p-1 transition-all ${active ? "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" : "bg-white/10"}`}
    >
      <motion.div
        animate={{ x: active ? 28 : 0 }}
        className="w-5 h-5 bg-white rounded-full shadow-lg"
      />
    </div>
    <span
      className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-white" : "text-gray-500"}`}
    >
      {label}
    </span>
  </div>
);

export default Notes;
