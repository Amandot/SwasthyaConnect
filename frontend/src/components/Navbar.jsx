import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  CalendarDays,
  CircleUserRound,
  FileHeart,
  HeartPulse,
  LogOut,
  Menu,
  Pill,
  ShieldAlert,
  Stethoscope,
  X
} from 'lucide-react';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import ThemeToggle from './ThemeToggle';
import logo from './logo/logo.png';

export default function Navbar({ user, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const handleLogout = async () => {
    try {
      if (!isDemoFirebase) {
        await signOut(auth);
      }
      localStorage.removeItem('userRole');
      localStorage.removeItem('demoUser');
      localStorage.removeItem('authToken');
      setIsOpen(false);
      navigate('/home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const publicLinks = [
    { label: 'Home', path: '/home', icon: HeartPulse },
    { label: 'Services', path: '/home#services', icon: Stethoscope, anchor: true },
    { label: 'How it works', path: '/home#how-it-works', icon: Activity, anchor: true }
  ];

  const patientLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: CircleUserRound },
    { label: 'Find a Doctor', path: '/book-appointment', icon: Stethoscope },
    { label: 'Health Records', path: '/health-records', icon: FileHeart },
    { label: 'Medicines', path: '/medicines', icon: Pill },
    { label: 'Symptom Checker', path: '/symptom-checker', icon: Activity }
  ];

  const doctorLinks = [
    { label: 'Overview', path: '/doctor-dashboard', icon: CircleUserRound },
    { label: 'Appointments', path: '/doctor-dashboard#schedule', icon: CalendarDays }
  ];

  const navLinks = userRole === 'doctor' ? doctorLinks : userRole === 'patient' ? patientLinks : publicLinks;
  const isActive = (link) => {
    const [path, hash] = link.path.split('#');
    return location.pathname === path && (hash ? location.hash === `#${hash}` : !location.hash);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        initial={reduceMotion ? false : { y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'mx-auto max-w-7xl overflow-hidden rounded-[20px] border bg-white/90 backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-200 dark:bg-slate-950/90',
          scrolled
            ? 'border-slate-200/90 shadow-[0_14px_42px_-28px_rgba(15,35,55,0.5)] dark:border-white/10'
            : 'border-white/80 shadow-[0_8px_30px_-24px_rgba(15,35,55,0.4)] dark:border-white/[0.07]'
        )}
        aria-label="Primary navigation"
      >
        <div className="flex min-h-[68px] items-center justify-between gap-5 px-3 sm:px-5">
          <Link
            to={user ? (userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard') : '/home'}
            className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label="SwasthyaConnect home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 ring-1 ring-primary-100 transition-transform duration-200 group-hover:scale-[1.03] dark:bg-primary-950/60 dark:ring-primary-800/70">
              <img src={logo} alt="" className="h-7 w-7 object-contain" />
            </span>
            <span className="hidden text-[15px] font-extrabold tracking-[-0.03em] text-ink dark:text-white sm:block">SwasthyaConnect</span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
            <div className="flex items-center gap-1 rounded-2xl bg-slate-50 p-1 dark:bg-white/[0.045]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={cn(
                    'relative rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-colors',
                    isActive(link)
                      ? 'bg-white text-primary-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-white/10 dark:text-primary-200 dark:ring-white/10'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2.5 xl:flex">
            <ThemeToggle variant="compact" />
            {user ? (
              <>
                <Link
                  to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                  className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-primary-800"
                >
                  <CircleUserRound className="h-4 w-4" aria-hidden="true" />
                  <span className="max-w-28 truncate">{user.displayName || user.email?.split('@')[0] || (userRole === 'doctor' ? 'Doctor' : 'Patient')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login/patient" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                  Patient login
                </Link>
                <Button size="sm" onClick={() => navigate('/login/doctor')}>
                  Doctor login
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle variant="compact" />
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-slate-950"
            >
              <div className="max-h-[calc(100vh-100px)] overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
                <p className="px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Navigation</p>
                <div className="mt-2 grid gap-1.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      className={cn(
                        'flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition',
                        isActive(link)
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.05] dark:hover:text-white'
                      )}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-white/[0.05] dark:text-slate-300 dark:ring-white/10">
                        <link.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>

                {userRole === 'patient' && (
                  <Link
                    to="/emergency"
                    className="mt-2 flex min-h-12 items-center gap-3 rounded-xl bg-red-50 px-3 py-3 text-sm font-bold text-red-700 dark:bg-red-950/35 dark:text-red-300"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-white/[0.05]">
                      <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    </span>
                    Emergency information
                  </Link>
                )}

                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/[0.08]">
                  {user ? (
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                      <Link
                        to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                        className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-white/10"
                      >
                        <CircleUserRound className="h-5 w-5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-slate-800 dark:text-white">{user.displayName || user.email?.split('@')[0] || 'Account'}</span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">{userRole === 'doctor' ? 'Doctor portal' : 'Patient portal'}</span>
                        </span>
                      </Link>
                      <Button type="button" variant="ghost" onClick={handleLogout} className="text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40">
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => navigate('/login/patient')}>Patient login</Button>
                      <Button onClick={() => navigate('/login/doctor')}>Doctor login</Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
