import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import mermaid from "mermaid";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  FaPlay,
  FaCircleStop,
  FaBoltLightning,
  FaListCheck,
  FaGlobe,
  FaRegCircleQuestion,
  FaRegCopy,
  FaCheck,
  FaYoutube,
  FaMapLocationDot,
  FaScaleBalanced,
  FaCalculator,
  FaArrowTrendUp,
  FaQuoteLeft,
  FaHighlighter,
  FaLanguage,
  FaTimeline,
  FaMicroscope,
  FaClockRotateLeft,
  FaFlask,
  FaComputer,
  FaTriangleExclamation,
  FaBrain
} from "react-icons/fa6";
import {
  LineChart, Line, XAxis as LXAxis, YAxis as LYAxis, CartesianGrid as LGrid,
  Tooltip as LTooltip, ResponsiveContainer as LResponsive, ReferenceLine
} from "recharts";
import ReactMarkdown from "react-markdown";

// --- PIE CHART COLORS ---
const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#e0d9ff"];

// --- Mermaid Flowchart ---
const MermaidChart = ({ chartData }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chartData) return;
    setSvg("");
    setError(false);

    // Detect if chartData is a valid mermaid string or placeholder text
    const trimmed = chartData.trim();
    const isValidMermaid = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|gitGraph|erDiagram)/i.test(trimmed);
    if (!isValidMermaid) {
      setError(true);
      return;
    }

    try {
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose", suppressErrors: true });
      const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

      mermaid.parse(chartData)
        .then(() => {
          mermaid.render(id, chartData)
            .then(({ svg }) => setSvg(svg))
            .catch((e) => {
              console.error("Mermaid Render Error:", e);
              setError(true);
            });
        })
        .catch((e) => {
          console.warn("Invalid Mermaid Syntax:", e);
          setError(true);
        });
    } catch (err) {
      console.error("Mermaid Init Error:", err);
      setError(true);
    }
  }, [chartData]);

  if (error) {
    return (
      <div className="bg-white/5 p-6 rounded-3xl border border-dashed border-cyan-500/30 flex flex-col items-center justify-center gap-3 min-h-[120px]">
        <span className="text-3xl">🔀</span>
        <p className="text-xs font-bold text-cyan-500/60 uppercase tracking-widest">Diagram Preview</p>
        <p className="text-[10px] text-gray-600 text-center max-w-xs">AI-generated diagram data received. Render failed due to complex syntax — raw data below:</p>
        <pre className="text-[9px] text-gray-600 bg-black/30 p-3 rounded-xl overflow-x-auto w-full max-h-32 whitespace-pre-wrap">{chartData?.substring(0, 300)}</pre>
      </div>
    );
  }

  if (!svg) return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-center min-h-[100px]">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className="bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// --- Pie Chart Component ---
const ExamPieChart = ({ data }) => {
  if (!data || typeof data !== "object") return null;
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value: Number(value) }));
  return (
    <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem]">
      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">📊 Exam Weightage (Pie)</h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
            {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 12 }} itemStyle={{ color: "#a5b4fc" }} />
          <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Bar Chart Component ---
