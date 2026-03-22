const express = require('express');
const router = express.Router();
const { analyzeDocument, getAnalysis, translateAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:documentId',           protect, analyzeDocument);
router.get('/:documentId',            protect, getAnalysis);
router.post('/:documentId/translate', protect, translateAnalysis);

module.exports = router;