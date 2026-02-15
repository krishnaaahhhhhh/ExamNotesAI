const fetchExamData = async (prompt, apiKey) => {
  // ✅ 2.0 Flash ke liye v1beta endpoint hi sabse best hai
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          // ✅ AI response ko strictly JSON mein rakhega
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Agar Quota error (429) aaye toh yahan se handle hoga
      throw new Error(data.error?.message || "Gemini API Error");
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("AI ne response khali bheja hai.");

    // Strategic Cleaning (Safety Layer)
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid JSON structure in AI response");
    }

    const cleanedJson = rawText.substring(jsonStart, jsonEnd + 1);
    
    return JSON.parse(cleanedJson);

  } catch (error) {
    console.error("Gemini Fetch Error:", error.message);
    throw error;
  }
};

module.exports = { fetchExamData };