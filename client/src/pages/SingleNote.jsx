import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SingleNote = () => {
  const { id } = useParams(); // ✅ URL se ID milegi
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
        Loading Note...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Note not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-6">{note.topic}</h1>

        <p className="text-gray-400 mb-6">
          Created on: {new Date(note.createdAt).toLocaleDateString()}
        </p>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 whitespace-pre-line leading-relaxed">
          {note.content}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleNote;
