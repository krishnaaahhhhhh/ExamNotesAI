import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import Footer from "../components/Footer";
import { useRef } from "react";
import {
  LineChart, Line, XAxis as LXAxis, YAxis as LYAxis, CartesianGrid as LGrid,
  Tooltip as LTooltip, ResponsiveContainer as LResponsive, ReferenceLine
} from "recharts";
import {
  FaLightbulb,
  FaBookOpen,
  FaLayerGroup,
  FaGraduationCap,
  FaClockRotateLeft,
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
  FaFlask,
  FaBrain
} from "react-icons/fa6";

const SectionDivider = ({ label, color = "indigo" }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="h-px flex-1 bg-white/5" />
    <span className={`text-xs font-black uppercase tracking-widest text-${color}-400 px-3 py-1 bg-${color}-500/10 border border-${color}-500/20 rounded-full`}>{label}</span>
    <div className="h-px flex-1 bg-white/5" />
  </div>
);




// --- Mermaid Flowchart Component ---
const MermaidChart = ({ chartData }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chartData) return;
    setSvg("");
    setError(false);

    // Detect if chartData is valid mermaid syntax or just placeholder text from AI
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
      <div className="bg-white/5 p-6 rounded-3xl border border-dashed border-cyan-500/30 flex flex-col items-center justify-center gap-3 min-h-[120px] my-4">
        <span className="text-3xl">🔀</span>
        <p className="text-xs font-bold text-cyan-500/60 uppercase tracking-widest">Diagram Preview</p>
        <p className="text-[10px] text-gray-600 text-center max-w-xs">AI-generated diagram data received. Render failed due to complex syntax — raw data below:</p>
        <pre className="text-[9px] text-gray-600 bg-black/30 p-3 rounded-xl overflow-x-auto w-full max-h-32 whitespace-pre-wrap">{chartData?.substring(0, 300)}</pre>
      </div>
    );
  }

  if (!svg) return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-center min-h-[100px] my-4">
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
      className="bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-center overflow-x-auto my-4 shadow-inner"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const SingleNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio Playback Handler
  const handlePlayAudio = (text) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice - prefer English and try for Google UK Female or similar recognizable voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsPlaying(false);
    
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axiosInstance.get(`/api/notes/${id}`);

        if (res.data.success) {
          setNote(res.data.note);
        }
      } catch (err) {
        console.error("Single Note Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse font-black tracking-widest uppercase text-indigo-500">
          Decrypting Module...
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center italic">
        Note not found in the vault.
      </div>
    );
  }

  // Final Bulletproof Rendering Logic
  const renderStructuredContent = () => {
    const content = note.content;

    // Case 1: Agar content purana plain string hai
    if (typeof content === "string") {
      return (
        <div className="whitespace-pre-line text-gray-300 leading-loose text-lg">
          {content}
        </div>
      );
    }

    // Case 2: Agar content Gemini ka naya structured object hai
    if (typeof content === "object" && content !== null) {
      // 🧠 Sub-case A: Deep Dive Journey
      if (content.journey) {
        return (
          <div className="space-y-12 text-left">
            {/* Header Banner */}
            <div className="text-center space-y-4">
              <span className="inline-block py-1 px-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold tracking-widest uppercase text-violet-400">
                🧠 Zero to Hero Journey
              </span>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">{content.overview}</p>
            </div>

            {/* Hinglish TLDR and mindmap layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {/* Hinglish TLDR (Left/Top) */}
              <div className="lg:col-span-1 space-y-6">
                {content.hinglishTldr && (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><FaBrain className="text-6xl text-yellow-400" /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-3">🔥 Hinglish TLDR (Quick Summary)</p>
                    <p className="text-gray-200 text-sm leading-relaxed font-medium italic">"{content.hinglishTldr}"</p>
                  </div>
                )}

                {content.expertSummary && (
                  <div className="bg-violet-500/5 border border-violet-500/20 p-8 rounded-[2rem] relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-3">🏆 Expert Mental Model</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{content.expertSummary}</p>
                  </div>
                )}
              </div>

              {/* Mind Map / Concepts Map (Right) */}
              {content.mindMap && (
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">🗺️ Journey Map (Visual Overview)</p>
                  <MermaidChart chartData={content.mindMap} />
                </div>
              )}
            </div>

            {/* The 8 Chapters Journey */}
            <div className="space-y-12">
              <SectionDivider label="🚀 The 8-Step Mastery Path" color="violet" />

              <div className="space-y-16 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-violet-500/40 before:to-indigo-500/5">
                {content.journey.map((chap, idx) => (
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
          </div>
        );
      }

      // 🧪 Sub-case B: Practical / Lab Manual / Computer Program
      if (content.labManual || content.computerProgram) {
        return (
          <div className="space-y-10 text-left">
            {/* Marking Scheme Banner */}
            {content.markingScheme?.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {content.markingScheme.map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
                    <p className="text-xs text-gray-500">{s.component}</p>
                    <p className="text-teal-400 font-black">{s.marks}M</p>
                  </div>
                ))}
              </div>
            )}

            {/* LAB MANUAL SECTION */}
            {content.labManual && (
              <div className="space-y-6">
                <SectionDivider label="📋 Lab Manual" color="teal" />

                {/* Aim */}
                <div className="bg-teal-500/5 border border-teal-500/20 p-8 rounded-[2rem]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-3">🎯 Aim</p>
                  <p className="text-white text-lg leading-relaxed font-medium">{content.labManual.aim}</p>
                </div>

                {/* Apparatus */}
                {content.labManual.apparatus?.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">🔧 Apparatus Required</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {content.labManual.apparatus.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl">
                          <span className="text-indigo-400 font-black text-sm">{i + 1}.</span>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Theory */}
                {content.labManual.theory && (
                  <div className="bg-purple-500/5 border border-purple-500/20 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4">📖 Theory</p>
                    <div className="text-gray-300 text-sm leading-relaxed markdown-body">
                      <ReactMarkdown>{content.labManual.theory}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Circuit Diagram */}
                {content.labManual.diagram && (
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">⚡ Circuit / Setup Diagram</p>
                    <MermaidChart chartData={content.labManual.diagram} />
                  </div>
                )}

                {/* Procedure */}
                {content.labManual.procedure?.length > 0 && (
                  <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-6">📋 Procedure</p>
                    <div className="space-y-4">
                      {content.labManual.procedure.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-7 h-7 rounded-full bg-orange-500 text-black font-black flex items-center justify-center text-xs shrink-0">{i + 1}</div>
                          <p className="text-gray-300 text-sm leading-relaxed pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observation Table */}
                {content.labManual.observationTable && (
                  <div className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-[2rem] overflow-x-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">📊 {content.labManual.observationTable.title || "Observation Table"}</p>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          {content.labManual.observationTable.headers?.map((h, i) => (
                            <th key={i} className="py-3 px-4 text-xs font-black uppercase tracking-wider text-blue-300">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {content.labManual.observationTable.rows?.map((row, i) => (
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
                {content.labManual.graph && (() => {
                  const g = content.labManual.graph;
                  const rel = (g.relationship || "").toLowerCase();

                  // Filter out AI placeholder strings — keep only numeric {x,y} objects
                  let rawPts = Array.isArray(g.dataPoints)
                    ? g.dataPoints.filter(p => p && typeof p === "object" && "x" in p && "y" in p && !isNaN(Number(p.x)) && !isNaN(Number(p.y)))
                    : [];

                  // Fallback: extract from observation table
                  if (rawPts.length < 3) {
                    rawPts = (content.labManual.observationTable?.rows || [])
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
                {content.labManual.calculations && (
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-4">🧮 Calculations</p>
                    <div className="bg-black/50 p-6 rounded-xl border border-white/5 font-mono text-sm text-gray-300 leading-relaxed">
                      {content.labManual.calculations}
                    </div>
                  </div>
                )}

                {/* Result */}
                {content.labManual.result && (
                  <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">✅ Result</p>
                    <p className="text-white text-lg font-medium leading-relaxed">{content.labManual.result}</p>
                  </div>
                )}

                {/* Precautions + Sources of Error */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.labManual.precautions?.length > 0 && (
                    <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[2rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-4">⚠️ Precautions</p>
                      <ul className="space-y-3">
                        {content.labManual.precautions.map((p, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-300">
                            <span className="text-rose-400 mt-0.5">•</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {content.labManual.sourcesOfError?.length > 0 && (
                    <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">🔍 Sources of Error</p>
                      <ul className="space-y-3">
                        {content.labManual.sourcesOfError.map((e, i) => (
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
            {content.computerProgram && (
              <div className="space-y-6">
                <SectionDivider label="💻 Computer Program" color="violet" />

                <div className="bg-violet-500/5 border border-violet-500/20 p-8 rounded-[2rem]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">🎯 Program Aim</p>
                    <span className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-lg text-xs font-bold border border-violet-500/30">{content.computerProgram.language}</span>
                  </div>
                  <p className="text-white text-lg font-medium">{content.computerProgram.aim}</p>
                </div>

                {content.computerProgram.algorithm?.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">📝 Algorithm</p>
                    <div className="space-y-3">
                      {content.computerProgram.algorithm.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="text-indigo-400 font-mono text-sm shrink-0">{i + 1}.</span>
                          <p className="text-gray-300 text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {content.computerProgram.code && (
                  <div className="bg-[#080808] border border-white/10 rounded-[2rem] overflow-hidden relative group">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">💾 Source Code — {content.computerProgram.language}</p>
                      <CopyButton text={content.computerProgram.code} />
                    </div>
                    <pre className="p-8 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {content.computerProgram.code}
                    </pre>
                  </div>
                )}

                {content.computerProgram.output && (
                  <div className="bg-black border border-emerald-500/20 p-6 rounded-[1.5rem] font-mono">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">▶ Expected Output</p>
                    <pre className="text-emerald-300 text-sm whitespace-pre-wrap">{content.computerProgram.output}</pre>
                  </div>
                )}

                {content.computerProgram.flowchart && (
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">🔀 Program Flowchart</p>
                    <MermaidChart chartData={content.computerProgram.flowchart} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {content.computerProgram.timeComplexity && (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                      <p className="text-xs text-gray-500 mb-1">Time Complexity</p>
                      <p className="text-white font-black text-xl font-mono">{content.computerProgram.timeComplexity.split(" ")[0]}</p>
                      <p className="text-xs text-gray-600 mt-1">{content.computerProgram.timeComplexity.split(" ").slice(1).join(" ")}</p>
                    </div>
                  )}
                  {content.computerProgram.spaceComplexity && (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                      <p className="text-xs text-gray-500 mb-1">Space Complexity</p>
                      <p className="text-white font-black text-xl font-mono">{content.computerProgram.spaceComplexity.split(" ")[0]}</p>
                      <p className="text-xs text-gray-600 mt-1">{content.computerProgram.spaceComplexity.split(" ").slice(1).join(" ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HINGLISH EXPLANATION */}
            {content.hinglishExplanation && (
              <div className="space-y-6">
                <SectionDivider label="💬 Hinglish Mein Samjho" color="yellow" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(content.hinglishExplanation).map(([key, val], i) => {
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
            {content.vivaQuestions?.length > 0 && (
              <div className="space-y-6">
                <SectionDivider label="🎤 Viva Voce Questions" color="rose" />
                <div className="grid grid-cols-1 gap-4">
                  {content.vivaQuestions.map((viva, i) => (
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
            {content.quickRevision?.length > 0 && (
              <section className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-2 border-teal-500/30 p-10 rounded-[2.5rem]">
                <h4 className="text-2xl font-black mb-6 text-teal-300 flex items-center gap-3">
                  <FaBoltLightning className="animate-pulse" /> Viva Se Pehle — Quick Revision
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.quickRevision.map((tip, i) => (
                    <div key={i} className="bg-black/40 border border-white/10 p-5 rounded-2xl flex gap-4 items-start">
                      <span className="text-teal-400 font-black italic opacity-50">#{i + 1}</span>
                      <p className="text-gray-200 text-sm font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      }

      return (
        <div className="space-y-12">

          {/* B. CHEAT SHEET */}
          {content.cheatSheet && Array.isArray(content.cheatSheet) && (
            <section className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 text-orange-400 mb-6 font-black text-sm uppercase tracking-widest">
                <FaBoltLightning /> Cheat Sheet (Last Minute Guide)
              </div>
              <div className="flex flex-wrap gap-3">
                {content.cheatSheet.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-mono text-sm shadow-inner"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* D. REAL WORLD APPLICATION */}
          {content.realWorldApplication && (
            <section className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] relative overflow-hidden">
              <FaGlobe className="absolute -bottom-6 -right-6 text-9xl text-emerald-500/10 pointer-events-none" />
              <div className="flex items-center gap-3 text-emerald-400 mb-4 font-black text-sm uppercase tracking-widest">
                Why Learn This? (Career Value)
              </div>
              <p className="text-gray-300 text-lg leading-relaxed relative z-10 italic">
                {content.realWorldApplication}
              </p>
            </section>
          )}




          {/* 1. Main Notes Section */}
          <section className="relative group">
            <CopyButton text={typeof content.notes === "string" ? content.notes : typeof content.notes?.content === "string" ? content.notes.content : JSON.stringify(content.notes)} />
            <div className="flex items-center gap-3 text-indigo-400 mb-6 uppercase tracking-widest font-black text-sm">
              <FaBookOpen /> Comprehensive Notes
            </div>
            <div className="markdown-body text-gray-300 leading-relaxed text-lg border-l-2 border-white/5 pl-6">
              {typeof content.notes === "string" || typeof content.notes?.content === "string" ? (
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
                  {typeof content.notes === "string" ? content.notes : content.notes.content}
                </ReactMarkdown>
              ) : (
                <pre className="whitespace-pre-wrap">{JSON.stringify(content.notes, null, 2)}</pre>
              )}
            </div>
          </section>

          {/* 2. Mnemonics / Memory Tricks */}
          {content.mnemonics && (
            <section className="bg-indigo-500/5 border border-indigo-500/20 p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl text-indigo-400">
                <FaLightbulb />
              </div>
              <div className="flex items-center gap-3 text-indigo-400 mb-4 font-black text-xs uppercase tracking-tighter">
                Intelligence Hack (Mnemonics)
              </div>
              <p className="text-indigo-100 italic font-medium relative z-10">
                {typeof content.mnemonics === "string"
                  ? content.mnemonics
                  : JSON.stringify(content.mnemonics)}
              </p>
            </section>
          )}

          {/* 3. Sub-Topics Section with Array Safety */}
          {content.subTopics && (
            <section>
              <div className="flex items-center gap-3 text-purple-400 mb-6 uppercase tracking-widest font-black text-sm">
                <FaLayerGroup /> Key Sub-Topics
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(content.subTopics) ? (
                  content.subTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-400 font-medium hover:bg-white/10 transition-colors"
                    >
                      {typeof topic === "object"
                        ? JSON.stringify(topic)
                        : topic}
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-400">
                    {JSON.stringify(content.subTopics)}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. Flashcards Section with Object Safety */}
          {content.flashcards && (
            <section className="bg-transparent">
              <div className="flex items-center justify-between text-emerald-400 mb-6 uppercase tracking-widest font-black text-sm">
                 <span className="flex items-center gap-3"><FaGraduationCap /> Active Recall Flashcards</span>
                 <span className="text-emerald-500/50 text-[10px]">Click to flip</span>
              </div>
              <div className="space-y-4">
                {Array.isArray(content.flashcards) ? (
                  content.flashcards.map((card, i) => (
                    <div key={i} className="mb-4">
                      <InteractiveFlashcard question={typeof card.question === "object" ? JSON.stringify(card.question) : card.question || card.front || "N/A"} answer={typeof card.answer === "object" ? JSON.stringify(card.answer) : card.answer || card.back || "N/A"} />
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl text-gray-400">
                    {JSON.stringify(content.flashcards)}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. Multiple Visual Flowcharts */}
          {content.visuals?.flowcharts && Array.isArray(content.visuals.flowcharts) ? (
            <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
              <h4 className="text-2xl font-bold mb-8 text-indigo-400 flex items-center gap-3">
                <FaLayerGroup /> Visual Logic Systems
              </h4>
              <div className="space-y-8">
                {content.visuals.flowcharts.map((chart, i) => (
                  <div key={i} className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/50 ml-2">Diagram {i+1}</p>
                    <MermaidChart chartData={chart} />
                  </div>
                ))}
              </div>
            </section>
          ) : content.visuals?.mermaidData && (
            <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
              <h4 className="text-2xl font-bold mb-8 text-indigo-400 flex items-center gap-3">
                <FaLayerGroup /> Visual Logic System
              </h4>
              <MermaidChart chartData={content.visuals.mermaidData} />
            </section>
          )}

          {/* 5. Viva Voce Expert List */}
          {content.vivaQuestions && Array.isArray(content.vivaQuestions) && (
            <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
              <div className="flex items-center gap-3 text-emerald-400 mb-8 font-black text-sm uppercase tracking-widest">
                <FaGraduationCap /> Viva Voce Master List
              </div>
              <div className="grid grid-cols-1 gap-4">
                {content.vivaQuestions.map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-emerald-500/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        Q{i+1}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-white text-lg mb-4 leading-relaxed italic">"{item.question}"</p>
                        <div className="h-px bg-white/10 w-full mb-6" />
                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl">
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Ideal Answer</p>
                          <p className="text-gray-400 font-medium leading-relaxed text-sm">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. Comparative Analysis (Differences) */}
          {content.comparativeAnalysis && Array.isArray(content.comparativeAnalysis) && content.comparativeAnalysis.length > 0 && (
            <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] overflow-x-auto">
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
                  {content.comparativeAnalysis.map((row, i) => (
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
          {content.formulaTheoremBank && Array.isArray(content.formulaTheoremBank) && content.formulaTheoremBank.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.formulaTheoremBank.map((f, i) => (
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
          {content.stepByStepDerivations && Array.isArray(content.stepByStepDerivations) && content.stepByStepDerivations.length > 0 && (
            <section className="space-y-8">
              {content.stepByStepDerivations.map((d, i) => (
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
          {content.scientificDefinitions && Array.isArray(content.scientificDefinitions) && content.scientificDefinitions.length > 0 && (
            <section className="bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[2.5rem] relative overflow-hidden">
               <FaQuoteLeft className="absolute top-8 left-8 text-6xl text-emerald-500/10" />
               <div className="flex items-center gap-3 text-emerald-400 mb-8 font-black text-sm uppercase tracking-widest relative z-10">
                 Formal Scientific Definitions
               </div>
               <div className="space-y-8 relative z-10">
                 {content.scientificDefinitions.map((d, i) => (
                   <div key={i} className="pl-12 border-l-2 border-emerald-500/30">
                     <p className="text-emerald-400 font-bold mb-2 uppercase text-[10px] tracking-[0.2em]">{d.term}</p>
                     <p className="text-gray-200 text-xl font-medium leading-relaxed italic">"{d.definition}"</p>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {/* 10. Predictive Marking Scheme */}
          {content.markingScheme && Array.isArray(content.markingScheme) && content.markingScheme.length > 0 && (
            <section className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
              <h4 className="text-2xl font-bold mb-8 text-orange-400 flex items-center gap-3">
                <FaHighlighter /> Predictive Marking Scheme
              </h4>
              <div className="space-y-4">
                {content.markingScheme.map((s, i) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {content.glossary && Array.isArray(content.glossary) && content.glossary.length > 0 && (
              <section className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                  <FaLanguage /> Glossary
                </h4>
                <div className="space-y-4">
                  {content.glossary.map((g, i) => (
                    <div key={i}>
                      <span className="text-indigo-300 font-bold text-sm block mb-1">{g.term}</span>
                      <p className="text-xs text-gray-500 leading-relaxed">{g.definition}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {content.historicalEvolution && (
              <section className="bg-indigo-500/5 border border-indigo-500/20 p-8 rounded-[2rem]">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                  <FaClockRotateLeft /> Historical Evolution
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  {content.historicalEvolution}
                </p>
              </section>
            )}
          </div>

          {/* 13. Industry 2036 Roadmap & Prototype */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {content.industryRoadmap && Array.isArray(content.industryRoadmap) && (
              <section className="lg:col-span-2 bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><FaTimeline className="text-8xl" /></div>
                <h4 className="text-2xl font-bold mb-10 text-indigo-400 flex items-center gap-3">
                  🚀 Industry 2036 Roadmap
                </h4>
                <div className="space-y-8 relative z-10">
                  {content.industryRoadmap.map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="px-3 py-1 bg-indigo-500 text-black font-black rounded-lg text-[10px] mb-2">{step.year}</div>
                        {i !== content.industryRoadmap.length - 1 && <div className="w-px grow bg-indigo-500/20" />}
                      </div>
                      <p className="text-gray-300 text-lg font-medium pt-1 group-hover:text-white transition-colors">{step.milestone}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {content.futuristicPrototype && (
              <section className="bg-[#0a0a0a] border-2 border-indigo-500/30 p-8 rounded-[2rem] relative shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                <div className="flex items-center gap-3 text-indigo-400 mb-6 font-black text-xs uppercase tracking-widest">
                  <FaMicroscope /> AI-Dreamed Prototype
                </div>
                <h5 className="text-xl font-bold text-white mb-4 italic">"{content.futuristicPrototype.concept}"</h5>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {content.futuristicPrototype.vision}
                </p>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  2036 Feasibility: High
                </div>
              </section>
            )}
          </div>

          {/* 14. Zero-Day Hyper-Drive Hack */}
          {content.zeroDayHack && Array.isArray(content.zeroDayHack) && content.zeroDayHack.length > 0 && (
            <section className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-2 border-orange-500/30 p-10 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute -top-10 -right-10 text-[180px] text-orange-500/5 font-black uppercase tracking-tighter -rotate-12 pointer-events-none">HACK</div>
               <h4 className="text-2xl font-black mb-8 text-orange-400 flex items-center gap-4">
                 <FaBoltLightning className="animate-pulse" /> 💎 Zero-Day Hyper-Drive Hack
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {content.zeroDayHack.map((hack, i) => (
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
          {content.examChecklist && Array.isArray(content.examChecklist) && content.examChecklist.length > 0 && (
            <section className="bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[2.5rem]">
              <h4 className="text-2xl font-bold mb-8 text-emerald-400 flex items-center gap-3">
                <FaListCheck /> Exam Hall Checklist
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.examChecklist.map((item, i) => (
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
        </div>
      );
    }

    return (
      <p className="text-red-400 italic">
        Error: Invalid module structure detected.
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-28 relative">
        {/* Aesthetic Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

        <div className="relative z-10">
          <header className="mb-20">
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">
              {typeof note.topic === "string"
                ? note.topic
                : note.topic?.name || "Untitled Module"}
            </h1>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                SECURE_ID: {id.substring(0, 8)}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400/50 uppercase tracking-[0.4em]">
                <FaClockRotateLeft />
                {new Date(note.createdAt).toDateString()}
              </div>
            </div>
          </header>

          <div className="bg-white/[0.03] p-10 md:p-20 rounded-[4rem] border border-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden">
            {renderStructuredContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleNote;

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
