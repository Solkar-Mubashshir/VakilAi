import React from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import useVoice from '../../hooks/useVoice';

const VoiceButton = ({ text, language = 'english' }) => {
  const { speak, stop, speaking } = useVoice();
  const handleClick = () => speaking ? stop() : speak(text, language);
  return (
    <button className={`voice-btn ${speaking ? 'speaking' : ''}`} onClick={handleClick}>
      {speaking ? <StopIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
      {speaking ? 'Stop' : '🔊 Listen'}
    </button>
  );
};

export default VoiceButton;