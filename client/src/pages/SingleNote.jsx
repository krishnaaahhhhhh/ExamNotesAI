import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaLightbulb,
  FaBookOpen,
  FaLayerGroup,
  FaGraduationCap,
  FaClockRotateLeft,
} from "react-icons/fa6";

const SingleNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5008/api/notes/${id}`, {
          withCredentials: true,
        });

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
      return (
        <div className="space-y-12">
          {/* 1. Main Notes Section */}
          <section>
            <div className="flex items-center gap-3 text-indigo-400 mb-6 uppercase tracking-widest font-black text-sm">
              <FaBookOpen /> Comprehensive Notes
            </div>
            <div className="text-gray-300 leading-loose text-lg border-l-2 border-white/5 pl-6">
              {typeof content.notes === "string"
                ? content.notes
                : JSON.stringify(content.notes)}
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
            <section>
              <div className="flex items-center gap-3 text-emerald-400 mb-6 uppercase tracking-widest font-black text-sm">
                <FaGraduationCap /> Active Recall Flashcards
              </div>
              <div className="space-y-4">
                {Array.isArray(content.flashcards) ? (
                  content.flashcards.map((card, i) => (
                    <div
                      key={i}
                      className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all group"
                    >
                      <p className="text-emerald-400 font-black text-[10px] uppercase mb-2">
                        Question
                      </p>
                      <p className="text-white font-bold mb-4">
                        {typeof card.question === "object"
                          ? JSON.stringify(card.question)
                          : card.question || "N/A"}
                      </p>
                      <div className="h-px bg-white/5 w-full mb-4" />
                      <p className="text-emerald-400/50 font-black text-[10px] uppercase mb-2">
                        Solution
                      </p>
                      <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                        {typeof card.answer === "object"
                          ? JSON.stringify(card.answer)
                          : card.answer || "N/A"}
                      </p>
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
