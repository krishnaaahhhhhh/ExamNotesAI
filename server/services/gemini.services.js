const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🚀 Groq API — Free tier: 14,400 requests/day, much better than Gemini's 200 RPD!
// Models: llama-3.3-70b-versatile (best quality), llama-3.1-8b-instant (fastest)
const GROQ_KEYS = process.env.GROQ_API_KEYS
  ? process.env.GROQ_API_KEYS.split(",").map((k) => k.trim()).filter(Boolean)
  : process.env.GROQ_API_KEY
    ? [process.env.GROQ_API_KEY]
    : [];

// Separate keys for Video/PDF to bypass TPM limits
const GROQ_KEYS_POWER = process.env.GROQ_API_KEYS_POWER
  ? process.env.GROQ_API_KEYS_POWER.split(",").map((k) => k.trim()).filter(Boolean)
  : GROQ_KEYS;

const MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

let currentKeyIndex = 0;
let currentPowerKeyIndex = 0;

const getNextKey = (isPower = false) => {
  if (isPower) {
    const key = GROQ_KEYS_POWER[currentPowerKeyIndex];
    currentPowerKeyIndex = (currentPowerKeyIndex + 1) % GROQ_KEYS_POWER.length;
    return key;
  }
  const key = GROQ_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
  return key;
};

const fetchExamData = async (prompt, isPower = false) => {
  const keysToUse = isPower ? GROQ_KEYS_POWER : GROQ_KEYS;
  const maxTokens = isPower ? 5500 : 4000;
  const content = prompt.length > 8000 ? prompt.slice(0, 8000) : prompt;

  if (keysToUse.length === 0) {
    throw new Error("No API keys found for this operation.");
  }

  let lastError = null;
  const attempted429 = new Set();

  // Round 1: try each key once
  for (let i = 0; i < keysToUse.length; i++) {
    const apiKey = getNextKey(isPower);

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
                "You are an expert exam notes generator. Always respond with valid JSON only. Be detailed but concise enough to fit in a single response. No markdown, no explanation — just raw JSON.",
            },
            {
              role: "user",
              content: content,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: maxTokens,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        attempted429.add(apiKey);
        console.log(
          `⚠️ Groq Key ...${apiKey.slice(-6)} rate limited (${attempted429.size}/${keysToUse.length})`
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
  if (attempted429.size >= keysToUse.length) {
    console.log(
      `⏳ All ${keysToUse.length} Groq keys rate limited. Waiting 65s...`
    );
    await sleep(65000);

    const apiKey = getNextKey(isPower);
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
                "You are an expert exam notes generator. Always respond with valid JSON only. Be detailed but concise enough to fit in a single response. No markdown, no explanation — just raw JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: maxTokens,
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

const fetchMascotReply = async (message) => {
  const apiKey = getNextKey(true);
  if (!apiKey) {
    throw new Error("No API keys found for mascot chat.");
  }

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
              "You are 'Synapse', the cute, futuristic, friendly female AI study mascot for ExamNotesAI. You speak in a mix of English and Hinglish (friendly, relatable Indian college slang, e.g. 'Bhai', 'yaar', 'tension mat le'). Keep your answer highly concise (2 to 3 sentences maximum, 50-60 words). Explain concepts, give motivation, or talk generally. Respond in plain text, do NOT use markdown symbols, bold tags (**), or bullet lists.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Groq Mascot Chat Error");
    }

    return data.choices?.[0]?.message?.content || "Bhai, dimag hang ho gaya mera. Dobara puchna yaar!";
  } catch (error) {
    console.error("Mascot chat API failed:", error);
    return "Bhai, thoda connection issue lag raha hai. Apne networks check karo ya dobara try karo!";
  }
};

module.exports = { fetchExamData, fetchMascotReply };