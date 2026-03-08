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
4. **MERMAID ARCHITECT**: ${includeDiagram ? "Generate a multi-layered, nested Mermaid.js flowchart using 'subgraph' logic for extreme clarity." : "Describe a highly complex professional block diagram."}
5. **NO BOLD**: Use HIGH-IMPACT Emojis (🛡️, 📈, 🧠, 🧬, ⚡) instead of ** for a modern UI look.
6. **QUANTITY**: 8 Flashcards, 5 Mnemonics, and 8 Viva Questions.
7. **DEPTH**: ${revisionMode ? "Hyper-condensed data bullets, max 500 words." : "Concise but powerful: 800-1200 words of high-voltage academic data. No filler."}

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
    "mermaidData": "graph TD; subgraph Process; A-->B; end; subgraph Logic; B-->C; end;",
    "description": "Deep architectural analysis of the topic's logic flow."
  },
  "mnemonics": [{ "concept": "Concept", "trick": "High-retention memory sentence" }],
  "flashcards": [{ "front": "Complex Q", "back": "Master Answer" }],
  "examPrep": {
    "vivaQuestions": ["25+ Expert-level Questions"],
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

module.exports = { buildPrompt };