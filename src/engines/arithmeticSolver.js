// ============================================================
// GANITYANTRA — ARITHMETIC SOLVER ENGINE
// Covers: LCM, HCF, BODMAS, Fractions, Percentages,
//         Ratio & Proportion, Exponents, Prime Factorization
// Class 6-8 level — step by step
// ============================================================

// ── Utilities ──────────────────────────────────────────────

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function primeFactors(n) {
  const factors = {};
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors[d] = (factors[d] || 0) + 1;
      n = Math.floor(n / d);
    }
    d++;
  }
  if (n > 1) factors[n] = (factors[n] || 0) + 1;
  return factors;
}

function formatFactors(factors) {
  return Object.entries(factors)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => (v > 1 ? `${k}^{${v}}` : `${k}`))
    .join(" \\times ");
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// ── 1. LCM & HCF ───────────────────────────────────────────

export function solveLCMHCF(input) {
  const nums = input.match(/\d+/g)?.map(Number);
  if (!nums || nums.length < 2) return null;

  const isLCM = /lcm/i.test(input);
  const isHCF = /hcf|gcd/i.test(input);

  // Support more than 2 numbers
  const allFactors = nums.map(n => ({ n, factors: primeFactors(n) }));
  const allKeys = [...new Set(allFactors.flatMap(({ factors }) => Object.keys(factors)))].map(Number).sort((a, b) => a - b);

  const hcfFactors = {}, lcmFactors = {};
  allKeys.forEach(k => {
    const powers = allFactors.map(({ factors }) => factors[k] || 0);
    hcfFactors[k] = Math.min(...powers);
    lcmFactors[k] = Math.max(...powers);
  });

  const hcfResult = allFactors.reduce((acc, { n }) => gcd(acc, n), nums[0]);
  const lcmResult = nums.reduce((acc, n) => lcm(acc, n));

  const steps = [];

  // Step 1 — Prime factorization of each number
  allFactors.forEach(({ n, factors }) => {
    steps.push({
      latex: `${n} = ${formatFactors(factors)}`,
      explanation: `${n} ke prime factors nikale — prime factorization method`,
    });
  });

  // Step 2 — HCF
  steps.push({
    latex: `\\text{HCF} = ${formatFactors(hcfFactors)} = ${hcfResult}`,
    explanation: "HCF ke liye — sabhi common prime factors ka MINIMUM power lo",
  });

  // Step 3 — LCM
  steps.push({
    latex: `\\text{LCM} = ${formatFactors(lcmFactors)} = ${lcmResult}`,
    explanation: "LCM ke liye — sabhi prime factors ka MAXIMUM power lo",
  });

  // Step 4 — Verification
  steps.push({
    latex: `\\text{Verification: HCF} \\times \\text{LCM} = ${hcfResult} \\times ${lcmResult} = ${hcfResult * lcmResult}`,
    explanation: `Check: HCF × LCM = ${nums[0]} × ${nums[1]} = ${nums[0] * nums[1]} ✓`,
  });

  const answer = isLCM ? lcmResult : isHCF ? hcfResult : `HCF = ${hcfResult}, LCM = ${lcmResult}`;
  const answerLatex = isLCM
    ? `\\text{LCM} = ${lcmResult}`
    : isHCF
    ? `\\text{HCF} = ${hcfResult}`
    : `\\text{HCF} = ${hcfResult},\\ \\text{LCM} = ${lcmResult}`;

  return { steps, answer, answerLatex };
}

// ── 2. BODMAS / Arithmetic ──────────────────────────────────

