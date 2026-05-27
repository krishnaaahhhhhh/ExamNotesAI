import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  FaVolumeHigh,
  FaVolumeXmark,
  FaArrowRight,
  FaBrain,
  FaFlask,
  FaRegFileLines,
  FaTerminal,
  FaStar,
  FaPaperPlane,
  FaBolt,
  FaEye
} from "react-icons/fa6";

const mascotDialogs = {
  intro: {
    text: "Welcome to ExamNotesAI! Hey there! Regards from Krishna, creator of ExamNotesAI. I am Synapse, your AI study companion. I am here to help you turn complex university syllabus topics and academic jargon into structured, god-level wisdom. Click on any module below to see how I can upgrade your exam prep!",
    audioText: "Welcome to Exam Notes A.I. Hey there! Regards from Krishna, creator of Exam Notes A.I. I am Synapse, your A.I. study companion. I am here to help you turn complex university syllabus topics and academic jargon into structured, god level wisdom. Click on any module below to see how I can upgrade your exam prep!"
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("intro");
  const [typedText, setTypedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [mascotStatus, setMascotStatus] = useState("ONLINE"); // ONLINE, SPEAKING, THINKING
  
  const typingTimer = useRef(null);
  const speechUtterance = useRef(null);
  const introAudio = useRef(null);

  // Play a premium synthetic digital sound on hover/click using Web Audio API
  const playSoundEffect = (type = "click") => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      } else if (type === "thinking") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "powerup") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.6);
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      }
    } catch (e) {
      // AudioContext could be blocked by autoplay policies
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!isInitialized) {
      setTypedText("System Offline. Click 'Start Guided Tour' to initialize...");
      return;
    }

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
    }, 15);

    speakVoice(mascotDialogs[activeTab].audioText, activeTab === "intro");

    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
      stopVoice();
    };
  }, [activeTab, isInitialized]);

  const speakTTS = (text) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      return name.includes("david") || name.includes("male") || name.includes("google us english male") || name.includes("microsoft david");
    });
    const englishVoice = maleVoice || voices.find(v => v.lang.startsWith("en-"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.volume = 1.0; // Max volume
    utterance.rate = 1.1;   // Confident, slightly faster rate
    utterance.pitch = 1.0;  // Solid boy vocal pitch
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setMascotStatus("SPEAKING");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setMascotStatus("ONLINE");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setMascotStatus("ONLINE");
    };
    
    speechUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Speech Synthesis (checks for custom audio file for intro tab)
  const speakVoice = (text, isIntro = false) => {
    window.speechSynthesis.cancel();
    if (introAudio.current) {
      introAudio.current.pause();
      introAudio.current.currentTime = 0;
    }

    if (voiceMuted) {
      setIsSpeaking(false);
      setMascotStatus("ONLINE");
      return;
    }

    if (isIntro) {
      if (!introAudio.current) {
        introAudio.current = new Audio("/intro_voice.mp3");
        introAudio.current.onplay = () => {
          setIsSpeaking(true);
          setMascotStatus("SPEAKING");
        };
        introAudio.current.onended = () => {
          setIsSpeaking(false);
          setMascotStatus("ONLINE");
        };
        introAudio.current.onerror = () => {
          setIsSpeaking(false);
          setMascotStatus("ONLINE");
          speakTTS(text);
        };
      }
      introAudio.current.volume = 1.0;
      introAudio.current.play().catch((err) => {
        console.warn("Custom audio play failed, falling back to TTS:", err);
        speakTTS(text);
      });
    } else {
      speakTTS(text);
    }
  };

  const stopVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (introAudio.current) {
      introAudio.current.pause();
      introAudio.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setMascotStatus("ONLINE");
  };

  const handleMuteToggle = () => {
    playSoundEffect("click");
    const nextMute = !voiceMuted;
    setVoiceMuted(nextMute);
    if (nextMute) {
      stopVoice();
    } else {
      speakVoice(mascotDialogs[activeTab].audioText, activeTab === "intro");
    }
  };

  // Interactive Live Chat
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatLoading(true);
    setMascotStatus("THINKING");
    playSoundEffect("thinking");
    
    stopVoice();
    
    // Set a typewriter "Thinking..." status message
    setTypedText("Processing input... Synapse is reasoning...");
    
    try {
      const res = await axiosInstance.post("/api/notes/mascot/chat", { message: userMsg });
      if (res.data.success) {
        const reply = res.data.reply;
        playSoundEffect("success");
        
        // Custom fast typewriter for response
        setTypedText("");
        let index = 0;
        if (typingTimer.current) clearInterval(typingTimer.current);
        
        typingTimer.current = setInterval(() => {
          if (index < reply.length) {
            setTypedText((prev) => prev + reply.charAt(index));
            index++;
          } else {
            clearInterval(typingTimer.current);
          }
        }, 15);
        
        speakVoice(reply);
      }
    } catch (err) {
      console.error(err);
      setTypedText("Bhai, server offline chala gaya lagta hai. Dobara poochiye na yaar!");
      setMascotStatus("ONLINE");
    } finally {
      setChatLoading(false);
    }
  };

  // Quick Action: Motivational Quote
  const handleMotivationBoost = async () => {
    if (chatLoading) return;
    setChatInput("");
    setChatLoading(true);
    setMascotStatus("THINKING");
    playSoundEffect("thinking");
    stopVoice();
    setTypedText("Accessing motivational mainframe...");

    try {
      const res = await axiosInstance.post("/api/notes/mascot/chat", { 
        message: "Bhai, mujhe thodi energy aur college level exam motivation quote do Hinglish me tagdi waali!" 
      });
      if (res.data.success) {
        const reply = res.data.reply;
        playSoundEffect("success");
        
        setTypedText("");
        let index = 0;
        if (typingTimer.current) clearInterval(typingTimer.current);
        
        typingTimer.current = setInterval(() => {
          if (index < reply.length) {
            setTypedText((prev) => prev + reply.charAt(index));
            index++;
          } else {
            clearInterval(typingTimer.current);
          }
        }, 15);
        
        speakVoice(reply);
      }
    } catch (err) {
      console.error(err);
      setTypedText("Bhai, tension mat lo! Padhte raho aur fodte raho!");
      setMascotStatus("ONLINE");
    } finally {
      setChatLoading(false);
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
        className="relative z-10 mb-8 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
      >
        <FaStar className="text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">
          Overview
        </span>
      </motion.div>

      {/* Main Glassmorphic Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[4rem] p-8 md:p-14 backdrop-blur-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 shadow-2xl"
      >
        {/* Left Side: Mascot Avatar, Status, and Sound Controls */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center gap-6">
          <div className="relative group">
            {/* Hologram Rings */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur-2xl transition-opacity duration-500 ${
              mascotStatus === "THINKING" ? "opacity-40 animate-pulse" : mascotStatus === "SPEAKING" ? "opacity-30" : "opacity-15"
            }`} />
            <div className="absolute -inset-4 border border-indigo-500/20 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute -inset-8 border border-purple-500/10 rounded-full animate-reverse-spin" style={{ animationDuration: '20s' }} />

            {/* Mascot Image */}
            <motion.div
              animate={{
                y: mascotStatus === "SPEAKING" ? [0, -8, 0] : [0, -12, 0],
              }}
              transition={{
                duration: mascotStatus === "SPEAKING" ? 2 : 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 bg-black/40 relative z-10 flex items-center justify-center shadow-2xl transition-colors duration-500 ${
                mascotStatus === "THINKING" ? "border-amber-500/55 shadow-[0_0_30px_rgba(245,158,11,0.2)]" : mascotStatus === "SPEAKING" ? "border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.2)]" : "border-white/15"
              }`}
            >
              <img
                src="/ai_mascot.png"
                alt="Synapse - AI Mascot"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
              />
            </motion.div>

            {/* HUD Status Badge */}
            <div className={`absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full border text-[8px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md ${
              mascotStatus === "THINKING"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                : mascotStatus === "SPEAKING"
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-green-500/10 border-green-500/30 text-green-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                mascotStatus === "THINKING" ? "bg-amber-400 animate-ping" : mascotStatus === "SPEAKING" ? "bg-purple-400" : "bg-green-400"
              }`} />
              {mascotStatus}
            </div>
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
                    height: isSpeaking ? [4, 20, 4] : mascotStatus === "THINKING" ? [4, 12, 4] : 4,
                  }}
                  transition={{
                    duration: mascotStatus === "THINKING" ? 0.8 + i * 0.15 : 0.4 + i * 0.08,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`w-1 rounded-full ${
                    isSpeaking 
                      ? "bg-violet-400" 
                      : mascotStatus === "THINKING" 
                        ? "bg-amber-400" 
                        : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Speech Bubble, Chat Input, and System Subroutines */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          
          {/* Speech Terminal Bubble */}
          <div className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 shadow-inner flex-grow flex flex-col justify-center min-h-[170px]">
            <div className="absolute top-8 -left-3 w-6 h-6 bg-[#0c0c16] border-l border-t border-white/10 rotate-[-45deg] hidden lg:block" />
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                <FaTerminal className="text-xs" /> Terminal://Synapse_Core
              </div>
              
              {/* Motivation booster quick button */}
              <button
                onClick={() => {
                  playSoundEffect("click");
                  handleMotivationBoost();
                }}
                disabled={chatLoading}
                className="text-[9px] font-black uppercase bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-lg disabled:opacity-50"
              >
                <FaBolt /> Motivate Me
              </button>
            </div>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
              {typedText}
              <span className="w-2.5 h-4 bg-indigo-400 inline-block ml-1 animate-pulse" />
            </p>
          </div>

          {/* Interactive Chat Form */}
          <form 
            onSubmit={handleSendChat}
            className="flex gap-2 relative bg-white/5 border border-white/10 rounded-2xl p-2 items-center"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={chatLoading ? "Thinking..." : "Ask Synapse a question (e.g. 'What is a stack?', 'Explain Deep Dive')..."}
              disabled={chatLoading}
              className="bg-transparent flex-grow text-sm py-2 px-3 focus:outline-none text-white placeholder-gray-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-xs transition-colors shrink-0 disabled:opacity-50 disabled:bg-white/5 disabled:text-gray-500 cursor-pointer"
            >
              {chatLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </form>

          {/* Subroutines Grid */}
          <div className="space-y-3">
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 pl-2">
              Select Subsystem Core
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  playSoundEffect("click");
                  setActiveTab("intro");
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "intro"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaStar className="text-indigo-400 text-sm shrink-0 animate-pulse" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Hello</p>
                  <p className="text-[8px] text-gray-500">Welcome Routine</p>
                </div>
              </button>

              <button
                onClick={() => {
                  playSoundEffect("click");
                  setActiveTab("notes")}
                }
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "notes"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaRegFileLines className="text-cyan-400 text-sm shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Exam Notes</p>
                  <p className="text-[8px] text-gray-500">Revision Engine</p>
                </div>
              </button>

              <button
                onClick={() => {
                  playSoundEffect("click");
                  setActiveTab("deepdive")}
                }
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "deepdive"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaBrain className="text-violet-400 text-sm shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Deep Dive</p>
                  <p className="text-[8px] text-gray-500">0-to-Hero Timeline</p>
                </div>
              </button>

              <button
                onClick={() => {
                  playSoundEffect("click");
                  setActiveTab("practicals")}
                }
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === "practicals"
                    ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <FaFlask className="text-teal-400 text-sm shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Lab Manual</p>
                  <p className="text-[8px] text-gray-500">Practical & Code</p>
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
                playSoundEffect("click");
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

      {/* --- Initialization Autoplay Policy Overlay --- */}
      <AnimatePresence>
        {!isInitialized && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-[#020202]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="max-w-md w-full bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Outer decorative ring */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/10 blur-2xl rounded-full" />
              <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-purple-500/10 blur-2xl rounded-full" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Glowing AI Core Icon */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(99, 102, 241, 0.2)", "0 0 40px rgba(99, 102, 241, 0.4)", "0 0 20px rgba(99, 102, 241, 0.2)"] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-4xl text-indigo-400 mb-8"
                >
                  <FaBrain className="animate-pulse" />
                </motion.div>

                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">
                  System Overview
                </span>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tight mb-4">
                  Initialize Synapse
                </h1>
                <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8 max-w-xs mx-auto">
                  Click below to activate the neural speech synthesizer and start the guided tour with Synapse.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsInitialized(true);
                    playSoundEffect("powerup");
                  }}
                  className="w-full py-4.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-xs font-black text-white uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 group cursor-pointer"
                >
                  Start Guided Tour
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeMascot;
