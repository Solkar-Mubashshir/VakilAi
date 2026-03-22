import { useState, useCallback } from 'react';

const useVoice = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text, language = 'english') => {
    if (!window.speechSynthesis) { alert('Voice not supported in your browser'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang   = language === 'hindi' ? 'hi-IN' : 'en-IN';
    utterance.rate   = 0.9;
    utterance.pitch  = 1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const langCode = language === 'hindi' ? 'hi' : 'en';
    const preferred = voices.find(v => v.lang.startsWith(langCode) && v.lang.includes('IN'))
      || voices.find(v => v.lang.startsWith(langCode)) || null;
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
};

export default useVoice;