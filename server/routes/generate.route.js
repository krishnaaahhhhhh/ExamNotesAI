// routes/user.router.js
const express = require("express");
const notesrouter = express.Router();
const isAuth = require("../middleware/isAuth.js");
const { generateNotes } = require("../controllers/generate.controller.js");
const { getUserNotes } = require("../controllers/notes.controller.js"); // Ye naya controller import karo
const { downloadPDF } = require("../controllers/pdf.controller"); // Isse import karo
const { getSingleNote } = require("../controllers/generate.controller");
// Line 6: Ensure karein ki dono functions hain
notesrouter.post("/generate", isAuth,generateNotes);
notesrouter.post("/download-pdf", downloadPDF); // Ye naya route add kardo 🔥
notesrouter.get("/my-notes",isAuth, getUserNotes);
notesrouter.get("/:id", isAuth, getSingleNote);

module.exports = notesrouter;