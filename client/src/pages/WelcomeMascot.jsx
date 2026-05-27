import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  FaVolumeHigh,
  FaVolumeXmark,
  FaArrowRight,
  FaBrain,
  FaFlask,
  FaRegFileLines,
  FaTerminal,
  FaStar
} from "react-icons/fa6";

const mascotDialogs = {
  intro: {
    text: "Hey there! I am Synapse, your AI study assistant. Welcome to ExamNotesAI! I am here to help you turn complex university syllabus topics and academic jargon into structured, god-level wisdom. Click on any module below to see how I can upgrade your exam prep!",
    audioText: "Hey there! I am Synapse, your A.I. study assistant. Welcome to Exam Notes A.I.! I am here to help you turn complex university syllabus topics and academic jargon into structured, god level wisdom. Click on any module below to see how I can upgrade your exam prep!"
  },
  notes: {
    text: "Got an exam tomorrow morning? My Exam Notes engine generates hyper-focused summaries, core formula sheets, structural comparison tables, and mock tests designed specifically to match your class curriculum. Supercharge your revision instantly!",
    audioText: "Got an exam tomorrow morning? My Exam Notes engine generates hyper-focused summaries, core formula sheets, structural comparison tables, and mock tests designed specifically to match your class curriculum. Supercharge your revision instantly!"
  },
  deepdive: {
    text: "Want to master a topic from absolute scratch? My Deep Dive subroutine creates an 8-chapter journey from Level 0 to Level 7. It includes real-world analogies, conceptual code blocks, and god-level Mermaid diagrams. Pure conceptual mastery, zero questions!",
    audioText: "Want to master a topic from absolute scratch? My Deep Dive subroutine creates an 8-chapter journey from Level 0 to Level 7. It includes real-world analogies, conceptual code blocks, and god-level Mermaid diagrams. Pure conceptual mastery, zero questions!"
  },
  practicals: {
    text: "Stressing over lab exams? My Practical File generator writes out complete university-grade lab manuals. You get aims, apparatus lists, detailed step-by-step procedures, observation tables, working source code, and 10 tricky viva questions to secure that perfect grade!",
    audioText: "Stressing over lab exams? My Practical File generator writes out complete university-grade lab manuals. You get aims, apparatus lists, detailed step-by-step procedures, observation tables, working source code, and 10 tricky viva questions to secure that perfect grade!"
  }
};

const WelcomeMascot = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("intro");
  const [typedText, setTypedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const typingTimer = useRef(null);
  const speechUtterance = useRef(null);

  // Typewriter effect
  useEffect(() => {
    const fullText = mascotDialogs[activeTab].text;
    setTypedText("");
    let index = 0;
    
    if (typingTimer.current) clearInterval(typingTimer.current);
    
    typingTimer.current = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingTimer.current);
      }
    }, 20);

    // Speak content
    speakVoice(mascotDialogs[activeTab].audioText);

    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
      stopVoice();
    };
  }, [activeTab]);

  // Voice Speech Synthesis
  const speakVoice = (text) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    if (voiceMuted) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Find a premium female/robot sounding voice if possible
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Natural"));
    if (googleVoice) utterance.voice = googleVoice;
    
    utterance.rate = 1.05;
    utterance.pitch = 1.15;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleMuteToggle = () => {
    const nextMute = !voiceMuted;
    setVoiceMuted(nextMute);
    if (nextMute) {
      stopVoice();
    } else {
      speakVoice(mascotDialogs[activeTab].audioText);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30 font-sans">
      {/* --- Premium Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[45%] h-[45%] bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-purple-500/10 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-50" />
      </div>

      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-10 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
      >
        <FaStar className="text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">
          Synapse Interactive Module
        </span>
      </motion.div>

      {/* Main Glassmorphic Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[4rem] p-8 md:p-14 backdrop-blur-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 shadow-2xl"
      >
        {/* Left Side: Mascot Avatar & Controls */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center gap-6">
          <div className="relative group">
            {/* Hologram Ring Backdrops */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
            <div className="absolute -inset-4 border border-indigo-500/20 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute -inset-8 border border-purple-500/10 rounded-full animate-reverse-spin" style={{ animationDuration: '20s' }} />

            {/* Mascot Image */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-white/15 bg-black/40 relative z-10 flex items-center justify-center shadow-2xl"
            >
              <img
                src="/ai_mascot.png"
                alt="Synapse - AI Mascot"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
          </div>

          {/* Voice Wave Visualizer & Mute button */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-full relative z-10 backdrop-blur-md">
            <button
              onClick={handleMuteToggle}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm transition-all"
              title={voiceMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {voiceMuted ? <FaVolumeXmark className="text-red-400" /> : <FaVolumeHigh className="text-green-400" />}
            </button>

            {/* Audio Wave Indicators */}
            <div className="flex gap-1 h-5 items-center w-28 px-1">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isSpeaking ? [4, 20, 4] : 4,
                  }}
                  transition={{
                    duration: 0.5 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`w-1 rounded-full ${
                    isSpeaking ? "bg-indigo-400" : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Speech Bubble & Subroutine Tabs */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-8">
          
          {/* Futuristic Speech Bubble */}
          <div className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-inner flex-grow flex flex-col justify-center min-h-[180px]">
            <div className="absolute top-8 -left-3 w-6 h-6 bg-[#0c0c16] border-l border-t border-white/10 rotate-[-45deg] hidden lg:block" />
            
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
              <FaTerminal className="text-xs" /> Terminal://Synapse_Voice
            </div>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed font-medium">
              {typedText}
              <span className="w-2.5 h-4 bg-indigo-400 inline-block ml-1 animate-pulse" />
            </p>
          </div>

          {/* Subroutines / Navigation Tabs */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3 pl-2">
              Select Subroutine Subsystem
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab("intro")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "intro"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaStar className="text-indigo-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase">System Hello</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Welcome Routine</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "notes"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaRegFileLines className="text-cyan-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase">Exam Notes</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Revision Helper</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("deepdive")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "deepdive"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaBrain className="text-violet-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase">Deep Dive</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">0-to-Hero Chapters</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("practicals")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "practicals"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaFlask className="text-teal-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase">Lab Practicals</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Lab Manual & Code</p>
                </div>
              </button>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-600">
              Ready to construct wisdom?
            </p>

            <button
              onClick={() => {
                stopVoice();
                navigate("/notes");
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-500 cursor-pointer"
            >
              Enter Application <FaArrowRight />
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeMascot;
