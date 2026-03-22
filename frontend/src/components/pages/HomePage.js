import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, Chip } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ShieldIcon from '@mui/icons-material/Shield';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TranslateIcon from '@mui/icons-material/Translate';
import BoltIcon from '@mui/icons-material/Bolt';

const features = [
  { icon: <UploadFileIcon />, title: 'Upload Any Legal Doc',  desc: 'Rent agreements, FIRs, court notices, NDAs — just drag and drop your PDF.' },
  { icon: <ShieldIcon />,     title: 'Clause Risk Flags',     desc: 'Every clause analyzed and color-coded — 🔴 Risky, 🟢 Safe, 🔵 Neutral.' },
  { icon: <VolumeUpIcon />,   title: 'Voice Explanation 🔊',  desc: 'Unique feature: AI reads your document summary aloud in Hindi or English.' },
  { icon: <TranslateIcon />,  title: 'Hindi & English',       desc: 'Switch between English and Hindi explanations with one click.' },
  { icon: <WarningAmberIcon />, title: 'Plain Language',      desc: 'No legal jargon. Summary written like your best friend explaining it.' },
  { icon: <BoltIcon />,       title: 'Powered by Groq',       desc: 'LLaMA 3 via Groq gives sub-3 second analysis — the fastest AI available.' },
];

const stats = [
  { val: '70%', label: "Indians can't read legal docs" },
  { val: '₹0',  label: 'Cost to use VakilAI' },
  { val: '<3s', label: 'Analysis time with Groq' },
  { val: '22+', label: 'Indian languages (TTS)' },
];

const HomePage = () => {
  return (
    <Box>

      {/* ── Hero ── */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="⚖️  Legal AI for Every Indian"
                sx={{ bgcolor: 'rgba(201,168,76,0.18)', color: 'var(--gold)', fontWeight: 600, mb: 2.5, fontSize: '0.8rem' }}
              />
              <Typography
                variant="h1"
                className="fade-in-up"
                sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, fontWeight: 800, color: 'white', lineHeight: 1.18, mb: 2 }}
              >
                Understand Your
                <Box component="span" sx={{ color: 'var(--gold)', display: 'block' }}>
                  Legal Documents
                </Box>
                Instantly
              </Typography>
              <Typography
                variant="body1"
                className="fade-in-up delay-1"
                sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', mb: 3.5, maxWidth: 500 }}
              >
                Upload any legal document — rent deed, FIR, court notice — and VakilAI explains
                it in plain English or Hindi, flags risky clauses, and reads it aloud for you.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }} className="fade-in-up delay-2">
                <Button
                  component={Link} to="/register"
                  variant="contained" size="large" startIcon={<GavelIcon />}
                  sx={{ bgcolor: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, px: 3.5, py: 1.4, fontSize: '1rem', '&:hover': { bgcolor: 'var(--gold-lt)' } }}
                >
                  Try VakilAI Free
                </Button>
                <Button
                  component={Link} to="/login"
                  variant="outlined" size="large"
                  sx={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', px: 3, py: 1.4, '&:hover': { borderColor: 'var(--gold)', color: 'var(--gold)' } }}
                >
                  Login
                </Button>
              </Box>
            </Grid>

            {/* Mock UI Preview */}
            <Grid item xs={12} md={5} className="fade-in-up delay-3">
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 4, p: 3,
              }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {['#C0392B','#F39C12','#27AE60'].map((c) => (
                    <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
                  ))}
                </Box>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, p: 2, mb: 2, border: '1px dashed rgba(201,168,76,0.4)', textAlign: 'center' }}>
                  <UploadFileIcon sx={{ color: 'var(--gold)', fontSize: 36, mb: 1 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Drop your legal document here
                  </Typography>
                </Box>
                {[
                  { color: '#FDEDED', border: '#C0392B', text: '🔴 RISK: Landlord can terminate with 7 days notice' },
                  { color: '#EDF7F1', border: '#1A7A4A', text: '🟢 SAFE: Security deposit refund within 30 days' },
                ].map((item, i) => (
                  <Box key={i} sx={{ bgcolor: item.color, border: `1px solid ${item.border}`, borderRadius: 1.5, p: 1.5, mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: item.border }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 2, bgcolor: 'var(--gold)', borderRadius: 50, py: 1, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--navy)' }}>
                    🔊 Listen in Hindi
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Stats Bar ── */}
      <Box sx={{ bgcolor: 'var(--navy)', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {stats.map((s, i) => (
              <Grid item xs={6} md={3} key={i} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: 'var(--gold)', fontWeight: 800, fontSize: '2.2rem' }}>
                  {s.val}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontSize: '0.85rem' }}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Features ── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.5rem' }, fontWeight: 800, color: 'var(--navy)', mb: 1.5 }}>
            Everything You Need to Know Your Rights
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--slate)', maxWidth: 560, mx: 'auto' }}>
            VakilAI is built for real Indians — not lawyers. Simple, fast, and free.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                className="vk-card fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
                sx={{ height: '100%' }}
              >
                <Box sx={{
                  width: 52, height: 52, borderRadius: 2.5,
                  bgcolor: 'rgba(201,168,76,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)', mb: 2,
                }}>
                  {f.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 1, fontFamily: 'var(--font-head)', fontSize: '1.1rem' }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--slate)', lineHeight: 1.7 }}>
                  {f.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── CTA Banner ── */}
      <Box sx={{ bgcolor: 'var(--navy)', py: 8, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <GavelIcon sx={{ color: 'var(--gold)', fontSize: 48, mb: 2 }} />
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, fontSize: '2rem', mb: 1.5 }}>
            Every Indian Deserves to Understand Their Rights.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', mb: 3.5 }}>
            Join thousands already using VakilAI to stay protected.
          </Typography>
          <Button
            component={Link} to="/register"
            variant="contained" size="large"
            sx={{ bgcolor: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, px: 5, py: 1.5, fontSize: '1.05rem', '&:hover': { bgcolor: 'var(--gold-lt)' } }}
          >
            Get Started — It's Free
          </Button>
        </Container>
      </Box>

    </Box>
  );
};

export default HomePage;