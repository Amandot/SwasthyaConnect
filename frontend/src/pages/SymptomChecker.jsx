import { useState } from 'react';
import SymptomCheckerComponent from '../components/SymptomChecker';
import VoiceChat from '../components/VoiceChat';
import { cn } from '../lib/utils';
import { FileText, Mic } from 'lucide-react';

function SymptomChecker() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">AI Symptom Checker</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Get AI-powered health guidance using text or voice
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('text')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
            activeTab === 'text'
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-800"
          )}
        >
          <FileText className="w-4 h-4" /> Text Check
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
            activeTab === 'voice'
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-800"
          )}
        >
          <Mic className="w-4 h-4" /> Voice Chat
        </button>
      </div>
      
      {activeTab === 'text' ? <SymptomCheckerComponent /> : <VoiceChat />}
    </main>
  );
}

export default SymptomChecker;
