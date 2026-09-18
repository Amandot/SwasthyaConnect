import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogOut, User,
  Stethoscope, Calendar, FileText, Pill, AlertCircle, Activity
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import logo from './logo/logo.png';
import ThemeToggle from './ThemeToggle';
export default function Navbar({ user, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      if (!isDemoFirebase) {
        await signOut(auth);
      }
      localStorage.removeItem('userRole'); // Clear role cache
      localStorage.removeItem('demoUser');
      localStorage.removeItem('authToken');
      navigate('/home');
      setIsOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { name: 'Overview', path: '/home', icon: Activity, public: true },
    { name: 'Consult Doctor', path: '/book-appointment', icon: Stethoscope, roles: ['patient'] },
    { name: 'AI Symptoms', path: '/symptom-checker', icon: Activity, roles: ['patient'] },
    { name: 'Health Records', path: '/health-records', icon: FileText, roles: ['patient', 'doctor'] },
    { name: 'Medicines', path: '/medicines', icon: Pill, roles: ['patient'] },
    { name: 'Appointments', path: '/doctor-dashboard', icon: Calendar, roles: ['doctor'] },
    { name: 'Emergency', path: '/emergency', icon: AlertCircle, roles: ['patient'] },
  ];

  const visibleLinks = navLinks.filter(link =>
    link.public || (user && link.roles?.includes(userRole))
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrolled
          ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link
            to={user ? (userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard') : '/home'}
            className="flex items-center gap-3 group outline-none"
          >
            <img src={logo} alt="Arogo Logo" className="h-8 w-8 object-contain" />
            {/* <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-500 ease-out"
            > */}
            {/* <HeartPulse className="h-6 w-6" strokeWidth={2.5} /> */}
            {/* </motion.div> */}

            <span className="text-xl tracking-tight font-bold bg-clip-text text-[#1B3E40] dark:text-white bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Arogo
              {/* ArogyaCure */}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden lg:flex items-center relative rounded-full bg-slate-500/5 dark:bg-slate-800/50 backdrop-blur-md p-1.5 border border-slate-200/50 dark:border-slate-700/50"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {visibleLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              const isHovered = hoveredLink === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10",
                    isActive || isHovered
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  )}
                >
                  <span className="relative z-20 mix-blend-multiply dark:mix-blend-normal">{link.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-600/50 z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hoverTab"
                      className="absolute inset-0 bg-slate-100/80 dark:bg-slate-700/80 rounded-full z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate('/test/video-call')}
                className="shadow-sm border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                Join Video Call
              </Button>
            </motion.div>

            {user ? (
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <span>{userRole === 'doctor' ? 'Dr. Account' : 'Patient'}</span>
                    </div>
                  </Link>
                </motion.div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login/patient" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-2">
                  Patient Login
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="sm"
                    onClick={() => navigate('/login/doctor')}
                    className="shadow-md shadow-primary-500/20"
                  >
                    Doctor Login
                  </Button>
                </motion.div>
              </div>

            )}
            {/* Theme Toggle */}
            <ThemeToggle variant="compact" />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed top-[72px] left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-800/50 overflow-y-auto z-40"
          >
            <div className="px-6 py-8 space-y-6 flex flex-col min-h-full pb-24">
              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {visibleLinks.map((link) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <motion.div
                      key={link.name}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                      }}
                    >
                      <Link
                        to={link.path}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium",
                          isActive
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-100/50 dark:border-primary-800/50"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={cn(
                          "p-2 rounded-xl",
                          isActive ? "bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        )}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="self-start">
                <ThemeToggle variant="default" showLabel />
              </div>

              <div className="mt-auto pt-8 border-t border-slate-200/50">
                <motion.div
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {user ? (
                    <>
                      <Link
                        to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-200 font-medium"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center border border-primary-100 dark:border-primary-800">
                            <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Account</span>
                            <span className="block text-sm">{userRole === 'doctor' ? 'Dr. Account' : 'Patient Dashboard'}</span>
                          </div>
                        </div>
                      </Link>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 h-12 rounded-xl">
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate('/test/video-call')}
                        >
                          Join Video Call
                        </Button>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button variant="ghost" onClick={() => { navigate('/login/patient'); setIsOpen(false); }} className="w-full justify-center h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Patient Login
                        </Button>
                        <Button onClick={() => { navigate('/login/doctor'); setIsOpen(false); }} className="w-full justify-center h-12 rounded-xl shadow-md border border-primary-600 text-white bg-primary-600 hover:bg-primary-700">
                          Doctor Login
                        </Button>

                      </div>

                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
