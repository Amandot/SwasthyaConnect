import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Stethoscope, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

export default function LoginSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/50 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <Button
        variant="ghost"
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 z-20"
        onClick={() => navigate('/home')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> {t('nav.backHome', 'Back to Home')}
      </Button>

      <motion.div 
        className="max-w-3xl w-full text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 mb-4 shadow-sm">
          {t('auth.selection.badge', 'Welcome to Rural TeleHealth')}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {t('auth.selection.title', 'Select your portal')}
        </h1>
        <p className="text-slate-600 text-lg max-w-lg mx-auto font-medium">
          {t('auth.selection.subtitle', 'Choose how you want to access the platform. Patients can book consultations, while doctors manage their schedules.')}
        </p>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card 
            hoverEffect 
            className="h-full bg-white cursor-pointer flex flex-col items-center text-center p-10 group border-2 border-transparent hover:border-primary-200 transition-all duration-300 shadow-sm"
            onClick={() => navigate('/login/patient')}
          >
            <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 border border-primary-100 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300 shadow-sm">
              <User size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              {t('auth.selection.patientTitle', 'Patient Portal')}
            </h2>
            <p className="text-slate-600 mb-6 font-medium max-w-xs text-balance">
              {t('auth.selection.patientDesc', 'Book consultations, check symptoms, and manage your health records securely.')}
            </p>
            <div className="flex flex-col gap-3 w-full mt-auto">
              <Button className="w-full text-base group-hover:bg-primary-700 shadow-md h-12" onClick={(e) => {
                e.stopPropagation();
                navigate('/signup/patient');
              }}>
                {t('auth.selection.createPatient', 'Create Patient Account')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login/patient');
                }}
              >
                {t('auth.selection.loginPatient', 'Login as Patient')}
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card 
            hoverEffect 
            className="h-full bg-white cursor-pointer flex flex-col items-center text-center p-10 group border-2 border-transparent hover:border-slate-300 transition-all duration-300 shadow-sm"
            onClick={() => navigate('/login/doctor')}
          >
            <div className="w-20 h-20 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 group-hover:scale-110 group-hover:bg-slate-100 transition-all duration-300 shadow-sm">
              <Stethoscope size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              {t('auth.selection.doctorTitle', 'Doctor Portal')}
            </h2>
            <p className="text-slate-600 mb-6 font-medium max-w-xs text-balance">
              {t('auth.selection.doctorDesc', 'Manage appointments, view patient records, and conduct video consultations.')}
            </p>
            <div className="flex flex-col gap-3 w-full mt-auto">
              <Button
                variant="secondary"
                className="w-full text-base shadow-md h-12"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/signup/doctor');
                }}
              >
                {t('auth.selection.createDoctor', 'Create Doctor Account')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login/doctor');
                }}
              >
                {t('auth.selection.loginDoctor', 'Login as Doctor')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
