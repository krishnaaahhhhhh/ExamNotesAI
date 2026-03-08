const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🚀 Groq API — Free tier: 14,400 requests/day, much better than Gemini's 200 RPD!
// Models: llama-3.3-70b-versatile (best quality), llama-3.1-8b-instant (fastest)
const GROQ_KEYS = process.env.GROQ_API_KEYS
  ? process.env.GROQ_API_KEYS.split(",").map((k) => k.trim()).filter(Boolean)
  : process.env.GROQ_API_KEY
    ? [process.env.GROQ_API_KEY]
    : [];

const MODEL = "llama-3.3-70b-versatile"; // Best free model on Groq
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

let currentKeyIndex = 0;

const getNextKey = () => {
  const key = GROQ_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
  return key;
};

const fetchExamData = async (prompt) => {
  if (GROQ_KEYS.length === 0) {
    throw new Error("No GROQ_API_KEY found in environment variables.");
  }

  let lastError = null;
  const attempted429 = new Set();

  // Round 1: try each key once
  for (let i = 0; i < GROQ_KEYS.length; i++) {
    const apiKey = getNextKey();

    try {
      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert exam notes generator. Always respond with valid JSON only. No markdown, no explanation — just raw JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        attempted429.add(apiKey);
        console.log(
          `⚠️ Groq Key ...${apiKey.slice(-6)} rate limited (${attempted429.size}/${GROQ_KEYS.length})`
        );
        lastError = new Error(data.error?.message || "Rate limited");
        continue;
      }

      if (!response.ok) {
        lastError = new Error(
          data.error?.message || `Groq API Error ${response.status}`
        );
        console.error(
          `❌ Groq Key ...${apiKey.slice(-6)}: ${lastError.message}`
        );
        continue;
      }

      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        lastError = new Error("Empty response from Groq");
        console.error(`⚠️ Groq Key ...${apiKey.slice(-6)}: Empty response`);
        continue;
      }

      // Parse JSON from response
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        lastError = new Error("Invalid JSON in Groq response");
        console.error(
          `⚠️ Groq Key ...${apiKey.slice(-6)}: ${lastError.message}`
        );
        continue;
      }

      const parsed = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
      console.log(
        `✅ Notes generated via Groq key ...${apiKey.slice(-6)} [${MODEL}]`
      );
      return parsed;
    } catch (error) {
      lastError = error;
      console.error(
        `💥 Groq Key ...${apiKey.slice(-6)} crashed:`,
        error.message
      );
    }
  }

  // Round 2: Agar saari keys 429 thi, 65 seconds wait karke retry
  if (attempted429.size >= GROQ_KEYS.length) {
    console.log(
      `⏳ All ${GROQ_KEYS.length} Groq keys rate limited. Waiting 65s...`
    );
    await sleep(65000);

    const apiKey = getNextKey();
    try {
      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert exam notes generator. Always respond with valid JSON only. No markdown, no explanation — just raw JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || `API Error ${response.status}`);

      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) throw new Error("Empty response after wait");

      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1)
        throw new Error("Invalid JSON after wait");

      const parsed = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
      console.log(`✅ Notes generated after wait via Groq key ...${apiKey.slice(-6)}`);
      return parsed;
    } catch (err) {
      lastError = err;
      console.error("❌ Final Groq retry also failed:", err.message);
    }
  }

  throw lastError || new Error("All Groq API keys failed. Please try again.");
};

module.exports = { fetchExamData };