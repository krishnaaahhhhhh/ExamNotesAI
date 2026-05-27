const { YoutubeTranscript } = require('youtube-transcript');
const pdf = require('pdf-parse');
const axios = require('axios');
const userModel = require("../models/user.model.js");
const notesModel = require("../models/notes.model.js");
const { buildVideoPrompt, buildPracticalPrompt, buildDeepDivePrompt } = require("../utils/promptBuilder.js");
const { fetchExamData, fetchMascotReply } = require("../services/gemini.services.js");


// Helper to extract Video ID from various YouTube URL formats
const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

exports.generateVideoNotes = async (req, res) => {
    try {
        const { videoUrl, classLevel, examType } = req.body;

        if (!videoUrl || !classLevel || !examType) {
            return res.status(400).json({ success: false, message: "Missing fields!" });
        }

        const videoId = getVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({ success: false, message: "Invalid YouTube URL! Please provide a standard link." });
        }

        const user = await userModel.findById(req.userId);
        if (user.credits < 15) {
            return res.status(403).json({ success: false, message: "Insufficient credits! 15 credits required for Video Analysis." });
        }

        // 1. Fetch Transcript with Metadata Fallback
        console.log("Fetching transcript for ID:", videoId);
        let transcriptText = "";
        let videoTitle = "";

        try {
            // Try getting title first as fallback info
            const metaRes = await axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
            videoTitle = metaRes.data.title || "Unknown Topic";

            const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
            transcriptText = transcriptData.map(t => t.text).join(' ').substring(0, 8000);
        } catch (transcriptError) {
            console.warn("Transcript failed, falling back to Metadata:", transcriptError);
            // Fallback: If no transcript, we use the title to generate expert notes
            transcriptText = `[METADATA FALLBACK] Video Title: ${videoTitle}. The user wants exam engineering notes specifically based on the concepts covered in a video with this title. Since captions are unavailable, use your core knowledge to engineer the most accurate notes for this topic.`;
        }

        // 2. Build Prompt
        const prompt = buildVideoPrompt({ transcript: transcriptText, classLevel, examType });

        // 3. AI Call (Using separate Power keys for high volume)
        const aiResponse = await fetchExamData(prompt, true);

        // 4. Save
        const notes = await notesModel.create({
            user: req.userId,
            topic: `Video Analysis: ${aiResponse.metadata?.topic || "YouTube Module"}`,
            classLevel,
            examType,
            content: aiResponse,
            metadata: {
                topic: aiResponse.metadata?.topic || "YouTube Module",
                difficulty: aiResponse.metadata?.difficulty || "Expert",
                examStrategy: "Video-to-Note Strategy"
            }
        });

        user.credits -= 15;
        user.notes.push(notes._id);
        await user.save();

        res.status(200).json({
            success: true,
            notesId: notes._id,
            notesContent: aiResponse
        });

    } catch (error) {
        console.error("Video Notes Error:", error);
        res.status(500).json({ success: false, message: error.message || "Could not process video. Ensure it has captions/subtitles." });
    }
};

exports.generatePDFNotes = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No PDF uploaded!" });
        const { classLevel, examType } = req.body;

        const user = await userModel.findById(req.userId);
        if (user.credits < 20) {
            return res.status(403).json({ success: false, message: "Insufficient credits! 20 credits required for PDF Engineering." });
        }

        // 1. Extract Text
        const data = await pdf(req.file.buffer);
        const pdfText = data.text.substring(0, 8000);

        // 2. Build Prompt (Reusing Video Prompt structure for now as it's similar)
        const prompt = buildVideoPrompt({ transcript: pdfText, classLevel, examType });

        // 3. AI Call (Using separate Power keys for high volume)
        const aiResponse = await fetchExamData(prompt, true);

        // 4. Save
        const notes = await notesModel.create({
            user: req.userId,
            topic: `PDF Analysis: ${aiResponse.metadata?.topic || "Document Module"}`,
            classLevel,
            examType,
            content: aiResponse,
            metadata: {
                topic: aiResponse.metadata?.topic || "Document Module",
                difficulty: aiResponse.metadata?.difficulty || "Advanced",
                examStrategy: "PDF Analysis Logic"
            }
        });

        user.credits -= 20;
        user.notes.push(notes._id);
        await user.save();

        res.status(200).json({
            success: true,
            notesId: notes._id,
            notesContent: aiResponse
        });

    } catch (error) {
        console.error("PDF Notes Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to parse PDF." });
    }
};

