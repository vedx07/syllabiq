const express = require('express');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// Get all previous analyses for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-results.roadmap'); // omit detailed roadmap for list view to save bandwidth
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get a specific analysis by slug (publicly shareable or just for user)
// Making it public so share links work
router.get('/:slug', async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ slug: req.params.slug });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an analysis
router.delete('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found or not authorized' });
    }
    res.json({ success: true, message: 'Analysis deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
