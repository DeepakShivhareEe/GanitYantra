// ============================================================
// GANITYANTRA — AI SERVICE
// File: src/services/aiService.js
//
// PURPOSE:
// Sab AI-related code ek jagah. Backend se baat karna,
// error handle karna, retry logic — sab yahan.
//
// WHY SEPARATE FROM APP.JSX:
// Agar backend URL change ho (localhost → Railway deployed),
// sirf yeh ek file change karni hai — App.jsx nahi.
// Agar Groq se Claude pe switch karna ho — sirf yahan.
// Agar retry logic add karna ho — sirf yahan.
//
// ARCHITECTURE:
// App.jsx → aiService.js → FastAPI Backend (port 8000)
//                        → Groq API (llama-3.3-70b)
//                        → Returns Hinglish explanation
//
// USED IN:
// App.jsx → handleSolve() ke end mein
// ============================================================

// ── Backend URL ────────────────────────────────────────────
// Development mein localhost, production mein Railway URL
// Jab deploy karo: VITE_BACKEND_URL env variable set karo
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

// ── Error Messages ─────────────────────────────────────────
const ERROR_MESSAGES = {
  network:  "Backend server se connect nahi ho paya. Terminal mein uvicorn chal raha hai?",
  timeout:  "AI response time out ho gaya. Dobara try karo.",
  server:   "Backend mein kuch error aaya. Terminal mein error check karo.",
  default:  "AI explanation load nahi ho saki. Network check karo.",
};

/**
 * getAIExplanation(problem, steps, level, topic)
 *
 * Backend ke /explain endpoint ko call karta hai.
 * Groq API se Hinglish explanation generate karta hai.
 *
 * @param {string}   problem — user ka original problem
 * @param {Array}    steps   — engine ke computed steps [{latex, explanation}]
 * @param {string}   level   — "class68" | "class910" | "class1112" | "ug" | "pg"
 * @param {string}   topic   — "quadratic" | "lcm_hcf" | "arithmetic" etc.
 * @returns {Promise<string>} — Hinglish explanation text
 *
 * Example response:
 * "Yeh quadratic equation hai jisme hum discriminant D = b² - 4ac
 *  calculate karte hain. D = 1 > 0 hai, isliye do alag real roots
 *  hain. Bahut log yahan galti karte hain — negative sign bhool jaate hain..."
 */
export async function getAIExplanation(problem, steps, level, topic) {
  try {
    const response = await fetch(`${BACKEND_URL}/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem, steps, level, topic }),
    });

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status >= 500) return ERROR_MESSAGES.server;
      if (response.status === 404) return "Endpoint nahi mila. Backend code check karo.";
      return ERROR_MESSAGES.default;
    }

    const data = await response.json();
    return data.explanation || ERROR_MESSAGES.default;

  } catch (err) {
    // Network error — backend not running
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      return ERROR_MESSAGES.network;
    }
    // Timeout
    if (err.name === "AbortError") {
      return ERROR_MESSAGES.timeout;
    }
    return ERROR_MESSAGES.default;
  }
}

/**
 * checkBackendHealth()
 *
 * Backend online hai ya nahi — check karo.
 * App startup pe call kar sakte ho.
 *
 * @returns {Promise<boolean>} — true if backend is running
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
