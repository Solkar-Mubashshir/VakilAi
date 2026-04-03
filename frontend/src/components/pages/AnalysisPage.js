import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentById, translateAnalysis } from '../../services/documentService';
import { toast } from 'react-toastify';
import {
  Container, Box, Typography, Grid, Button,
  Tabs, Tab, ToggleButton, ToggleButtonGroup,
  Chip, Divider, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelIcon from '@mui/icons-material/Gavel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RiskMeter from '../common/RiskMeter';
import ClauseCard from '../common/ClauseCard';
import VoiceButton from '../common/VoiceButton';

const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState(0);
  const [language, setLanguage]     = useState('english');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDocumentById(id);
        setDoc(data.document);
        setLanguage(data.document.analysis?.language || 'english');
      } catch (err) {
        toast.error(err.message);
        navigate('/documents');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleTranslate = async (lang) => {
    if (lang === language || translating) return;
    setTranslating(true);
    try {
      await translateAnalysis(id, lang);
      const data = await getDocumentById(id);
      setDoc(data.document);
      setLanguage(lang);
      toast.success(`Switched to ${lang === 'hindi' ? 'Hindi' : 'English'}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTranslating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <div className="vk-spinner" style={{ margin: '0 auto 16px' }} />
          <Typography sx={{ color: 'var(--slate)' }}>Loading analysis...</Typography>
        </Box>
      </Box>
    );
  }

  if (!doc) return null;

  const analysis       = doc.analysis || {};
  const clauses        = analysis.clauses || [];
  const redFlags       = analysis.redFlags || [];      // NEW
  const riskyClauses   = clauses.filter(c => c.risk === 'risky');
  const safeClauses    = clauses.filter(c => c.risk === 'safe');
  const neutralClauses = clauses.filter(c => c.risk === 'neutral');

  const voiceText = `
    Document: ${doc.originalName}.
    Summary: ${analysis.summary || 'No summary available'}.
    Key Points: ${(analysis.keyPoints || []).join('. ')}.
    Risk Score: ${analysis.riskScore || 0} out of 100.
    There are ${riskyClauses.length} risky clauses and ${safeClauses.length} safe clauses.
    ${redFlags.length > 0 ? `Red Flags: ${redFlags.join('. ')}.` : ''}
    ${analysis.advice ? `Advice: ${analysis.advice}` : ''}
  `;

  return (
    <Box sx={{ bgcolor: 'var(--cream)', minHeight: '90vh', pb: 6 }}>

      {/* Top Bar */}
      <Box sx={{ bgcolor: 'var(--navy)', py: 3 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/documents')}
            sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, '&:hover': { color: 'var(--gold)' } }}
          >
            Back to Documents
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mb: 0.5, fontSize: { xs: '1.4rem', md: '1.9rem' } }}>
                <GavelIcon sx={{ mr: 1, color: 'var(--gold)', verticalAlign: 'middle' }} />
                {doc.originalName}
              </Typography>
              <Chip
                label={doc.status === 'completed' ? '✅ Analysis Complete' : doc.status}
                size="small"
                sx={{ bgcolor: doc.status === 'completed' ? 'rgba(26,122,74,0.25)' : 'rgba(201,168,76,0.2)', color: doc.status === 'completed' ? '#7FDBA8' : 'var(--gold)' }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <ToggleButtonGroup
                value={language} exclusive size="small"
                onChange={(_, v) => v && handleTranslate(v)}
                disabled={translating}
              >
                <ToggleButton value="english" sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)', '&.Mui-selected': { bgcolor: 'var(--gold)', color: 'var(--navy)' } }}>
                  English
                </ToggleButton>
                <ToggleButton value="hindi" sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)', '&.Mui-selected': { bgcolor: 'var(--gold)', color: 'var(--navy)' } }}>
                  हिन्दी
                </ToggleButton>
              </ToggleButtonGroup>
              {translating && (
                <Typography variant="caption" sx={{ color: 'var(--gold)' }}>Translating...</Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>

        {doc.status === 'failed' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Analysis failed. The document may be unreadable or text could not be extracted.
          </Alert>
        )}

        {doc.status === 'completed' && (
          <Grid container spacing={3}>

            {/* ── Left: Main Content ── */}
            <Grid item xs={12} md={8}>

              {/* Summary */}
              <Box className="vk-card fade-in-up" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-head)' }}>
                    📋 Plain Language Summary
                  </Typography>
                  <VoiceButton text={voiceText} language={language} />
                </Box>
                <Typography variant="body1" sx={{ color: 'var(--slate)', lineHeight: 1.8 }}>
                  {analysis.summary || 'No summary available.'}
                </Typography>
              </Box>

              {/* Key Points */}
              {analysis.keyPoints?.length > 0 && (
                <Box className="vk-card fade-in-up delay-1" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 2, fontFamily: 'var(--font-head)' }}>
                    📌 Key Points
                  </Typography>
                  {analysis.keyPoints.map((point, i) => (
                    <div key={i} className="key-point">
                      <div className="key-point-dot" />
                      <Typography variant="body2" sx={{ color: 'var(--slate)', lineHeight: 1.7 }}>
                        {point}
                      </Typography>
                    </div>
                  ))}
                </Box>
              )}

              {/* 🚨 NEW: Red Flags */}
              {redFlags.length > 0 && (
                <Box className="vk-card fade-in-up delay-2" sx={{ mb: 3, border: '1px solid #FECACA', bgcolor: '#FFF5F5' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#B91C1C', mb: 2, fontFamily: 'var(--font-head)' }}>
                    🚨 Red Flags
                  </Typography>
                  {redFlags.map((flag, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                      <Typography sx={{ color: '#EF4444', fontSize: '1rem', mt: 0.2 }}>⚠️</Typography>
                      <Typography variant="body2" sx={{ color: '#7F1D1D', lineHeight: 1.7, fontWeight: 500 }}>
                        {flag}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* 💡 NEW: Advice */}
              {analysis.advice && (
                <Box className="vk-card fade-in-up delay-2" sx={{ mb: 3, border: '1px solid #BBF7D0', bgcolor: '#F0FDF4' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--green)', mb: 1.5, fontFamily: 'var(--font-head)' }}>
                    💡 {language === 'hindi' ? 'VakilAI की सलाह' : 'VakilAI Advice'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#14532D', lineHeight: 1.8 }}>
                    {analysis.advice}
                  </Typography>
                </Box>
              )}

              {/* Clauses */}
              {clauses.length > 0 && (
                <Box className="vk-card fade-in-up delay-2">
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 2, fontFamily: 'var(--font-head)' }}>
                    ⚖️ Clause Analysis
                  </Typography>
                  <Tabs
                    value={tab} onChange={(_, v) => setTab(v)}
                    sx={{
                      mb: 2,
                      '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 'auto', px: 2 },
                      '& .Mui-selected': { color: 'var(--navy) !important' },
                      '& .MuiTabs-indicator': { bgcolor: 'var(--gold)' },
                    }}
                  >
                    <Tab label={`All (${clauses.length})`} />
                    <Tab label={`🔴 Risky (${riskyClauses.length})`} />
                    <Tab label={`🟢 Safe (${safeClauses.length})`} />
                    <Tab label={`🔵 Neutral (${neutralClauses.length})`} />
                  </Tabs>
                  {(tab === 0 ? clauses : tab === 1 ? riskyClauses : tab === 2 ? safeClauses : neutralClauses)
                    .map((clause, i) => <ClauseCard key={i} clause={clause} index={i} />)
                  }
                  {tab === 1 && riskyClauses.length === 0 && (
                    <Typography variant="body2" sx={{ color: 'var(--green)', textAlign: 'center', py: 3 }}>
                      🎉 No risky clauses found!
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>

            {/* ── Right: Risk Sidebar ── */}
            <Grid item xs={12} md={4}>
              <Box className="vk-card fade-in-up delay-1" sx={{ position: 'sticky', top: 80 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 2.5, fontFamily: 'var(--font-head)' }}>
                  📊 Risk Summary
                </Typography>

                <RiskMeter score={analysis.riskScore || 0} />
                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { label: '🔴 Risky Clauses',   count: riskyClauses.length,   bg: '#FDEDED', color: 'var(--red)' },
                    { label: '🟢 Safe Clauses',    count: safeClauses.length,    bg: '#EDF7F1', color: 'var(--green)' },
                    { label: '🔵 Neutral Clauses', count: neutralClauses.length, bg: '#EEF2FF', color: '#4338CA' },
                    // NEW
                    { label: '🚨 Red Flags',       count: redFlags.length,       bg: '#FFF5F5', color: '#B91C1C' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.25, bgcolor: item.bg, borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: item.color }}>{item.label}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: item.color }}>{item.count}</Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'var(--slate)', mb: 1.5, fontWeight: 500 }}>
                    🔊 Listen to Summary
                  </Typography>
                  <VoiceButton text={analysis.summary || ''} language={language} />
                  <Typography variant="caption" sx={{ display: 'block', color: 'var(--muted)', mt: 1 }}>
                    Works in Hindi & English
                  </Typography>
                </Box>

                {analysis.riskScore > 60 && (
                  <>
                    <Divider sx={{ my: 2.5 }} />
                    <Alert severity="warning" icon={<ErrorOutlineIcon fontSize="small" />} sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
                      <strong>High Risk Document</strong><br />
                      Consider consulting a lawyer before signing.
                    </Alert>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AnalysisPage;