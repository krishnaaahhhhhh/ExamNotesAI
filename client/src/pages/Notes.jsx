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

// --- PIE CHART COLORS ---
const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#e0d9ff"];

// --- Mermaid Flowchart ---
const MermaidChart = ({ chartData }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    if (!chartData || !ref.current) return;
    mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose" });
    const id = `mermaid-${Date.now()}`;
    mermaid.render(id, chartData).then(({ svg }) => setSvg(svg)).catch(() => { });
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

              {/* MAIN CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Detailed Notes */}
                  <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
                    <h4 className="text-2xl font-bold mb-6 text-indigo-400">Detailed Notes</h4>
                    <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {notesData.notes?.content}
                    </div>
                  </section>

                  {/* Mermaid Flowchart */}
                  {notesData.visuals?.mermaidData && (
                    <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                      <h4 className="text-2xl font-bold mb-6 text-indigo-400">🔀 Visual Flowchart</h4>
                      <MermaidChart chartData={notesData.visuals.mermaidData} />
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

                  {/* Flashcards */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 p-8 rounded-[2rem]">
                    <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-6">⚡ Flashcards</h4>
                    {Array.isArray(notesData.flashcards)
                      ? notesData.flashcards.slice(0, 5).map((f, i) => (
                        <div key={i} className="mb-4 p-4 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-sm font-bold text-white mb-1">Q: {f.front || f.question}</p>
                          <p className="text-xs text-gray-400 italic">A: {f.back || f.answer}</p>
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

              {/* Exam Prep / Viva */}
              {notesData.examPrep?.vivaQuestions?.length > 0 && (
                <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                  <h4 className="text-2xl font-bold mb-6 text-pink-400">🎤 Viva Questions</h4>
                  <div className="space-y-3">
                    {notesData.examPrep.vivaQuestions.slice(0, 8).map((q, i) => (
                      <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-pink-400 font-black text-sm min-w-[24px]">{i + 1}.</span>
                        <p className="text-sm text-gray-300">{q}</p>
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
