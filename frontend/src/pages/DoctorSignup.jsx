import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import AuthLayout from '../components/AuthLayout';
import { Button } from '../components/ui/Button';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';

export default function DoctorSignup({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // In demo mode: don't hit Firebase, just simulate a doctor account
      if (isDemoFirebase) {
        const demoUser = {
          uid: 'demo-doctor-signup',
          email,
          displayName: name,
          role: 'doctor',
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('userRole', 'doctor');
        localStorage.setItem('authToken', 'demo-doctor-token');
        onLogin?.();
        navigate('/doctor-dashboard');
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      const token = await cred.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Register with our backend
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            email,
            role: 'doctor'
          })
        });
      } catch (backendErr) {
        console.error('Failed to create backend profile:', backendErr);
      }

      localStorage.setItem('userRole', 'doctor');
      onLogin?.();
      navigate('/doctor-dashboard');
    } catch (err) {
      console.error('Doctor signup error:', err);
      let message = 'Failed to create doctor account. ';
      if (err.code === 'auth/email-already-in-use') {
        message += 'This email is already registered. Please log in instead.';
      } else if (err.code === 'auth/invalid-email') {
        message += 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        message += 'Password is too weak. Please use a stronger password.';
      } else {
        message += err.message || 'Please try again.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      audience="doctor"
      eyebrow="Doctor account"
      title="Create your account"
      description="Set up your doctor portal to review appointments, join consultation rooms, and continue your care workflow."
      error={error}
      backLink={{ to: '/login', label: 'Portal selection' }}
      switchLink={{ to: '/signup/patient', label: 'Switch to patient sign up', shortLabel: 'Patient' }}
      footer={(
        <>
          Already have a doctor account?{' '}
          <Link to="/login/doctor" className="font-bold text-primary-700 hover:text-primary-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-primary-300 dark:hover:text-primary-200">
            Sign in instead
          </Link>
        </>
      )}
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2.5 block text-[15px] font-bold text-ink dark:text-slate-200">
            Full name <span className="text-primary-600 dark:text-primary-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500" aria-hidden="true">
              <UserRound className="h-5 w-5" />
            </span>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field h-14 pl-12"
              placeholder="Your full name"
              aria-describedby={error ? 'auth-error' : undefined}
            />
          </div>
        </div>

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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field h-14 pl-12 pr-14"
              placeholder="Create a password"
              aria-describedby={error ? 'auth-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-1.5 flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-slate-700/60 dark:hover:text-white"
              aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2.5 block text-[15px] font-bold text-ink dark:text-slate-200">
            Confirm password <span className="text-primary-600 dark:text-primary-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500" aria-hidden="true">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field h-14 pl-12 pr-14"
              placeholder="Re-enter your password"
              aria-describedby={error ? 'auth-error' : undefined}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-ink-950 hover:bg-ink-900 focus-visible:ring-ink-700 dark:bg-slate-100 dark:text-ink-950 dark:hover:bg-white dark:focus-visible:ring-slate-300"
          size="lg"
          isLoading={loading}
          loadingText="Creating account…"
        >
          Create doctor account
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
