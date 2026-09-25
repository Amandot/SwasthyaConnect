import { Link } from 'react-router-dom';
import { Activity, CalendarDays, FileHeart, HeartPulse, Pill, ShieldCheck, Stethoscope } from 'lucide-react';
import logo from './logo/logo.png';

const patientLinks = [
  { label: 'Patient dashboard', to: '/dashboard' },
  { label: 'Find a doctor', to: '/book-appointment' },
  { label: 'Health records', to: '/health-records' },
  { label: 'Find medicines', to: '/medicines' }
];

const serviceLinks = [
  { label: 'Online consultation', to: '/book-appointment', icon: Stethoscope },
  { label: 'Symptom checker', to: '/symptom-checker', icon: Activity },
  { label: 'Health records', to: '/health-records', icon: FileHeart },
  { label: 'Medicine finder', to: '/medicines', icon: Pill }
];

export default function Footer() {
  return (
    <footer className="bg-[#071426] text-slate-300 dark:bg-[#050f1c]">
      <div className="app-container py-12 sm:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-12">
          <div className="max-w-sm">
            <Link to="/home" className="inline-flex items-center gap-3" aria-label="SwasthyaConnect home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                <img src={logo} alt="" className="h-7 w-7 object-contain" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">SwasthyaConnect</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              A simpler way to discover doctors, book consultations, manage health records, and find essential medicines from one accessible platform.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Built for accessible digital care
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">For patients</h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              {patientLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-400 transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Healthcare services</h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
                    <link.icon className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Support</h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li><Link to="/emergency" className="text-slate-400 transition-colors hover:text-white">Emergency information</Link></li>
              <li><a href="tel:112" className="text-slate-400 transition-colors hover:text-white">National emergency · 112</a></li>
              <li><Link to="/login" className="text-slate-400 transition-colors hover:text-white">Patient & doctor login</Link></li>
            </ul>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CalendarDays className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                Need care now?
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-400">Open the patient portal to book an appointment or join a consultation.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            <span>© 2026 SwasthyaConnect. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility-first care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
