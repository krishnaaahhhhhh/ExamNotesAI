const mongoose = require("mongoose");
const notesModel = require("../models/notes.model");

exports.getUserNotes = async (req, res) => {
  try {
    console.log("👉 req.userId:", req.userId);

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated!",
      });
    }
;


    // 🔥 ObjectId ensure kar dete hain (type mismatch avoid)
    const notes = await notesModel
      .find({ user: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 });

    console.log("👉 Notes Found:", notes.length);

    return res.status(200).json({
      success: true,
      notes,
    });

  } catch (error) {
    console.error("Vault Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Vault se notes fetch nahi ho paye!",
    });
  }
};
