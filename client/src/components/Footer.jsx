import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-gray-100 bg-white px-6 py-16 overflow-hidden">
      {/* Cinematic Top Border Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Left Side: Brand Identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              ExamNotes <span className="text-indigo-600 italic">AI</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
            Empowering students with Gemini-powered AI to transform complex
            study materials into structured notes instantly.
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
              © {currentYear} ExamNotes AI Inc.
            </p>
          </div>
        </motion.div>

        {/* Center: Navigation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-start md:items-center"
        >
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-2">
              Quick Access
            </h4>
            <ul className="flex flex-col gap-4">
              <FooterLink to="/notes" label="Generate Notes" />
              <FooterLink to="/my-notes" label="Study History" />
              <FooterLink to="/credits" label="Add Credits" />
            </ul>
          </div>
        </motion.div>

        {/* Right Side: Stylish Signature with Your Links */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-start md:items-end justify-between h-full"
        >
          <div className="group relative cursor-default text-left md:text-right">
            <p className="text-[13px] font-extrabold text-gray-500 uppercase tracking-[0.25em] mb-3 group-hover:text-indigo-600 transition-colors duration-500">
              Design & Architecture
            </p>

            <div className="relative">
              <h3 className="text-4xl font-black text-gray-900 transition-all duration-500 group-hover:tracking-tight">
                Crafted by{" "}
                <span className="relative inline-block text-indigo-600 group-hover:text-indigo-500 transition-colors italic">
                  ~Krishna
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <motion.span
                    className="absolute -top-5 -right-6 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ rotate: [0, 90, 0], scale: [0.8, 1.5, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ✦
                  </motion.span>
                </span>
              </h3>
            </div>
          </div>

          {/* Social Icons with Your Real Links */}
          <div className="flex gap-4 mt-10">
            <SocialIcon
              icon={<FaInstagram size={18} />}
              color="hover:text-pink-600 hover:bg-pink-50"
              url="https://www.instagram.com/______krishnaaa______?igsh=YzI2c2czNmExbnVw"
            />
            <SocialIcon
              icon={<FaXTwitter size={18} />}
              color="hover:text-black hover:bg-gray-100"
              url="https://x.com/alex__creates"
            />
            <SocialIcon
              icon={<FaLinkedinIn size={18} />}
              color="hover:text-blue-700 hover:bg-blue-50"
              url="https://www.linkedin.com/in/krishna-rathore-984825363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            />
            <SocialIcon
              icon={<FaGithub size={18} />}
              color="hover:text-gray-900 hover:bg-gray-100"
              url="https://github.com/krishnaaahhhhhh"
            />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Sub-components
const SocialIcon = ({ icon, color, url }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noreferrer"
    whileHover={{ y: -5, scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-300 shadow-sm ${color}`}
  >
    {icon}
  </motion.a>
);

const FooterLink = ({ to, label }) => (
  <motion.li className="list-none group">
    <Link
      to={to}
      className="text-gray-500 hover:text-indigo-600 text-sm font-bold transition-all duration-300 flex items-center gap-3"
    >
      <motion.span className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-4 group-hover:bg-indigo-600 transition-all" />
      {label}
    </Link>
  </motion.li>
);

export default Footer;
