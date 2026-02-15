import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] text-center backdrop-blur-3xl relative overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
          >
            <span className="text-4xl text-red-500">✖</span>
          </motion.div>

          <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">
            Payment <span className="text-red-500 italic">Cancelled</span>
          </h2>
          <p className="text-gray-400 mb-8 font-medium leading-relaxed">
            Koi baat nahi bhai, kabhi-kabhi technical issue ho jata hai. Aap ek
            baar dobara koshish kar sakte hain.
          </p>

          <div className="space-y-4">
            <Link to="/credits">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-red-500/20"
              >
                Try Again
              </motion.button>
            </Link>
            <Link to="/">
              <p className="text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] mt-6 cursor-pointer">
                Back to Home
              </p>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailed; // ✅ Ye line honi hi chahiye
