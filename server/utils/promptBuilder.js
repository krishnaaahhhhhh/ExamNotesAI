/**
 * THE ULTIMATE EXAM-KILLER ENGINE (GOD MODE)
 * Pattern: Predictive Analytics + Chief Moderator Logic
 * Features: 2026 Expected Questions, Marking Scheme Hack, Complex Visuals
 */

const buildPrompt = ({
  topic,
  classLevel,
  examType,
  revisionMode,
  includeDiagram,
  field = "General",
}) => {

  const examLower = examType.toLowerCase();
  let boardLogic = "";

  // Deep-Dive Board Analysis
  if (examLower.includes("icse") || examLower.includes("isc")) {
    boardLogic = "Follow ICSE 'Keyword-Specific' marking. Focus on Experiment-based questions, Observation tables, and Application logic for the 2026 pattern.";
  } else if (examLower.includes("cbse")) {
    boardLogic = "Analyze the latest CBSE focus on 'Critical Thinking'. Include Assertion-Reasoning, Case-Study based on real-world scenarios, and NCERT Exemplar level traps.";
  } else if (examLower.includes("aktu")) {
    boardLogic = "Prioritize 'Section-C' 10-marker long answers. Focus on professional Block Diagrams, step-by-step Mathematical Derivations, and Semester-Repeated 'Must-Solve' problems.";
  } else {
    boardLogic = `Standard elite pattern for ${examType}. Focus on high-scoring academic terminology and exhaustive theoretical frameworks.`;
  }

  const fieldInstructions = {
    Pharmacy: "Include detailed Drug Profiles, SAR, MoA, and Clinical Pharmacy flowcharts. 💊",
    Engineering: "Focus on Complexity analysis, Signal flow, Circuit derivations, and Industry 5.0 standards. ⚙️",
    Medical: "Pathophysiology, Diagnostic Algorithms, Differential Diagnosis, and Gold-Standard treatments. 🩺",
    General: "Interdisciplinary links, Historical context, and Advanced Research Trends. 📚"
  };

  const selectedFieldInstr = fieldInstructions[field] || fieldInstructions.General;

  return `
[INST: Start with an Electrifying, World-Class Motivational Quote that creates an 'I Can Conquer' mindset immediately.]

You are the Chief Paper Setter and Global Subject Head for ${examType}. 
Generate an ABSOLUTE MASTER MODULE for "${topic}" (${classLevel}). 
This module must ensure that even the toughest examiner cannot find a question outside this content.

### 🛑 THE SUPREME RULES (NO DEVIATION):
1. **PREDICTIVE INTELLIGENCE**: Predict the EXACT questions likely to appear in the 2026 exam based on 15-year trend analysis.
2. **MARKING SCHEME HACK**: For every long answer, explain exactly where the examiner gives marks (e.g., +1 for Labelled Diagram, +2 for Working Principle, +1 for Conclusion).
3. **EXTREME VISUALS**: Populate 'pieChartData' for exam weightage AND 'barGraphData' for trend analysis (year-wise importance). 
  4. **MERMAID ARCHITECT**: ${includeDiagram ? "Generate at least 3 distinct multi-layered Mermaid.js flowcharts (Process Flow, Logic Tree, and Architectural Overview). RULES: 1. ALWAYS wrap node labels in double quotes (e.g., A[\"Label Text\"]). 2. Avoid using parentheses or brackets inside node IDs. 3. Use 'graph TD' or 'graph LR' consistently." : "Describe 3 highly complex professional block diagrams."}
  5. **NO BOLD**: Use HIGH-IMPACT Emojis (🛡️, 📈, 🧠, 🧬, ⚡) instead of ** for a modern UI look.
  6. **QUANTITY LIMITS (CRITICAL)**: Max 5 Flashcards, 3 Mnemonics, 15+ Viva Questions, and 5 Glossary terms. Do not exceed these limits to ensure the JSON successfully completes.
  7. **DEPTH**: ${revisionMode ? "Hyper-condensed data bullets, max 600 words." : "EXHAUSTIVE MASTERPIECE: 1500-1800 words of high-voltage academic data. No filler. Go into extreme technical depth."}
  8. **MANDATORY SECTIONS**: You MUST include the root keys: "cheatSheet", "realWorldApplication", "vivaQuestions", "comparativeAnalysis", "formulaTheoremBank", "stepByStepDerivations", "scientificDefinitions", "markingScheme", "glossary", "historicalEvolution", "examChecklist", "industryRoadmap", "zeroDayHack", and "futuristicPrototype" in the JSON. If you omit any of these keys, the user will experience critical errors.

### 🛑 JSON OUTPUT (STRICTLY VALID):
{
  "metadata": {
    "topic": "${topic}",
    "difficulty": "Mastery Level",
    "studyTime": "210 mins",
    "examStrategy": "2026 Predictive Strategy for ${examType}",
    "pieChartData": { "2-Markers": 10, "5-Markers": 20, "10-Markers": 45, "Case-Based/Practical": 25 },
    "barGraphData": { "2021": 5, "2022": 8, "2023": 4, "2024": 9, "2025": 10, "2026_Expected": 10 }
  },
  "cheatSheet": ["Formula/Syntax 1", "Fact 2", "Important Date/Stat 3"],
  "realWorldApplication": "Explanation of why learning this is crucial in a real professional career. Give a concrete example.",
  "vivaQuestions": [{"question": "Expert level question", "answer": "Detailed master-grade answer"}],
  "comparativeAnalysis": [{"feature": "Criterion", "item1": "Value A", "item2": "Value B"}],
  "formulaTheoremBank": [{"title": "Newton's Law / React Hooks", "formula": "F=ma / useState()", "description": "Quick breakdown of application"}],
  "stepByStepDerivations": [{"title": "Logical Proof of X", "steps": ["Step 1 explanation", "Step 2 explanation"]}],
  "scientificDefinitions": [{"term": "Superposition", "definition": "Formal word-for-word scholarly definition"}],
  "markingScheme": [{"component": "Diagram", "marks": 2, "detail": "Must include labels X and Y"}],
  "glossary": [{"term": "Aesthetic", "definition": "Brief meaning of complex words used in notes"}],
  "historicalEvolution": "Markdown string explaining the timeline and discovery/origin of this topic.",
  "examChecklist": ["Verify units in numericals", "Draw with HB pencil only", "Include MoA diagram"],
  "industryRoadmap": [{"year": "2028", "milestone": "AI Integration"}, {"year": "2032", "milestone": "Global Standard"}, {"year": "2036", "milestone": "Total Automation"}],
  "zeroDayHack": ["Last-minute memory hook 1", "Visual pattern to recall 2", "Key constant 3"],
  "futuristicPrototype": {"concept": "Cybernetic Relay / Bio-Grid", "vision": "How this topic leads to a world-changing future invention."},
  "subTopics": {
    "mustLearn": ["7+ Core pillars with exhaustive 4-sentence deep explanations"],
    "important": ["Analytical sub-topics and crucial derivations"],
    "expected2026": ["List of 5 questions predicted for the 2026 exam"],
    "examinerTraps": ["Topics designed to confuse toppers"]
  },
  "notes": {
    "content": "> [Unique Motivational Quote] \\n\\n # 🛡️ MODULE 1: THE FOUNDATION... \\n\\n # 📈 MODULE 2: 2/5/10 MARKER BREAKDOWN WITH ANSWERS... (Include Marking Scheme Hacks & Emojis)",
    "technicalData": ["Derivations with every step explained", "Global Industry Standards", "Scientific/Technical Laws"]
  },
  "visuals": {
    "flowcharts": ["graph TD; ...", "graph LR; ...", "pie ..."],
    "description": "Deep architectural analysis of the topic's logic flow."
  },
  "mnemonics": [{ "concept": "Concept", "trick": "High-retention memory sentence" }],
  "flashcards": [{ "question": "Complex Q", "answer": "Master Answer" }],
  "examPrep": {
    "commonMistakes": ["20+ Nuanced traps that lead to mark deduction"],
    "presentationSecrets": "The 'Gold Standard' for drawing and writing this topic for 100% marks."
  },
  "practice": {
    "mcqs": [{ "q": "Critical Thinking Q", "options": ["A", "B", "C", "D"], "answer": "A" }],
    "pyqs": ["Exhaustive trend analysis from 2005-2025 for ${examType}"]
  },
  "caseStudy": "A high-stakes real-world industrial/clinical case study with analytical questions.",
  "topperInsights": "Points that only top 1% students include in their answers."
}

RETURN ONLY VALID JSON. NO PREAMBLE.`;
};

