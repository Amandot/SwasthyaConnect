import { useState } from 'react';
import { aiAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Activity, Search, AlertTriangle, 
  Info, Sparkles, Plus, ArrowRight, RotateCcw
} from 'lucide-react';

export default function SymptomCheckerComponent() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commonSymptoms = [
    'Fever', 'Dry Cough', 'Headache', 'Muscle Ache',
    'Fatigue', 'Nausea', 'Dizziness', 'Sore Throat'
  ];

  const handleAddSymptom = (symptom) => {
    if (symptoms.trim()) {
      // Check if symptom already exists to avoid duplicates
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
    setResult(response.data);
  } catch (err) {
    // Fallback demo data if API call fails
    setResult({
      analysis:
        "Based on the symptoms provided, you may be experiencing a viral infection or seasonal flu. It is recommended to rest, stay hydrated, and monitor your temperature.",
      disclaimer:
        "This is AI-generated advice and should not replace professional medical consultation. Please consult a doctor for accurate diagnosis and treatment.",
      urgency: symptoms
        .toLowerCase()
        .includes('chest pain') ||
        symptoms.toLowerCase().includes('shortness of breath')
        ? 'high'
        : 'medium'
    });
  } finally {
    setLoading(false);
  }
  };

  const handleClear = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
         <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity size={32} />
         </div>
         <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">AI Symptom Checker</h1>
         <p className="text-slate-500 mt-2 text-lg">
            Describe how you are feeling, and our AI will provide instant health guidance.
         </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result && (
          <motion.form 
            key="form"
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          >
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-premium">
              <div className="space-y-6">
                <div>
                  <label className="label flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-primary-500 text-sm" /> 
                    What symptoms are you experiencing?
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., I have a mild fever, dry cough, and a headache since yesterday..."
                    className="input-field min-h-[140px] resize-none text-lg p-4 bg-white"
                    rows={4}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Common Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleAddSymptom(symptom)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                  <Button
                    type="submit"
                    disabled={!symptoms.trim() || loading}
                    className="flex-1 h-14 text-lg"
                    isLoading={loading}
                    loadingText="Analyzing Symptoms..."
                  >
                    {!loading && <><Search className="w-5 h-5 mr-2" /> Analyze Symptoms</>}
                  </Button>
                  
                  {symptoms && (
                    <Button
                      type="button"
                      onClick={handleClear}
                      variant="ghost"
                      className="sm:w-auto px-6 h-14"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Information Card */}
            {!loading && (
              <motion.div variants={itemVariants} className="mt-8">
                <Card className="bg-primary-50/50 border-primary-100 p-6 flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100/80 rounded-2xl flex flex-shrink-0 items-center justify-center">
                    <Info className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900 mb-1">How it works</h4>
                    <p className="text-primary-700/80 text-sm leading-relaxed">
                      Our AI model analyzes your symptoms against a vast medical database to suggest potential causes and next steps. 
                      This tool is designed to help you prepare for a consultation, not to replace professional medical advice.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.form>
        )}

        {/* Results Section */}
        {result && (
          <motion.div 
            key="results"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          >
            <Card className="p-0 overflow-hidden shadow-premium border-slate-200/60">
              <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-6 sm:p-8 text-white relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/3" />
                <h3 className="text-2xl font-bold flex items-center gap-3 relative z-10">
                  <Activity className="w-8 h-8 opacity-80" />
                  Analysis complete
                </h3>
                <p className="mt-2 text-primary-100">Based on your reported symptoms.</p>
              </div>
              
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="text-primary-500 w-5 h-5" /> Possible Conditions & Advice
                  </h4>
                  <div className="prose prose-slate prose-lg max-w-none">
                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                      {result.analysis}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-4">
                  <div className="bg-amber-100/80 p-2 rounded-xl shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Medical Disclaimer</h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {result.disclaimer || 'This is AI-generated advice and should not replace professional medical consultation. Please consult a doctor for accurate diagnosis and treatment.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                  <Button
                    onClick={() => window.location.href = '/book-appointment'}
                    className="flex-1 h-14 text-lg bg-slate-900 hover:bg-slate-800"
                  >
                    Consult a Doctor Now <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    onClick={handleClear} 
                    variant="outline"
                    className="sm:w-auto h-14 px-8"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
