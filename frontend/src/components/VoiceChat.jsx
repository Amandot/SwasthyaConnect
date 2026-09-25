import { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Mic, Square, Volume2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US'); // Default English
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef(null);
  const langRef = useRef(selectedLang);

  useEffect(() => {
    langRef.current = selectedLang;
  }, [selectedLang]);

  // Supported languages
  const languages = [
    { code: 'en-US', label: 'English' },
    { code: 'hi-IN', label: 'Hindi (हिंदी)' },
    { code: 'bn-IN', label: 'Bengali (বাংলা)' },
    { code: 'ta-IN', label: 'Tamil (தமிழ்)' },
    { code: 'te-IN', label: 'Telugu (తెలుగు)' },
    { code: 'mr-IN', label: 'Marathi (मराठी)' },
    { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' }
  ];

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        
        // Auto-submit after 2 seconds of silence
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
          setIsListening(false);
          if (currentTranscript.trim()) {
            processVoiceChat(currentTranscript, langRef.current);
          }
        }, 2000);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}. Please check your permissions.`);
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };
    } else {
      setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    // Wake up speech synthesis on user interaction to bypass browser restrictions
    if (synthRef.current && !isListening) {
        const wakeUp = new SpeechSynthesisUtterance('');
        wakeUp.volume = 0;
        synthRef.current.speak(wakeUp);
    }
    
    setError('');
    setAiResponse('');
    
    if (isListening) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current.stop();
      setIsListening(false);
      // We don't auto-submit here manually anymore to avoid double submission, 
      // since the manual stop will trigger onend. But if they manually stop, 
      // we still want to submit what they said immediately.
      // Wait, if we submit here, the silence timeout might have already submitted it?
      // Clearing the timeout above prevents double submission.
      if (transcript.trim()) {
        processVoiceChat(transcript, selectedLang);
      }
    } else {
      synthRef.current.cancel();
      setTranscript('');
      try {
        recognitionRef.current.lang = selectedLang; // Set the explicitly selected language
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const processVoiceChat = async (message, langCode) => {
    setIsProcessing(true);
    const langLabel = languages.find(l => l.code === langCode)?.label || 'English';
    try {
      // Pass the explicit language to the backend so it knows exactly what to reply in
      const response = await aiAPI.voiceChat(message + `\n[Context: Please reply in ${langLabel} language]`);
      const reply = response.data.reply;
      setAiResponse(reply);
      speakText(reply, langCode);
    } catch (err) {
      console.error(err);
      
      // Provide a graceful fallback if the AI key is invalid or API fails (like SymptomChecker does)
      let fallbackReply = "I am currently in demo mode. Based on what you said, please ensure you rest and stay hydrated. Consult a doctor if symptoms persist.";
      
      if (langCode === 'hi-IN') {
        fallbackReply = "मैं अभी डेमो मोड में हूँ। कृपया आराम करें और खूब पानी पिएं। यदि लक्षण बने रहते हैं तो डॉक्टर से सलाह लें।";
      } else if (langCode === 'bn-IN') {
        fallbackReply = "আমি এখন ডেমো মোডে আছি। অনুগ্রহ করে বিশ্রাম নিন এবং প্রচুর জল পান করুন।";
      } else if (langCode === 'ta-IN') {
        fallbackReply = "நான் தற்போது டெமோ பயன்முறையில் உள்ளேன். ஓய்வெடுக்கவும், நிறைய தண்ணீர் குடிக்கவும்.";
      }
      
      setAiResponse(fallbackReply);
      speakText(fallbackReply, langCode);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text, langCode) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // cancel current
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (langCode) {
      utterance.lang = langCode;
      
      // Explicitly try to find a matching voice to prevent silent failures
      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
        // 1. Try exact match (e.g. hi-IN)
        let targetVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase());
        
        // 2. Try prefix match (e.g. hi)
        if (!targetVoice) {
          const prefix = langCode.split('-')[0].toLowerCase();
          targetVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
        }
        
        if (targetVoice) {
          utterance.voice = targetVoice;
        }
      }
    }
    
    utterance.rate = 0.95; // slightly slower for better comprehension
    synthRef.current.speak(utterance);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-8 border-slate-200/60 dark:border-slate-700/60 shadow-premium flex flex-col items-center justify-center min-h-[400px] text-center relative overflow-hidden">
        
        {/* Background Animation */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.15 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
              className="absolute inset-0 bg-primary-500 rounded-full blur-3xl z-0 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Voice Assistant</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Select your language, tap the microphone to speak, and tap again to send.
          </p>

          <div className="mb-8 z-20">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              disabled={isListening || isProcessing}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-shadow disabled:opacity-50 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
              isListening 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/40 animate-pulse" 
                : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            {isListening ? <Square className="w-8 h-8" /> : <Mic className="w-10 h-10" />}
          </button>

          <div className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            {isListening ? "Listening..." : isProcessing ? "AI is thinking..." : "Tap to speak"}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm w-full border border-red-100 dark:border-red-800 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-left">{error}</span>
              </motion.div>
            )}

            {(transcript || aiResponse) && !error && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mt-8 w-full space-y-4"
              >
                {transcript && (
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl rounded-tr-sm text-left max-w-[85%] ml-auto border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{transcript}</p>
                  </div>
                )}
                
                {isProcessing && (
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl rounded-tl-sm w-max border border-primary-100 dark:border-primary-900/40">
                    <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                  </div>
                )}

                {aiResponse && (
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl rounded-tl-sm text-left max-w-[90%] border border-primary-100 dark:border-primary-900/40 relative group">
                    <p className="text-primary-900 dark:text-primary-100 text-sm leading-relaxed">{aiResponse}</p>
                    <button 
                      onClick={() => speakText(aiResponse, selectedLang)}
                      className="absolute -right-2 -top-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-primary-600 hover:text-primary-700 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Replay Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