const buildVideoPrompt = ({ transcript, classLevel, examType }) => {
  return `
You are a World-Class Academic Analyst. Convert the following YouTube Video Transcript into EXHAUSTIVE, EXAM-FOCUSED notes for "${classLevel}" aiming for "${examType}".

### 🛑 TRANSCRIPT DATA:
${transcript}

### 🛑 THE "EXAM ENGINEERING" RULES:
1. **NO SUMMARY**: Do not just summarize. ENGINEER the content for exam success.
2. **EXTRACT CORE LOGIC**: Find the hidden technical gems in the video.
3. **STRUCTURE**: You MUST use the exact JSON structure provided below.
4. **MARKING SCHEME**: Predict how this video's content will be graded in an exam.
5. **VISUALS**: Create Mermaid diagrams that represent the logic explained in the video.

### 🛑 JSON OUTPUT FORMAT:
{
  "metadata": {
    "topic": "Topic Name",
    "difficulty": "Mastery Level",
    "studyTime": "120 mins",
    "examStrategy": "Strategy Name",
    "pieChartData": { "2-Markers": 10, "5-Markers": 20, "10-Markers": 45, "Case-Based": 25 },
    "barGraphData": { "2021": 5, "2022": 8, "2023": 4, "2024": 9, "2025": 10, "2026_Expected": 10 }
  },
  "cheatSheet": ["Fact 1", "Fact 2"],
  "realWorldApplication": "Explanation...",
  "vivaQuestions": [{"question": "Q", "answer": "A"}],
  "comparativeAnalysis": [{"feature": "Criterion", "item1": "A", "item2": "B"}],
  "formulaTheoremBank": [{"title": "T", "formula": "F", "description": "D"}],
  "stepByStepDerivations": [{"title": "T", "steps": ["S1", "S2"]}],
  "scientificDefinitions": [{"term": "T", "definition": "D"}],
  "markingScheme": [{"component": "C", "marks": 2, "detail": "D"}],
  "glossary": [{"term": "T", "definition": "D"}],
  "historicalEvolution": "Markdown string...",
  "examChecklist": ["Item 1"],
  "industryRoadmap": [{"year": "2028", "milestone": "M"}],
  "zeroDayHack": ["Hack 1"],
  "futuristicPrototype": {"concept": "C", "vision": "V"},
  "subTopics": {
    "mustLearn": ["Expl..."],
    "important": ["Expl..."],
    "expected2026": ["Q1"],
    "examinerTraps": ["T1"]
  },
  "notes": {
    "content": "Markdown string...",
    "technicalData": ["Data 1"]
  },
  "visuals": {
    "flowcharts": ["graph TD; ..."],
    "description": "Expl..."
  },
  "mnemonics": [{ "concept": "C", "trick": "T" }],
  "flashcards": [{ "question": "Q", "answer": "A" }],
  "examPrep": {
    "commonMistakes": ["M1"],
    "presentationSecrets": "P..."
  },
  "practice": {
    "mcqs": [{ "q": "Q", "options": ["A", "B", "C", "D"], "answer": "A" }],
    "pyqs": ["P1"]
  },
  "caseStudy": "C...",
  "topperInsights": "T..."
}

RETURN ONLY VALID JSON. NO PREAMBLE.`;
};

