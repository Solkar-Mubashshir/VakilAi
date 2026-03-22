const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');
const groq = require('../config/groq');

const buildEnglishPrompt = (docText, docType) => `
You are VakilAI, an expert Indian legal document analyzer.
Analyze the following ${docType.replace('_', ' ')} and respond ONLY with valid JSON (no markdown, no explanation outside JSON).

Document Text:
"""
${docText.slice(0, 6000)}
"""

Return this exact JSON structure:
{
  "summary": "Plain English summary in 3-5 sentences that any common person can understand",
  "keyPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "clauses": [
    {
      "text": "brief description of the clause",
      "risk": "safe | risky | neutral",
      "reason": "why this clause is safe/risky/neutral"
    }
  ],
  "riskScore": <number 0-100>,
  "docType": "<detected document type>"
}

Rules:
- Flag clauses as risky if they: allow sudden termination, impose heavy penalties, waive legal rights, have vague language
- Flag clauses as safe if they: protect tenant/employee rights, have clear timelines, follow Indian law
- Keep all text in simple, conversational English
- Identify at least 3-5 important clauses
`;

const buildHindiPrompt = (docText, docType) => `
Aap VakilAI hain, ek expert Indian legal document analyzer.
Neeche diye gaye ${docType.replace('_', ' ')} ko analyze karein aur SIRF valid JSON mein jawab dein.

Document Text:
"""
${docText.slice(0, 6000)}
"""

Yeh exact JSON structure return karein:
{
  "summary": "Saral Hindi mein 3-5 sentence ka summary",
  "keyPoints": ["mukhya baat 1", "mukhya baat 2", "mukhya baat 3"],
  "clauses": [
    {
      "text": "clause ka description Hindi mein",
      "risk": "safe | risky | neutral",
      "reason": "kyon yeh clause safe/risky/neutral hai"
    }
  ],
  "riskScore": <0-100 number>,
  "docType": "<detected document type>"
}
`;

const analyzeDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.documentId, user: req.user._id });
  if (!document) { res.status(404); throw new Error('Document not found'); }
  if (!document.rawText || document.rawText.trim().length < 50) {
    res.status(400); throw new Error('Document text too short or could not be extracted');
  }
  document.status = 'processing';
  await document.save();

  const language = req.body.language || req.user.language || 'english';
  const prompt = language === 'hindi'
    ? buildHindiPrompt(document.rawText, document.docType)
    : buildEnglishPrompt(document.rawText, document.docType);

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2048,
    });
    const raw = completion.choices[0]?.message?.content || '';
    const jsonString = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonString);
    document.analysis = {
      summary:   parsed.summary || '',
      keyPoints: parsed.keyPoints || [],
      clauses:   parsed.clauses || [],
      riskScore: parsed.riskScore || 0,
      language,
    };
    document.status = 'completed';
    await document.save();
    res.json({ success: true, analysis: document.analysis, documentId: document._id });
  } catch (err) {
    document.status = 'failed';
    await document.save();
    res.status(500); throw new Error(`AI analysis failed: ${err.message}`);
  }
});

const getAnalysis = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.documentId, user: req.user._id,
  }).select('analysis status originalName docType');
  if (!document) { res.status(404); throw new Error('Document not found'); }
  res.json({ success: true, status: document.status, analysis: document.analysis, document });
});

const translateAnalysis = asyncHandler(async (req, res) => {
  const { language } = req.body;
  if (!['english', 'hindi'].includes(language)) {
    res.status(400); throw new Error('Language must be english or hindi');
  }
  req.body.language = language;
  return analyzeDocument(req, res);
});

module.exports = { analyzeDocument, getAnalysis, translateAnalysis };