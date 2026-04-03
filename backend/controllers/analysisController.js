const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');
const groq = require('../config/groq');

/* =========================
   🔥 ENGLISH PROMPT (BEST)
========================= */
const buildEnglishPrompt = (docText, docType) => `
You are VakilAI, a highly experienced Indian legal expert and document simplifier.

Your goal is to break down complex legal documents into clear, practical, and trustworthy insights for a normal Indian citizen with no legal background.

If the output is incomplete or too short, regenerate internally before responding.

Analyze the following ${docType.replace('_', ' ')} and return ONLY valid JSON.

Document Text:
"""
${docText.slice(0, 6000)}
"""

Return this exact JSON structure:
{
  "summary": "Clear, detailed explanation in 4-6 sentences explaining what this document means, who it affects, and any important risks",
  "keyPoints": ["important point 1", "important point 2", "important point 3", "important point 4", "important point 5"],
  "clauses": [
    {
      "text": "simple explanation of the clause in plain English",
      "risk": "safe | risky | neutral",
      "reason": "why this clause is safe/risky/neutral in practical terms"
    }
  ],
  "redFlags": ["specific serious issue 1", "specific serious issue 2"],
  "riskScore": <number between 0-100>,
  "advice": "clear, practical, India-specific advice on what the user should do next",
  "docType": "<detected document type>"
}

STRICT QUALITY RULES:
- Summary MUST be 4-6 sentences and include purpose + impact + risks
- Use very simple conversational English
- Identify at least 6-8 meaningful clauses
- Each clause explanation must be clear (1-2 sentences)
- Mark risky if: sudden termination, heavy penalties, vague, one-sided, removes rights
- Mark safe if: protects user or is fair/legal
- Red flags: only top 2-4 serious issues
- Risk score:
  0-30 = low
  31-70 = medium
  71-100 = high
- Advice must be actionable
- Use Indian legal context where relevant
- Do NOT give vague answers
- Do NOT shorten output
- Output ONLY JSON
`;

/* =========================
   🇮🇳 HINDI PROMPT (BEST)
========================= */
const buildHindiPrompt = (docText, docType) => `
Aap VakilAI hain, ek experienced Indian legal expert.

Aapka kaam hai mushkil legal documents ko ek aam insaan ke liye simple aur clear banana.

Agar output chhota ya incomplete ho, toh internally regenerate karein.

Neeche diye gaye ${docType.replace('_', ' ')} ko analyze karein aur SIRF valid JSON mein jawab dein.

Document Text:
"""
${docText.slice(0, 6000)}
"""

Yeh exact JSON structure return karein:
{
  "summary": "4-6 sentence ka clear explanation jisme document ka purpose, impact aur risk samjhaya ho",
  "keyPoints": ["important baat 1", "important baat 2", "important baat 3", "important baat 4", "important baat 5"],
  "clauses": [
    {
      "text": "yeh clause simple Hindi/Hinglish mein kya kehta hai",
      "risk": "safe | risky | neutral",
      "reason": "yeh safe/risky/neutral kyu hai (simple explanation)"
    }
  ],
  "redFlags": ["serious problem 1", "serious problem 2"],
  "riskScore": <0-100 number>,
  "advice": "user ko kya karna chahiye (practical salah)",
  "docType": "<detected document type>"
}

SAKHT NIYAM:
- Summary 4-6 sentence ka hona chahiye
- Simple Hindi ya Hinglish use karein
- Kam se kam 6-8 important clauses identify karein
- Har clause clear ho (1-2 sentence)
- Risky agar: penalty zyada, rights kam, vague, one-sided, sudden end
- Safe agar: fair ho ya user ko protect kare
- Sirf 2-4 strong red flags
- Risk score:
  0-30 = low
  31-70 = medium
  71-100 = high
- Advice actionable ho
- Indian kanoon ka context use karein
- Vague answer NA dein
- Output short NA karein
- Output ONLY JSON
`;

/* =========================
   📊 ANALYZE DOCUMENT
========================= */
const analyzeDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.documentId,
    user: req.user._id,
  });

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  if (!document.rawText || document.rawText.trim().length < 50) {
    res.status(400);
    throw new Error('Document text too short or could not be extracted');
  }

  document.status = 'processing';
  await document.save();

  const language = req.body.language || req.user.language || 'english';

  const prompt =
    language === 'hindi'
      ? buildHindiPrompt(document.rawText, document.docType)
      : buildEnglishPrompt(document.rawText, document.docType);

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,        // 🔥 more consistent output
      max_tokens: 2500,        // 🔥 prevent cut-off
    });

    const raw = completion.choices[0]?.message?.content || '';

    const jsonString = raw
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      document.status = 'failed';
      await document.save();
      res.status(500);
      throw new Error('AI returned invalid JSON. Please retry.');
    }

    document.analysis = {
      summary: parsed.summary || '',
      keyPoints: parsed.keyPoints || [],
      clauses: parsed.clauses || [],
      redFlags: parsed.redFlags || [],
      advice: parsed.advice || '',
      riskScore: parsed.riskScore || 0,
      language,
    };

    document.status = 'completed';
    await document.save();

    res.json({
      success: true,
      analysis: document.analysis,
      documentId: document._id,
    });

  } catch (err) {
    document.status = 'failed';
    await document.save();
    res.status(500);
    throw new Error(`AI analysis failed: ${err.message}`);
  }
});

/* =========================
   📥 GET ANALYSIS
========================= */
const getAnalysis = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.documentId,
    user: req.user._id,
  }).select('analysis status originalName docType');

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  res.json({
    success: true,
    status: document.status,
    analysis: document.analysis,
    document,
  });
});

/* =========================
   🌐 TRANSLATE ANALYSIS
========================= */
const translateAnalysis = asyncHandler(async (req, res) => {
  const { language } = req.body;

  if (!['english', 'hindi'].includes(language)) {
    res.status(400);
    throw new Error('Language must be english or hindi');
  }

  req.body.language = language;
  return analyzeDocument(req, res);
});

module.exports = {
  analyzeDocument,
  getAnalysis,
  translateAnalysis,
};