export function solveArithmetic(input) {
  try {
    const cleaned = input
      .replace(/[^0-9+\-*/().\s^%]/g, "")
      .replace(/\^/g, "**")
      .trim();

    if (!cleaned) return null;

    // Break down into BODMAS stages
    const steps = [];
    let expr = input.trim();

    steps.push({
      latex: expr.replace(/\*/g, "\\times").replace(/\//g, "\\div"),
      explanation: "Original expression — BODMAS order mein solve karenge: Brackets → Orders → Division → Multiplication → Addition → Subtraction",
    });

    // Show bracket resolution if present
    const bracketMatch = expr.match(/\(([^()]+)\)/);
    if (bracketMatch) {
      const innerResult = Function('"use strict"; return (' + bracketMatch[1].replace(/\^/g, "**") + ")")();
      const resolved = expr.replace(bracketMatch[0], innerResult);
      steps.push({
        latex: resolved.replace(/\*/g, "\\times").replace(/\//g, "\\div"),
        explanation: `Bracket pehle solve kiya: (${bracketMatch[1]}) = ${innerResult}`,
      });
      expr = resolved;
    }

    // Show exponent resolution if present
    const expMatch = expr.match(/(\d+)\^(\d+)/);
    if (expMatch) {
      const expResult = Math.pow(Number(expMatch[1]), Number(expMatch[2]));
      const resolved = expr.replace(expMatch[0], expResult);
      steps.push({
        latex: resolved.replace(/\*/g, "\\times").replace(/\//g, "\\div"),
        explanation: `Exponent solve kiya: ${expMatch[1]}^${expMatch[2]} = ${expResult}`,
      });
      expr = resolved;
    }

    // Final result
    const result = Function('"use strict"; return (' + cleaned + ")")();
    const rounded = Math.round(result * 10000) / 10000;

    steps.push({
      latex: `= ${rounded}`,
      explanation: "Baki operations left to right solve kiye — Final answer",
    });

    return {
      steps,
      answer: rounded,
      answerLatex: `= ${rounded}`,
    };
  } catch {
    return null;
  }
}

// ── 3. FRACTION Operations ─────────────────────────────────

export function solveFraction(input) {
  // Detect operation: +, -, *, /
  const fracMatch = input.match(/(\d+)\/(\d+)\s*([\+\-\*\/])\s*(\d+)\/(\d+)/);
  if (!fracMatch) {
    // Single fraction simplification
    const singleMatch = input.match(/(\d+)\/(\d+)/);
    if (!singleMatch) return null;
    const num = parseInt(singleMatch[1]);
    const den = parseInt(singleMatch[2]);
    const g = gcd(num, den);
    const steps = [
      { latex: `\\frac{${num}}{${den}}`, explanation: "Fraction identify kiya" },
      { latex: `\\text{GCD}(${num}, ${den}) = ${g}`, explanation: "GCD nikala simplify karne ke liye" },
      { latex: `\\frac{${num}}{${den}} = \\frac{${num / g}}{${den / g}}`, explanation: `Numerator aur denominator dono ko ${g} se divide kiya` },
    ];
    return {
      steps,
      answer: `${num / g}/${den / g}`,
      answerLatex: `\\frac{${num / g}}{${den / g}}`,
    };
  }

  const n1 = parseInt(fracMatch[1]), d1 = parseInt(fracMatch[2]);
  const op = fracMatch[3];
  const n2 = parseInt(fracMatch[4]), d2 = parseInt(fracMatch[5]);

  const steps = [
    {
      latex: `\\frac{${n1}}{${d1}} ${op === "*" ? "\\times" : op === "/" ? "\\div" : op} \\frac{${n2}}{${d2}}`,
      explanation: "Fraction operation identify kiya",
    },
  ];

  let rn, rd;

  if (op === "+") {
    const lcmD = lcm(d1, d2);
    rn = n1 * (lcmD / d1) + n2 * (lcmD / d2);
    rd = lcmD;
    steps.push({
      latex: `\\text{LCM of denominators } (${d1}, ${d2}) = ${lcmD}`,
      explanation: "Denominators ka LCM nikala — common denominator banane ke liye",
    });
    steps.push({
      latex: `= \\frac{${n1 * (lcmD / d1)} + ${n2 * (lcmD / d2)}}{${lcmD}} = \\frac{${rn}}{${rd}}`,
      explanation: "Numerators add kiye same denominator ke saath",
    });
  } else if (op === "-") {
    const lcmD = lcm(d1, d2);
    rn = n1 * (lcmD / d1) - n2 * (lcmD / d2);
    rd = lcmD;
    steps.push({
      latex: `\\text{LCM of denominators } (${d1}, ${d2}) = ${lcmD}`,
      explanation: "Denominators ka LCM nikala",
    });
    steps.push({
      latex: `= \\frac{${n1 * (lcmD / d1)} - ${n2 * (lcmD / d2)}}{${lcmD}} = \\frac{${rn}}{${rd}}`,
      explanation: "Numerators subtract kiye",
    });
  } else if (op === "*") {
    rn = n1 * n2;
    rd = d1 * d2;
    steps.push({
      latex: `= \\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${rn}}{${rd}}`,
      explanation: "Numerator × numerator, denominator × denominator",
    });
  } else if (op === "/") {
    rn = n1 * d2;
    rd = d1 * n2;
    steps.push({
      latex: `= \\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}} = \\frac{${rn}}{${rd}}`,
      explanation: "Division mein: doosre fraction ko flip karke multiply karo",
    });
  }

  const g = gcd(Math.abs(rn), rd);
  const fn = rn / g, fd = rd / g;

  if (g > 1) {
    steps.push({
      latex: `\\frac{${rn}}{${rd}} = \\frac{${fn}}{${fd}}`,
      explanation: `GCD ${g} se simplify kiya — lowest terms mein`,
    });
  }

  return {
    steps,
    answer: `${fn}/${fd}`,
    answerLatex: `\\frac{${fn}}{${fd}}`,
  };
}

// ── 4. PERCENTAGE ──────────────────────────────────────────

export function solvePercentage(input) {
  const lower = input.toLowerCase();

  // "X% of Y"
  const ofMatch = input.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/i);
  if (ofMatch) {
    const pct = parseFloat(ofMatch[1]);
    const num = parseFloat(ofMatch[2]);
    const result = (pct / 100) * num;
    return {
      steps: [
        { latex: `${pct}\\% \\text{ of } ${num}`, explanation: "Percentage of a number nikalna hai" },
        { latex: `= \\frac{${pct}}{100} \\times ${num}`, explanation: "% matlab 'per hundred' — 100 se divide karo" },
        { latex: `= ${result}`, explanation: "Final answer" },
      ],
      answer: result,
      answerLatex: `= ${result}`,
    };
  }

  // Profit/Loss
  const profitMatch = input.match(/cp\s*=?\s*(\d+\.?\d*).*sp\s*=?\s*(\d+\.?\d*)/i)
    || input.match(/cost\s*price\s*=?\s*(\d+\.?\d*).*selling\s*price\s*=?\s*(\d+\.?\d*)/i);
  if (profitMatch) {
    const cp = parseFloat(profitMatch[1]);
    const sp = parseFloat(profitMatch[2]);
    const diff = sp - cp;
    const pct = ((Math.abs(diff) / cp) * 100).toFixed(2);
    const type = diff >= 0 ? "Profit" : "Loss";
    return {
      steps: [
        { latex: `\\text{CP} = ${cp},\\ \\text{SP} = ${sp}`, explanation: "Cost Price aur Selling Price identify kiye" },
        { latex: `${type} = \\text{SP} - \\text{CP} = ${sp} - ${cp} = ${Math.abs(diff)}`, explanation: `SP > CP hai isliye ${type} hua` },
        { latex: `${type}\\% = \\frac{${type}}{\\text{CP}} \\times 100 = \\frac{${Math.abs(diff)}}{${cp}} \\times 100 = ${pct}\\%`, explanation: `${type} percentage calculate kiya` },
      ],
      answer: `${type} = ${pct}%`,
      answerLatex: `\\text{${type}}\\% = ${pct}\\%`,
    };
  }

  // Simple Interest
  const siMatch = input.match(/p\s*=?\s*(\d+\.?\d*).*r\s*=?\s*(\d+\.?\d*).*t\s*=?\s*(\d+\.?\d*)/i);
  if (siMatch) {
    const p = parseFloat(siMatch[1]);
    const r = parseFloat(siMatch[2]);
    const t = parseFloat(siMatch[3]);
    const si = (p * r * t) / 100;
    const amount = p + si;
    return {
      steps: [
        { latex: `P = ${p},\\ R = ${r}\\%,\\ T = ${t} \\text{ years}`, explanation: "Principal, Rate, Time identify kiye" },
        { latex: `\\text{SI} = \\frac{P \\times R \\times T}{100} = \\frac{${p} \\times ${r} \\times ${t}}{100}`, explanation: "Simple Interest formula apply kiya" },
        { latex: `\\text{SI} = ${si}`, explanation: "Simple Interest calculate kiya" },
        { latex: `\\text{Amount} = P + \\text{SI} = ${p} + ${si} = ${amount}`, explanation: "Total Amount nikala" },
      ],
      answer: `SI = ${si}, Amount = ${amount}`,
      answerLatex: `\\text{SI} = ${si},\\ \\text{Amount} = ${amount}`,
    };
  }

  return null;
}

// ── 5. RATIO & PROPORTION ──────────────────────────────────

export function solveRatio(input) {
  // Simplify ratio: a:b or a:b:c
  const ratioMatch = input.match(/(\d+)\s*:\s*(\d+)(?:\s*:\s*(\d+))?/);
  if (!ratioMatch) return null;

  const nums = [parseInt(ratioMatch[1]), parseInt(ratioMatch[2])];
  if (ratioMatch[3]) nums.push(parseInt(ratioMatch[3]));

  const commonGcd = nums.reduce((a, b) => gcd(a, b));
  const simplified = nums.map(n => n / commonGcd);

  const steps = [
    {
      latex: nums.join(" : "),
      explanation: "Ratio identify kiya",
    },
    {
      latex: `\\text{GCD}(${nums.join(", ")}) = ${commonGcd}`,
      explanation: "Sabhi terms ka GCD nikala",
    },
    {
      latex: simplified.join(" : "),
      explanation: `Har term ko ${commonGcd} se divide kiya — simplified ratio`,
    },
  ];

  // Check if it's a proportion problem
  if (/proportion|find x|=/.test(input.toLowerCase())) {
    const propMatch = input.match(/(\d+)\s*:\s*(\d+)\s*=\s*(\d+)\s*:\s*x/i)
      || input.match(/(\d+)\s*:\s*x\s*=\s*(\d+)\s*:\s*(\d+)/i);
    if (propMatch) {
      const a = parseInt(propMatch[1]), b = parseInt(propMatch[2]), c = parseInt(propMatch[3]);
      const x = (b * c) / a;
      steps.push({
        latex: `\\frac{${a}}{${b}} = \\frac{${c}}{x}`,
        explanation: "Proportion setup kiya",
      });
      steps.push({
        latex: `x = \\frac{${b} \\times ${c}}{${a}} = ${x}`,
        explanation: "Cross multiply karke x nikala",
      });
    }
  }

  return {
    steps,
    answer: simplified.join(" : "),
    answerLatex: simplified.join(" : "),
  };
}

// ── 6. EXPONENTS & POWERS ──────────────────────────────────

export function solveExponents(input) {
  // Laws of exponents
  const powMatch = input.match(/(\d+)\^(\d+)/);
  if (!powMatch) return null;

  const base = parseInt(powMatch[1]);
  const exp = parseInt(powMatch[2]);
  const result = Math.pow(base, exp);

  const steps = [
    {
      latex: `${base}^{${exp}}`,
      explanation: `${base} ko ${exp} baar multiply karna hai`,
    },
    {
      latex: `= \\underbrace{${base} \\times ${base} \\times \\cdots \\times ${base}}_{${exp} \\text{ times}}`,
      explanation: `${base} ka ${exp} baar multiplication`,
    },
    {
      latex: `= ${result}`,
      explanation: "Final answer",
    },
  ];

  // Scientific notation if large
  if (result > 10000) {
    const sci = result.toExponential(2);
    steps.push({
      latex: `= ${sci.replace("e+", " \\times 10^{")}${result > 10000 ? "}" : ""}`,
      explanation: "Scientific notation mein bhi likh sakte hain",
    });
  }

  return {
    steps,
    answer: result,
    answerLatex: `${base}^{${exp}} = ${result}`,
  };
}

// ── 7. PRIME FACTORIZATION ─────────────────────────────────

export function solvePrimeFactorization(input) {
  const numMatch = input.match(/\d+/);
  if (!numMatch) return null;

  let n = parseInt(numMatch[0]);
  const original = n;
  const factors = [];
  const steps = [];

  steps.push({
    latex: `\\text{Find prime factors of } ${n}`,
    explanation: "Successive division method use karenge",
  });

  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      steps.push({
        latex: `${n} \\div ${d} = ${n / d}`,
        explanation: `${d} se divide hota hai — ${d} ek prime factor hai`,
      });
      n = Math.floor(n / d);
    }
    d++;
  }
  if (n > 1) {
    factors.push(n);
    steps.push({
      latex: `${n} \\text{ is prime}`,
      explanation: `${n} khud ek prime number hai`,
    });
  }

  const factStr = formatFactors(primeFactors(original));
  steps.push({
    latex: `${original} = ${factStr}`,
    explanation: "Prime factorization complete — exponential form mein likha",
  });

  // Check if perfect square
  const sqrtN = Math.sqrt(original);
  if (Number.isInteger(sqrtN)) {
    steps.push({
      latex: `\\sqrt{${original}} = ${sqrtN}`,
      explanation: `${original} ek perfect square hai!`,
    });
  }

  return {
    steps,
    answer: factors.join(" × "),
    answerLatex: `${original} = ${factStr}`,
  };
}

