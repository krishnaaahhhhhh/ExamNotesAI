// routes/user.router.js
const express = require("express");
const notesrouter = express.Router();
const isAuth = require("../middleware/isAuth.js");
const { generateNotes, getSingleNote } = require("../controllers/generate.controller.js");
const { generateVideoNotes, generatePDFNotes } = require("../controllers/power.controller.js");
const { getUserNotes } = require("../controllers/notes.controller.js");
const { downloadPDF } = require("../controllers/pdf.controller");

// Multer setup
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

notesrouter.post("/generate", isAuth, generateNotes);
notesrouter.post("/video/generate", isAuth, generateVideoNotes);
notesrouter.post("/pdf/generate", isAuth, upload.single("pdf"), generatePDFNotes);
notesrouter.post("/download-pdf", downloadPDF); // Ye naya route add kardo 🔥
notesrouter.get("/my-notes",isAuth, getUserNotes);
notesrouter.get("/:id", isAuth, getSingleNote);

module.exports = notesrouter;