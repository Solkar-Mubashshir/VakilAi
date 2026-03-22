import React, { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ClauseCard = ({ clause, index }) => {
  const [open, setOpen] = useState(false);
  const risk = clause.risk || 'neutral';
  const icons  = { risky: '🔴', safe: '🟢', neutral: '🔵' };
  const labels = { risky: 'RISKY', safe: 'SAFE', neutral: 'NEUTRAL' };
  return (
    <div className={`clause-card ${risk}`}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <span>{icons[risk]}</span>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--navy)' }}>
            Clause {index + 1}: {clause.text}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span className={`badge-${risk}`}>{labels[risk]}</span>
          <IconButton size="small">
            {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={open}>
        <Typography variant="body2" sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.08)', color: 'var(--slate)' }}>
          {clause.reason}
        </Typography>
      </Collapse>
    </div>
  );
};

export default ClauseCard;