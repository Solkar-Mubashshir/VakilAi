import React from 'react';
import { Box, Typography } from '@mui/material';

const RiskMeter = ({ score = 0 }) => {
  const getColor = (s) => s <= 30 ? '#1A7A4A' : s <= 60 ? '#D97706' : '#C0392B';
  const getLabel = (s) => s <= 30 ? 'Low Risk' : s <= 60 ? 'Medium Risk' : 'High Risk';
  const color = getColor(score);
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--slate)' }}>Risk Score</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color }}>
          {score}/100 · {getLabel(score)}
        </Typography>
      </Box>
      <div className="risk-meter">
        <div className="risk-meter-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </Box>
  );
};

export default RiskMeter;