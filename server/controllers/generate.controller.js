// ... baaki imports same ...
const mongoose = require("mongoose");
// Check karo ki ye path ekdum sahi ho aapke folder structure ke hisaab se
const userModel = require("../models/user.model.js");
const notesModel = require("../models/notes.model.js");
const { buildPrompt } = require("../utils/promptBuilder.js");
const { fetchExamData } = require("../services/gemini.services.js");

// Baki ka code...
exports.getSingleNote = async (req, res) => {
  try {
    const note = await notesModel.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Single Note Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.generateNotes = async (req, res) => {
  try {
    const { topic, classLevel, examType, revisionMode, includeDiagram, field } = req.body;

    // 1️⃣ Validation (Same)
    if (!topic || !classLevel || !examType) {
      return res.status(400).json({ success: false, message: "Required fields missing!" });
    }

    // 2️⃣ User Check (Same)
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found!" });

    if (user.credits < 10) {
      return res.status(403).json({ success: false, message: "Insufficient credits!" });
    }

    // 3️⃣ Prompt Build (Same)
    const prompt = buildPrompt({ topic, classLevel, examType, revisionMode, includeDiagram, field });

    // 4️⃣ Gemini AI Call (Same)
    let airesponse = await fetchExamData(prompt);

    // Guard: ensure we got a valid object back
    if (!airesponse || typeof airesponse !== "object") {
      return res.status(500).json({ success: false, message: "AI returned an invalid response. Please try again." });
    }

    // 5️⃣ Save Notes (UPDATED TO MATCH FRONTEND EXPECTATIONS) 🔥
    const notes = await notesModel.create({
      user: req.userId,
      topic,
      classLevel,
      examType,
      includeDiagrams: includeDiagram,
      content: airesponse, // Pura AI JSON yahan hai
      // Metadata fields add kar rahe hain taaki MyNotes card khali na dikhe
      metadata: {
        topic: airesponse.metadata?.topic || topic,
        difficulty: airesponse.metadata?.difficulty || "Expert",
        examStrategy: airesponse.metadata?.examStrategy || examType
      }
    });

    // 6️⃣ Deduct Credits (Same)
    user.credits -= 10;
    if (!user.notes) user.notes = [];
    user.notes.push(notes._id);
    await user.save();

    // 7️⃣ Success Response (Same)
    return res.status(200).json({
      success: true,
      message: "Notes generated successfully",
      notesId: notes._id,
      notesContent: airesponse,
    });

  } catch (error) {
    console.error("Final Catch Backend Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
  }
};