// ── TOPIC DETECTOR ─────────────────────────────────────────

export function detectArithmeticTopic(input) {
  const lower = input.toLowerCase();
  if (/lcm|hcf|gcd/.test(lower)) return "lcm_hcf";
  if (/\d+\/\d+/.test(input) && /[+\-*\/]/.test(input.replace(/\d+\/\d+/g, ""))) return "fraction";
  if (/\d+\/\d+/.test(input)) return "fraction_simplify";
  if (/%\s*of|profit|loss|simple interest|cp\s*=|sp\s*=/.test(lower)) return "percentage";
  if (/:\s*\d+/.test(input) && /ratio|proportion/.test(lower)) return "ratio";
  if (/prime\s*factor/.test(lower)) return "prime_factorization";
  if (/\d+\^?\s*\*\*?\s*\d+|\d+\^\d+/.test(input) && /exponent|power/.test(lower)) return "exponent";
  if (/[+\-*/^()]/.test(input) && /\d/.test(input)) return "arithmetic";
  return null;
}

// ── MASTER SOLVER ──────────────────────────────────────────

export function solveArithmeticMaster(input) {
  const topic = detectArithmeticTopic(input);
  switch (topic) {
    case "lcm_hcf": return solveLCMHCF(input);
    case "fraction":
    case "fraction_simplify": return solveFraction(input);
    case "percentage": return solvePercentage(input);
    case "ratio": return solveRatio(input);
    case "prime_factorization": return solvePrimeFactorization(input);
    case "exponent": return solveExponents(input);
    case "arithmetic": return solveArithmetic(input);
    default: return solveArithmetic(input);
  }
}
