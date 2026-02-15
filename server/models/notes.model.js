const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: { type: String, required: true },
  classLevel: { type: String, required: true },
  examType: { type: String, required: true },
  includeDiagrams: { type: Boolean, default: false },
  // 🔥 Metadata add kiya taaki card pe data dikhe
  metadata: {
    topic: String,
    difficulty: String,
    examStrategy: String
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.Notes || mongoose.model("Notes", notesSchema);