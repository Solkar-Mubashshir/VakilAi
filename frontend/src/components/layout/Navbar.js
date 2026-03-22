import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Avatar, Chip, Tooltip } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => { logout(); navigate('/login'); setAnchorEl(null); };
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'var(--navy)', boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}>
          <GavelIcon sx={{ color: 'var(--gold)', fontSize: 28 }} />
          <Box sx={{ fontFamily: 'var(--font-head)', fontSize: '1.55rem', fontWeight: 700, color: 'var(--gold)' }}>VakilAI</Box>
          <Chip label="Beta" size="small" sx={{ bgcolor: 'rgba(201,168,76,0.15)', color: 'var(--gold)', fontSize: '0.65rem', height: 20, ml: 0.5 }} />
        </Box>

        {user && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
            <Button component={Link} to="/upload" startIcon={<UploadFileIcon />}
              sx={{ color: isActive('/upload') ? 'var(--gold)' : 'rgba(255,255,255,0.8)', '&:hover': { color: 'var(--gold)' } }}>
              Upload
            </Button>
            <Button component={Link} to="/documents" startIcon={<DescriptionIcon />}
              sx={{ color: isActive('/documents') ? 'var(--gold)' : 'rgba(255,255,255,0.8)', '&:hover': { color: 'var(--gold)' } }}>
              My Documents
            </Button>
          </Box>
        )}

        {user ? (
          <>
            <Tooltip title={user.name}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar sx={{ bgcolor: 'var(--gold)', color: 'var(--navy)', width: 36, height: 36, fontWeight: 700 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 2 } }}>
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Box>
                  <Box sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{user.email}</Box>
                </Box>
              </MenuItem>
              <MenuItem component={Link} to="/documents" onClick={() => setAnchorEl(null)}>
                <DescriptionIcon fontSize="small" sx={{ mr: 1 }} /> My Documents
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'var(--red)' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/login" sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'var(--gold)' } }}>Login</Button>
            <Button component={Link} to="/register" variant="contained"
              sx={{ bgcolor: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, '&:hover': { bgcolor: 'var(--gold-lt)' } }}>
              Get Started
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;