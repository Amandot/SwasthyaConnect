import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LogIn, ArrowRight, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function PatientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem('userRole', 'patient');
  }, []);

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setEmail('demo.patient@telehealth.com');
    setPassword('demo123');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('auth.error.empty', 'Please enter both email and password'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isDemoFirebase && email === 'demo.patient@telehealth.com' && password === 'demo123') {
        const demoUser = {
          uid: 'demo-patient',
          email,
          displayName: 'Demo Patient',
          role: 'patient',
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('userRole', 'patient');
        localStorage.setItem('authToken', 'demo-patient-token');
        navigate('/dashboard');
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', 'patient');
      navigate('/dashboard');
    } catch (err) {
      console.error('Patient login error:', err);
      setError(t('auth.error.invalid', 'Invalid email or password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <Button
        variant="ghost"
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 z-20"
        onClick={() => navigate('/home')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> {t('nav.backHome', 'Back to Home')}
      </Button>

      <Card className="max-w-md w-full p-8 relative z-10 shadow-premium border-slate-200/60 bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100 shadow-sm">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('auth.patient.title', 'Patient Login')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            {t('auth.patient.subtitle', 'Sign in to access your health records and consult doctors')}
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center font-medium shadow-sm animate-fade-in">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t('auth.email', 'Email Address')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  placeholder="patient@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  {t('auth.password', 'Password')}
                </label>
                <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  {t('auth.forgotPassword', 'Forgot Password?')}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-2 h-12 text-base shadow-md hover:shadow-lg transition-all"
              isLoading={loading}
            >
              {!loading && (
                <>
                  {t('auth.signIn', 'Sign in securely')} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {isDemoFirebase && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                {t('auth.demo.patient', 'Use Demo Patient Credentials')}
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-sm font-medium">
            <span className="text-slate-500">{t('auth.noAccount', "Don't have an account? ")}</span>
            <button
              onClick={() => navigate('/signup/patient')}
              className="text-primary-600 hover:text-primary-700 font-bold transition-colors"
            >
              {t('auth.signUp', 'Sign up')}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
