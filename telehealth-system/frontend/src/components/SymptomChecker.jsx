import { useState } from 'react';
import { aiAPI } from '../services/api';

function SymptomCheckerComponent() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Body Pain',
    'Fatigue', 'Nausea', 'Dizziness', 'Cold'
  ];

  const handleAddSymptom = (symptom) => {
    if (symptoms.trim()) {
      setSymptoms(prev => `${prev}, ${symptom}`);
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
      setError('Failed to analyze symptoms. Please try again.');
      console.error('Symptom check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Describe your symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: Fever, cough, headache, body pain..."
            className="input-field min-h-[120px] resize-none"
            rows={4}
          />
        </div>

        {/* Common Symptoms Quick Add */}
        <div>
          <p className="text-sm text-slate-500 mb-2">Quick add common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => handleAddSymptom(symptom)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors"
              >
                + {symptom}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!symptoms.trim() || loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <SearchIcon className="w-5 h-5" />
                Check Symptoms
              </>
            )}
          </button>
          {(symptoms || result) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="card animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ResultIcon className="w-5 h-5 text-primary-600" />
            Analysis Results
          </h3>
          
          <div className="prose prose-slate max-w-none">
            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap">
              {result.analysis}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex items-start gap-3">
              <WarningIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Important Notice</p>
                <p className="text-sm text-amber-700 mt-1">
                  {result.disclaimer || 'This is AI-generated advice and should not replace professional medical consultation. Please consult a doctor for accurate diagnosis and treatment.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/book-appointment" className="btn-primary">
              Book Doctor Consultation
            </a>
            <button onClick={handleClear} className="btn-secondary">
              Check New Symptoms
            </button>
          </div>
        </div>
      )}

      {/* Information Card */}
      {!result && !loading && (
        <div className="card bg-primary-50 border-primary-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <InfoIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-primary-900">How it works</h4>
              <p className="text-primary-700 text-sm mt-1">
                Enter your symptoms and our AI will analyze them to provide possible conditions and recommendations. 
                This is for informational purposes only - always consult a healthcare professional for proper diagnosis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon Components
function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ResultIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function WarningIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function InfoIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default SymptomCheckerComponent;
