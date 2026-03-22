const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  text:   { type: String, required: true },
  risk:   { type: String, enum: ['safe', 'risky', 'neutral'], default: 'neutral' },
  reason: { type: String },
});

const documentSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    fileName:     { type: String, required: true },
    fileSize:     { type: Number },
    mimeType:     { type: String },
    rawText:      { type: String },
    docType: {
      type: String,
      enum: ['rent_agreement', 'fir', 'court_notice', 'employment', 'nda', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
    },
    analysis: {
      summary:      { type: String },
      summaryHindi: { type: String },
      clauses:      [clauseSchema],
      riskScore:    { type: Number, min: 0, max: 100, default: 0 },
      keyPoints:    [{ type: String }],
      language:     { type: String, enum: ['english', 'hindi'], default: 'english' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);