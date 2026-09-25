import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const configuredGeminiModel = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
const configuredFallbackModels = process.env.GEMINI_FALLBACK_MODELS
  ? process.env.GEMINI_FALLBACK_MODELS.split(",")
  : ["gemini-3-flash-preview", "gemini-3.1-flash-lite"];
const GEMINI_MODELS = [...new Set(
  [configuredGeminiModel, ...configuredFallbackModels]
    .map((model) => model.trim())
    .filter(Boolean)
)];
const GEMINI_REQUEST_TIMEOUT = Number(process.env.GEMINI_REQUEST_TIMEOUT_MS) || 12000;

function getGeminiEndpoint(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
}

function isAuthenticationError(error) {
  const status = error.response?.status;
  return status === 401 || status === 403;
}

async function requestGemini(model, prompt) {
  const response = await axios.post(
    `${getGeminiEndpoint(model)}?key=${encodeURIComponent(GEMINI_API_KEY)}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    },
    { timeout: GEMINI_REQUEST_TIMEOUT }
  );

  const rawText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!rawText) {
    const error = new Error("Gemini returned an empty response");
    error.response = { status: 502 };
    throw error;
  }

  return rawText;
}

async function generateWithFallback(prompt) {
  let lastError;

  for (const model of GEMINI_MODELS) {
    try {
      return { model, rawText: await requestGemini(model, prompt) };
    } catch (error) {
      lastError = error;
      if (isAuthenticationError(error)) break;
    }
  }

  throw lastError;
}

function getUpstreamErrorStatus(error) {
  const status = Number(error.response?.status);
  if (!status || status === 408 || status === 429 || status >= 500) return 503;
  return 502;
}

function parseGeminiJson(rawText) {
  const cleaned = rawText.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const jsonText = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(jsonText);
}

// AI Symptom Checker
export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim() === "") {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({ error: "The AI service is not configured." });
    }

    // ✅ Prompt mein strict JSON format maanga
    const prompt = `
You are a medical assistant AI helping rural patients understand their symptoms.

Respond ONLY with a valid JSON object. No markdown, no explanation outside JSON.

JSON format:
{
  "possibleConditions": ["condition1", "condition2", "condition3"],
  "severity": "mild" | "moderate" | "emergency",
  "advice": ["tip1", "tip2", "tip3"],
  "whenToSeeDoctor": ["reason1", "reason2"]
}

Patient symptoms: ${symptoms}
`;

    const { rawText } = await generateWithFallback(prompt);

    let analysis;
    try {
      analysis = parseGeminiJson(rawText);
    } catch {
      return res.json({
        symptoms,
        analysis: { rawText },
        disclaimer: "The assistant returned an unstructured response. Please try again."
      });
    }

    return res.json({
      symptoms,
      analysis,          // ✅ Ab structured object milega
      disclaimer: "AI generated advice. Please consult a doctor for accurate diagnosis."
    });

  } catch (error) {
    console.error("Gemini Error:", error?.response?.data || error.message);
    return res.status(getUpstreamErrorStatus(error)).json({
      error: "The AI service is temporarily unavailable. Please try again."
    });
  }
};

// Health Tips
export const getHealthTips = (req, res) => {
  try {
    const tips = [
      "Drink enough water",
      "Wash hands regularly",
      "Eat fruits and vegetables",
      "Sleep 7-8 hours",
      "Exercise daily",
      "Avoid smoking",
      "Keep surroundings clean",
      "Do regular health checkups"
    ];

    res.json({
      tips,
      dailyTip: tips[new Date().getDay() % tips.length]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Voice Conversational Chat
export const voiceChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({ error: "The AI service is not configured." });
    }

    const prompt = `
You are a friendly, empathetic medical AI assistant helping a patient.
The user is talking to you via a voice interface.
Keep your response conversational, concise (2-3 short sentences max), and easy to listen to.
IMPORTANT: Reply in the exact same language as the user's message.

User says: "${message}"
`;

    const { rawText: reply } = await generateWithFallback(prompt);

    return res.json({ reply });

  } catch (error) {
    console.error("Gemini Voice Chat Error:", error?.response?.data || error.message);
    return res.status(getUpstreamErrorStatus(error)).json({
      error: "The AI service is temporarily unavailable. Please try again."
    });
  }
};
