import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      // 1. Firebase Popup
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      // ✅ UI par loader ya status turant dikhao
      setIsRedirecting(true);

      // 2. Backend Call
      const result = await axiosInstance.post(
        "/api/auth/google",
        { name: user.displayName, email: user.email, photo: user.photoURL },
      );

      if (result.data.success) {
        // 3. Save token to localStorage for Authorization header usage
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
        }

        // 4. Redux state update (Isse Navbar turant update ho jayegi)
        dispatch(setUser(result.data.user));

        // 4. ✅ IMMEDIATE REDIRECT
        // 'replace: true' use karne se user back button daba kar login page pe nahi ja payega
        navigate("/", { replace: true });

        // 💡 Bonus Tip: Agar Navbar abhi bhi update nahi ho rahi (context issue),
        // toh navigate ke baad ek manual refresh de sakte ho:
        // window.location.reload();
      }
    } catch (error) {
      setIsRedirecting(false); // Error aaye toh redirection status hata do
      console.error("Auth Error:", error);
      alert("Auth failed, please try again!");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center selection:bg-indigo-500/30 overflow-hidden relative font-sans">
      {/* --- Aesthetic Background Mesh --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse delay-1000" />
      </div>

      <main className="flex-grow max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 px-6 py-20">
        {/* Left Section: The Power of Gemini 3.0 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
              Next-Gen AI Core : Gemini 3.0 Flash
            </span>
          </div>

          <h1 className="text-7xl xl:text-8xl font-black leading-[0.85] tracking-tighter text-white">
            Smart Learning <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
              Reimagined.
            </span>
          </h1>

          <p className="text-gray-400 text-xl font-medium max-w-lg leading-relaxed">
            Harness the world's most advanced reasoning model to turn complex
            academic jargon into structured, exam-ready wisdom.
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <CapabilityItem
              title="Multimodal Analysis"
              desc="Analyze PDFs, Hand-written notes, and Diagrams instantly."
            />
            <CapabilityItem
              title="Zero-Latency Reasoning"
              desc="Gemini 3.0 processes complex topics in milliseconds."
            />
            <CapabilityItem
              title="Contextual Retention"
              desc="AI remembers your syllabus to keep notes relevant."
            />
          </div>
        </motion.div>

        {/* Right Section: Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 lg:p-16 rounded-[3.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] relative overflow-hidden group"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700" />

          <div className="relative z-10">
            <div className="mb-10">
              <h2 className="text-4xl font-black mb-3 tracking-tight italic uppercase text-white">
                {isRedirecting ? "Mubarak Ho! 🎉" : "Elevate Your Study."}
              </h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                {isRedirecting
                  ? "Aapka verification safal raha. Taiyaar ho jao, hum Home page pe ja rahe hain..."
                  : "Join the elite circle of students using AI to dominate their exams."}
                <span className="text-indigo-400 block mt-1">
                  {!isRedirecting && "Get 50 Launch Credits Free."}
                </span>
              </p>
            </div>

            <motion.button
              onClick={handleGoogleAuth}
              disabled={isRedirecting}
              whileHover={
                !isRedirecting
                  ? { y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }
                  : {}
              }
              whileTap={!isRedirecting ? { scale: 0.98 } : {}}
              className={`w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all relative overflow-hidden group/btn ${isRedirecting
                ? "bg-indigo-600 text-white"
                : "bg-white text-black"
                }`}
            >
              {!isRedirecting && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 z-0" />
              )}

              <div className="relative z-10 flex items-center gap-4 transition-colors duration-500">
                {isRedirecting ? (
                  <span className="tracking-[0.1em] uppercase text-sm animate-pulse">
                    Redirecting in 3s...
                  </span>
                ) : (
                  <>
                    <FcGoogle className="text-2xl bg-white rounded-full p-1" />
                    <span className="group-hover/btn:text-white transition-colors duration-500 uppercase tracking-widest text-sm">
                      Continue with Google
                    </span>
                  </>
                )}
              </div>
            </motion.button>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-indigo-400 text-xl">✨</span>
                <span className="text-xs font-bold text-gray-300">
                  Unlimited Exports
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-indigo-400 text-xl">🛡️</span>
                <span className="text-xs font-bold text-gray-300">
                  Privacy First
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* --- INTEGRATED FOOTER --- */}
      <footer className="w-full relative z-10 border-t border-white/5 bg-[#030303]/50 backdrop-blur-md px-10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left text-white">
            <span className="text-xl font-black tracking-tighter">
              ExamNotes <span className="text-indigo-500 italic">AI</span>
            </span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              © {currentYear} • Built for the elite.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col items-center md:items-end cursor-default"
          >
            <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-[0.25em] mb-2 group-hover:text-indigo-400 transition-colors">
              Design & Architecture
            </p>
            <div className="relative">
              <h3 className="text-2xl font-black text-white transition-all group-hover:tracking-tight">
                Crafted by{" "}
                <span className="text-indigo-500 italic relative inline-block">
                  ~Krishna
                  <motion.div
                    className="absolute -bottom-1 left-0 h-1 bg-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>
              </h3>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

const CapabilityItem = ({ title, desc }) => (
  <div className="flex gap-4 items-start p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors cursor-default">
    <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500" />
    <div>
      <h4 className="text-sm font-black text-gray-200 uppercase tracking-wider">
        {title}
      </h4>
      <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

const SocialIcon = ({ icon, color }) => (
  <motion.a
    href="#"
    whileHover={{ y: -3 }}
    className={`w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 transition-all duration-300 ${color}`}
  >
    {icon}
  </motion.a>
);

export default Auth;
