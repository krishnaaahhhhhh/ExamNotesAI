import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaClockRotateLeft
} from "react-icons/fa6";
import ReactMarkdown from "react-markdown";

// --- PIE CHART COLORS ---
const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#e0d9ff"];

// --- Mermaid Flowchart ---
const MermaidChart = ({ chartData }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    if (!chartData || !ref.current) return;
    try {
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose", suppressError: true });
      const id = `mermaid-${Date.now()}`;
      
      // Syntax validation check
      mermaid.parse(chartData).then(() => {
        mermaid.render(id, chartData).then(({ svg }) => setSvg(svg)).catch((e) => {
           console.error("Mermaid Render Error:", e);
           setSvg(""); // Fail silently
        });
      }).catch((e) => {
        console.warn("Invalid Mermaid Syntax Detected - Hiding Chart");
        setSvg(""); // Hide broken chart
      });
    } catch (err) {
      console.error("Mermaid Init Error:", err);
    }
  }, [chartData]);

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

  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [notesData, setNotesData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (!formData.topic) return alert("Bhai, topic toh likho!");
    setLoading(true);
    setNotesData(null);
    try {
      const response = await axiosInstance.post("/api/notes/generate", formData);
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
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-grow px-6 py-20 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase mb-4 text-indigo-400">
              AI-Powered Study Engine
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Elevate Your <span className="text-indigo-500">Learning</span>
            </h2>
          </motion.div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div whileHover={{ y: -5 }} className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-indigo-400 text-3xl">✨</span>
                <h3 className="text-2xl font-black mt-4 text-white">Create New Notes</h3>
                <p className="text-gray-500 text-sm mt-2 font-medium">Fill the details below to conjure expert-level academic modules in seconds.</p>
              </div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => (window.location.href = "/my-notes")}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 cursor-pointer group relative overflow-hidden"
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
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/40 transition-all" />
            </motion.div>
          </div>

          {/* Form Card */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-8 md:p-14 border border-white/10 shadow-2xl relative">
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Target Topic</label>
                <input
                  type="text" name="topic" placeholder="e.g. Frontend Core Concepts"
                  value={formData.topic} onChange={handleInputChange}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-8 py-6 text-xl outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Academic Level" name="classLevel" value={formData.classLevel} onChange={handleInputChange} />
                <InputGroup label="Exam Category" name="examType" value={formData.examType} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-white/5">
                <ToggleButton label="Revision Mode" active={formData.revisionMode} onClick={() => handleToggle("revisionMode")} />
                <ToggleButton label="AI Diagrams" active={formData.includeDiagram} onClick={() => handleToggle("includeDiagram")} />
                <ToggleButton label="Smart Charts" active={formData.includeCharts} onClick={() => handleToggle("includeCharts")} />
              </div>

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
                  "Generate AI Notes 🧠"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {notesData && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto mt-32 space-y-12 pb-20">
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
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
                  <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md relative group">
                    <CopyButton text={typeof notesData.notes?.content === "string" ? notesData.notes.content : JSON.stringify(notesData.notes?.content)} />
                    <h4 className="text-2xl font-bold mb-6 text-indigo-400">Detailed Notes</h4>
                    <div className="markdown-body text-gray-300 leading-relaxed text-lg">
                      {typeof notesData.notes?.content === "string" ? (
                        <ReactMarkdown components={{
                          h1: ({node, ...props}) => <h1 className="text-3xl font-black text-white mb-6 mt-8 uppercase tracking-tighter" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-indigo-300 mb-4 mt-8" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mb-3 mt-6 border-b border-white/10 pb-2" {...props} />,
                          p: ({node, ...props}) => <p className="mb-6" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-3 marker:text-indigo-500" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-3 marker:text-indigo-500" {...props} />,
                          li: ({node, ...props}) => <li {...props} />,
                          strong: ({node, ...props}) => <strong className="font-black text-white bg-indigo-500/20 px-1.5 py-0.5 rounded" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 italic bg-white/5 rounded-r-2xl my-6" {...props} />,
                          code: ({node, inline, ...props}) => inline ? <code className="bg-white/10 text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono border border-white/10" {...props} /> : <div className="bg-[#080808] p-6 rounded-2xl overflow-x-auto border border-white/10 my-6 text-sm font-mono shadow-inner"><code {...props} /></div>,
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
                          <span className="text-orange-500 font-black text-xl italic opacity-50">#{i+1}</span>
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
      </main>
      <Footer />
    </div>
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
