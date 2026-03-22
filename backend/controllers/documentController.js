const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Document = require("../models/Document");

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  const { docType } = req.body;
  let rawText = "";
  if (req.file.mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(req.file.path);
    try {
      const parsed = await pdfParse(dataBuffer, {
        // Prevents crashes on malformed XRef tables
        max: 0,
      });
      rawText = parsed.text || "";
    } catch (pdfErr) {
      console.warn("pdf-parse warning:", pdfErr.message);
      // Still allow upload — analysis will catch empty text later
      rawText = "";
    }
  }
  const document = await Document.create({
    user: req.user._id,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    rawText,
    docType: docType || "other",
    status: "uploaded",
  });
  res.status(201).json({ success: true, document });
});

const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-rawText -analysis.summaryHindi");
  res.json({ success: true, count: documents.length, documents });
});

const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }
  res.json({ success: true, document });
});

const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }
  const filePath = path.join(
    process.env.UPLOAD_PATH || "./uploads",
    document.fileName,
  );
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await document.deleteOne();
  res.json({ success: true, message: "Document deleted" });
});

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