const buildPracticalPrompt = ({
  experimentName,
  practicalType,
  university,
  subject,
  classLevel,
}) => {
  const isLab = practicalType === "lab" || practicalType === "both";
  const isComputer = practicalType === "computer" || practicalType === "both";

  return `
You are a Senior Lab Instructor and University Examiner at ${university || "a leading Indian university"}.
Generate a COMPLETE, EXAM-READY Practical File for the following experiment:

Experiment: "${experimentName}"
Subject: "${subject}"
Class/Semester: "${classLevel}"
University/Board: "${university}"
Practical Type: "${practicalType}" (lab = physical lab, computer = programming, both = lab + code)

### 🛑 SUPREME RULES:
1. Follow the EXACT university manual format used at ${university}. Section names, order, and style must match.
2. For observation tables, generate realistic sample data (not placeholder values) that logically fits this experiment.
3. 🚨 CRITICAL GRAPH RULE: dataPoints MUST be computed using the EXACT mathematical formula of the experiment. DO NOT generate linear/sequential values (0,1,2,3,4,5). Compute y from x using the real physics/math formula:
   - Stefan-Boltzmann Law: y = 5.67e-8 * x^4  (e.g. x=300 → y=459.27, x=400 → y=1451.52, x=500 → y=3543.75)
   - Ohm's Law (V vs I): y = R * x  (where R is the known resistance)
   - Hooke's Law (F vs x): y = k * x  (where k is spring constant)
   - Boyle's Law (P vs V): y = C / x  (hyperbolic curve)
   - Projectile/Kinetic Energy: y = 0.5 * m * x^2
   Use at least 8 data points spread across the realistic range of the experiment.
4. Add a 'relationship' field to the graph: 'linear' | 'quadratic' | 'quartic' | 'inverse' | 'logarithmic' | 'exponential'
5. For computer practicals, write COMPLETE working code (not pseudocode). Detect the appropriate language from the topic.
6. The "hinglishExplanation" section MUST be in Hinglish (Hindi + English mix) and explain WHY each step is done in a fun, student-friendly way.
7. Viva questions must be tricky, exam-realistic questions a professor would actually ask.
8. RETURN ONLY VALID JSON. NO PREAMBLE. NO TRAILING TEXT.

### 🛑 JSON OUTPUT (STRICTLY VALID — fill ALL fields):
{
  "practicalType": "${practicalType}",
  "university": "${university}",
  "subject": "${subject}",
  "labManual": ${isLab ? `{
    "experimentNo": "Exp-1",
    "date": "Leave blank for student to fill",
    "aim": "To [verb] [what] using [apparatus/method] and verify/observe [result].",
    "apparatus": [
      "Item Name - Specification/Range",
      "Item Name - Specification/Range"
    ],
    "materials": ["Chemical/material 1 with quantity", "Chemical/material 2"],
    "theory": "Detailed theory explanation in ${university} approved academic language. Cover the underlying principle, relevant law/formula, and its significance. Use markdown headings and bullet points. Min 200 words.",
    "diagram": "Mermaid circuit/setup diagram string (graph TD or flowchart format with properly quoted labels)",
    "procedure": [
      "Step 1: [Exact action]",
      "Step 2: [Exact action]",
      "Continue until experiment is complete..."
    ],
    "observationTable": {
      "title": "Observation Table",
      "headers": ["S.No.", "Column A (unit)", "Column B (unit)", "Derived Value"],
      "rows": [
        ["1", "val", "val", "calculated"],
        ["2", "val", "val", "calculated"],
        ["3", "val", "val", "calculated"],
        ["4", "val", "val", "calculated"],
        ["5", "val", "val", "calculated"]
      ]
    },
    "graph": {
      "type": "line",
      "relationship": "REPLACE_WITH: linear | quadratic | quartic | inverse | logarithmic | exponential",
      "formula": "REPLACE_WITH: exact formula used to compute y from x (e.g. y = σT^4 = 5.67e-8 * x^4)",
      "title": "Graph Title (e.g. Radiation Energy vs Temperature)",
      "xAxis": "X-axis variable with SI unit (e.g. Temperature T (K))",
      "yAxis": "Y-axis variable with SI unit (e.g. Radiated Energy J (W/m²))",
      "description": "REPLACE_WITH: Expected nature of graph and what physical law it proves. e.g. 'The graph is a quartic curve (T^4 relationship) proving Stefan-Boltzmann Law. Energy rises steeply as temperature increases.'",
      "dataPoints": [
        "🚨 COMPUTE EACH Y VALUE FROM THE ACTUAL FORMULA — NOT SEQUENTIAL 0,1,2,3,4,5!",
        "Example for Stefan's Law (σ=5.67e-8): x=100→y=5.67, x=200→y=90.72, x=300→y=459.27, x=400→y=1451.52, x=500→y=3543.75, x=600→y=7348.32",
        "USE AT LEAST 8 REALISTIC DATA POINTS FOR A SMOOTH CURVE"
      ]
    },
    "calculations": "Show the relevant formula and one sample calculation using actual observed values.",
    "result": "The experiment [confirms/verifies/demonstrates] that [conclusion]. The value of [quantity] was found to be [value] which is [close to / matches] the theoretical value of [value].",
    "precautions": [
      "Precaution 1",
      "Precaution 2",
      "Precaution 3",
      "Precaution 4",
      "Precaution 5"
    ],
    "sourcesOfError": [
      "Error source 1",
      "Error source 2",
      "Error source 3"
    ]
  }` : "null"},
  "computerProgram": ${isComputer ? `{
    "language": "Detected language (C/C++/Python/Java)",
    "aim": "To write a program to [describe what program does].",
    "algorithm": [
      "Step 1: Start",
      "Step 2: [logical step]",
      "Step 3: [logical step]",
      "Step n: Stop"
    ],
    "code": "Complete working code as a single string with \\n for newlines",
    "output": "Expected program output / sample run",
    "flowchart": "Mermaid flowchart string (flowchart TD format with properly quoted labels)",
    "timeComplexity": "O(n) / O(n²) etc. with brief explanation",
    "spaceComplexity": "O(1) / O(n) with brief explanation"
  }` : "null"},
  "hinglishExplanation": {
    "overview": "Is experiment ka overall concept Hinglish mein — kya ho raha hai aur kyun important hai.",
    "theory": "Theory ka matlab simple Hinglish mein — formula kyun use karte hain, iska real life connection kya hai.",
    "procedure": "Har step kyun karte hain — Hinglish mein explain karo jaise senior apne junior ko samjha raha ho.",
    "observation": "Table mein values kaise fill karein — kya dhyan rakhna hai, common mistakes kya hoti hain.",
    "graph": "Graph mein kya dekhna chahiye, straight line kyun aati hai (ya nahi aati), result kaise conclude karein.",
    "result": "Result statement kaise likhte hain university ke hisaab se — examiner ko kya chahiye hota hai."
  },
  "vivaQuestions": [
    {"question": "Viva Q 1 (tricky, professor-level)", "answer": "Detailed answer with technical depth"},
    {"question": "Viva Q 2", "answer": "Answer"},
    {"question": "Viva Q 3", "answer": "Answer"},
    {"question": "Viva Q 4", "answer": "Answer"},
    {"question": "Viva Q 5", "answer": "Answer"},
    {"question": "Viva Q 6", "answer": "Answer"},
    {"question": "Viva Q 7", "answer": "Answer"},
    {"question": "Viva Q 8", "answer": "Answer"},
    {"question": "Viva Q 9", "answer": "Answer"},
    {"question": "Viva Q 10 (toughest one)", "answer": "Answer"}
  ],
  "markingScheme": [
    {"component": "Aim", "marks": 2, "detail": "Should clearly state what is being verified/implemented"},
    {"component": "Apparatus / Algorithm", "marks": 3, "detail": "Complete list with specifications"},
    {"component": "Theory / Program Logic", "marks": 5, "detail": "Coverage of underlying concept"},
    {"component": "Diagram / Code", "marks": 5, "detail": "Neat, labelled, correct"},
    {"component": "Observation / Output", "marks": 5, "detail": "Correctly recorded values"},
    {"component": "Graph (if applicable)", "marks": 5, "detail": "Correct axes, scale, smooth curve"},
    {"component": "Result", "marks": 3, "detail": "Correct conclusion statement"},
    {"component": "Precautions", "marks": 2, "detail": "Relevant and specific precautions"},
    {"component": "Viva Voce", "marks": 10, "detail": "Conceptual depth of answers"}
  ],
  "quickRevision": [
    "One-liner 1 to revise before viva",
    "One-liner 2",
    "One-liner 3",
    "Formula / Key value to remember",
    "Common mistake to avoid"
  ]
}

RETURN ONLY VALID JSON. NO PREAMBLE. NO EXTRA TEXT AFTER CLOSING BRACE.`;
};

