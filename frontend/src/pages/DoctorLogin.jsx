import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import AuthLayout from '../components/AuthLayout';
import { Button } from '../components/ui/Button';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

export default function DoctorLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Demo mode: allow README demo credentials without real Firebase
      if (isDemoFirebase && email === 'demo@telehealth.com' && password === 'demo123') {
        const demoUser = {
          uid: 'demo-doctor',
          email,
          displayName: 'Demo Doctor',
          role: 'doctor',
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('userRole', 'doctor');
        localStorage.setItem('authToken', 'demo-doctor-token');
        onLogin?.();
        navigate('/doctor-dashboard');
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Sync profile with backend (repairs users who failed to create DB row previously)
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: cred.user.displayName || email.split('@')[0],
            email,
            role: 'doctor'
          })
        });
      } catch (backendErr) {
        console.error('Failed to sync backend profile:', backendErr);
      }
      
      localStorage.setItem('userRole', 'doctor');
      onLogin?.();
      navigate('/doctor-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      audience="doctor"
      eyebrow="Doctor portal"
      title="Welcome back"
      description="Sign in to review appointments, join consultation rooms, and continue your care workflow."
      error={error}
      backLink={{ to: '/login', label: 'Portal selection' }}
      switchLink={{ to: '/login/patient', label: 'Switch to patient sign in', shortLabel: 'Patient' }}
      footer={(
        <>
          New to SwasthyaConnect?{' '}
          <Link to="/signup/doctor" className="font-bold text-primary-700 hover:text-primary-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-primary-300 dark:hover:text-primary-200">
            Create a doctor account
          </Link>
        </>
      )}
    >
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-300" aria-hidden="true" />
        <p>Use this portal to review appointments and join available consultation rooms.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2.5 block text-[15px] font-bold text-ink dark:text-slate-200">
            Email address <span className="text-primary-600 dark:text-primary-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500" aria-hidden="true">
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
              className="input-field h-14 pl-12"
              placeholder="doctor@hospital.com"
              aria-describedby={error ? 'auth-error' : undefined}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2.5 block text-[15px] font-bold text-ink dark:text-slate-200">
            Password <span className="text-primary-600 dark:text-primary-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500" aria-hidden="true">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field h-14 pl-12 pr-14"
              placeholder="••••••••"
              aria-describedby={error ? 'auth-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-1.5 flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-slate-700/60 dark:hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="mt-7 w-full bg-ink-950 hover:bg-ink-900 focus-visible:ring-ink-700 dark:bg-slate-100 dark:text-ink-950 dark:hover:bg-white dark:focus-visible:ring-slate-300"
          size="lg"
          isLoading={loading}
          loadingText="Signing in securely…"
        >
          Sign in securely
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
