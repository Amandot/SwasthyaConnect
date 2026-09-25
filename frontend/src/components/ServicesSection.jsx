import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileHeart,
  FileText,
  HeartPulse,
  Mic2,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Video,
  Wifi
} from 'lucide-react';
import { Button } from './ui/Button';
import { IconBadge, SectionHeader } from './ui/PagePrimitives';
import { cn } from '../lib/utils';

const heroImage = 'https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=80&w=800&h=600';
const connectedImage = heroImage;

const services = [
  {
    title: 'Find a Doctor',
    description: 'Discover doctors based on your healthcare needs and connect with the right specialist.',
    icon: Stethoscope,
    tone: 'primary',
    cta: 'Find a Doctor',
    to: '/book-appointment'
  },
  {
    title: 'Book an Appointment',
    description: 'Choose a doctor, select a suitable time, and schedule your consultation with ease.',
    icon: CalendarDays,
    tone: 'teal',
    cta: 'Book Appointment',
    to: '/book-appointment'
  },
  {
    title: 'Online Consultation',
    description: 'Connect with your doctor through secure online video or voice consultation.',
    icon: Video,
    tone: 'success',
    cta: 'Start Consultation',
    to: '/book-appointment'
  },
  {
    title: 'Health Records',
    description: 'Keep your health records and prescriptions organized and accessible in one place.',
    icon: FileHeart,
    tone: 'warning',
    cta: 'View Records',
    to: '/health-records'
  },
  {
    title: 'Medicines & Pharmacy',
    description: 'Search medicines and find available pharmacy information through the platform.',
    icon: Pill,
    tone: 'neutral',
    cta: 'Find Medicines',
    to: '/medicines'
  },
  {
    title: 'AI Symptom Checker',
    description: 'Describe your symptoms and receive AI-assisted health information to help you understand your next step.',
    icon: Sparkles,
    tone: 'danger',
    cta: 'Check Symptoms',
    to: '/symptom-checker'
  }
];

const connectedChecklist = [
  'Find the right doctor',
  'Schedule appointments',
  'Consult online',
  'Access health records',
  'Search medicines',
  'Get AI-assisted symptom guidance'
];

const principles = [
  {
    number: '01',
    title: 'Accessible',
    description: 'Healthcare services designed to be simple and easy to access.',
    icon: HeartPulse,
    tone: 'primary'
  },
  {
    number: '02',
    title: 'Connected',
    description: 'Doctors, appointments, consultations and records in one platform.',
    icon: Wifi,
    tone: 'teal'
  },
  {
    number: '03',
    title: 'Intelligent',
    description: 'AI-assisted tools to support better health information.',
    icon: Sparkles,
    tone: 'warning'
  },
  {
    number: '04',
    title: 'Patient-Centered',
    description: 'Designed around the needs of patients and healthcare professionals.',
    icon: UserRound,
    tone: 'success'
  }
];

const consultationFeatures = [
  { title: 'Video Consultation', description: 'See and speak with your doctor online.', icon: Video, tone: 'primary' },
  { title: 'Voice Consultation', description: 'Join with an audio-first consultation experience.', icon: Mic2, tone: 'teal' },
  { title: 'Appointment Based Access', description: 'Access consultations through your scheduled appointment.', icon: CalendarCheck, tone: 'success' }
];

const recordItems = [
  { label: 'Medical records', detail: 'Recent consultation history', icon: FileText },
  { label: 'Prescriptions', detail: 'Available care instructions', icon: ClipboardList },
  { label: 'Doctor information', detail: 'Provider details and visits', icon: Stethoscope },
  { label: 'Dates and history', detail: 'A clear timeline of care', icon: CalendarDays }
];

const medicineItems = [
  { label: 'Medicine search', detail: 'Search by medicine name', icon: Search },
  { label: 'Pharmacy information', detail: 'Find listed pharmacy details', icon: Pill },
  { label: 'Availability where supported', detail: 'View available information', icon: CheckCircle2 }
];

