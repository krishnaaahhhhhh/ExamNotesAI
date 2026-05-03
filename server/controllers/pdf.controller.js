const PDFDocument = require('pdfkit');

exports.downloadPDF = async (req, res) => {
    try {
        const { notesData } = req.body;
        const doc = new PDFDocument({ margin: 0, size: 'A4' }); // Margin 0 for full bg color

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(pdfData),
                'Content-Type': 'application/pdf',
                'Content-disposition': `attachment;filename=${notesData.metadata.topic}_AI_Module.pdf`,
            }).end(pdfData);
        });

        // --- Helper for Dark Background ---
        const addDarkPage = () => {
            doc.rect(0, 0, 612, 792).fill('#050505'); // Web-like Dark Background
        };

        // --- Page 1: Header & Quote ---
        addDarkPage();
        doc.fillColor('#6366f1').fontSize(26).text("AI-GENERATED STUDY MODULE", 50, 60, { align: 'center', characterSpacing: 1 });
        doc.moveDown(0.5);
        doc.fillColor('#ffffff').fontSize(22).text((notesData.metadata?.topic || "Study Notes").toUpperCase(), { align: 'center', bold: true });
        doc.fillColor('#9ca3af').fontSize(10).text(`Difficulty: ${notesData.metadata?.difficulty || "Expert"} | Mastery Level`, { align: 'center' });
        
        doc.moveDown(2);
        // Motivational Quote Box
        doc.rect(50, doc.y, 500, 60).fill('#111111').stroke('#6366f1');
        const contentStr = typeof notesData.notes?.content === "string" ? notesData.notes.content : "";
        doc.fillColor('#6366f1').fontSize(13).text(contentStr.split('\n')[0] || "Knowledge is Power", 70, doc.y + 15, { width: 460, italic: true, align: 'center' });
        
        doc.moveDown(4);
        // Notes Section Header
        doc.fillColor('#6366f1').fontSize(18).text("Detailed Notes", 50, doc.y);
        doc.rect(50, doc.y + 5, 120, 2).fill('#6366f1');
        doc.moveDown();
        doc.fillColor('#d1d5db').fontSize(11).text(contentStr.replace(/^>.*?\n/, "") || "No detailed notes available.", { align: 'justify', lineGap: 5 });

        // --- Page 2: Visuals & Logic ---
        doc.addPage();
        addDarkPage();
        doc.fillColor('#6366f1').fontSize(18).text("Visual Flowchart & Logic", 50, 50);
        doc.moveDown();
        
        // Diagram Placeholder (Since Mermaid is code, we show it as a structured Logic Box)
        doc.rect(50, doc.y, 500, 200).fill('#0f172a').stroke('#1e293b');
        doc.fillColor('#818cf8').fontSize(10).text("STRATEGIC FLOW DIAGRAM (Logic Tree)", 60, doc.y + 10);
        doc.moveDown();
        
        const mermaidStr = notesData.visuals?.mermaidData || (Array.isArray(notesData.visuals?.flowcharts) ? notesData.visuals.flowcharts[0] : "");
        doc.fillColor('#94a3b8').fontSize(9).text(mermaidStr || "Diagram logic unavailable in text format.", { width: 480, lineGap: 3 });
        
        doc.moveDown(2);
        doc.fillColor('#ffffff').fontSize(12).text("Diagram Explanation:", { underline: true });
        doc.fillColor('#9ca3af').fontSize(10).text(notesData.visuals?.description || "Visual logic explanation.");

        // --- Page 3: Retentions & Exam Prep ---
        doc.addPage();
        addDarkPage();
        doc.fillColor('#6366f1').fontSize(18).text("Mnemonics & Flashcards", 50, 50);
        doc.moveDown();
        
        if (Array.isArray(notesData.mnemonics)) {
            notesData.mnemonics.slice(0, 5).forEach(m => {
                doc.fillColor('#ffffff').fontSize(12).text(`• ${m.concept || m.word || "Concept"}`, { bold: true });
                doc.fillColor('#9ca3af').fontSize(10).text(`Trick: ${m.trick || m.meaning || "N/A"}`);
                doc.moveDown(0.5);
            });
        }

        doc.moveDown(2);
        doc.fillColor('#6366f1').fontSize(18).text("Scholar's Academic Vault", 50, doc.y);
        doc.moveDown();

        // 1. Formula & Theorem Bank
        if (notesData.formulaTheoremBank && notesData.formulaTheoremBank.length > 0) {
            doc.fillColor('#ffffff').fontSize(14).text("Formula & Theorem Bank", { underline: true });
            doc.moveDown(0.5);
            notesData.formulaTheoremBank.forEach(f => {
                doc.fillColor('#818cf8').fontSize(11).text(`${f.title}: ${f.formula}`);
                doc.fillColor('#9ca3af').fontSize(9).text(f.description);
                doc.moveDown(0.5);
            });
            doc.moveDown();
        }

        // 2. Marking Scheme
        if (notesData.markingScheme && notesData.markingScheme.length > 0) {
            doc.fillColor('#ffffff').fontSize(14).text("Predictive Marking Scheme", { underline: true });
            doc.moveDown(0.5);
            notesData.markingScheme.forEach(s => {
                doc.fillColor('#fb923c').fontSize(10).text(`• ${s.component}: +${s.marks} Marks (${s.detail})`);
            });
            doc.moveDown();
        }

        // 3. Viva Questions
        if (notesData.vivaQuestions && notesData.vivaQuestions.length > 0) {
            doc.fillColor('#ffffff').fontSize(14).text("Viva Voce Master List", { underline: true });
            doc.moveDown(0.5);
            notesData.vivaQuestions.slice(0, 10).forEach((v, i) => {
                doc.fillColor('#ffffff').fontSize(11).text(`Q${i+1}: ${v.question}`);
                doc.fillColor('#9ca3af').fontSize(9).text(`A: ${v.answer}`);
            });
        }

        // 4. Industry 2036 Roadmap
        if (notesData.industryRoadmap && notesData.industryRoadmap.length > 0) {
            doc.addPage();
            addDarkPage();
            doc.fillColor('#6366f1').fontSize(18).text("Industry 2036 Roadmap", 50, 50);
            doc.moveDown();
            notesData.industryRoadmap.forEach(step => {
                doc.fillColor('#ffffff').fontSize(12).text(`${step.year}: ${step.milestone}`, { bold: true });
                doc.moveDown(0.5);
            });
            doc.moveDown();
        }

        // 5. Futuristic Prototype
        if (notesData.futuristicPrototype) {
            doc.fillColor('#6366f1').fontSize(18).text("AI-Dreamed Prototype", 50, doc.y);
            doc.moveDown();
            doc.rect(50, doc.y, 500, 80).fill('#0f172a').stroke('#6366f1');
            doc.fillColor('#ffffff').fontSize(12).text(notesData.futuristicPrototype.concept, 70, doc.y + 15, { bold: true });
            doc.fillColor('#9ca3af').fontSize(10).text(notesData.futuristicPrototype.vision, 70, doc.y + 35, { width: 460 });
            doc.moveDown(5);
        }

        // 6. Zero-Day Hyper-Drive Hack
        if (notesData.zeroDayHack && notesData.zeroDayHack.length > 0) {
            doc.addPage();
            addDarkPage();
            doc.fillColor('#fb923c').fontSize(22).text("ZERO-DAY HYPER-DRIVE HACK", 50, 50, { align: 'center', bold: true });
            doc.moveDown(2);
            doc.rect(50, doc.y, 500, 200).fill('#1a1a1a').stroke('#fb923c');
            doc.fillColor('#ffffff').fontSize(12).text("READ THIS 120 SECONDS BEFORE ENTRY", 70, doc.y + 15, { align: 'center', bold: true });
            doc.moveDown();
            notesData.zeroDayHack.forEach((hack, i) => {
                doc.fillColor('#fb923c').fontSize(11).text(`#${i+1} ${hack}`, 80, doc.y, { width: 440 });
                doc.moveDown(0.5);
            });
        }

        doc.end();

    } catch (error) {
        console.error("PDF Dark Mode Error:", error);
        res.status(500).send("Error generating Dark PDF");
    }
};