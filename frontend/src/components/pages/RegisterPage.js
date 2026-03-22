import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Container, Box, Typography, TextField, Button,
  InputAdornment, IconButton, ToggleButton,
  ToggleButtonGroup, CircularProgress,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': { borderColor: 'var(--gold)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--gold)' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--gold)' },
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', language: 'english' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.language);
      toast.success('Account created! Welcome to VakilAI 🎉');
      navigate('/upload');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', bgcolor: 'var(--cream)', py: 4 }}>
      <Container maxWidth="xs">
        <Box className="vk-card fade-in-up" sx={{ p: { xs: 3, sm: 4 } }}>

          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box sx={{ display: 'inline-flex', bgcolor: 'rgba(201,168,76,0.12)', p: 1.5, borderRadius: 3, mb: 2 }}>
              <GavelIcon sx={{ color: 'var(--gold)', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--navy)', mb: 0.5, fontSize: '1.7rem' }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
              Join VakilAI — Free forever
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField label="Full Name"       name="name"     value={form.name}     onChange={handleChange} fullWidth required autoFocus sx={fieldSx} />
            <TextField label="Email Address"   name="email"    type="email" value={form.email}    onChange={handleChange} fullWidth required sx={fieldSx} />
            <TextField
              label="Password (min 6 chars)" name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              fullWidth required sx={fieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" size="small">
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="body2" sx={{ color: 'var(--slate)', mb: 1, fontWeight: 500 }}>
                Preferred Language
              </Typography>
              <ToggleButtonGroup
                value={form.language} exclusive fullWidth size="small"
                onChange={(_, v) => v && setForm({ ...form, language: v })}
              >
                <ToggleButton value="english" sx={{ '&.Mui-selected': { bgcolor: 'var(--navy)', color: 'white' } }}>
                  English
                </ToggleButton>
                <ToggleButton value="hindi" sx={{ '&.Mui-selected': { bgcolor: 'var(--navy)', color: 'white' } }}>
                  हिन्दी
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Button
              type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ mt: 1, py: 1.4, bgcolor: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, fontSize: '1rem', '&:hover': { bgcolor: 'var(--gold-lt)' } }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'var(--slate)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign in</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;