const express = require('express');
const crypto = require('crypto');
const upload = require('../middleware/multer');
const auth = require('../middleware/auth');
const { extractTextFromPDF } = require('../utils/pdfParser');
const { analyzeSyllabus } = require('../utils/aiClient');
const Analysis = require('../models/Analysis');

const router = express.Router();

router.post('/', auth, upload.single('syllabus'), async (req, res) => {
  try {
    let text = '';
    let originalFileName = 'Pasted Text';

    if (req.file) {
      try {
        text = await extractTextFromPDF(req.file.buffer);
        originalFileName = req.file.originalname;
      } catch (pdfError) {
        return res.status(400).json({ error: 'Could not read text from this PDF. It might be scanned or protected. Please copy and paste the syllabus text instead.' });
      }
    } else if (req.body.text) {
      text = req.body.text;
    } else {
      return res.status(400).json({ error: 'Please upload a PDF or paste syllabus text.' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract any text.' });
    }

    // Call AI to analyze the text
    const results = await analyzeSyllabus(text);

    // Generate a unique slug for sharing
    const slug = crypto.randomBytes(6).toString('hex');

    // Save to DB
    const analysis = new Analysis({
      userId: req.user.id,
      slug,
      originalFileName,
      results
    });

    await analysis.save();

    res.json({ success: true, slug, results });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process syllabus.' });
  }
});

module.exports = router;
