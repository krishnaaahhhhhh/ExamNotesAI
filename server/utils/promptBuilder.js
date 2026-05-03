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

module.exports = { buildPrompt, buildVideoPrompt };