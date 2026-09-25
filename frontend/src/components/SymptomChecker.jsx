import { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  Info,
  Lightbulb,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const commonSymptoms = [
  'Fever', 'Dry Cough', 'Headache', 'Muscle Ache',
  'Fatigue', 'Nausea', 'Dizziness', 'Sore Throat'
];

export default function SymptomCheckerComponent() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reduceMotion = useReducedMotion();

  const handleAddSymptom = (symptom) => {
    if (symptoms.trim()) {
      if (!symptoms.toLowerCase().includes(symptom.toLowerCase())) {
        setSymptoms(prev => `${prev}, ${symptom}`);
      }
    } else {
      setSymptoms(symptom);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiAPI.checkSymptoms(symptoms);
      const { analysis, disclaimer, symptoms: sym } = response.data;
      const newResult = { analysis, disclaimer, symptoms: sym };
      setResult(newResult);

      let history = [];
      try {
        const storedHistory = JSON.parse(localStorage.getItem('aiSymptomHistory') || '[]');
        history = Array.isArray(storedHistory) ? storedHistory : [];
      } catch {
        localStorage.removeItem('aiSymptomHistory');
      }
      history.unshift({
        ...newResult,
        date: new Date().toISOString()
      });
      localStorage.setItem('aiSymptomHistory', JSON.stringify(history.slice(0, 20)));
    } catch (err) {
      console.error('API Error:', err);
      const responseMessage = err.response?.data?.error;
      setError(
        err.code === 'ECONNABORTED'
          ? 'The live assistant took too long to respond. Please try again.'
          : responseMessage || 'We could not reach the live AI service. No symptom assessment is shown; please try again when the service is available.'
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  const getSeverityStyle = (severity) => {
    if (severity === 'emergency') return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800/70 dark:bg-red-950/45 dark:text-red-300';
    if (severity === 'moderate') return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/45 dark:text-amber-300';
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/45 dark:text-emerald-300';
  };

  const severity = result?.analysis?.severity;
  const motionTransition = reduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' };

  return (
    <motion.section
      className="mx-auto max-w-4xl"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition}
    >
      <AnimatePresence mode="wait">
        {!result && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            aria-busy={loading}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, transition: { duration: 0.18 } }}
            className="space-y-5"
          >
            <Card className="overflow-hidden p-0 shadow-premium">
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6 dark:border-slate-700/70">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-800/70 dark:bg-primary-900/45 dark:text-primary-300">
                    <Activity className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-700 dark:text-primary-300">Text check</p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">Tell us what you are feeling</h2>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">Add when it started, where it feels strongest, and anything that makes it better or worse.</p>
                  </div>
                </div>
                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 dark:border-primary-800/70 dark:bg-primary-900/45 dark:text-primary-300">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  AI-assisted
                </span>
              </div>

              <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
                <div>
                  <label htmlFor="symptom-description" className="mb-2.5 flex items-center justify-between gap-3 text-sm font-bold text-ink dark:text-slate-100">
                    <span>Describe your symptoms</span>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">In your own words</span>
                  </label>
                  <div className="relative">
                    <Sparkles className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-primary-500" aria-hidden="true" />
                    <textarea
                      id="symptom-description"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g., I have a mild fever, dry cough, and a headache since yesterday..."
                      aria-describedby="symptom-description-hint"
                      className="input-field min-h-[180px] resize-y rounded-[20px] bg-white py-4 pl-12 pr-4 text-base leading-7 shadow-inner shadow-slate-100/60 sm:min-h-[200px] sm:text-lg dark:bg-slate-950/35 dark:shadow-black/10"
                      rows={5}
                    />
                  </div>
                  <p id="symptom-description-hint" className="mt-2.5 flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Include relevant details, but avoid highly sensitive personal data and do not rely on this tool during an emergency.
                  </p>
                </div>

                <fieldset>
                  <legend className="text-sm font-bold text-ink dark:text-slate-100">Common symptoms</legend>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Tap a chip to add it. Selected chips update as your description changes.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => {
                      const selected = symptoms.toLowerCase().includes(symptom.toLowerCase());

                      return (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => handleAddSymptom(symptom)}
                          aria-pressed={selected}
                          aria-label={`${symptom}, ${selected ? 'selected' : 'add symptom'}`}
                          className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                            selected
                              ? 'border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-700/80 dark:bg-primary-900/55 dark:text-primary-200'
                              : 'border-slate-200 bg-slate-50/80 text-slate-600 hover:border-primary-200 hover:bg-primary-50/70 hover:text-primary-800 dark:border-slate-700 dark:bg-slate-800/55 dark:text-slate-300 dark:hover:border-primary-800 dark:hover:bg-primary-900/40 dark:hover:text-primary-200'
                          }`}
                        >
                          {selected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                          {symptom}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-700/70 sm:flex-row">
                  <Button type="submit" disabled={!symptoms.trim() || loading} className="h-14 w-full text-base sm:flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" aria-hidden="true" />
                        Analyze Symptoms
                      </>
                    )}
                  </Button>
                  {symptoms && (
                    <Button type="button" onClick={handleClear} variant="ghost" className="h-14 px-6 sm:w-auto">
                      <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-primary-100 bg-primary-50/65 p-5 dark:border-primary-800/65 dark:bg-primary-900/25">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                    <Lightbulb className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-bold text-primary-900 dark:text-primary-100">A supportive starting point</h3>
                    <p className="mt-1.5 text-sm leading-6 text-primary-900/75 dark:text-primary-100/70">
                      AI can summarize what you describe and suggest general next steps. It cannot confirm a diagnosis, review your full medical history, or replace a qualified healthcare professional.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 dark:border-amber-800/70 dark:bg-amber-950/25">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm dark:bg-slate-900 dark:text-amber-300">
                    <ShieldAlert className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-bold text-amber-950 dark:text-amber-100">When to get help</h3>
                    <p className="mt-1.5 text-sm leading-6 text-amber-900/75 dark:text-amber-100/70">
                      If symptoms are severe, rapidly worsening, or frightening, contact local emergency services or seek professional care promptly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm leading-6 text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/50 dark:text-slate-300">
              <Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <p><strong className="font-bold text-ink dark:text-white">AI-assisted information only.</strong> Responses may be incomplete or incorrect and are not a diagnosis.</p>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/35 dark:text-amber-100">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                <div>
                  <p className="font-bold">We could not analyze symptoms</p>
                  <p className="mt-1 text-sm leading-6 opacity-80">{error}</p>
                </div>
              </div>
            )}

            <div className="min-h-5 text-center" role="status" aria-live="polite">
              {loading && (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
                  <span className="flex items-end gap-1" aria-hidden="true">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500 motion-safe:animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500 motion-safe:animate-bounce [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500 motion-safe:animate-bounce [animation-delay:240ms]" />
                  </span>
                  Reviewing your description
                </p>
              )}
            </div>
          </motion.form>
        )}

        {result && (
          <motion.section
            key="results"
            aria-labelledby="analysis-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, transition: { duration: 0.18 } }}
            className="space-y-5"
          >
            <Card className="overflow-hidden p-0 shadow-premium">
              <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-primary-50/90 via-white to-cyan-50/70 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 dark:border-slate-700/70 dark:from-primary-900/40 dark:via-slate-900 dark:to-cyan-950/20">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-card dark:bg-slate-900 dark:text-primary-300">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-700 dark:text-primary-300">AI-assisted summary</p>
                    <h2 id="analysis-heading" className="mt-1 text-2xl font-extrabold tracking-tight text-ink dark:text-white">Your AI-assisted summary is ready</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Based only on the symptoms you reported.</p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm dark:border-emerald-800/70 dark:bg-slate-900 dark:text-emerald-300">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Summary ready
                </span>
              </div>

              <div className="space-y-5 px-5 py-6 sm:px-7 sm:py-7">
                {error && (
                  <div role="alert" className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/35 dark:text-amber-100">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold">We could not connect to the live assistant</h3>
                      <p className="mt-1 text-sm leading-6 opacity-80">{error}</p>
                    </div>
                  </div>
                )}

                <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700/70 dark:bg-slate-950/35" aria-labelledby="severity-heading">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Severity</p>
                      <h3 id="severity-heading" className="mt-1 text-lg font-extrabold text-ink dark:text-white">Suggested urgency</h3>
                    </div>
                    {severity ? (
                      <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-extrabold capitalize ${getSeverityStyle(severity)}`}>
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        {severity}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Not provided</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">This is a general AI estimate based on your description, not a clinical assessment.</p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700/70 dark:bg-slate-900/50" aria-labelledby="possible-conditions-heading">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                      <Activity className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 id="possible-conditions-heading" className="text-base font-extrabold text-ink dark:text-white">Analysis</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Possible explanations only; these are not confirmed diagnoses.</p>
                    </div>
                  </div>
                  {result.analysis?.possibleConditions?.length > 0 ? (
                    <ul className="mt-4 space-y-2.5">
                      {result.analysis.possibleConditions.map((condition, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">No analysis details were included in this response.</p>
                  )}
                </section>

                <section className="rounded-2xl border border-cyan-200/80 bg-cyan-50/60 p-5 dark:border-cyan-800/60 dark:bg-cyan-950/20" aria-labelledby="advice-heading">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-sm dark:bg-slate-900 dark:text-cyan-300">
                      <Lightbulb className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 id="advice-heading" className="text-base font-extrabold text-cyan-950 dark:text-cyan-100">Advice</h3>
                      <p className="mt-1 text-xs leading-5 text-cyan-900/70 dark:text-cyan-100/70">General suggestions to discuss with a healthcare professional.</p>
                    </div>
                  </div>
                  {result.analysis?.advice?.length > 0 ? (
                    <ul className="mt-4 space-y-2.5">
                      {result.analysis.advice.map((advice, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm leading-6 text-cyan-950/80 dark:text-cyan-100/85">
                          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
                          {advice}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-cyan-900/70 dark:bg-slate-900/45 dark:text-cyan-100/70">No specific advice was included in this response.</p>
                  )}
                </section>

                <section className="rounded-2xl border border-red-200/80 bg-red-50/70 p-5 dark:border-red-800/70 dark:bg-red-950/25" aria-labelledby="warning-heading">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-700 shadow-sm dark:bg-slate-900 dark:text-red-300">
                      <ShieldAlert className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 id="warning-heading" className="text-base font-extrabold text-red-950 dark:text-red-100">Warning: when to seek care</h3>
                      <p className="mt-1 text-xs leading-5 text-red-900/70 dark:text-red-100/70">Do not wait for an AI response if symptoms are severe or rapidly worsening.</p>
                    </div>
                  </div>
                  {result.analysis?.whenToSeeDoctor?.length > 0 ? (
                    <ul className="mt-4 space-y-2.5">
                      {result.analysis.whenToSeeDoctor.map((warning, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm leading-6 text-red-950/80 dark:text-red-100/85">
                          <AlertTriangle className="mt-1 h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-300" aria-hidden="true" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-red-900/70 dark:bg-slate-900/45 dark:text-red-100/70">Seek professional care if symptoms persist, worsen, or concern you.</p>
                  )}
                  <p className="mt-4 border-t border-red-200/70 pt-4 text-sm font-bold leading-6 text-red-900 dark:border-red-800/70 dark:text-red-100">For severe or life-threatening symptoms, contact local emergency services now.</p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700/70 dark:bg-slate-950/40" aria-labelledby="disclaimer-heading">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                    <div>
                      <h3 id="disclaimer-heading" className="font-extrabold text-ink dark:text-white">AI-assisted information disclaimer</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {result.disclaimer || 'This is AI-generated advice and should not replace professional medical consultation.'}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        This tool does not diagnose conditions or prescribe treatment. Consider its output incomplete and verify health decisions with a qualified healthcare professional.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-700/70 sm:flex-row">
                  <Button asChild className="h-14 w-full text-base sm:flex-1">
                    <Link to="/book-appointment">
                      Consult a Doctor Now
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button onClick={handleClear} variant="secondary" className="h-14 w-full px-8 sm:w-auto">
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    Start Over
                  </Button>
                </div>
              </div>
            </Card>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