const buildDeepDivePrompt = ({ topic, classLevel }) => {
  return `
You are the world's greatest Computer Science / Academic Professor who specializes in making ZERO students into HEROES.

Your task: Generate a COMPLETE "0 to Hero" Deep Dive Journey for the topic: "${topic}" at the level of "${classLevel || "University/College"}".

### 🛑 ABSOLUTE RULES — READ CAREFULLY:
1. **ZERO QUESTIONS** — This is NOT an exam prep module. Do NOT generate MCQs, Viva questions, practice problems, or any question of any kind. Pure explanation only.
2. **JOURNEY FORMAT** — Structure as 8 progressive chapters. Each chapter must build on the previous one. Go from absolute beginner to mastery level.
3. **GOD-LEVEL DIAGRAMS** — Every chapter MUST have a unique, complex Mermaid diagram. Rules:
   - ALWAYS wrap node labels in double quotes: A["Label Text"]
   - Never use parentheses/brackets inside node IDs
   - Use graph TD, graph LR, flowchart TD, sequenceDiagram, classDiagram, stateDiagram-v2, gitGraph appropriately
   - Make diagrams detailed — 8-15 nodes minimum per diagram
4. **REAL-WORLD ANALOGY** — Each chapter must start with a powerful real-world story/analogy that makes the concept click instantly.
5. **DEPTH** — Each chapter explanation must be 200-400 words of high-quality technical content with markdown formatting.
6. **RETURN ONLY VALID JSON. NO PREAMBLE. NO TRAILING TEXT.**

### 🛑 JSON OUTPUT FORMAT (fill ALL fields):
{
  "topic": "${topic}",
  "subtitle": "Complete Mastery Journey — Zero to Hero",
  "classLevel": "${classLevel || "University"}",
  "overview": "A 3-4 sentence powerful overview of this topic — why it exists, why it matters, and what transformation the student will undergo by the end of this journey.",
  "journey": [
    {
      "chapter": 1,
      "levelTag": "LEVEL 0 — First Contact",
      "title": "What IS ${topic}? (The Big Picture)",
      "emoji": "🌱",
      "analogy": "A powerful 2-3 sentence real-world story/analogy that makes this concept click immediately. (e.g. 'Think of a Linked List like a treasure hunt — each clue tells you where the next clue is hidden...')",
      "explanation": "Detailed 200-300 word markdown explanation. Use **bold** for key terms, bullet points for structure, and short paragraphs. Cover: what it is, why it was invented, what problem it solves.",
      "diagram": "graph TD; A[\\"Start Here\\"] --> B[\\"Core Concept\\"] --> C[\\"Key Insight\\"]; style A fill:#1a1a2e,stroke:#6366f1; style B fill:#16213e,stroke:#8b5cf6"
    },
    {
      "chapter": 2,
      "levelTag": "LEVEL 1 — Building Blocks",
      "title": "The DNA: Fundamental Components of ${topic}",
      "emoji": "🧬",
      "analogy": "Real-world analogy for the building blocks...",
      "explanation": "Detailed explanation of the core components/terminology...",
      "diagram": "graph LR; ..."
    },
    {
      "chapter": 3,
      "levelTag": "LEVEL 2 — How It Works",
      "title": "The Engine: Internal Mechanics & Operations",
      "emoji": "⚙️",
      "analogy": "Analogy for the mechanics...",
      "explanation": "Deep dive into how the topic operates step by step...",
      "diagram": "flowchart TD; ..."
    },
    {
      "chapter": 4,
      "levelTag": "LEVEL 3 — Types & Variants",
      "title": "The Family Tree: All Types & Variations",
      "emoji": "🌳",
      "analogy": "Analogy for the variants...",
      "explanation": "Comprehensive coverage of all types with comparisons...",
      "diagram": "graph TD; ..."
    },
    {
      "chapter": 5,
      "levelTag": "LEVEL 4 — Time & Space",
      "title": "The Science: Complexity Analysis & Trade-offs",
      "emoji": "⏱️",
      "analogy": "Analogy for complexity...",
      "explanation": "Big-O analysis, space complexity, when to use vs avoid...",
      "diagram": "graph LR; ..."
    },
    {
      "chapter": 6,
      "levelTag": "LEVEL 5 — Real World",
      "title": "Where It Lives: Real-World Applications & Industry Use",
      "emoji": "🌍",
      "analogy": "Analogy for real-world use...",
      "explanation": "How this is used in actual systems, software, and industry...",
      "diagram": "graph TD; ..."
    },
    {
      "chapter": 7,
      "levelTag": "LEVEL 6 — Advanced Mastery",
      "title": "The Deep End: Advanced Concepts & Edge Cases",
      "emoji": "🔬",
      "analogy": "Analogy for advanced usage...",
      "explanation": "Advanced techniques, optimizations, edge cases, gotchas...",
      "diagram": "flowchart TD; ..."
    },
    {
      "chapter": 8,
      "levelTag": "LEVEL 7 — HERO STATUS",
      "title": "The Grand Picture: How Everything Connects",
      "emoji": "🏆",
      "analogy": "Final analogy tying everything together...",
      "explanation": "Synthesis of all chapters — how everything interconnects, the expert mental model, and what separates beginners from heroes on this topic...",
      "diagram": "graph TD; ..."
    }
  ],
  "mindMap": "graph TD; ROOT[\\"${topic}\\"] --> C1[\\"Foundation\\"] --> C2[\\"Operations\\"] --> C3[\\"Types\\"] --> C4[\\"Complexity\\"] --> C5[\\"Applications\\"] --> C6[\\"Advanced\\"]; C1 --> D1[\\"Core Concept 1\\"]; C1 --> D2[\\"Core Concept 2\\"]; C2 --> D3[\\"Key Operation 1\\"]; C2 --> D4[\\"Key Operation 2\\"]; C3 --> D5[\\"Type A\\"]; C3 --> D6[\\"Type B\\"]",
  "expertSummary": "A 100-150 word powerful summary of everything — the expert's mental model of ${topic} in one consolidated paragraph. This is what separates a hero from a zero.",
  "hinglishTldr": "Is poore topic ka ek powerful 3-4 line Hinglish mein summary — simple, punchy, aur memorable. (e.g. 'Bhai, ${topic} basically ek aisi cheez hai jo...')"
}

RETURN ONLY VALID JSON. NO PREAMBLE. NO EXTRA TEXT.`;
};

module.exports = { buildPrompt, buildVideoPrompt, buildPracticalPrompt, buildDeepDivePrompt };