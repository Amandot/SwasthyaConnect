import { useState } from 'react';
import SymptomCheckerComponent from '../components/SymptomChecker';
import VoiceChat from '../components/VoiceChat';
import { cn } from '../lib/utils';
import { AlertTriangle, FileText, HeartPulse, Mic, ShieldCheck, Sparkles } from 'lucide-react';

function SymptomChecker() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <main className="app-container py-8 sm:py-10 lg:py-12">
      <header className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white px-5 py-7 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80 sm:px-8 sm:py-9 lg:px-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-900/20" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl dark:bg-cyan-900/10" />
        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-primary-700 dark:border-primary-800/70 dark:bg-primary-900/45 dark:text-primary-300">
                <HeartPulse className="h-4 w-4" aria-hidden="true" />
                AI health assistant
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Text and voice options
              </span>
            </div>
            <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-[-0.04em] text-ink dark:text-white sm:text-4xl lg:text-[2.85rem]">
              A calmer way to understand your symptoms
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Describe what you are feeling in your own words. The assistant can help organize your input into general information and next-step questions for professional care.
            </p>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-700/70 dark:bg-slate-950/40">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/45 dark:text-emerald-300">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-ink dark:text-white">Designed for clarity</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Use it to prepare, not to diagnose.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-200/80 pt-4 text-sm text-slate-500 dark:border-slate-700/70 dark:text-slate-400">
              <Sparkles className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" aria-hidden="true" />
              You stay in control of what you share and share next.
            </div>
          </div>
        </div>
      </header>

      <div
        className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80"
        role="tablist"
        aria-label="Choose how to describe your symptoms"
      >
        <button
          id="text-check-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 'text'}
          aria-controls="symptom-assistant-panel"
          onClick={() => setActiveTab('text')}
          className={cn(
            'flex min-h-14 items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 motion-reduce:transition-none sm:text-base',
            activeTab === 'text'
              ? 'bg-primary-600 text-white shadow-[0_10px_24px_-16px_rgba(18,104,177,0.8)]'
              : 'text-slate-500 hover:bg-slate-50 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
          )}
        >
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', activeTab === 'text' ? 'bg-white/15' : 'bg-slate-100 dark:bg-slate-800')}>
            <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="text-left">
            <span className="block">Text check</span>
            <span className={cn('mt-0.5 hidden text-xs font-medium sm:block', activeTab === 'text' ? 'text-primary-100' : 'text-slate-400 dark:text-slate-500')}>
              Type what you feel
            </span>
          </span>
        </button>
        <button
          id="voice-chat-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 'voice'}
          aria-controls="symptom-assistant-panel"
          onClick={() => setActiveTab('voice')}
          className={cn(
            'flex min-h-14 items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 motion-reduce:transition-none sm:text-base',
            activeTab === 'voice'
              ? 'bg-primary-600 text-white shadow-[0_10px_24px_-16px_rgba(18,104,177,0.8)]'
              : 'text-slate-500 hover:bg-slate-50 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
          )}
        >
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', activeTab === 'voice' ? 'bg-white/15' : 'bg-slate-100 dark:bg-slate-800')}>
            <Mic className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="text-left">
            <span className="block">Voice chat</span>
            <span className={cn('mt-0.5 hidden text-xs font-medium sm:block', activeTab === 'voice' ? 'text-primary-100' : 'text-slate-400 dark:text-slate-500')}>
              Speak naturally
            </span>
          </span>
        </button>
      </div>

      <div
        id="symptom-assistant-panel"
        role="tabpanel"
        aria-labelledby={activeTab === 'text' ? 'text-check-tab' : 'voice-chat-tab'}
        className="mt-6"
      >
        {activeTab === 'text' ? <SymptomCheckerComponent /> : <VoiceChat />}
      </div>

      <aside className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/25 dark:text-amber-100 sm:items-center" aria-label="Urgent symptom notice">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300 sm:mt-0" aria-hidden="true" />
        <p>
          <strong>Need urgent help?</strong> Contact local emergency services for severe or life-threatening symptoms. This assistant cannot provide emergency care.
        </p>
      </aside>
    </main>
  );
}

export default SymptomChecker;
