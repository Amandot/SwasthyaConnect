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
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navbar({ user, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage, languages } = useLanguage();

  const NAV_TEXT = {
    brand: {
      en: 'Rural TeleHealth',
      hi: 'ग्रामीण टेलीहेल्थ',
      mr: 'ग्रामीण टेलीहेल्थ',
    },
    links: {
      overview: { en: 'Overview', hi: 'ओवरव्यू', mr: 'ओव्हरव्ह्यू' },
      consultDoctor: { en: 'Consult Doctor', hi: 'डॉक्टर से परामर्श', mr: 'डॉक्टरांचा सल्ला' },
      aiSymptoms: { en: 'AI Symptoms', hi: 'एआई लक्षण जाँच', mr: 'एआय लक्षण तपासणी' },
      healthRecords: { en: 'Health Records', hi: 'स्वास्थ्य रिकॉर्ड', mr: 'आरोग्य नोंदी' },
      medicines: { en: 'Medicines', hi: 'दवाइयाँ', mr: 'औषधे' },
      appointments: { en: 'Appointments', hi: 'अपॉइंटमेंट्स', mr: 'अपॉइंटमेंट्स' },
      emergency: { en: 'Emergency', hi: 'आपातकाल', mr: 'आपत्कालीन' },
    },
    auth: {
      patientLogin: { en: 'Patient Login', hi: 'मरीज़ लॉगिन', mr: 'रुग्ण लॉगिन' },
      doctorLogin: { en: 'Doctor Login', hi: 'डॉक्टर लॉगिन', mr: 'डॉक्टर लॉगिन' },
      logout: { en: 'Logout', hi: 'लॉगआउट', mr: 'लॉगआउट' },
      doctorAccount: { en: 'Dr. Account', hi: 'डॉक्टर खाता', mr: 'डॉक्टर खाते' },
      patientAccount: { en: 'Patient', hi: 'मरीज़', mr: 'रुग्ण' },
      dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
    },
  };

  const tLink = (key, fallback) =>
    NAV_TEXT.links[key]?.[language] || fallback;

  const tAuth = (key, fallback) =>
    NAV_TEXT.auth[key]?.[language] || fallback;

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
    { id: 'overview', defaultLabel: 'Overview', path: '/home', icon: Activity, public: true },
    { id: 'consultDoctor', defaultLabel: 'Consult Doctor', path: '/book-appointment', icon: Stethoscope, roles: ['patient'] },
    { id: 'aiSymptoms', defaultLabel: 'AI Symptoms', path: '/symptom-checker', icon: Activity, roles: ['patient'] },
    { id: 'healthRecords', defaultLabel: 'Health Records', path: '/health-records', icon: FileText, roles: ['patient', 'doctor'] },
    { id: 'medicines', defaultLabel: 'Medicines', path: '/medicines', icon: Pill, roles: ['patient'] },
    { id: 'appointments', defaultLabel: 'Appointments', path: '/doctor-dashboard', icon: Calendar, roles: ['doctor'] },
    { id: 'emergency', defaultLabel: 'Emergency', path: '/emergency', icon: AlertCircle, roles: ['patient'] },
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
              {NAV_TEXT.brand[language] || NAV_TEXT.brand.en}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-200/50 shadow-soft">
            {visibleLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white text-primary-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                  )}
                >
                  {tLink(link.id, link.defaultLabel)}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-white/60 rounded-full px-2 py-1 border border-slate-200 text-xs">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    'px-2 py-0.5 rounded-full font-medium',
                    language === lang.code
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                    <User className="h-4 w-4" />
                    <span>
                      {userRole === 'doctor'
                        ? tAuth('doctorAccount', 'Dr. Account')
                        : tAuth('patientAccount', 'Patient')}
                    </span>
                  </div>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:text-red-600 px-3">
                  <LogOut className="h-4 w-4 mr-2" />
                  {tAuth('logout', 'Logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login/patient')}>
                  {tAuth('patientLogin', 'Patient Login')}
                </Button>
                <Button size="sm" onClick={() => navigate('/login/doctor')} className="shadow-sm">
                  {tAuth('doctorLogin', 'Doctor Login')}
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
              {/* Mobile language switcher */}
              <div className="flex items-center gap-2 mb-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      'flex-1 px-2 py-1 rounded-full text-xs font-medium border',
                      language === lang.code
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {visibleLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {tLink(link.id, link.defaultLabel)}
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
                      {tAuth('dashboard', 'Dashboard')}
                    </Link>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                      <LogOut className="h-5 w-5 mr-3" />
                      {tAuth('logout', 'Logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => { navigate('/login/patient'); setIsOpen(false); }} className="w-full justify-center">
                      {tAuth('patientLogin', 'Patient Login')}
                    </Button>
                    <Button onClick={() => { navigate('/login/doctor'); setIsOpen(false); }} className="w-full justify-center">
                      {tAuth('doctorLogin', 'Doctor Login')}
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
