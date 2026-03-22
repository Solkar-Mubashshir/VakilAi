import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Container, Box, Typography, TextField,
  Button, InputAdornment, IconButton, CircularProgress,
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

const LoginPage = () => {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/upload');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', bgcolor: 'var(--cream)' }}>
      <Container maxWidth="xs">
        <Box className="vk-card fade-in-up" sx={{ p: { xs: 3, sm: 4 } }}>

          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box sx={{ display: 'inline-flex', bgcolor: 'rgba(201,168,76,0.12)', p: 1.5, borderRadius: 3, mb: 2 }}>
              <GavelIcon sx={{ color: 'var(--gold)', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--navy)', mb: 0.5, fontSize: '1.7rem' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
              Sign in to your VakilAI account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email Address" name="email" type="email"
              value={form.email} onChange={handleChange}
              fullWidth required autoFocus sx={fieldSx}
            />
            <TextField
              label="Password" name="password"
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
            <Button
              type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ mt: 1, py: 1.4, bgcolor: 'var(--navy)', color: 'white', fontWeight: 700, fontSize: '1rem', '&:hover': { bgcolor: 'var(--navy-mid)' } }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'var(--slate)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>
              Create one free
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;