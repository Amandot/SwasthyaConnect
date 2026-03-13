import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Stethoscope, ArrowRight, Lock, Mail, User as UserIcon, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function DoctorSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.error.emptyAll', 'Please fill in all fields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.error.match', 'Passwords do not match'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.error.length', 'Password must be at least 6 characters'));
      return;
    }

    setLoading(true);

    try {
      if (isDemoFirebase) {
        const demoUser = {
          uid: `demo-doctor-${Date.now()}`,
          email,
          displayName: name,
          role: 'doctor',
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('userRole', 'doctor');
        localStorage.setItem('authToken', 'demo-doctor-token');
        navigate('/doctor-dashboard');
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      const token = await cred.user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', 'doctor');
      navigate('/doctor-dashboard');
    } catch (err) {
      console.error('Doctor signup error:', err);
      let message = t('auth.error.genericSignup', 'Failed to create account. ');
      if (err.code === 'auth/email-already-in-use') {
        message += t('auth.error.inUse', 'This email is already registered. Please log in instead.');
      } else if (err.code === 'auth/invalid-email') {
        message += t('auth.error.invalidEmail', 'Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        message += t('auth.error.weakPassword', 'Password is too weak. Please use a stronger password.');
      } else {
        message += err.message || t('auth.error.tryAgain', 'Please try again.');
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

        <Button
          variant="ghost"
          className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 z-20"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('nav.backHome', 'Back to Home')}
        </Button>

      <Card className="max-w-md w-full p-8 relative z-10 shadow-premium border-slate-200/60 bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('auth.signup.doctor.title', 'Create Doctor Account')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            {t('auth.signup.doctor.subtitle', 'Sign up to manage appointments and patient records securely.')}
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center font-medium shadow-sm animate-fade-in">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
               <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t('auth.fullName', 'Full Name')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-medium"
                  placeholder="Dr. Full Name"
                />
              </div>
            </div>

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
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-medium"
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t('auth.password', 'Password')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-medium"
                  placeholder="Create a password"
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

            <div>
               <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t('auth.confirmPassword', 'Confirm Password')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-medium"
                  placeholder="Re-enter your password"
                />
                 <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-12 text-base shadow-md hover:shadow-lg transition-all"
              isLoading={loading}
              variant="secondary"
            >
              {!loading && (
                <>
                  {t('auth.createDoctorAccount', 'Create doctor account')} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm font-medium">
            <span className="text-slate-500">{t('auth.hasAccount', 'Already have an account? ')}</span>
            <button
              onClick={() => navigate('/login/doctor')}
              className="text-slate-800 hover:text-slate-900 font-bold transition-colors"
            >
              {t('auth.login', 'Log In')}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
