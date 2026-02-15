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
        doc.fillColor('#ffffff').fontSize(22).text(notesData.metadata.topic.toUpperCase(), { align: 'center', bold: true });
        doc.fillColor('#9ca3af').fontSize(10).text(`Difficulty: ${notesData.metadata.difficulty} | Mastery Level`, { align: 'center' });
        
        doc.moveDown(2);
        // Motivational Quote Box
        doc.rect(50, doc.y, 500, 60).fill('#111111').stroke('#6366f1');
        doc.fillColor('#6366f1').fontSize(13).text(notesData.notes.content.split('\n')[0], 70, doc.y + 15, { width: 460, italic: true, align: 'center' });
        
        doc.moveDown(4);
        // Notes Section Header
        doc.fillColor('#6366f1').fontSize(18).text("Detailed Notes", 50, doc.y);
        doc.rect(50, doc.y + 5, 120, 2).fill('#6366f1');
        doc.moveDown();
        doc.fillColor('#d1d5db').fontSize(11).text(notesData.notes.content.replace(/^>.*?\n/, ""), { align: 'justify', lineGap: 5 });

        // --- Page 2: Visuals & Logic ---
        doc.addPage();
        addDarkPage();
        doc.fillColor('#6366f1').fontSize(18).text("Visual Flowchart & Logic", 50, 50);
        doc.moveDown();
        
        // Diagram Placeholder (Since Mermaid is code, we show it as a structured Logic Box)
        doc.rect(50, doc.y, 500, 200).fill('#0f172a').stroke('#1e293b');
        doc.fillColor('#818cf8').fontSize(10).text("STRATEGIC FLOW DIAGRAM (Logic Tree)", 60, doc.y + 10);
        doc.moveDown();
        doc.fillColor('#94a3b8').fontSize(9).text(notesData.visuals.mermaidData, { width: 480, lineGap: 3 });
        
        doc.moveDown(2);
        doc.fillColor('#ffffff').fontSize(12).text("Diagram Explanation:", { underline: true });
        doc.fillColor('#9ca3af').fontSize(10).text(notesData.visuals.description);

        // --- Page 3: Retentions & Exam Prep ---
        doc.addPage();
        addDarkPage();
        doc.fillColor('#6366f1').fontSize(18).text("Mnemonics & Flashcards", 50, 50);
        doc.moveDown();
        
        notesData.mnemonics.slice(0, 5).forEach(m => {
            doc.fillColor('#ffffff').fontSize(12).text(`• ${m.concept}`, { bold: true });
            doc.fillColor('#9ca3af').fontSize(10).text(`Trick: ${m.trick}`);
            doc.moveDown(0.5);
        });

        doc.moveDown(2);
        doc.fillColor('#6366f1').fontSize(18).text("Exam Practice (PYQs & MCQs)", 50, doc.y);
        doc.moveDown();
        notesData.practice.mcqs.slice(0, 3).forEach((q, i) => {
            doc.fillColor('#ffffff').fontSize(11).text(`${i+1}. ${q.q}`);
            doc.fillColor('#9ca3af').fontSize(9).text(`Ans: ${q.answer}`);
            doc.moveDown(0.5);
        });

        doc.end();

    } catch (error) {
        console.error("PDF Dark Mode Error:", error);
        res.status(500).send("Error generating Dark PDF");
    }
};