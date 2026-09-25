import { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import {
  AlertCircle,
  Bot,
  Headphones,
  Languages,
  Loader2,
  Mic,
  ShieldCheck,
  Square,
  UserRound,
  Volume2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef(null);
  const langRef = useRef(selectedLang);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    langRef.current = selectedLang;
  }, [selectedLang]);

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
      if (transcript.trim()) {
        processVoiceChat(transcript, selectedLang);
      }
    } else {
      synthRef.current?.cancel();
      setTranscript('');
      try {
        recognitionRef.current.lang = selectedLang;
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
      const response = await aiAPI.voiceChat(message + `\n[Context: Please reply in ${langLabel} language]`);
      const reply = response.data.reply;
      setAiResponse(reply);
      speakText(reply, langCode);
    } catch (err) {
      console.error(err);
      setError('The live voice service is unavailable, so no medical response is shown. Please try again later or use the text option.');
      setAiResponse('');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text, langCode) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (langCode) {
      utterance.lang = langCode;

      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
        let targetVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase());

        if (!targetVoice) {
          const prefix = langCode.split('-')[0].toLowerCase();
          targetVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
        }

        if (targetVoice) {
          utterance.voice = targetVoice;
        }
      }
    }

    utterance.rate = 0.95;
    synthRef.current.speak(utterance);
  };

  const statusLabel = isListening ? 'Listening...' : isProcessing ? 'AI is thinking...' : 'Tap to speak';

  return (
    <motion.section
      className="mx-auto max-w-5xl"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden p-0 shadow-premium">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-h-[520px] flex-col bg-white dark:bg-slate-900/45">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 dark:border-slate-700/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                    <Headphones className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-700 dark:text-primary-300">Voice conversation</p>
                </div>
                <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">Talk in a comfortable way</h2>
                <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Describe what you notice, ask a general question, and listen when the response is ready.</p>
              </div>
              <span className={cn(
                'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold',
                isProcessing
                  ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800/70 dark:bg-primary-900/45 dark:text-primary-300'
                  : isListening
                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800/70 dark:bg-red-950/45 dark:text-red-300'
                    : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              )}>
                <span className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isProcessing ? 'bg-primary-500 motion-safe:animate-pulse' : isListening ? 'bg-red-500 motion-safe:animate-pulse' : 'bg-slate-400'
                )} aria-hidden="true" />
                {isProcessing ? 'Responding' : isListening ? 'Live' : 'Ready'}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-7">
              <div className="flex-1 space-y-5">
                <AnimatePresence mode="wait" initial={false}>
                  {error ? (
                    <motion.div
                      key="voice-error"
                      role="alert"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
                      className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 dark:border-red-800/70 dark:bg-red-950/30 dark:text-red-100"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm dark:bg-slate-900 dark:text-red-300">
                        <AlertCircle className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-extrabold">We could not continue the voice check</h3>
                        <p className="mt-1.5 text-sm leading-6 opacity-80">{error}</p>
                        <p className="mt-2 text-sm leading-6 opacity-80">Check your browser and microphone permissions, then try again, or use the text check in a supported browser.</p>
                      </div>
                    </motion.div>
                  ) : !transcript && !aiResponse && !isProcessing ? (
                    <motion.div
                      key="voice-empty"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex min-h-[285px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/55 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-950/30"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-100 bg-white text-primary-700 shadow-card dark:border-primary-800/70 dark:bg-slate-900 dark:text-primary-300">
                        <Bot className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-lg font-extrabold text-ink dark:text-white">Start with how you are feeling</h3>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">The current exchange appears in this panel while it is open. You can stop listening at any time.</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="voice-conversation"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      {transcript && (
                        <div className="ml-auto max-w-[88%] sm:max-w-[78%]" aria-label="Your message">
                          <div className="mb-1.5 flex items-center justify-end gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <span>You</span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="rounded-2xl rounded-tr-md bg-primary-600 px-4 py-3.5 text-sm leading-6 text-white shadow-[0_14px_30px_-20px_rgba(18,104,177,0.8)] sm:px-5">
                            {transcript}
                          </div>
                        </div>
                      )}

                      {isProcessing && (
                        <div className="max-w-[88%] sm:max-w-[78%]" aria-label="AI assistant is thinking">
                          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            AI assistant
                          </div>
                          <div className="flex w-fit items-center gap-3 rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                            <Loader2 className="h-4 w-4 animate-spin text-primary-600 motion-reduce:animate-none dark:text-primary-300" aria-hidden="true" />
                            Thinking...
                          </div>
                        </div>
                      )}

                      {aiResponse && (
                        <div className="group max-w-[92%] sm:max-w-[86%]" aria-label="AI assistant response">
                          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            AI assistant
                          </div>
                          <div className="relative rounded-2xl rounded-tl-md border border-primary-100 bg-primary-50/75 px-4 py-3.5 text-sm leading-6 text-primary-900 shadow-sm dark:border-primary-800/70 dark:bg-primary-900/30 dark:text-primary-50 sm:px-5">
                            {aiResponse}
                            <button
                              type="button"
                              onClick={() => speakText(aiResponse, selectedLang)}
                              className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-primary-200 bg-white px-2.5 py-1.5 text-xs font-bold text-primary-700 transition duration-200 hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-primary-800 dark:bg-slate-900 dark:text-primary-300 dark:hover:bg-primary-900/50 motion-reduce:transition-none sm:absolute sm:-right-3 sm:-top-3 sm:mt-0 sm:h-9 sm:w-9 sm:justify-center sm:px-0 sm:py-0"
                              title="Replay Audio"
                              aria-label="Replay AI response"
                            >
                              <Volume2 className="h-4 w-4" aria-hidden="true" />
                              <span className="sm:hidden">Replay audio</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-start gap-3 border-t border-slate-100 pt-5 dark:border-slate-700/70">
                <ShieldCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  <strong className="font-bold text-slate-700 dark:text-slate-200">AI-assisted information only.</strong> Voice responses can be incomplete or incorrect and cannot diagnose a condition or replace professional care.
                </p>
              </div>
            </div>
          </div>

          <aside className="border-t border-slate-100 bg-slate-50/75 p-5 dark:border-slate-700/70 dark:bg-slate-950/45 sm:p-7 lg:border-l lg:border-t-0" aria-label="Voice controls">
            <div className="flex h-full flex-col">
              <div>
                <label htmlFor="voice-language" className="flex items-center gap-2 text-sm font-extrabold text-ink dark:text-white">
                  <Languages className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                  Conversation language
                </label>
                <select
                  id="voice-language"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  disabled={isListening || isProcessing}
                  className="mt-3 min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 motion-reduce:transition-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">The same language is used for listening and spoken replies.</p>
              </div>

              <div className="relative flex flex-1 flex-col items-center justify-center py-10">
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute h-48 w-48 rounded-full bg-primary-400/15 blur-xl"
                      initial={reduceMotion ? { opacity: 0.12, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      animate={reduceMotion ? { opacity: 0.12, scale: 1 } : { opacity: 0.45, scale: 1.28 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={reduceMotion ? { duration: 0 } : { repeat: Infinity, duration: 1.5, repeatType: 'reverse', ease: 'easeInOut' }}
                    />
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isProcessing}
                  aria-pressed={isListening}
                  aria-label={isListening ? 'Stop listening and send your message' : 'Start a voice conversation'}
                  className={cn(
                    'relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white text-white shadow-[0_24px_50px_-24px_rgba(18,104,177,0.85)] transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/25 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:h-36 sm:w-36 dark:border-slate-800',
                    isListening ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-primary-600 hover:bg-primary-700'
                  )}
                >
                  {isListening ? <Square className="h-9 w-9 fill-current" aria-hidden="true" /> : <Mic className="h-12 w-12" aria-hidden="true" />}
                </button>

                <div className="relative z-10 mt-6 min-h-12 text-center" role="status" aria-live="polite" aria-atomic="true">
                  <p className="text-base font-extrabold text-ink dark:text-white">{statusLabel}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {isListening ? 'Pause briefly and your message will send automatically.' : isProcessing ? 'Preparing a response in your selected language.' : 'Tap once to start, then tap again to stop and send.'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex items-start gap-3">
                  <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Voice input and audio playback use your browser's speech tools. Headphones can make replies easier to hear.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Card>
    </motion.section>
  );
}