function Reveal({ children, className, delay = 0, y = 22 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl px-3 pb-8 pt-8 sm:px-8 sm:pb-12 sm:pt-10 lg:max-w-none lg:px-12">
      <div className="absolute inset-8 -z-10 rounded-[3rem] bg-primary-100/70 blur-3xl dark:bg-primary-900/20" aria-hidden="true" />
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/80 bg-slate-200 shadow-float transition duration-500 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-800 sm:aspect-[5/4] lg:aspect-[4/5]">
        <img
          src={heroImage}
          alt="A healthcare professional using digital technology with a patient"
          className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 motion-reduce:transform-none"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-ink-950/5 to-primary-900/10" aria-hidden="true" />
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 text-white sm:bottom-7 sm:left-7 sm:right-7">
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-ink-950/55 px-3.5 py-2.5 backdrop-blur-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10" aria-hidden="true">
              <HeartPulse className="h-4 w-4" />
            </span>
            <span className="text-xs font-extrabold">Care, connected</span>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold text-primary-700 sm:inline-flex dark:bg-white/10 dark:text-primary-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Available
          </span>
        </div>
      </div>

      <div className="absolute left-0 top-3 w-[10.5rem] rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:left-1 sm:w-[12.5rem] sm:p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300" aria-hidden="true">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Booking</p>
            <p className="mt-0.5 text-xs font-extrabold text-ink dark:text-white">Appointment Confirmed</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">Your care time is ready</p>
      </div>

      <div className="absolute right-0 top-[31%] w-[10.75rem] rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:right-1 sm:w-[12.75rem] sm:p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
            <Stethoscope className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Care team</p>
            <p className="mt-0.5 text-xs font-extrabold text-ink dark:text-white">Doctor Available</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
          Browse available doctors
        </div>
      </div>

      <div className="absolute bottom-0 left-2 right-2 rounded-2xl border border-primary-100/80 bg-white/95 p-3.5 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:left-5 sm:right-auto sm:w-[13rem] sm:p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300" aria-hidden="true">
            <Video className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Consultation</p>
            <p className="mt-0.5 text-xs font-extrabold text-ink dark:text-white">Online Consultation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, index }) {
  return (
    <Reveal delay={index * 0.07} className="h-full">
      <Link
        to={service.to}
        className="group flex h-full min-h-[19rem] flex-col rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:hover:translate-y-0 dark:border-white/[0.08] dark:bg-slate-900/80 dark:hover:border-primary-800/70"
      >
        <div className="flex items-start justify-between gap-4">
          <IconBadge icon={service.icon} tone={service.tone} size="lg" />
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition group-hover:border-primary-200 group-hover:bg-primary-50 group-hover:text-primary-700 dark:border-white/[0.08] dark:group-hover:border-primary-800 dark:group-hover:bg-primary-900/50 dark:group-hover:text-primary-300" aria-hidden="true">
            <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:rotate-0 motion-reduce:transform-none" />
          </span>
        </div>
        <h3 className="mt-7 text-xl font-extrabold tracking-[-0.025em] text-ink dark:text-white">{service.title}</h3>
        <p className="mt-3 text-[15px] leading-7 text-slate-500 dark:text-slate-400">{service.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-extrabold text-primary-700 dark:text-primary-300">
          {service.cta}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
        </span>
      </Link>
    </Reveal>
  );
}

function ConnectedVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -inset-5 -z-10 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-primary-100 to-cyan-50 opacity-80 dark:from-primary-900/50 dark:to-cyan-950/20" aria-hidden="true" />
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/80 bg-slate-200 shadow-float transition duration-500 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-800 sm:aspect-[5/4]">
        <img
          src={connectedImage}
          alt="A patient and healthcare professional using a digital healthcare platform"
          className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 motion-reduce:transform-none"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/65 via-transparent to-primary-950/10" aria-hidden="true" />
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-ink-950/55 p-4 text-white backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10" aria-hidden="true">
              <Wifi className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-cyan-200">One care space</p>
              <p className="mt-1 text-sm font-extrabold">From search to follow-through</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-2 rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:-left-6 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Connected care</p>
            <p className="mt-0.5 text-xs font-extrabold text-ink dark:text-white">Information stays organized</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelehealthVisual() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-primary-200/60 blur-2xl dark:bg-primary-900/25" aria-hidden="true" />
      <div className="overflow-hidden rounded-[2rem] border border-primary-200/80 bg-white shadow-float dark:border-primary-800/70 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-4 dark:border-white/[0.08] dark:bg-slate-950/50 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
              <Video className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Consultation room</p>
              <p className="mt-0.5 text-sm font-extrabold text-ink dark:text-white">Ready when you are</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Connected
          </span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[1.4fr_0.8fr] sm:p-6">
          <div className="relative flex min-h-[14rem] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-ink-950 via-primary-950 to-cyan-950 sm:min-h-[17rem]">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(34,211,238,.28), transparent 28%), radial-gradient(circle at 80% 70%, rgba(96,165,250,.24), transparent 30%)' }} aria-hidden="true" />
            <div className="relative flex flex-col items-center text-center text-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-primary-100 shadow-2xl" aria-hidden="true">
                <UserRound className="h-7 w-7" />
              </span>
              <p className="mt-4 text-sm font-extrabold">Your doctor</p>
              <p className="mt-1 text-[10px] font-semibold text-primary-100/70">Video consultation preview</p>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-[10px] font-bold text-white backdrop-blur-xl">
              <Mic2 className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
              Voice available
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            {consultationFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/[0.08] dark:bg-slate-950/50 sm:p-4">
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold', feature.tone === 'primary' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300' : feature.tone === 'teal' ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300')} aria-hidden="true">
                  <feature.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[10px] font-extrabold leading-4 text-ink dark:text-white">{feature.title}</p>
                <p className="mt-1 hidden text-[9px] leading-4 text-slate-500 dark:text-slate-400 sm:block">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-slate-200/80 px-4 py-4 dark:border-white/[0.08] sm:px-6">
          {['Video', 'Voice', 'Appointment Status'].map((label) => (
            <div key={label} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-center text-[9px] font-extrabold text-slate-500 dark:bg-slate-950/50 dark:text-slate-300">
              <Check className="h-3 w-3 text-primary-600 dark:text-primary-300" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -left-3 top-12 hidden rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:block">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Access</p>
        <p className="mt-1 text-xs font-extrabold text-ink dark:text-white">Scheduled appointment</p>
      </div>
    </div>
  );
}

function AIVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-[2rem] border border-primary-100 bg-white/90 shadow-float backdrop-blur-xl dark:border-primary-800/70 dark:bg-slate-900/90">
        <div className="flex items-center justify-between border-b border-primary-100/80 bg-white/80 px-5 py-4 dark:border-white/[0.08] dark:bg-slate-950/50 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Symptom guidance</p>
              <p className="mt-0.5 text-sm font-extrabold text-ink dark:text-white">A helpful starting point</p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 text-[10px] font-extrabold text-primary-700 dark:text-primary-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
            AI-assisted
          </span>
        </div>
        <div className="space-y-4 p-5 sm:p-7">
          <div className="flex items-end justify-between gap-3 text-[10px] font-semibold text-slate-400">
            <span>Patient conversation</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" aria-hidden="true" /> AI-assisted</span>
          </div>
          <div className="space-y-3">
            <div className="ml-auto max-w-[84%] rounded-2xl rounded-tr-md bg-primary-600 px-4 py-3 text-sm leading-6 text-white">I have been feeling unwell and want help understanding my next step.</div>
            <div className="max-w-[90%] rounded-2xl rounded-tl-md border border-primary-100 bg-primary-50/80 px-4 py-3 text-sm leading-6 text-primary-950 dark:border-primary-800/70 dark:bg-primary-950/40 dark:text-primary-100">Share what you notice and use the information as a starting point for your next care decision.</div>
            <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm dark:border-white/[0.08] dark:bg-slate-950/60 dark:text-slate-300">I can describe the symptoms I have noticed.</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {['Describe your symptoms', 'AI-assisted analysis', 'Next-step guidance'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-primary-100/80 bg-white px-3 py-2.5 text-[10px] font-extrabold text-primary-800 dark:border-primary-800/60 dark:bg-slate-950/60 dark:text-primary-200">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-400 dark:border-white/[0.08] dark:bg-slate-950/50">
            <Search className="h-4 w-4" aria-hidden="true" />
            Describe what you are noticing
            <span className="ml-auto rounded-lg bg-primary-50 px-2 py-1 text-[9px] font-extrabold text-primary-700 dark:bg-primary-900/60 dark:text-primary-300">Symptom checker</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecordsVisual() {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-canvas p-4 dark:border-white/[0.08] dark:bg-slate-950/60 sm:p-5">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-white/[0.08]">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Health records</p>
          <p className="mt-1 text-sm font-extrabold text-ink dark:text-white">Your care history</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
          <FileHeart className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {recordItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3 dark:border-white/[0.08] dark:bg-slate-900/70">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300" aria-hidden="true">
              <item.icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-extrabold text-ink dark:text-white">{item.label}</p>
              <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-500 dark:text-slate-400">{item.detail}</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MedicinesVisual() {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-canvas p-4 dark:border-white/[0.08] dark:bg-slate-950/60 sm:p-5">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3 dark:border-white/[0.08] dark:bg-slate-900/70">
        <Search className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" aria-hidden="true" />
        <span className="text-xs font-semibold text-slate-400">Search medicines</span>
        <span className="ml-auto rounded-lg bg-primary-50 px-2 py-1 text-[9px] font-extrabold text-primary-700 dark:bg-primary-900/60 dark:text-primary-300">Search</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {medicineItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3 dark:border-white/[0.08] dark:bg-slate-900/70">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300" aria-hidden="true">
              <item.icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-extrabold text-ink dark:text-white">{item.label}</p>
              <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-500 dark:text-slate-400">{item.detail}</p>
            </div>
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <div id="services" className="scroll-mt-32">
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-canvas to-canvas py-20 sm:py-24 lg:py-32 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary-100/70 blur-3xl dark:bg-primary-900/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 top-24 h-96 w-96 rounded-full bg-cyan-100/60 blur-3xl dark:bg-cyan-900/10" aria-hidden="true" />
        <div className="app-container relative">
          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 xl:gap-20">
            <Reveal className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
              <p className="eyebrow">OUR SERVICES</p>
              <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.055em] text-ink dark:text-white sm:text-5xl lg:text-[4rem]">Healthcare, Connected Around You</h1>
              <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-8 text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">From finding the right doctor to managing your health records and getting AI-assisted guidance, SwasthyaConnect brings essential healthcare services into one simple platform.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg" className="group w-full sm:w-auto">
                  <Link to="/book-appointment">
                    Find a Doctor
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <a href="#how-it-works">
                    See How It Works
                    <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </Reveal>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section aria-labelledby="services-overview-heading" className="bg-white py-20 sm:py-24 lg:py-28 dark:bg-slate-950">
        <div className="app-container">
          <Reveal>
            <div id="services-overview-heading">
              <SectionHeader eyebrow="Service overview" title="Everything You Need for Better Healthcare" description="Access essential healthcare services from one secure and easy-to-use platform." align="center" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}
          </div>
        </div>
      </section>

      <section aria-labelledby="connected-care-heading" className="relative overflow-hidden bg-ink-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-primary-700/20 blur-3xl" aria-hidden="true" />
        <div className="app-container relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <Reveal>
              <ConnectedVisual />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="eyebrow text-cyan-200">CONNECTED CARE</p>
              <h2 id="connected-care-heading" className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-[3.1rem]">From Your First Search to Your Consultation</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">Discover doctors, schedule appointments, consult online, and manage your healthcare information from the same platform.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {connectedChecklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-slate-100">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-200" aria-hidden="true">
                      <Check className="h-4 w-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="consultation-services-heading" className="relative overflow-hidden bg-primary-50/70 py-20 sm:py-24 lg:py-28 dark:bg-primary-950/20">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl dark:bg-cyan-900/10" aria-hidden="true" />
        <div className="app-container relative">
          <Reveal>
            <div id="consultation-services-heading">
              <SectionHeader eyebrow="Online consultation" title="Consult Your Doctor From Anywhere" description="Connect with your doctor through online video or voice consultation without needing to be physically present." align="center" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <TelehealthVisual />
          </Reveal>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="w-full sm:w-auto"><Link to="/book-appointment">Start Consultation<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline" className="w-full sm:w-auto"><a href="#how-it-works">See How It Works</a></Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="services-ai-heading" className="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/50 to-cyan-50/50 py-20 sm:py-24 lg:py-28 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-primary-100/70 blur-3xl dark:bg-primary-900/20" aria-hidden="true" />
        <div className="app-container relative">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-primary-700 dark:text-primary-300">AI-ASSISTED HEALTHCARE</p>
              <h2 id="services-ai-heading" className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-[-0.04em] text-ink dark:text-white sm:text-4xl lg:text-[3.1rem]">Understand Your Symptoms Better</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">SwasthyaConnect provides AI-assisted symptom analysis to help users understand their symptoms and consider appropriate next steps.</p>
              <div className="mt-8 space-y-3">
                {['Describe your symptoms', 'AI-assisted analysis', 'Next-step guidance'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-extrabold text-ink dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-white shadow-[0_10px_20px_-14px_rgba(18,104,177,0.8)]" aria-hidden="true">
                      <Check className="h-4 w-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-md border-l-2 border-primary-300 pl-4 text-sm font-semibold leading-6 text-slate-500 dark:border-primary-700 dark:text-slate-400">AI-generated information is for assistance and does not replace professional medical diagnosis or advice.</p>
              <Button asChild className="mt-7 w-full sm:w-auto"><Link to="/symptom-checker">Check Symptoms<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            </Reveal>
            <Reveal delay={0.1}>
              <AIVisual />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="records-medicines-heading" className="bg-white py-20 sm:py-24 lg:py-28 dark:bg-slate-950">
        <div className="app-container">
          <Reveal>
            <div id="records-medicines-heading">
              <SectionHeader eyebrow="Your care tools" title="Keep Essential Health Information Close" description="Use clear, product-style views for the health information and tools available through SwasthyaConnect." align="center" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-[1.8rem] border border-slate-200/80 bg-canvas p-5 shadow-card sm:p-7 dark:border-white/[0.08] dark:bg-slate-900/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <IconBadge icon={FileHeart} tone="primary" size="lg" />
                    <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] text-ink dark:text-white">Your Health Records, Organized</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">Keep available medical records, prescriptions, doctor information, and dates together in one view.</p>
                  </div>
                  <Link to="/health-records" aria-label="View health records" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-white/[0.08] dark:hover:border-primary-800 dark:hover:bg-primary-900/50 dark:hover:text-primary-300">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="mt-7"><RecordsVisual /></div>
                <Button asChild variant="outline" className="mt-6 w-full sm:w-auto"><Link to="/health-records">View Records<ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="h-full rounded-[1.8rem] border border-slate-200/80 bg-canvas p-5 shadow-card sm:p-7 dark:border-white/[0.08] dark:bg-slate-900/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <IconBadge icon={Pill} tone="teal" size="lg" />
                    <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] text-ink dark:text-white">Find Medicines More Easily</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">Search for medicines and find pharmacy information, including availability where supported.</p>
                  </div>
                  <Link to="/medicines" aria-label="Find medicines" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-white/[0.08] dark:hover:border-primary-800 dark:hover:bg-primary-900/50 dark:hover:text-primary-300">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="mt-7"><MedicinesVisual /></div>
                <Button asChild variant="outline" className="mt-6 w-full sm:w-auto"><Link to="/medicines">Find Medicines<ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="services-principles-heading" className="bg-canvas py-20 sm:py-24 lg:py-28 dark:bg-slate-950">
        <div className="app-container">
          <Reveal>
            <div id="services-principles-heading">
              <SectionHeader eyebrow="Why SwasthyaConnect" title="Designed Around Your Healthcare Journey" description="A calm, connected experience helps patients and healthcare professionals focus on the next useful action." align="center" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.07} className="h-full">
                <article className="group flex h-full flex-col rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-float motion-reduce:transform-none motion-reduce:hover:translate-y-0 dark:border-white/[0.08] dark:bg-slate-900/80 dark:hover:border-primary-800/70">
                  <div className="flex items-center justify-between gap-3">
                    <IconBadge icon={principle.icon} tone={principle.tone} size="md" />
                    <span className="text-2xl font-extrabold tracking-[-0.05em] text-slate-200 dark:text-slate-700">{principle.number}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold tracking-[-0.025em] text-ink dark:text-white">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{principle.description}</p>
                  <span className="mt-auto block h-1 w-10 rounded-full bg-primary-100 transition-all duration-300 group-hover:w-16 dark:bg-primary-900/60" aria-hidden="true" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="services-final-cta-heading" className="relative overflow-hidden bg-primary-800 py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-36 -right-16 h-96 w-96 rounded-full border border-cyan-200/10" aria-hidden="true" />
        <div className="app-container relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary-100 ring-1 ring-white/15" aria-hidden="true">
              <HeartPulse className="h-7 w-7" />
            </span>
            <h2 id="services-final-cta-heading" className="mt-6 text-balance text-3xl font-extrabold leading-tight tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">Take the Next Step in Your Healthcare Journey</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-primary-50/85">Find a doctor, book a consultation, or explore the healthcare services available through SwasthyaConnect.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full bg-white text-primary-800 shadow-xl hover:bg-primary-50 sm:w-auto">
                <Link to="/book-appointment">Find a Doctor<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 sm:w-auto">
                <a href="#how-it-works">Explore How It Works<ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" /></a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
