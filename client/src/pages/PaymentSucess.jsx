import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentSucess = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] text-center backdrop-blur-3xl relative overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
          >
            <span className="text-4xl text-green-500">✔</span>
          </motion.div>

          <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">
            Payment <span className="text-green-500 italic">Success</span>
          </h2>
          <p className="text-gray-400 mb-8 font-medium leading-relaxed">
            Bhai, aapke credits account mein add ho chuke hain. Ab aap bina ruke
            God-Level notes conjure kar sakte ho. 🚀
          </p>

          <div className="space-y-4 relative z-10">
            <Link to="/notes">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-white/5"
              >
                Start Generating
              </motion.button>
            </Link>
            <Link to="/my-notes">
              <p className="text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] mt-6 cursor-pointer">
                Explore Your Vault
              </p>
            </Link>
          </div>

          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSucess; // ✅ Ye line honi hi chahiye
