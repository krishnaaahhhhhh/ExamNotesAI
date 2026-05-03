const { YoutubeTranscript } = require('youtube-transcript');
const pdf = require('pdf-parse');
const axios = require('axios');
const userModel = require("../models/user.model.js");
const notesModel = require("../models/notes.model.js");
const { buildVideoPrompt } = require("../utils/promptBuilder.js");
const { fetchExamData } = require("../services/gemini.services.js");

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
