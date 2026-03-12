import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, Menu, X, LogOut, User, 
  Stethoscope, Calendar, FileText, Pill, AlertCircle, Activity
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export default function Navbar({ user, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to={user ? (userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard') : '/home'} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md group-hover:shadow-premium transition-all duration-300">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Rural TeleHealth
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-200/50 shadow-soft">
            {visibleLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white text-primary-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                    <User className="h-4 w-4" />
                    <span>{userRole === 'doctor' ? 'Dr. Account' : 'Patient'}</span>
                  </div>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:text-red-600 px-3">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login/patient')}>
                  Patient Login
                </Button>
                <Button size="sm" onClick={() => navigate('/login/doctor')} className="shadow-sm">
                  Doctor Login
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200/50 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {visibleLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200/50 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium"
                    >
                      <User className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => { navigate('/login/patient'); setIsOpen(false); }} className="w-full justify-center">
                      Patient Login
                    </Button>
                    <Button onClick={() => { navigate('/login/doctor'); setIsOpen(false); }} className="w-full justify-center">
                      Doctor Login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