const ExamBarChart = ({ data }) => {
  if (!data || typeof data !== "object") return null;
  const chartData = Object.entries(data).map(([year, value]) => ({ year, value: Number(value) }));
  return (
    <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem]">
      <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-6">📈 Year-Wise Trend (Bar)</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 12 }} itemStyle={{ color: "#c4b5fd" }} cursor={{ fill: "#ffffff08" }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === chartData.length - 1 ? "#6366f1" : "#4f46e533"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5008";

const Notes = () => {
  const [formData, setFormData] = useState({
    topic: "",
    classLevel: "",
    examType: "",
    revisionMode: false,
    includeDiagram: false,
    includeCharts: false,
  });

  const [sourceMode, setSourceMode] = useState("topic"); // topic, video, pdf, practical
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Practical Mode State
  const [practicalForm, setPracticalForm] = useState({
    experimentName: "",
    practicalType: "lab",
    university: "",
    subject: "",
    classLevel: "",
  });
  const [practicalData, setPracticalData] = useState(null);

  // Deep Dive Mode State
  const [deepDiveForm, setDeepDiveForm] = useState({ topic: "", classLevel: "" });
  const [deepDiveData, setDeepDiveData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode && ["topic", "video", "pdf", "practical", "deepdive"].includes(mode)) {
      setSourceMode(mode);
    }
  }, []);


  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [notesData, setNotesData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  const LOADING_MESSAGES = [
    "Firing up Gemini 2.0 AI Engine...",
    "Scanning 15-year previous year trends...",
    "Structuring deep technical data...",
    "Building interactive 3D flashcards...",
    "Finalizing presentation secrets..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handlePlayAudio = (text) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleGenerate = async () => {
    if (sourceMode === "topic" && !formData.topic) return alert("Bhai, topic toh likho!");
    if (sourceMode === "video" && !videoUrl) return alert("YouTube link kahan hai?");
    if (sourceMode === "pdf" && !selectedFile) return alert("PDF file select karo!");
    if (sourceMode === "practical") {
      if (!practicalForm.experimentName) return alert("Experiment ka naam toh daalo!");
      if (!practicalForm.classLevel) return alert("Class/Semester batao!");
    }
    if (sourceMode === "deepdive" && !deepDiveForm.topic) return alert("Kaunsa topic explore karna hai? Likho!");

    setLoading(true);
    setNotesData(null);
    setPracticalData(null);
    setDeepDiveData(null);
    try {
      let response;
      if (sourceMode === "topic") {
        response = await axiosInstance.post("/api/notes/generate", formData);
      } else if (sourceMode === "video") {
        response = await axiosInstance.post("/api/notes/video/generate", {
          videoUrl,
          classLevel: formData.classLevel,
          examType: formData.examType
        });
      } else if (sourceMode === "pdf") {
        const data = new FormData();
        data.append("pdf", selectedFile);
        data.append("classLevel", formData.classLevel);
        data.append("examType", formData.examType);
        response = await axiosInstance.post("/api/notes/pdf/generate", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else if (sourceMode === "practical") {
        response = await axiosInstance.post("/api/notes/practical/generate", practicalForm);
      } else if (sourceMode === "deepdive") {
        response = await axiosInstance.post("/api/notes/deepdive/generate", deepDiveForm);
      }

      if (response.data.success) {
        if (sourceMode === "practical") {
          setPracticalData(response.data.notesContent);
        } else if (sourceMode === "deepdive") {
          setDeepDiveData(response.data.notesContent);
        } else {
          setNotesData(response.data.notesContent);
        }
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
      const response = await axiosInstance.post(
        "/api/notes/download-pdf",
        { notesData },
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${notesData.metadata?.topic || "Notes"}_AI_Module.pdf`);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-indigo-500/30 relative"
    >
      {/* --- 3D BACKGROUND MODEL (Paladins Book) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <iframe
          title="Paladins book"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/07bc6364101c4bd4adaa3d0cee1aaa3e/embed?autostart=1&autospin=0.2&preload=1&transparent=1&ui_hint=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_theme=dark&dnt=1"
          style={{
            width: '100%',
            height: '100vh',
            border: '0',
            filter: 'brightness(0.6) contrast(1.1) hue-rotate(15deg) saturate(1.1)',
          }}
        ></iframe>
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <motion.main
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="flex-grow px-6 py-20 relative"
        >
          {/* Neural Scanning Animation (Loading State) */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
              >
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-md shadow-[0_0_20px_rgba(79,70,229,0.5)] opacity-50"
                />
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.1 }}
                  className="absolute left-0 right-0 h-px bg-white/20 opacity-20"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

          <div className="max-w-4xl mx-auto w-full">
            {/* Header */}
            <motion.div variants={itemVars} className="text-center mb-16">
              <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase mb-4 text-indigo-400">
                AI-Powered Study Engine
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                Elevate Your <span className="text-indigo-500">Learning</span>
              </h2>
            </motion.div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <motion.div variants={itemVars} whileHover={{ y: -5 }} className="bg-transparent rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-indigo-400 text-3xl">✨</span>
                  <h3 className="text-2xl font-black mt-4 text-white">Create New Notes</h3>
                  <p className="text-gray-500 text-sm mt-2 font-medium">Fill the details below to conjure expert-level academic modules in seconds.</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVars}
                whileHover={{ y: -5, scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                onClick={() => (window.location.href = "/my-notes")}
                className="bg-transparent rounded-[2.5rem] p-8 border border-white/10 cursor-pointer group relative overflow-hidden"
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <span className="text-indigo-400 text-3xl">🗂️</span>
                    <h3 className="text-2xl font-black mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">My Study Vault</h3>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Aapke saare "God-Level" notes yahan safe hain.</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    View Archive <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mode Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <ModeButton icon={<FaBoltLightning />} label="Topic" active={sourceMode === "topic"} onClick={() => setSourceMode("topic")} />
              <ModeButton icon={<FaYoutube />} label="Video" active={sourceMode === "video"} onClick={() => setSourceMode("video")} />
              <ModeButton icon={<FaMicroscope />} label="PDF" active={sourceMode === "pdf"} onClick={() => setSourceMode("pdf")} />
              <ModeButton icon={<FaFlask />} label="Practical" active={sourceMode === "practical"} onClick={() => setSourceMode("practical")} practicalMode />
              <ModeButton icon={<FaBrain />} label="Deep Dive" active={sourceMode === "deepdive"} onClick={() => setSourceMode("deepdive")} deepDiveMode />
            </div>

            {/* Form Card */}
            <motion.div variants={itemVars} className="bg-transparent rounded-[3rem] p-8 md:p-14 border border-white/10 shadow-2xl relative">
              <div className="space-y-8 relative z-10">
                {sourceMode === "topic" && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Target Topic</label>
                    <input
                      type="text" name="topic" placeholder="e.g. Frontend Core Concepts"
                      value={formData.topic} onChange={handleInputChange}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-8 py-6 text-xl outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                )}

                {sourceMode === "video" && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-4 flex items-center gap-2"><FaYoutube /> YouTube Video URL</label>
                    <input
                      type="text" placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-2xl px-8 py-6 text-xl outline-none focus:border-indigo-500 transition-all text-indigo-200 placeholder:text-indigo-500/20"
                    />
                    <p className="text-[10px] text-gray-600 ml-4 italic">*AI will analyze video captions for exam engineering.</p>
                  </div>
                )}

                {sourceMode === "pdf" && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 ml-4 flex items-center gap-2"><FaMicroscope /> Upload Syllabus/PDF</label>
                    <div className="relative group">
                      <input
                        type="file" accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-2xl px-8 py-10 flex flex-col items-center justify-center gap-4 group-hover:border-emerald-500/50 transition-all">
                        <FaMicroscope className="text-4xl text-emerald-500/30 group-hover:text-emerald-500 transition-colors" />
                        <p className="text-emerald-500/60 font-bold">{selectedFile ? selectedFile.name : "Drag & Drop or Click to Upload PDF"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🧪 PRACTICAL FORM */}
                {sourceMode === "practical" && (
                  <div className="space-y-8">
                    {/* Glowing header */}
                    <div className="flex items-center gap-3 p-4 bg-teal-500/5 border border-teal-500/20 rounded-2xl">
                      <FaFlask className="text-teal-400 text-xl" />
                      <div>
                        <p className="text-teal-400 font-black text-xs uppercase tracking-widest">Lab Practical AI Mode</p>
                        <p className="text-gray-500 text-xs mt-1">University ke exact manual format mein complete practical file generate hogi — graph, code, observation table, aur Hinglish explanation ke saath! 🔥</p>
                      </div>
                    </div>

                    {/* Experiment Name */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 ml-4 flex items-center gap-2"><FaFlask /> Experiment / Program Name</label>
                      <input
                        type="text"
                        placeholder="e.g. To verify Ohm's Law / Bubble Sort in C"
                        value={practicalForm.experimentName}
                        onChange={(e) => setPracticalForm(p => ({ ...p, experimentName: e.target.value }))}
                        className="w-full bg-teal-500/5 border border-teal-500/20 rounded-2xl px-8 py-6 text-xl outline-none focus:border-teal-500 transition-all text-teal-100 placeholder:text-teal-500/20"
                      />
                    </div>

                    {/* Practical Type */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 ml-4">Practical Type</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { val: "lab", icon: "🔬", label: "Lab / Physical", desc: "Circuit, Chemical, etc." },
                          { val: "computer", icon: "💻", label: "Computer", desc: "Code + Algorithm" },
                          { val: "both", icon: "⚡", label: "Both", desc: "Lab + Code both" },
                        ].map(({ val, icon, label, desc }) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setPracticalForm(p => ({ ...p, practicalType: val }))}
                            className={`p-5 rounded-2xl border-2 transition-all text-left ${
                              practicalForm.practicalType === val
                                ? "border-teal-500 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                                : "border-white/10 bg-white/5 hover:border-teal-500/40"
                            }`}
                          >
                            <div className="text-2xl mb-2">{icon}</div>
                            <p className={`font-black text-sm ${practicalForm.practicalType === val ? "text-teal-300" : "text-gray-400"}`}>{label}</p>
                            <p className="text-xs text-gray-600 mt-1">{desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* University + Subject + Class Level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">University / Board</label>
                        <input
                          type="text" placeholder="e.g. AKTU, Mumbai Univ."
                          value={practicalForm.university}
                          onChange={(e) => setPracticalForm(p => ({ ...p, university: e.target.value }))}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-white/10"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Subject</label>
                        <input
                          type="text" placeholder="e.g. Physics, DBMS, OS"
                          value={practicalForm.subject}
                          onChange={(e) => setPracticalForm(p => ({ ...p, subject: e.target.value }))}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-white/10"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Class / Semester</label>
                        <input
                          type="text" placeholder="e.g. B.Tech 3rd Sem"
                          value={practicalForm.classLevel}
                          onChange={(e) => setPracticalForm(p => ({ ...p, classLevel: e.target.value }))}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-white/10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {sourceMode !== "practical" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Academic Level" name="classLevel" value={formData.classLevel} onChange={handleInputChange} />
                    <InputGroup label="Exam Category" name="examType" value={formData.examType} onChange={handleInputChange} />
                  </div>
                )}

                {sourceMode !== "practical" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-white/5">
                    <ToggleButton label="Revision Mode" active={formData.revisionMode} onClick={() => handleToggle("revisionMode")} />
                    <ToggleButton label="AI Diagrams" active={formData.includeDiagram} onClick={() => handleToggle("includeDiagram")} />
                    <ToggleButton label="Smart Charts" active={formData.includeCharts} onClick={() => handleToggle("includeCharts")} />
                  </div>
                )}

                {/* 🧠 DEEP DIVE FORM */}
                {sourceMode === "deepdive" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 p-4 bg-violet-500/5 border border-violet-500/20 rounded-2xl">
                      <FaBrain className="text-violet-400 text-xl" />
                      <div>
                        <p className="text-violet-400 font-black text-xs uppercase tracking-widest">0 to Hero — Deep Dive Mode</p>
                        <p className="text-gray-500 text-xs mt-1">Koi bhi topic — complete journey mile. 8 chapters, god-level diagrams, real-world analogies. No questions, only pure mastery. 🚀</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 ml-4 flex items-center gap-2"><FaBrain /> Topic / Concept to Master</label>
                      <input
                        type="text"
                        placeholder="e.g. Linked List, Operating System, Quantum Physics, French Revolution..."
                        value={deepDiveForm.topic}
                        onChange={e => setDeepDiveForm(p => ({ ...p, topic: e.target.value }))}
                        className="w-full bg-violet-500/5 border border-violet-500/20 rounded-2xl px-8 py-6 text-xl outline-none focus:border-violet-500 transition-all text-violet-100 placeholder:text-violet-500/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Your Level</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech 2nd Year, Class 12, Complete Beginner..."
                        value={deepDiveForm.classLevel}
                        onChange={e => setDeepDiveForm(p => ({ ...p, classLevel: e.target.value }))}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-violet-500/50 transition-all placeholder:text-white/10"
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate} disabled={loading}
                  className="w-full py-6 bg-white text-black font-black text-xl rounded-2xl disabled:opacity-50 relative overflow-hidden group"
                >
                  {loading ? (
                    <motion.div
                      key={loadingMsgIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute inset-0 flex items-center justify-center font-bold text-lg"
                    >
                      {LOADING_MESSAGES[loadingMsgIdx]} <span className="animate-pulse ml-2 text-indigo-500">⏳</span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span>{sourceMode === "practical" ? "Generate Practical File 🧪" : sourceMode === "deepdive" ? "Start 0→Hero Journey 🧠" : "Generate AI Notes 🧠"}</span>
                      <span className="text-[10px] opacity-50 font-normal tracking-normal uppercase">
                        Costs {sourceMode === "topic" ? "10" : sourceMode === "video" ? "15" : sourceMode === "practical" ? "25" : sourceMode === "deepdive" ? "20" : "20"} Credits
                      </span>
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {notesData && (
              <motion.div
                variants={containerVars}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto mt-32 space-y-12 pb-20"
              >
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-4xl font-black mb-4">
                    Study Material for <span className="text-indigo-500">{notesData.metadata?.topic}</span>
                  </h3>
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    <span className="bg-indigo-500/20 text-indigo-400 px-4 py-1 rounded-full text-sm font-bold border border-indigo-500/30">
                      Difficulty: {notesData.metadata?.difficulty}
                    </span>
                    <span className="bg-purple-500/20 text-purple-400 px-4 py-1 rounded-full text-sm font-bold border border-purple-500/30">
                      Time: {notesData.metadata?.studyTime}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadPDF} disabled={downloading}
                      className="bg-white text-black px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-tighter flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {downloading ? "Preparing..." : "Download PDF 📥"}
                    </motion.button>
                  </div>
                </div>

                {/* 🔥 PIE + BAR CHARTS SECTION */}
                {(notesData.metadata?.pieChartData || notesData.metadata?.barGraphData) && (
                  <motion.div variants={itemVars}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-xs font-black uppercase tracking-widest text-indigo-400">📊 Exam Analytics</span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ExamPieChart data={notesData.metadata.pieChartData} />
                      <ExamBarChart data={notesData.metadata.barGraphData} />
                    </div>
                  </motion.div>
                )}

                {/* ----- NEW ADVANCED AI BLOCKS ----- */}
                <div className="space-y-6">
                  {/* Cheat Sheet & Real World side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {notesData.cheatSheet && (
                      <section className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 text-orange-400 mb-6 font-black text-sm uppercase tracking-widest"><FaBoltLightning /> Cheat Sheet</div>
                        <div className="flex flex-wrap gap-3">
                          {notesData.cheatSheet.map((item, idx) => (
                            <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-mono text-xs shadow-inner">{item}</span>
                          ))}
                        </div>
                      </section>
                    )}
                    {notesData.realWorldApplication && (
                      <section className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <FaGlobe className="absolute -bottom-6 -right-6 text-8xl text-emerald-500/10 pointer-events-none" />
                        <div className="flex items-center gap-3 text-emerald-400 mb-4 font-black text-sm uppercase tracking-widest">Why Learn This?</div>
                        <p className="text-gray-300 text-sm leading-relaxed relative z-10 italic">{notesData.realWorldApplication}</p>
                      </section>
                    )}
                  </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Detailed Notes */}
                    <section className="bg-transparent border border-white/10 p-10 rounded-[2.5rem] relative group">
                      <CopyButton text={typeof notesData.notes?.content === "string" ? notesData.notes.content : JSON.stringify(notesData.notes?.content)} />
                      <h4 className="text-2xl font-bold mb-6 text-indigo-400">Detailed Notes</h4>
                      <div className="markdown-body text-gray-300 leading-relaxed text-lg">
                        {typeof notesData.notes?.content === "string" ? (
                          <ReactMarkdown components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mb-6 mt-8 uppercase tracking-tighter" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-indigo-300 mb-4 mt-8" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mb-3 mt-6 border-b border-white/10 pb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-6" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-3 marker:text-indigo-500" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-3 marker:text-indigo-500" {...props} />,
                            li: ({ node, ...props }) => <li {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-black text-white bg-indigo-500/20 px-1.5 py-0.5 rounded" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 italic bg-white/5 rounded-r-2xl my-6" {...props} />,
                            code: ({ node, inline, ...props }) => inline ? <code className="bg-white/10 text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono border border-white/10" {...props} /> : <div className="bg-[#080808] p-6 rounded-2xl overflow-x-auto border border-white/10 my-6 text-sm font-mono shadow-inner"><code {...props} /></div>,
                          }}>
                            {notesData.notes.content}
                          </ReactMarkdown>
                        ) : (
                          <pre className="whitespace-pre-wrap">{JSON.stringify(notesData.notes?.content, null, 2)}</pre>
                        )}
                      </div>
                    </section>

                    {/* Visual Flowcharts */}
                    {(notesData.visuals?.flowcharts || notesData.visuals?.mermaidData) && (
                      <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                        <h4 className="text-2xl font-bold mb-6 text-indigo-400">🔀 Visual Logic Systems</h4>
                        <div className="space-y-6">
                          {Array.isArray(notesData.visuals.flowcharts) ? (
                            notesData.visuals.flowcharts.map((chart, idx) => (
                              <div key={idx} className="space-y-2">
                                {notesData.visuals.flowcharts.length > 1 && <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500/50 ml-2">Diagram {idx + 1}</p>}
                                <MermaidChart chartData={chart} />
                              </div>
                            ))
                          ) : (
                            <MermaidChart chartData={notesData.visuals.mermaidData} />
                          )}
                        </div>
                      </section>
                    )}

                    {/* Sub-Topics */}
                    {notesData.subTopics && (
                      <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                        <h4 className="text-2xl font-bold mb-8 text-purple-400">🗂️ Sub-Topics Breakdown</h4>
                        <div className="space-y-6">
                          {Object.entries(notesData.subTopics).map(([key, items]) => (
                            <div key={key}>
                              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">{key.replace(/([A-Z])/g, " $1")}</p>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(items)
                                  ? items.map((item, i) => (
                                    <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-300 font-medium hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
                                      {typeof item === "string" ? item : JSON.stringify(item)}
                                    </span>
                                  ))
                                  : <span className="text-gray-400 text-sm">{typeof items === "string" ? items : JSON.stringify(items)}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-8">
                    {/* Mnemonics */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 p-8 rounded-[2rem]">
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">🧠 Mnemonics</h4>
                      {Array.isArray(notesData.mnemonics)
                        ? notesData.mnemonics.slice(0, 6).map((m, i) => (
                          <div key={i} className="mb-6 last:mb-0">
                            <p className="text-sm font-bold text-white">{m.concept || m.word}</p>
                            <p className="text-xs text-gray-400 mt-1">{m.trick || m.meaning}</p>
                          </div>
                        ))
                        : null}
                    </div>

                    {/* Flashcards (3D Interactive) */}
                    <div className="bg-transparent">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center justify-between">
                        <span>⚡ Flashcards</span>
                        <span className="text-emerald-500/50 text-[10px]">Click to flip</span>
                      </h4>
                      {Array.isArray(notesData.flashcards)
                        ? notesData.flashcards.slice(0, 5).map((f, i) => (
                          <div key={i} className="mb-4">
                            <InteractiveFlashcard question={f.front || f.question || "No Question"} answer={f.back || f.answer || "No Answer"} />
                          </div>
                        ))
                        : null}
                    </div>

                    {/* Topper Insights */}
                    {notesData.topperInsights && (
                      <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-8 rounded-[2rem]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-4">🏆 Topper Insights</h4>
                        <p className="text-sm text-gray-300 leading-relaxed">{notesData.topperInsights}</p>
                      </div>
                    )}

                    {/* Case Study */}
                    {notesData.caseStudy && (
                      <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-8 rounded-[2rem]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">🧪 Case Study</h4>
                        <p className="text-sm text-gray-300 leading-relaxed">{notesData.caseStudy}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Practice Section */}
                {notesData.practice?.mcqs?.length > 0 && (
                  <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                    <h4 className="text-2xl font-bold mb-8 text-emerald-400">🎯 Practice MCQs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {notesData.practice.mcqs.slice(0, 6).map((mcq, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-emerald-500/30 transition-all">
                          <p className="text-sm font-bold text-white mb-4">Q{i + 1}: {mcq.q || mcq.question}</p>
                          <div className="space-y-2">
                            {(mcq.options || []).map((opt, j) => (
                              <div key={j} className={`text-xs px-3 py-2 rounded-lg font-medium transition-all ${opt === mcq.answer ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-gray-500 bg-white/5"}`}>
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Viva Questions */}
                {notesData.vivaQuestions && Array.isArray(notesData.vivaQuestions) && (
                  <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                    <h4 className="text-2xl font-bold mb-8 text-emerald-400 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm"><FaRegCircleQuestion /></span>
                      Viva Voce Expert List
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      {notesData.vivaQuestions.map((viva, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/[0.07] transition-all">
                          <p className="text-sm font-black text-emerald-400 mb-2 uppercase tracking-widest">Question {i + 1}</p>
                          <p className="text-lg font-bold text-white mb-4 italic leading-relaxed">"{viva.question}"</p>
                          <div className="h-px bg-white/10 w-full mb-4" />
                          <p className="text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-widest">Ideal Answer</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{viva.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 6. Comparative Analysis (Differences) */}
                {notesData.comparativeAnalysis && Array.isArray(notesData.comparativeAnalysis) && notesData.comparativeAnalysis.length > 0 && (
                  <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] overflow-x-auto text-left">
                    <h4 className="text-2xl font-bold mb-8 text-indigo-400 flex items-center gap-3">
                      <FaScaleBalanced /> Comparative Analysis
                    </h4>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500">Feature</th>
                          <th className="py-4 px-6 text-indigo-300 font-bold italic">Item A</th>
                          <th className="py-4 px-6 text-emerald-300 font-bold italic">Item B</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notesData.comparativeAnalysis.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6 text-sm font-bold text-gray-300">{row.feature}</td>
                            <td className="py-4 px-6 text-sm text-gray-400">{row.item1}</td>
                            <td className="py-4 px-6 text-sm text-gray-400">{row.item2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                )}

                {/* 7. Formula & Theorem Bank */}
                {notesData.formulaTheoremBank && Array.isArray(notesData.formulaTheoremBank) && notesData.formulaTheoremBank.length > 0 && (
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {notesData.formulaTheoremBank.map((f, i) => (
                      <div key={i} className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
                        <FaCalculator className="absolute -bottom-4 -right-4 text-7xl text-indigo-500/10 group-hover:scale-110 transition-transform" />
                        <h5 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">{f.title}</h5>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-4 font-mono text-center text-lg text-white shadow-inner">
                          {f.formula}
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </section>
                )}

                {/* 8. Step-by-Step Derivations */}
                {notesData.stepByStepDerivations && Array.isArray(notesData.stepByStepDerivations) && notesData.stepByStepDerivations.length > 0 && (
                  <section className="space-y-8 text-left">
                    {notesData.stepByStepDerivations.map((d, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                        <h4 className="text-xl font-bold mb-8 text-indigo-300 flex items-center gap-3">
                          <FaArrowTrendUp /> {d.title}
                        </h4>
                        <div className="space-y-6">
                          {d.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-6">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 text-black font-black flex items-center justify-center text-xs shrink-0">
                                  {idx + 1}
                                </div>
                                {idx !== d.steps.length - 1 && <div className="w-0.5 grow bg-indigo-500/20 my-2" />}
                              </div>
                              <p className="text-gray-300 text-lg leading-relaxed pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* 9. Scientific Definitions */}
                {notesData.scientificDefinitions && Array.isArray(notesData.scientificDefinitions) && notesData.scientificDefinitions.length > 0 && (
                  <section className="bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[2.5rem] relative overflow-hidden text-left">
                    <FaQuoteLeft className="absolute top-8 left-8 text-6xl text-emerald-500/10" />
                    <div className="flex items-center gap-3 text-emerald-400 mb-8 font-black text-sm uppercase tracking-widest relative z-10">
                      Formal Scientific Definitions
                    </div>
                    <div className="space-y-8 relative z-10">
                      {notesData.scientificDefinitions.map((d, i) => (
                        <div key={i} className="pl-12 border-l-2 border-emerald-500/30">
                          <p className="text-emerald-400 font-bold mb-2 uppercase text-[10px] tracking-[0.2em]">{d.term}</p>
                          <p className="text-gray-200 text-xl font-medium leading-relaxed italic">"{d.definition}"</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 10. Predictive Marking Scheme */}
                {notesData.markingScheme && Array.isArray(notesData.markingScheme) && notesData.markingScheme.length > 0 && (
                  <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] text-left">
                    <h4 className="text-2xl font-bold mb-8 text-orange-400 flex items-center gap-3">
                      <FaHighlighter /> Predictive Marking Scheme
                    </h4>
                    <div className="space-y-4">
                      {notesData.markingScheme.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 p-6 rounded-2xl">
                          <div className="flex-1 pr-6">
                            <p className="text-white font-bold mb-1">{s.component}</p>
                            <p className="text-xs text-gray-500">{s.detail}</p>
                          </div>
                          <div className="shrink-0 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-xl font-black text-sm border border-orange-500/30">
                            +{s.marks} Marks
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 11. Glossary & Historical Evolution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                  {notesData.glossary && Array.isArray(notesData.glossary) && notesData.glossary.length > 0 && (
                    <section className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                        <FaLanguage /> Glossary
                      </h4>
                      <div className="space-y-4">
                        {notesData.glossary.map((g, i) => (
                          <div key={i}>
                            <span className="text-indigo-300 font-bold text-sm block mb-1">{g.term}</span>
                            <p className="text-xs text-gray-500 leading-relaxed">{g.definition}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {notesData.historicalEvolution && (
                    <section className="bg-indigo-500/5 border border-indigo-500/20 p-8 rounded-[2rem]">
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                        <FaClockRotateLeft /> Historical Evolution
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed italic">
                        {notesData.historicalEvolution}
                      </p>
                    </section>
                  )}
                </div>

                {/* 13. Industry 2036 Roadmap & Prototype */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                  {notesData.industryRoadmap && Array.isArray(notesData.industryRoadmap) && (
                    <section className="lg:col-span-2 bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><FaTimeline className="text-8xl" /></div>
                      <h4 className="text-2xl font-bold mb-10 text-indigo-400 flex items-center gap-3">
                        🚀 Industry 2036 Roadmap
                      </h4>
                      <div className="space-y-8 relative z-10">
                        {notesData.industryRoadmap.map((step, i) => (
                          <div key={i} className="flex gap-6 group">
                            <div className="flex flex-col items-center">
                              <div className="px-3 py-1 bg-indigo-500 text-black font-black rounded-lg text-[10px] mb-2">{step.year}</div>
                              {i !== notesData.industryRoadmap.length - 1 && <div className="w-px grow bg-indigo-500/20" />}
                            </div>
                            <p className="text-gray-300 text-lg font-medium pt-1 group-hover:text-white transition-colors">{step.milestone}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {notesData.futuristicPrototype && (
                    <section className="bg-[#0a0a0a] border-2 border-indigo-500/30 p-8 rounded-[2rem] relative shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                      <div className="flex items-center gap-3 text-indigo-400 mb-6 font-black text-xs uppercase tracking-widest">
                        <FaMicroscope /> AI-Dreamed Prototype
                      </div>
                      <h5 className="text-xl font-bold text-white mb-4 italic">"{notesData.futuristicPrototype.concept}"</h5>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {notesData.futuristicPrototype.vision}
                      </p>
                      <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        2036 Feasibility: High
                      </div>
                    </section>
                  )}
                </div>

                {/* 14. Zero-Day Hyper-Drive Hack */}
                {notesData.zeroDayHack && Array.isArray(notesData.zeroDayHack) && notesData.zeroDayHack.length > 0 && (
                  <section className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-2 border-orange-500/30 p-10 rounded-[2.5rem] relative overflow-hidden text-left">
                    <div className="absolute -top-10 -right-10 text-[180px] text-orange-500/5 font-black uppercase tracking-tighter -rotate-12 pointer-events-none">HACK</div>
                    <h4 className="text-2xl font-black mb-8 text-orange-400 flex items-center gap-4">
                      <FaBoltLightning className="animate-pulse" /> 💎 Zero-Day Hyper-Drive Hack
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {notesData.zeroDayHack.map((hack, i) => (
                        <div key={i} className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                          <span className="text-orange-500 font-black text-xl italic opacity-50">#{i + 1}</span>
                          <p className="text-sm text-gray-200 font-bold leading-tight">{hack}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-8 text-[10px] font-black text-orange-500/50 uppercase tracking-[0.3em] text-center">Open this 120 seconds before entering the hall</p>
                  </section>
                )}

                {/* 12. Exam Hall Checklist */}
                {notesData.examChecklist && Array.isArray(notesData.examChecklist) && notesData.examChecklist.length > 0 && (
                  <section className="bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[2.5rem] text-left">
                    <h4 className="text-2xl font-bold mb-8 text-emerald-400 flex items-center gap-3">
                      <FaListCheck /> Exam Hall Checklist
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {notesData.examChecklist.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                          <div className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <FaCheck className="text-[10px]" />
                          </div>
                          <span className="text-sm text-gray-300 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}


              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== PRACTICAL RESULTS SECTION ==================== */}
          <AnimatePresence>
            {practicalData && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto mt-32 space-y-10 pb-20"
              >
                {/* Header */}
                <div className="text-center space-y-4">
                  <span className="inline-block py-1 px-4 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold tracking-widest uppercase text-teal-400">
                    🧪 {practicalData.university || "University"} — Lab Practical File
                  </span>
                  <h3 className="text-4xl font-black">
                    <span className="text-teal-400">{practicalData.labManual?.aim?.substring(0, 60) || practicalData.computerProgram?.aim?.substring(0, 60) || practicalForm.experimentName}</span>
                  </h3>
                  <p className="text-gray-500 text-sm">{practicalData.subject} · {practicalForm.classLevel}</p>
                </div>

                {/* Marking Scheme Banner */}
                {practicalData.markingScheme?.length > 0 && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {practicalData.markingScheme.map((s, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
                        <p className="text-xs text-gray-500">{s.component}</p>
                        <p className="text-teal-400 font-black">{s.marks}M</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* LAB MANUAL SECTION */}
                {practicalData.labManual && (
                  <div className="space-y-6">
                    <SectionDivider label="📋 Lab Manual" color="teal" />

                    {/* Aim */}
                    <div className="bg-teal-500/5 border border-teal-500/20 p-8 rounded-[2rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-3">🎯 Aim</p>
                      <p className="text-white text-lg leading-relaxed font-medium">{practicalData.labManual.aim}</p>
                    </div>

                    {/* Apparatus */}
                    {practicalData.labManual.apparatus?.length > 0 && (
                      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">🔧 Apparatus Required</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {practicalData.labManual.apparatus.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl">
                              <span className="text-indigo-400 font-black text-sm">{i + 1}.</span>
                              <span className="text-gray-300 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Theory */}
                    {practicalData.labManual.theory && (
                      <div className="bg-purple-500/5 border border-purple-500/20 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4">📖 Theory</p>
                        <div className="text-gray-300 text-sm leading-relaxed markdown-body">
                          <ReactMarkdown>{practicalData.labManual.theory}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Circuit Diagram */}
                    {practicalData.labManual.diagram && (
                      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">⚡ Circuit / Setup Diagram</p>
                        <MermaidChart chartData={practicalData.labManual.diagram} />
                      </div>
                    )}

                    {/* Procedure */}
                    {practicalData.labManual.procedure?.length > 0 && (
                      <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-6">📋 Procedure</p>
                        <div className="space-y-4">
                          {practicalData.labManual.procedure.map((step, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="w-7 h-7 rounded-full bg-orange-500 text-black font-black flex items-center justify-center text-xs shrink-0">{i + 1}</div>
                              <p className="text-gray-300 text-sm leading-relaxed pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Observation Table */}
                    {practicalData.labManual.observationTable && (
                      <div className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-[2rem] overflow-x-auto">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">📊 {practicalData.labManual.observationTable.title || "Observation Table"}</p>
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/10">
                              {practicalData.labManual.observationTable.headers?.map((h, i) => (
                                <th key={i} className="py-3 px-4 text-xs font-black uppercase tracking-wider text-blue-300">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {practicalData.labManual.observationTable.rows?.map((row, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                {row.map((cell, j) => (
                                  <td key={j} className="py-3 px-4 text-sm text-gray-300">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Graph — Smart Curve Renderer */}
                    {practicalData.labManual.graph && (() => {
                      const g = practicalData.labManual.graph;
                      const rel = (g.relationship || "").toLowerCase();

                      // Filter out AI placeholder strings — keep only numeric {x,y} objects
                      let rawPts = Array.isArray(g.dataPoints)
                        ? g.dataPoints.filter(p => p && typeof p === "object" && "x" in p && "y" in p && !isNaN(Number(p.x)) && !isNaN(Number(p.y)))
                        : [];

                      // Fallback: extract from observation table
                      if (rawPts.length < 3) {
                        rawPts = (practicalData.labManual.observationTable?.rows || [])
                          .map(row => ({ x: Number(row[1]), y: Number(row[2]) }))
                          .filter(p => !isNaN(p.x) && !isNaN(p.y) && p.x !== 0);
                      }

                      let pts = rawPts;

                      // Recompute correct Y values for non-linear relationships
                      if (rawPts.length >= 2) {
                        const xMin = Math.min(...rawPts.map(p => Number(p.x)));
                        const xMax = Math.max(...rawPts.map(p => Number(p.x)));
                        const step = (xMax - xMin) / 9 || xMin / 2 || 1;

                        if (rel.includes("quart") || rel.includes("t4") || rel.includes("fourth")) {
                          // y = sigma * x^4 — infer sigma from first valid raw point
                          const ref = rawPts[0];
                          const sigma = Number(ref.y) / Math.pow(Number(ref.x), 4);
                          pts = Array.from({ length: 10 }, (_, i) => {
                            const x = Math.round(xMin + i * step);
                            return { x, y: parseFloat((sigma * Math.pow(x, 4)).toFixed(3)) };
                          });
                        } else if (rel.includes("quad") || rel.includes("square") || rel.includes("x2")) {
                          const ref = rawPts[0];
                          const k = Number(ref.y) / Math.pow(Number(ref.x), 2);
                          pts = Array.from({ length: 10 }, (_, i) => {
                            const x = Math.round(xMin + i * step);
                            return { x, y: parseFloat((k * x * x).toFixed(3)) };
                          });
                        } else if (rel.includes("invers") || rel.includes("hyperbol")) {
                          const c = Number(rawPts[0].y) * Number(rawPts[0].x);
                          pts = Array.from({ length: 10 }, (_, i) => {
                            const x = parseFloat((xMin + i * step).toFixed(2));
                            return x > 0 ? { x, y: parseFloat((c / x).toFixed(3)) } : null;
                          }).filter(Boolean);
                        } else if (rel.includes("log")) {
                          const k = Number(rawPts[0].y) / Math.log(Number(rawPts[0].x));
                          pts = Array.from({ length: 10 }, (_, i) => {
                            const x = parseFloat((xMin + i * step).toFixed(2));
                            return x > 0 ? { x, y: parseFloat((k * Math.log(x)).toFixed(3)) } : null;
                          }).filter(Boolean);
                        } else if (rel.includes("exp")) {
                          const r0 = rawPts[0], r1 = rawPts[rawPts.length - 1];
                          const b = (Math.log(Number(r1.y)) - Math.log(Number(r0.y))) / (Number(r1.x) - Number(r0.x));
                          const a = Number(r0.y) / Math.exp(b * Number(r0.x));
                          pts = Array.from({ length: 10 }, (_, i) => {
                            const x = parseFloat((xMin + i * step).toFixed(2));
                            return { x, y: parseFloat((a * Math.exp(b * x)).toFixed(3)) };
                          });
                        }
                        // linear: use rawPts as-is
                      }

                      if (!pts || pts.length === 0) pts = [100,200,300,400,500,600,700,800].map(v => ({ x: v, y: v }));

                      const relLabel = rel ? rel.charAt(0).toUpperCase() + rel.slice(1) : "Linear";
                      const curveSymbol = rel.includes("quart") ? " (T⁴)" : rel.includes("quad") ? " (T²)" : rel.includes("invers") ? " (1/x)" : "";
                      const badgeColor = rel.includes("quart") ? "text-orange-400 border-orange-500/30 bg-orange-500/10"
                        : rel.includes("quad") ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                        : rel.includes("invers") ? "text-purple-400 border-purple-500/30 bg-purple-500/10"
                        : rel.includes("exp") ? "text-rose-400 border-rose-500/30 bg-rose-500/10"
                        : "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";

                      return (
                        <div className="bg-cyan-500/5 border border-cyan-500/20 p-8 rounded-[2rem]">
                          <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
                            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">📈 {g.title || "Experiment Graph"}</p>
                            {rel && (
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${badgeColor}`}>
                                {relLabel}{curveSymbol}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1 italic">{g.description}</p>
                          {g.formula && <p className="text-[10px] font-mono text-cyan-600/80 mb-5">f(x) = {g.formula}</p>}
                          <LResponsive width="100%" height={300}>
                            <LineChart data={pts} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                              <LGrid strokeDasharray="3 3" stroke="#ffffff10" />
                              <LXAxis
                                dataKey="x"
                                label={{ value: g.xAxis || "X", position: "insideBottom", offset: -15, fill: "#9ca3af", fontSize: 11 }}
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                              />
                              <LYAxis
                                label={{ value: g.yAxis || "Y", angle: -90, position: "insideLeft", offset: 10, fill: "#9ca3af", fontSize: 11 }}
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                                width={55}
                              />
                              <LTooltip
                                contentStyle={{ background: "#0a0a0a", border: "1px solid #14b8a6", borderRadius: 12, fontSize: 12 }}
                                itemStyle={{ color: "#5eead4" }}
                                formatter={val => [typeof val === "number" ? val.toLocaleString() : val, g.yAxis || "Y"]}
                                labelFormatter={label => `${g.xAxis || "X"} = ${label}`}
                              />
                              <ReferenceLine y={0} stroke="#ffffff20" />
                              <Line
                                type="monotone"
                                dataKey="y"
                                stroke="#14b8a6"
                                strokeWidth={3}
                                dot={{ fill: "#14b8a6", r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 7, fill: "#5eead4" }}
                              />
                            </LineChart>
                          </LResponsive>
                          <p className="text-[9px] text-gray-600 text-center mt-3 uppercase tracking-widest">
                            {pts.length} computed data points • {relLabel} relationship
                          </p>
                        </div>
                      );
                    })()}

                    {/* Calculations */}
                    {practicalData.labManual.calculations && (
                      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-4">🧮 Calculations</p>
                        <div className="bg-black/50 p-6 rounded-xl border border-white/5 font-mono text-sm text-gray-300 leading-relaxed">
                          {practicalData.labManual.calculations}
                        </div>
                      </div>
                    )}

                    {/* Result */}
                    {practicalData.labManual.result && (
                      <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">✅ Result</p>
                        <p className="text-white text-lg font-medium leading-relaxed">{practicalData.labManual.result}</p>
                      </div>
                    )}

                    {/* Precautions + Sources of Error */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {practicalData.labManual.precautions?.length > 0 && (
                        <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[2rem]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-4">⚠️ Precautions</p>
                          <ul className="space-y-3">
                            {practicalData.labManual.precautions.map((p, i) => (
                              <li key={i} className="flex gap-3 text-sm text-gray-300">
                                <span className="text-rose-400 mt-0.5">•</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {practicalData.labManual.sourcesOfError?.length > 0 && (
                        <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2rem]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">🔍 Sources of Error</p>
                          <ul className="space-y-3">
                            {practicalData.labManual.sourcesOfError.map((e, i) => (
                              <li key={i} className="flex gap-3 text-sm text-gray-300">
                                <span className="text-amber-400 mt-0.5">•</span>{e}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* COMPUTER PROGRAM SECTION */}
                {practicalData.computerProgram && (
                  <div className="space-y-6">
                    <SectionDivider label="💻 Computer Program" color="violet" />

                    <div className="bg-violet-500/5 border border-violet-500/20 p-8 rounded-[2rem]">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">🎯 Program Aim</p>
                        <span className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-lg text-xs font-bold border border-violet-500/30">{practicalData.computerProgram.language}</span>
                      </div>
                      <p className="text-white text-lg font-medium">{practicalData.computerProgram.aim}</p>
                    </div>

                    {practicalData.computerProgram.algorithm?.length > 0 && (
                      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">📝 Algorithm</p>
                        <div className="space-y-3">
                          {practicalData.computerProgram.algorithm.map((step, i) => (
                            <div key={i} className="flex gap-4">
                              <span className="text-indigo-400 font-mono text-sm shrink-0">{i + 1}.</span>
                              <p className="text-gray-300 text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {practicalData.computerProgram.code && (
                      <div className="bg-[#080808] border border-white/10 rounded-[2rem] overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">💾 Source Code — {practicalData.computerProgram.language}</p>
                          <CopyButton text={practicalData.computerProgram.code} />
                        </div>
                        <pre className="p-8 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                          {practicalData.computerProgram.code}
                        </pre>
                      </div>
                    )}

                    {practicalData.computerProgram.output && (
                      <div className="bg-black border border-emerald-500/20 p-6 rounded-[1.5rem] font-mono">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">▶ Expected Output</p>
                        <pre className="text-emerald-300 text-sm whitespace-pre-wrap">{practicalData.computerProgram.output}</pre>
                      </div>
                    )}

                    {practicalData.computerProgram.flowchart && (
                      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">🔀 Program Flowchart</p>
                        <MermaidChart chartData={practicalData.computerProgram.flowchart} />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {practicalData.computerProgram.timeComplexity && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                          <p className="text-xs text-gray-500 mb-1">Time Complexity</p>
                          <p className="text-white font-black text-xl font-mono">{practicalData.computerProgram.timeComplexity.split(" ")[0]}</p>
                          <p className="text-xs text-gray-600 mt-1">{practicalData.computerProgram.timeComplexity.split(" ").slice(1).join(" ")}</p>
                        </div>
                      )}
                      {practicalData.computerProgram.spaceComplexity && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                          <p className="text-xs text-gray-500 mb-1">Space Complexity</p>
                          <p className="text-white font-black text-xl font-mono">{practicalData.computerProgram.spaceComplexity.split(" ")[0]}</p>
                          <p className="text-xs text-gray-600 mt-1">{practicalData.computerProgram.spaceComplexity.split(" ").slice(1).join(" ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* HINGLISH EXPLANATION */}
                {practicalData.hinglishExplanation && (
                  <div className="space-y-6">
                    <SectionDivider label="💬 Hinglish Mein Samjho" color="yellow" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(practicalData.hinglishExplanation).map(([key, val], i) => {
                        const colors = ["yellow", "teal", "orange", "violet", "cyan", "emerald"];
                        const c = colors[i % colors.length];
                        const labels = { overview: "🌟 Overall Concept", theory: "📖 Theory ka Matlab", procedure: "📋 Steps Kyun?", observation: "📊 Table Kaise Bharein", graph: "📈 Graph Mein Kya Dekho", result: "✅ Result Kaise Likho" };
                        return (
                          <div key={key} className={`bg-${c}-500/5 border border-${c}-500/20 p-6 rounded-[1.5rem]`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest text-${c}-400 mb-3`}>{labels[key] || key}</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{val}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* VIVA QUESTIONS */}
                {practicalData.vivaQuestions?.length > 0 && (
                  <div className="space-y-6">
                    <SectionDivider label="🎤 Viva Voce Questions" color="rose" />
                    <div className="grid grid-cols-1 gap-4">
                      {practicalData.vivaQuestions.map((viva, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/[0.07] transition-all">
                          <p className="text-xs font-black text-rose-400 mb-2 uppercase tracking-widest">Q{i + 1}</p>
                          <p className="text-white font-bold italic mb-3">"{viva.question}"</p>
                          <div className="h-px bg-white/10 mb-3" />
                          <p className="text-gray-400 text-sm leading-relaxed">{viva.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUICK REVISION */}
                {practicalData.quickRevision?.length > 0 && (
                  <section className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-2 border-teal-500/30 p-10 rounded-[2.5rem]">
                    <h4 className="text-2xl font-black mb-6 text-teal-300 flex items-center gap-3">
                      <FaBoltLightning className="animate-pulse" /> Viva Se Pehle — Quick Revision
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {practicalData.quickRevision.map((tip, i) => (
                        <div key={i} className="bg-black/40 border border-white/10 p-5 rounded-2xl flex gap-4 items-start">
                          <span className="text-teal-400 font-black italic opacity-50">#{i + 1}</span>
                          <p className="text-gray-200 text-sm font-medium">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== DEEP DIVE RESULTS SECTION ==================== */}
          <AnimatePresence>
            {deepDiveData && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto mt-32 space-y-12 pb-20 text-left"
              >
                {/* Header Banner */}
                <div className="text-center space-y-4">
                  <span className="inline-block py-1 px-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold tracking-widest uppercase text-violet-400">
                    🧠 Zero to Hero Journey
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black">
                    Deep Dive: <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">{deepDiveData.topic}</span>
                  </h3>
                  <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">{deepDiveData.overview}</p>
                </div>

                {/* Hinglish TLDR and mindmap layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Hinglish TLDR (Left/Top) */}
                  <div className="lg:col-span-1 space-y-6">
                    {deepDiveData.hinglishTldr && (
                      <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 p-8 rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><FaBrain className="text-6xl text-yellow-400" /></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-3">🔥 Hinglish TLDR (Quick Summary)</p>
                        <p className="text-gray-200 text-sm leading-relaxed font-medium italic">"{deepDiveData.hinglishTldr}"</p>
                      </div>
                    )}

                    {deepDiveData.expertSummary && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-8 rounded-[2rem] relative overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-3">🏆 Expert Mental Model</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{deepDiveData.expertSummary}</p>
                      </div>
                    )}
                  </div>

                  {/* Mind Map / Concepts Map (Right) */}
                  {deepDiveData.mindMap && (
                    <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">🗺️ Journey Map (Visual Overview)</p>
                      <MermaidChart chartData={deepDiveData.mindMap} />
                    </div>
                  )}
                </div>

                {/* The 8 Chapters Journey */}
                <div className="space-y-12">
                  <SectionDivider label="🚀 The 8-Step Mastery Path" color="violet" />

                  <div className="space-y-16 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-violet-500/40 before:to-indigo-500/5">
                    {deepDiveData.journey?.map((chap, idx) => (
                      <div key={idx} className="relative pl-16 group">
                        {/* Timeline Node Icon */}
                        <div className="absolute left-2.5 top-0 w-8 h-8 rounded-full bg-violet-600 border-4 border-[#050505] flex items-center justify-center text-sm shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-transform">
                          {chap.emoji || "✨"}
                        </div>

                        {/* Chapter Card */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:border-violet-500/30 transition-all space-y-6 relative overflow-hidden">
                          <CopyButton text={`Chapter ${chap.chapter}: ${chap.title}\n\nAnalogy:\n${chap.analogy}\n\nExplanation:\n${chap.explanation}`} />
                          
                          {/* Tag & Title */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-black tracking-widest uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3.5 py-1 rounded-full">
                              {chap.levelTag || `LEVEL ${idx}`}
                            </span>
                            <h4 className="text-2xl font-black text-white mt-2">
                              Chapter {chap.chapter}: {chap.title}
                            </h4>
                          </div>

                          {/* Analogy Story Box */}
                          {chap.analogy && (
                            <div className="bg-gradient-to-r from-violet-500/5 to-transparent border-l-4 border-violet-500 p-6 rounded-r-2xl italic text-gray-300 text-sm leading-relaxed">
                              <span className="text-violet-400 font-bold block not-italic text-xs uppercase tracking-wider mb-1">💡 Real-World Story / Analogy</span>
                              "{chap.analogy}"
                            </div>
                          )}

                          {/* Explanation Markdown */}
                          {chap.explanation && (
                            <div className="text-gray-300 text-base leading-relaxed markdown-body">
                              <ReactMarkdown components={{
                                h1: ({ node, ...props }) => <h1 className="text-xl font-black text-white mb-4 mt-6 uppercase tracking-tighter" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-violet-300 mb-3 mt-5" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 marker:text-violet-500" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2 marker:text-violet-500" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-black text-white bg-violet-500/20 px-1 py-0.5 rounded" {...props} />,
                                code: ({ node, inline, ...props }) => inline ? <code className="bg-white/10 text-pink-400 px-1 py-0.5 rounded text-xs font-mono" {...props} /> : <pre className="bg-[#080808] p-4 rounded-xl overflow-x-auto border border-white/5 my-4 text-xs font-mono"><code {...props} /></pre>,
                              }}>
                                {chap.explanation}
                              </ReactMarkdown>
                            </div>
                          )}

                          {/* Mermaid Flowchart */}
                          {chap.diagram && (
                            <div className="space-y-3 pt-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500/70">📊 Mental Visual Model</p>
                              <MermaidChart chartData={chap.diagram} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
        <Footer />
      </div>
    </motion.div>
  );
};

const InputGroup = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">{label}</label>
    <input
      type="text" name={name} value={value} onChange={onChange}
      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50 transition-all"
    />
  </div>
);

const ToggleButton = ({ label, active, onClick }) => (
  <div className="flex items-center gap-4 cursor-pointer group" onClick={onClick}>
    <div className={`w-14 h-7 rounded-full relative p-1 transition-all ${active ? "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" : "bg-white/10"}`}>
      <motion.div animate={{ x: active ? 28 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-lg" />
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-white" : "text-gray-500"}`}>{label}</span>
  </div>
);

const ModeButton = ({ icon, label, active, onClick, practicalMode, deepDiveMode }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${active
      ? practicalMode
        ? "bg-teal-400 text-black shadow-[0_0_20px_rgba(20,184,166,0.3)]"
        : deepDiveMode
          ? "bg-violet-400 text-black shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      : "bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10"
      }`}
  >
    {icon} {label}
  </button>
);


const SectionDivider = ({ label, color = "indigo" }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="h-px flex-1 bg-white/5" />
    <span className={`text-xs font-black uppercase tracking-widest text-${color}-400 px-3 py-1 bg-${color}-500/10 border border-${color}-500/20 rounded-full`}>{label}</span>
    <div className="h-px flex-1 bg-white/5" />
  </div>
);


export default Notes;

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-xs flex items-center gap-2 border border-white/10 z-20 opacity-0 group-hover:opacity-100 backdrop-blur-md">
      {copied ? <FaCheck className="text-emerald-400" /> : <FaRegCopy />}
      {copied ? "Copied!" : "Copy Content"}
    </button>
  );
};

const InteractiveFlashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="w-full h-44 cursor-pointer relative group" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: "1000px" }}>
      <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }} className="w-full h-full absolute" style={{ transformStyle: "preserve-3d" }}>

        {/* Front (Question) */}
        <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/30 transition-colors group-hover:bg-white/10">
          <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-3">Question</span>
          <h3 className="text-white font-bold leading-relaxed">{question}</h3>
          <span className="absolute bottom-4 text-emerald-500/30 text-[10px] font-bold uppercase tracking-widest animate-pulse">Click to Flip ↺</span>
        </div>

        {/* Back (Answer) */}
        <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} className="absolute inset-0 bg-emerald-900/40 border border-emerald-500/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center overflow-y-auto shadow-lg custom-scrollbar">
          <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-3">Answer</span>
          <p className="text-emerald-50 text-sm leading-relaxed">{answer}</p>
        </div>

      </motion.div>
    </div>
  );
};
