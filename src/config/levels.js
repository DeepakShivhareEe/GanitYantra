// ============================================================
// GANITYANTRA — LEVELS CONFIG
// File: src/config/levels.js
//
// PURPOSE:
// Yeh file poore app ka "brain" hai levels ke liye.
// Jab bhi naya level add karna ho (jaise "Diploma" ya
// "Class 1-5"), sirf yahan aao — baaki kuch nahi badlega.
//
// CONTAINS:
// 1. LEVELS        — har level ki ID, label, color, desc
// 2. EXAMPLE_PROBLEMS — har level ke example questions
// 3. LEVEL_COLORS  — quick color lookup by level ID
// ============================================================

// ── 1. LEVELS ARRAY ────────────────────────────────────────
// Yeh array LevelSelector component mein use hota hai
// buttons render karne ke liye.
// Har object mein:
//   id    — unique identifier (string) — detection mein use hota hai
//   label — button pe jo dikhta hai
//   color — hex color — border, background, glow sab isi se
//   desc  — header badge mein dikhta hai

export const LEVELS = [
  {
    id:    "class68",
    label: "Class 6-8",
    color: "#10b981",   // green — beginner friendly
    desc:  "Foundation",
  },
  {
    id:    "class910",
    label: "Class 9-10",
    color: "#3b82f6",   // blue — secondary level
    desc:  "Secondary",
  },
  {
    id:    "class1112",
    label: "Class 11-12",
    color: "#8b5cf6",   // purple — JEE/NEET level
    desc:  "JEE/NEET",
  },
  {
    id:    "ug",
    label: "UG / B.Tech",
    color: "#f59e0b",   // amber — university level
    desc:  "Engineering",
  },
  {
    id:    "pg",
    label: "PG / PhD",
    color: "#ef4444",   // red — advanced research
    desc:  "Research",
  },
];

// ── 2. EXAMPLE PROBLEMS ────────────────────────────────────
// Yeh object InputArea component mein example chips
// render karne ke liye use hota hai.
// Key = level ID, Value = array of example problem strings
// Jab user level change kare, examples automatically
// us level ke according change ho jaate hain.

export const EXAMPLE_PROBLEMS = {
  class68: [
    "LCM of 12 and 18",
    "HCF of 48 and 36",
    "4 + 3 * 2 - 1",
    "prime factors of 360",
    "3/4 + 1/2",
    "15% of 240",
  ],
  class910: [
    "x^2 - 5x + 6 = 0",
    "2x^2 + 7x + 3 = 0",
    "x^2 - 4x + 4 = 0",
    "3x^2 - 2x - 1 = 0",
  ],
  class1112: [
    "x^2 + x + 1 = 0",
    "x^4 - 5x^2 + 4 = 0",
    "x^2 - 6x + 9 = 0",
    "3(x-2)^2 - 12 = 0",
  ],
  ug: [
    "2(x-3)(x+1) = 0",
    "x^4 - 5x^2 + 4 = 0",
    "5x^2 - 3x - 2 = 0",
  ],
  pg: [
    "x^2 + 2x + 5 = 0",
    "6x^2 + x - 2 = 0",
  ],
};

// ── 3. LEVEL COLORS LOOKUP ─────────────────────────────────
// Quick lookup object — jab sirf color chahiye level ID se
// Usage: LEVEL_COLORS["class68"] → "#10b981"
// Useful in backend/main.py ke prompts ya charts mein

export const LEVEL_COLORS = Object.fromEntries(
  LEVELS.map(l => [l.id, l.color])
);

// ── 4. DEFAULT LEVEL ───────────────────────────────────────
// App start hone par kaunsa level selected ho
export const DEFAULT_LEVEL = "class68";
