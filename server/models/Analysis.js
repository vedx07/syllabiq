const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, required: true, unique: true },
  originalFileName: { type: String, required: true },
  results: {
    roles: [{
      role: String,
      fitScore: Number,
      matchedSkills: [String],
      missingSkills: [String]
    }],
    demandScore: Number,
    roadmap: [{
      skill: String,
      resources: [String]
    }],
    topCompanies: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
