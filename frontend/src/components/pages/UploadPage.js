import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import { uploadDocument, analyzeDocument } from '../../services/documentService';
import { toast } from 'react-toastify';
import {
  Container, Box, Typography, Button, Grid,
  MenuItem, Select, FormControl, InputLabel,
  LinearProgress, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import GavelIcon from '@mui/icons-material/Gavel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const DOC_TYPES = [
  { value: 'rent_agreement', label: '🏠 Rent Agreement' },
  { value: 'fir',            label: '🚔 FIR (First Information Report)' },
  { value: 'court_notice',   label: '⚖️ Court Notice' },
  { value: 'employment',     label: '💼 Employment Contract' },
  { value: 'nda',            label: '🔒 NDA / Confidentiality Agreement' },
  { value: 'other',          label: '📄 Other Legal Document' },
];

const UploadPage = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [file, setFile]         = useState(null);
  const [docType, setDocType]   = useState('other');
  const [language, setLanguage] = useState(user?.language || 'english');
  const [step, setStep]         = useState('idle');
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length) { toast.error('Only PDF or image files are accepted'); return; }
    setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg','.jpeg'], 'image/png': ['.png'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a document first'); return; }
    try {
      setStep('uploading'); setProgress(20);
      const uploadRes  = await uploadDocument(file, docType);
      const documentId = uploadRes.document._id;
      setProgress(50);
      setStep('analyzing'); setProgress(70);
      await analyzeDocument(documentId, language);
      setProgress(100); setStep('done');
      toast.success('Analysis complete! 🎉');
      setTimeout(() => navigate(`/documents/${documentId}`), 800);
    } catch (err) {
      toast.error(err.message);
      setStep('idle'); setProgress(0);
    }
  };

  const isProcessing = step === 'uploading' || step === 'analyzing';

  return (
    <Box sx={{ bgcolor: 'var(--cream)', minHeight: '90vh', py: 5 }}>
      <Container maxWidth="md">

        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--navy)', mb: 1, fontSize: { xs: '1.8rem', md: '2.3rem' } }}>
            <GavelIcon sx={{ mr: 1.5, color: 'var(--gold)', verticalAlign: 'middle', fontSize: 32 }} />
            Analyze a Legal Document
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--slate)' }}>
            Upload your PDF — VakilAI will break it down in plain language.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left: Upload + Settings */}
          <Grid item xs={12} md={7}>
            <Box className="vk-card">

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 1.5 }}>
                1. Upload Document
              </Typography>

              {!file ? (
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  <UploadFileIcon sx={{ fontSize: 48, color: 'var(--gold)', mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--navy)', mb: 0.5 }}>
                    {isDragActive ? 'Drop it here!' : 'Drag & drop your document'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
                    PDF, JPG, PNG — max 10MB
                  </Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 2, borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                    Browse Files
                  </Button>
                </div>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '2px solid var(--gold)', borderRadius: 2, bgcolor: 'rgba(201,168,76,0.06)' }}>
                  <InsertDriveFileIcon sx={{ color: 'var(--gold)', fontSize: 36 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--muted)' }}>
                      {formatSize(file.size)}
                    </Typography>
                  </Box>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setFile(null)} disabled={isProcessing}>
                    Remove
                  </Button>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 1.5 }}>
                  2. Document Type
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Select document type</InputLabel>
                  <Select value={docType} label="Select document type" onChange={(e) => setDocType(e.target.value)} disabled={isProcessing} sx={{ borderRadius: 2 }}>
                    {DOC_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 1.5 }}>
                  3. Explanation Language
                </Typography>
                <ToggleButtonGroup value={language} exclusive onChange={(_, v) => v && setLanguage(v)} size="small" disabled={isProcessing}>
                  <ToggleButton value="english" sx={{ px: 3, '&.Mui-selected': { bgcolor: 'var(--navy)', color: 'white' } }}>
                    English
                  </ToggleButton>
                  <ToggleButton value="hindi" sx={{ px: 3, '&.Mui-selected': { bgcolor: 'var(--navy)', color: 'white' } }}>
                    हिन्दी
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Grid>

          {/* Right: Action Panel */}
          <Grid item xs={12} md={5}>
            <Box className="vk-card" sx={{ bgcolor: 'var(--navy)', color: 'white' }}>
              <AutoAwesomeIcon sx={{ color: 'var(--gold)', fontSize: 36, mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--gold)', mb: 1, fontFamily: 'var(--font-head)' }}>
                AI Analysis Includes
              </Typography>
              {[
                '📋 Plain language summary',
                '🔴 Risk clause detection',
                '🟢 Safe clause highlights',
                '🔊 Voice explanation',
                '📌 Key points list',
                '📊 Overall risk score',
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.6 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--gold)', flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{item}</Typography>
                </Box>
              ))}

              <Box sx={{ mt: 3 }}>
                {isProcessing && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'var(--gold)', fontWeight: 600 }}>
                      {step === 'uploading' ? '📤 Uploading document...' : '🧠 AI is analyzing...'}
                    </Typography>
                    <LinearProgress
                      variant="determinate" value={progress}
                      sx={{ mt: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: 'var(--gold)' } }}
                    />
                  </Box>
                )}
                <Button
                  fullWidth variant="contained" size="large"
                  onClick={handleAnalyze}
                  disabled={!file || isProcessing || step === 'done'}
                  sx={{
                    py: 1.5, bgcolor: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, fontSize: '1rem',
                    '&:hover': { bgcolor: 'var(--gold-lt)' },
                    '&:disabled': { bgcolor: 'rgba(201,168,76,0.3)', color: 'rgba(255,255,255,0.4)' },
                  }}
                >
                  {isProcessing ? 'Analyzing...' : step === 'done' ? '✅ Done!' : 'Analyze Document'}
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(201,168,76,0.08)', borderRadius: 2, border: '1px solid rgba(201,168,76,0.25)' }}>
              <Typography variant="caption" sx={{ color: 'var(--navy)', fontWeight: 600, display: 'block', mb: 0.5 }}>
                💡 Tips for best results
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--slate)', lineHeight: 1.8, display: 'block' }}>
                • Use a clear PDF for best text extraction<br />
                • Images should be well-lit and not blurry<br />
                • Select the correct document type above
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UploadPage;