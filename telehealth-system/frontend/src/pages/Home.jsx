import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { 
  Video, Activity, FileText, Pill, MapPin, AlertCircle, 
  ChevronRight, Shield, Award, HeartHandshake 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    { icon: Video, title: "Consult Doctor", desc: "Live video & audio calls with certified professionals.", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Activity, title: "AI Symptom Checker", desc: "Get instant AI-driven health assessments.", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: FileText, title: "Health Records", desc: "Securely store and access your medical history.", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: Pill, title: "Medicine Finder", desc: "Locate prescribed medicines at nearby pharmacies.", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: MapPin, title: "Nearby Centers", desc: "Find government approved rural health centers.", color: "text-indigo-500", bg: "bg-indigo-50" },
    { icon: AlertCircle, title: "Emergency Help", desc: "One-tap access to ambulance and urgent care.", color: "text-red-500", bg: "bg-red-50" }
  ];

  return (
    <div className="min-h-screen bg-brand-background overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary-50/80 to-transparent -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Now serving thousands of villages
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Healthcare for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">Every Village</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 text-balance">
              Connecting rural communities with certified doctors through secure, fast, and accessible telemedicine.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate('/login')} className="group">
                Start Consultation
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                Check Symptoms
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeIn} className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-70">
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Certified Doctors</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Govt. Compliant</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual showing floating cards */}
          <motion.div 
            className="flex-1 relative w-full h-[500px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Video Call Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-80 bg-white p-4 rounded-3xl shadow-premium border border-slate-100 z-20"
            >
              <div className="aspect-video bg-slate-900 rounded-2xl relative overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=250" alt="Doctor Consultation" className="object-cover opacity-80" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div className="bg-red-500/90 p-2 rounded-full"><Video className="h-4 w-4 text-white" /></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">Dr</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Dr. Sharma</p>
                  <p className="text-xs text-brand-success">08:45 • Ongoing</p>
                </div>
              </div>
            </motion.div>

            {/* AI Checker Card */}
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-10 w-64 bg-white p-5 rounded-3xl shadow-premium border border-slate-100 z-30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg"><Activity className="h-4 w-4 text-purple-600" /></div>
                  <span className="font-semibold text-sm">AI Analysis</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Low Risk</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">Mild fever and headache reported.</p>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/3 rounded-full" />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Comprehensive Care Ecosystem</h2>
            <p className="text-slate-600">Everything you need to manage your health in one place, optimized for all connections.</p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card hoverEffect className="h-full">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", feature.bg, feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Additional sections (Consultation Preview, Records Preview, etc) would go here */}
    </div>
  );
}