exports.generatePracticalNotes = async (req, res) => {
    try {
        const { experimentName, practicalType, university, subject, classLevel } = req.body;

        // Validation
        if (!experimentName || !practicalType || !classLevel) {
            return res.status(400).json({
                success: false,
                message: "Experiment name, practical type, aur class level required hai!"
            });
        }
        if (!["lab", "computer", "both"].includes(practicalType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid practical type! Must be: lab, computer, or both."
            });
        }

        // Credit check — 25 credits for practical
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found!" });
        if (user.credits < 25) {
            return res.status(403).json({
                success: false,
                message: "Insufficient credits! Practical generation requires 25 credits."
            });
        }

        // Build & call AI
        const prompt = buildPracticalPrompt({ experimentName, practicalType, university, subject, classLevel });
        const aiResponse = await fetchExamData(prompt, true); // using power key

        if (!aiResponse || typeof aiResponse !== "object") {
            return res.status(500).json({ success: false, message: "AI returned invalid response. Please retry." });
        }

        // Save to DB
        const notes = await notesModel.create({
            user: req.userId,
            topic: `Practical: ${experimentName}`,
            classLevel,
            examType: university || "Practical Exam",
            content: aiResponse,
            metadata: {
                topic: experimentName,
                difficulty: "Practical",
                examStrategy: `${university || "University"} Lab Manual Format`
            }
        });

        // Deduct credits
        user.credits -= 25;
        if (!user.notes) user.notes = [];
        user.notes.push(notes._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Practical notes generated successfully!",
            notesId: notes._id,
            notesContent: aiResponse,
        });

    } catch (error) {
        console.error("Practical Notes Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Practical generation failed. Please try again."
        });
    }
};

exports.generateDeepDive = async (req, res) => {
    try {
        const { topic, classLevel } = req.body;

        if (!topic) {
            return res.status(400).json({ success: false, message: "Topic toh batao bhai!" });
        }

        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found!" });
        if (user.credits < 20) {
            return res.status(403).json({ success: false, message: "Insufficient credits! Deep Dive requires 20 credits." });
        }

        const prompt = buildDeepDivePrompt({ topic, classLevel });
        const aiResponse = await fetchExamData(prompt, true);

        if (!aiResponse || typeof aiResponse !== "object") {
            return res.status(500).json({ success: false, message: "AI returned invalid response. Please retry." });
        }

        const notes = await notesModel.create({
            user: req.userId,
            topic: `Deep Dive: ${topic}`,
            classLevel: classLevel || "University",
            examType: "Deep Dive Journey",
            content: aiResponse,
            metadata: { topic, difficulty: "Mastery", examStrategy: "0 to Hero Journey" }
        });

        user.credits -= 20;
        if (!user.notes) user.notes = [];
        user.notes.push(notes._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Deep Dive journey generated!",
            notesId: notes._id,
            notesContent: aiResponse,
        });

    } catch (error) {
        console.error("Deep Dive Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Deep Dive generation failed." });
    }
};

exports.mascotChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, reply: "Bhai, query toh likho tabhi toh help kar paungi!" });
        }

        const reply = await fetchMascotReply(message);
        return res.status(200).json({ success: true, reply });
    } catch (error) {
        console.error("Mascot Chat Controller Error:", error);
        return res.status(500).json({ success: false, reply: "Mera server thoda off-line chala gaya, ek baar aur koshish karna?" });
    }
};
