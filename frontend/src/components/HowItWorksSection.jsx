import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileHeart,
  FileText,
  Headphones,
  HeartPulse,
  LayoutDashboard,
  LayoutGrid,
  Mic,
  PhoneCall,
  Pill,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
  Video,
  Wifi
} from 'lucide-react';
import { Button } from './ui/Button';
import { IconBadge, SectionHeader } from './ui/PagePrimitives';
import { cn } from '../lib/utils';

const consultationImage = 'https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=80&w=800&h=600';

const processSteps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up as a patient and access your personalized healthcare experience.',
    icon: UserRound,
    visual: 'account',
    tone: 'primary'
  },
  {
    number: '02',
    title: 'Find the Right Doctor',
    description: 'Explore available doctors and choose the one that matches your healthcare needs.',
    icon: Search,
    visual: 'doctor',
    tone: 'teal'
  },
  {
    number: '03',
    title: 'Book an Appointment',
    description: 'Select your preferred date and available consultation time.',
    icon: CalendarDays,
    visual: 'booking',
    tone: 'success'
  },
  {
    number: '04',
    title: 'Consult Online',
    description: 'Join your scheduled consultation through video or voice.',
    icon: Video,
    visual: 'consultation',
    tone: 'warning'
  },
  {
    number: '05',
    title: 'Manage Your Health',
    description: 'Access your health records, prescriptions, medicines and other available healthcare information.',
    icon: FileHeart,
    visual: 'health',
    tone: 'neutral'
  },
  {
    number: '06',
    title: 'Get AI-Assisted Guidance',
    description: 'Use the symptom checker to describe symptoms and receive AI-assisted health information.',
    icon: Sparkles,
    visual: 'ai',
    tone: 'danger'
  }
];

const journeyStages = [
  {
    label: 'Discover',
    description: 'Find the care option that fits your needs.',
    icon: Search,
    visual: 'discover',
    tone: 'primary'
  },
  {
    label: 'Book',
    description: 'Choose a provider, date and time.',
    icon: CalendarDays,
    visual: 'book',
    tone: 'teal'
  },
  {
    label: 'Consult',
    description: 'Join your scheduled session online.',
    icon: Video,
    visual: 'consult',
    tone: 'success'
  },
  {
    label: 'Manage',
    description: 'Keep available health information organized.',
    icon: FileHeart,
    visual: 'manage',
    tone: 'warning'
  },
  {
    label: 'Understand',
    description: 'Use AI-assisted guidance when needed.',
    icon: Sparkles,
    visual: 'understand',
    tone: 'danger'
  }
];

const bookingSteps = [
  { number: '1', title: 'Choose a Doctor', description: 'Review the available care options.', icon: Stethoscope },
  { number: '2', title: 'Select a Time', description: 'Pick a date and consultation slot.', icon: CalendarDays },
  { number: '3', title: 'Confirm Appointment', description: 'Review the details before booking.', icon: CheckCircle2 }
];

const doctorSteps = [
  { number: '01', title: 'Manage Appointments', description: 'Review the appointments assigned to your doctor portal.', icon: CalendarCheck },
  { number: '02', title: 'Connect With Patients', description: 'Keep the consultation context easy to access.', icon: UsersRound },
  { number: '03', title: 'Conduct Online Consultations', description: 'Join available consultation rooms through the platform.', icon: Video },
  { number: '04', title: 'Manage Records & Prescriptions', description: 'Use the available health information tools in one workspace.', icon: FileText }
];

const principles = [
  { title: 'Simple', description: 'Easy-to-understand healthcare workflows.', icon: LayoutGrid, tone: 'primary' },
  { title: 'Connected', description: 'Your healthcare journey stays connected across services.', icon: Wifi, tone: 'teal' },
  { title: 'Accessible', description: 'Designed to make digital healthcare easier to access.', icon: UsersRound, tone: 'success' },
  { title: 'Human', description: 'Technology designed to support patients and doctors.', icon: HeartPulse, tone: 'warning' }
];

function Reveal({ children, className, delay = 0, y = 20 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MiniAvatar({ initials = 'SC', tone = 'primary', className }) {
  const tones = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/70 dark:text-primary-200',
    teal: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/70 dark:text-cyan-200',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200',
    slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
  };

  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-xl text-[10px] font-extrabold', tones[tone] || tones.primary, className)} aria-hidden="true">
      {initials}
    </span>
  );
}

function MockWindow({ label, children, className }) {
  return (
    <div className={cn('overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-soft dark:border-white/[0.09] dark:bg-slate-950/75', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-3 dark:border-white/[0.07]">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-red-300 dark:bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-amber-300 dark:bg-amber-400/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-300 dark:bg-emerald-400/70" />
        </div>
        <span className="truncate text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{label}</span>
        <span className="h-5 w-5 rounded-md border border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-slate-800" aria-hidden="true" />
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}

function AccountVisual() {
  return (
    <MockWindow label="Patient account">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-white/[0.06] dark:bg-white/[0.035]">
          <MiniAvatar initials="YP" className="h-8 w-8" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-extrabold text-ink dark:text-white">Your patient profile</p>
            <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400">Personal access</p>
          </div>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-slate-100 px-2.5 py-2 dark:border-white/[0.06]">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Name</p>
            <p className="mt-1 text-[10px] font-extrabold text-ink dark:text-white">Your details</p>
          </div>
          <div className="rounded-lg border border-slate-100 px-2.5 py-2 dark:border-white/[0.06]">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Access</p>
            <p className="mt-1 text-[10px] font-extrabold text-ink dark:text-white">Patient</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-2.5 py-2 text-[9px] font-extrabold text-white">
          Continue securely
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </div>
      </div>
    </MockWindow>
  );
}

function DoctorVisual() {
  return (
    <MockWindow label="Doctor discovery">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2 dark:border-white/[0.06] dark:bg-white/[0.035]">
          <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Search available doctors</span>
        </div>
        {[
          { initials: 'GP', label: 'General physician', tone: 'primary' },
          { initials: 'PD', label: 'Pediatric care', tone: 'teal' },
          { initials: 'CM', label: 'Care options', tone: 'slate' }
        ].map((doctor) => (
          <div key={doctor.label} className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2 dark:border-white/[0.06]">
            <MiniAvatar initials={doctor.initials} tone={doctor.tone} className="h-7 w-7" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-extrabold text-ink dark:text-white">{doctor.label}</p>
              <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400">View profile</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" aria-hidden="true" />
          </div>
        ))}
      </div>
    </MockWindow>
  );
}

function BookingVisual() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dates = ['10', '11', '12', '13', '14', '15', '16'];

  return (
    <MockWindow label="Appointment booking">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-300">Choose a date</p>
            <p className="mt-1 text-xs font-extrabold text-ink dark:text-white">Available times</p>
          </div>
          <CalendarDays className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day, index) => (
            <span key={`${day}-${index}`} className="text-[8px] font-extrabold text-slate-400">{day}</span>
          ))}
          {dates.map((date, index) => (
            <span key={date} className={cn('mx-auto flex h-6 w-6 items-center justify-center rounded-lg text-[9px] font-extrabold', index === 3 ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300')}>
              {date}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 border-t border-slate-100 pt-2.5 dark:border-white/[0.06]">
          {['10:00 AM', '11:30 AM', '04:00 PM'].map((time, index) => (
            <span key={time} className={cn('rounded-lg border px-1 py-1.5 text-center text-[8px] font-extrabold', index === 1 ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-200' : 'border-slate-100 text-slate-500 dark:border-white/[0.06] dark:text-slate-400')}>
              {time}
            </span>
          ))}
        </div>
      </div>
    </MockWindow>
  );
}

function ConsultationVisual() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem] bg-slate-900">
      <img src={consultationImage} alt="Doctor-patient consultation preview" className="h-full w-full object-cover opacity-85" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-cyan-200">Online consultation</p>
          <p className="mt-0.5 text-[10px] font-bold text-white">Private care room</p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/90 text-slate-950" aria-hidden="true">
          <Video className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function HealthVisual() {
  return (
    <MockWindow label="Health dashboard">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between rounded-xl bg-primary-50 p-2.5 dark:bg-primary-950/40">
          <div>
            <p className="text-[9px] font-bold text-primary-700 dark:text-primary-200">Health overview</p>
            <p className="mt-0.5 text-[11px] font-extrabold text-primary-950 dark:text-primary-50">Your care space</p>
          </div>
          <FileHeart className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 p-2 dark:border-white/[0.06]">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Records</p>
            <p className="mt-1 text-[10px] font-extrabold text-ink dark:text-white">Organized</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-2 dark:border-white/[0.06]">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Medicines</p>
            <p className="mt-1 text-[10px] font-extrabold text-ink dark:text-white">Available</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 p-2 dark:border-white/[0.06]">
          <Pill className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
          <span className="text-[9px] font-extrabold text-slate-600 dark:text-slate-300">Prescription information</span>
        </div>
      </div>
    </MockWindow>
  );
}

function AiVisual() {
  return (
    <MockWindow label="AI symptom checker">
      <div className="space-y-2.5">
        <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-md bg-primary-600 px-2.5 py-2 text-[9px] font-semibold leading-4 text-white">
          I need help understanding my symptoms.
        </div>
        <div className="max-w-[92%] rounded-xl rounded-tl-md border border-primary-100 bg-primary-50/80 px-2.5 py-2 text-[9px] font-semibold leading-4 text-primary-950 dark:border-primary-800/70 dark:bg-primary-950/40 dark:text-primary-100">
          Describe what you are feeling and review general information.
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 px-2.5 py-2 dark:border-white/[0.06]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="text-[9px] font-semibold text-slate-400">AI assistance available</span>
        </div>
      </div>
    </MockWindow>
  );
}

function StepVisual({ type }) {
  if (type === 'account') return <AccountVisual />;
  if (type === 'doctor') return <DoctorVisual />;
  if (type === 'booking') return <BookingVisual />;
  if (type === 'consultation') return <ConsultationVisual />;
  if (type === 'health') return <HealthVisual />;
  return <AiVisual />;
}

function JourneyPreview({ type }) {
  if (type === 'discover') {
    return (
      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.07] p-3 text-left">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-400/20 text-primary-200"><Search className="h-4 w-4" aria-hidden="true" /></span>
          <div>
            <p className="text-[9px] font-bold text-slate-300">Care directory</p>
            <p className="text-[11px] font-extrabold text-white">Explore options</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-4/5 rounded-full bg-white/15" aria-hidden="true" />
        <div className="mt-2 h-2 w-3/5 rounded-full bg-white/10" aria-hidden="true" />
      </div>
    );
  }

  if (type === 'book') {
    return (
      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.07] p-3 text-left">
        <div className="flex items-center justify-between">
          <CalendarDays className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          <span className="text-[9px] font-extrabold text-cyan-200">Date & time</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {['10', '11', '12', '13'].map((date, index) => <span key={date} className={cn('flex h-6 items-center justify-center rounded-md text-[9px] font-extrabold', index === 2 ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-300')}>{date}</span>)}
        </div>
        <div className="mt-2 h-2 w-2/3 rounded-full bg-white/15" aria-hidden="true" />
      </div>
    );
  }

  if (type === 'consult') {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] border border-white/10 bg-slate-800">
        <img src={consultationImage} alt="" className="h-full w-full object-cover opacity-70" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" aria-hidden="true" />
        <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-emerald-400/90 px-2 py-1 text-[8px] font-extrabold text-slate-950">Ready to join</span>
      </div>
    );
  }

  if (type === 'manage') {
    return (
      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.07] p-3 text-left">
        <div className="flex items-center gap-2">
          <FileHeart className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          <p className="text-[10px] font-extrabold text-white">Health records</p>
        </div>
        <div className="mt-3 space-y-2">
          {['Available records', 'Prescriptions', 'Medicine information'].map((label) => <div key={label} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" /><span className="text-[9px] font-semibold text-slate-300">{label}</span></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.07] p-3 text-left">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/20 text-violet-200"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /></span>
        <p className="text-[10px] font-extrabold text-white">Symptom guidance</p>
      </div>
      <div className="mt-3 rounded-lg bg-white/10 px-2.5 py-2 text-[9px] font-semibold text-slate-300">Describe what you notice.</div>
      <div className="mt-2 flex items-center gap-1.5 text-[8px] font-extrabold text-violet-200"><Bot className="h-3 w-3" aria-hidden="true" /> AI-assisted information</div>
    </div>
  );
}

export default function HowItWorksSection() {
  const reduceMotion = useReducedMotion();
  const timelineContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: reduceMotion ? 0 : 0.08 } }
  };
  const timelineItem = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.48, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div id="how-it-works" className="relative scroll-mt-28 overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-cyan-50/60 py-16 sm:py-20 lg:py-24 dark:from-primary-950/35 dark:via-slate-950 dark:to-cyan-950/20">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl dark:bg-primary-900/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/45 blur-3xl dark:bg-cyan-900/15" aria-hidden="true" />
        <div className="app-container relative">
          <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
                <p className="eyebrow">HOW IT WORKS</p>
                <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-ink dark:text-white sm:text-5xl lg:text-[4rem]">Simple Steps to Better Healthcare</h1>
                <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-8 text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">From finding a doctor to completing your consultation, SwasthyaConnect keeps your healthcare journey simple and connected.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button asChild size="lg" className="w-full sm:w-auto"><Link to="/book-appointment">Find a Doctor<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                  <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto"><a href="#services">Explore Services<ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} y={24} className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute inset-5 -z-10 rounded-[3rem] bg-gradient-to-br from-primary-200/75 via-cyan-100/70 to-transparent blur-2xl dark:from-primary-900/60 dark:via-cyan-950/30 dark:to-transparent" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-slate-200 shadow-float sm:rounded-[2.5rem] dark:border-white/10 dark:bg-slate-800">
                <div className="aspect-[5/4] sm:aspect-[4/3]">
                  <img src={consultationImage} alt="Doctor and patient in a healthcare consultation" className="h-full w-full object-cover" loading="eager" decoding="async" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-primary-900/5" aria-hidden="true" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-ink-950/55 p-3.5 text-white backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:w-64">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10" aria-hidden="true"><HeartPulse className="h-5 w-5 text-cyan-200" /></span>
                  <div><p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-cyan-200">Care, connected</p><p className="mt-1 text-sm font-extrabold">One simple patient journey</p></div>
                </div>
              </div>

              <motion.div animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut' }} className="absolute -left-2 top-8 w-40 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-float backdrop-blur-xl sm:-left-4 sm:w-48 dark:border-white/10 dark:bg-slate-900/95">
                <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300" aria-hidden="true"><CheckCircle2 className="h-4 w-4" /></span><div><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Status</p><p className="mt-0.5 text-xs font-extrabold text-ink dark:text-white">Appointment Confirmed</p></div></div>
              </motion.div>
              <motion.div animate={reduceMotion ? undefined : { y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 5.8, delay: 0.45, ease: 'easeInOut' }} className="absolute -right-2 top-1/3 w-36 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-float backdrop-blur-xl sm:-right-3 sm:w-44 dark:border-white/10 dark:bg-slate-900/95">
                <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300" aria-hidden="true"><Stethoscope className="h-4 w-4" /></span><div><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Care team</p><p className="mt-0.5 text-xs font-extrabold text-ink dark:text-white">Doctor Available</p></div></div>
              </motion.div>
              <motion.div animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6.2, delay: 0.8, ease: 'easeInOut' }} className="absolute -bottom-5 right-5 w-40 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-float backdrop-blur-xl sm:right-8 sm:w-48 dark:border-white/10 dark:bg-slate-900/95">
                <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300" aria-hidden="true"><Video className="h-4 w-4" /></span><div><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Consultation</p><p className="mt-0.5 text-xs font-extrabold text-ink dark:text-white">Online Consultation</p></div></div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="healthcare-journey-heading" className="bg-white py-20 sm:py-24 lg:py-28 dark:bg-slate-950">
        <div className="app-container">
          <Reveal>
            <div id="healthcare-journey-heading">
              <SectionHeader eyebrow="The process" title="Your Healthcare Journey, Simplified" description="Six clear moments take you from your first sign-in to the information and guidance you need next." align="center" />
            </div>
          </Reveal>
          <div className="relative mt-14">
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-[1.1rem] hidden h-px bg-gradient-to-r from-primary-200 via-cyan-200 to-primary-200 dark:from-primary-800/80 dark:via-cyan-800/70 dark:to-primary-800/80 lg:block" aria-hidden="true" />
            <motion.ol variants={timelineContainer} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="grid gap-9 lg:grid-cols-6 lg:gap-4">
              {processSteps.map((step, index) => (
                <motion.li key={step.number} variants={timelineItem} className="relative pl-12 lg:pl-0">
                  {index < processSteps.length - 1 && <span className="absolute bottom-[-2.25rem] left-[1.15rem] top-12 w-px bg-primary-100 dark:bg-primary-900/70 lg:hidden" aria-hidden="true" />}
                  <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl border border-primary-200 bg-white text-xs font-extrabold text-primary-700 shadow-soft dark:border-primary-800 dark:bg-slate-900 dark:text-primary-200 lg:relative lg:mx-auto">
                    {step.number}
                  </div>
                  <div className="mt-5 lg:mt-7"><StepVisual type={step.visual} /></div>
                  <div className="mt-5 flex items-center gap-2 lg:justify-center"><IconBadge icon={step.icon} tone={step.tone} size="sm" /><h3 className="text-sm font-extrabold leading-5 text-ink dark:text-white lg:text-center">{step.title}</h3></div>
                  <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400 lg:text-center">{step.description}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="patient-journey-heading" className="relative overflow-hidden bg-ink-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[52rem] -translate-x-1/2 rounded-full bg-primary-700/20 blur-3xl" aria-hidden="true" />
        <div className="app-container relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-primary-200">Patient journey</p>
            <h2 id="patient-journey-heading" className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">A connected path through care.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">See how discovery, booking, consultation and ongoing information fit together in one simple experience.</p>
          </Reveal>
          <div className="relative mt-14">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-primary-400/50 via-cyan-300/50 to-primary-400/50 lg:block" aria-hidden="true" />
            <ol className="grid gap-10 lg:grid-cols-5 lg:gap-5">
              {journeyStages.map((stage, index) => (
                <motion.li key={stage.label} initial={reduceMotion ? false : { opacity: 0, y: reduceMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.08 }} className="relative pl-12 lg:pl-0 lg:text-center">
                  {index < journeyStages.length - 1 && <span className="absolute bottom-[-2.5rem] left-[1.15rem] top-12 w-px bg-white/15 lg:hidden" aria-hidden="true" />}
                  <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-primary-200 shadow-[0_14px_30px_-20px_rgba(56,189,248,0.8)] lg:relative lg:mx-auto">
                    <stage.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="mt-5 lg:mt-7"><JourneyPreview type={stage.visual} /></div>
                  <h3 className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">{stage.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{stage.description}</p>
                  {index < journeyStages.length - 1 && <ArrowRight className="absolute -right-3 top-[1.1rem] hidden h-5 w-5 text-primary-300/70 lg:block" aria-hidden="true" />}
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="booking-heading" className="bg-canvas py-20 sm:py-24 lg:py-28">
        <div className="app-container">
          <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Booking experience</p>
              <h2 id="booking-heading" className="section-title mt-3 text-balance text-3xl sm:text-4xl lg:text-[2.85rem]">Booking Made Simple</h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-500 dark:text-slate-400">Move through the existing booking flow with clear choices at every stage.</p>
              <ol className="mt-8 space-y-3">
                {bookingSteps.map((step, index) => (
                  <li key={step.number} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-soft transition hover:border-primary-200 hover:bg-white dark:border-white/[0.08] dark:bg-slate-900/70 dark:hover:border-primary-800/70">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-extrabold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">{step.number}</span>
                    <div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold text-ink dark:text-white">{step.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{step.description}</p></div>
                    {index < bookingSteps.length - 1 && <span className="hidden h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 dark:bg-white/[0.05] dark:text-slate-500 sm:flex" aria-hidden="true"><ChevronRight className="h-4 w-4" /></span>}
                  </li>
                ))}
              </ol>
              <Button asChild className="mt-8"><Link to="/book-appointment">Book an Appointment<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            </Reveal>
            <Reveal delay={0.1} y={24} className="relative">
              <div className="absolute -inset-5 -z-10 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-primary-100 to-cyan-50 opacity-75 dark:from-primary-900/50 dark:to-cyan-950/20" aria-hidden="true" />
              <MockWindow label="Appointment booking" className="p-1.5 shadow-float sm:p-2">
                <div className="rounded-[1.1rem] bg-slate-50/80 p-4 dark:bg-slate-950/60 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">Step 1 of 3</p><h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-ink dark:text-white">Choose a doctor</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Review the available care options.</p></div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300" aria-hidden="true"><Stethoscope className="h-5 w-5" /></span>
                  </div>
                  <div className="mt-6 space-y-2.5">
                    {[{ label: 'General physician', meta: 'Available options', tone: 'primary' }, { label: 'Pediatric care', meta: 'Available options', tone: 'teal' }, { label: 'Specialty care', meta: 'Available options', tone: 'slate' }].map((doctor) => (
                      <div key={doctor.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-slate-900"><MiniAvatar initials="DR" tone={doctor.tone} className="h-10 w-10 rounded-xl" /><div className="min-w-0 flex-1"><p className="text-sm font-extrabold text-ink dark:text-white">{doctor.label}</p><p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{doctor.meta}</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Available</span><ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" aria-hidden="true" /></div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-bold text-slate-500 dark:border-white/[0.07] dark:text-slate-400"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" aria-hidden="true" /> Date and time next</span><span className="text-primary-700 dark:text-primary-300">Continue</span></div>
                </div>
              </MockWindow>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="online-consultation-heading" className="relative overflow-hidden border-y border-slate-200/80 bg-white py-20 sm:py-24 lg:py-28 dark:border-white/[0.08] dark:bg-slate-950">
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl dark:bg-cyan-900/20" aria-hidden="true" />
        <div className="app-container relative">
          <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow">Online consultation</p>
              <h2 id="online-consultation-heading" className="section-title mt-3 text-balance text-3xl sm:text-4xl lg:text-[2.85rem]">Meet Your Doctor Online</h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-500 dark:text-slate-400">Once your appointment is confirmed, join your consultation directly through the platform.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[{ label: 'Video', icon: Video }, { label: 'Voice', icon: Headphones }, { label: 'Doctor Information', icon: Stethoscope }, { label: 'Appointment Status', icon: CalendarCheck }].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/75 p-3.5 shadow-soft dark:border-white/[0.08] dark:bg-slate-900/70"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300" aria-hidden="true"><item.icon className="h-4 w-4" /></span><span className="text-xs font-extrabold text-ink dark:text-white">{item.label}</span></div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1} y={24} className="relative">
              <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary-100/90 via-cyan-50/70 to-transparent blur-2xl dark:from-primary-900/50 dark:via-cyan-950/30 dark:to-transparent" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-slate-900 p-2 shadow-float sm:p-3 dark:border-white/[0.1]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.45rem] bg-slate-800">
                  <img src={consultationImage} alt="Video consultation preview" className="h-full w-full object-cover opacity-80" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-slate-950/20" aria-hidden="true" />
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Appointment confirmed</span><span className="rounded-lg bg-white/10 px-2 py-1 text-[9px] font-bold text-slate-200 backdrop-blur">Room ready</span></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-cyan-200">Your consultation</p><p className="mt-1 text-sm font-extrabold text-white">Private care room</p></div><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur" aria-hidden="true"><Mic className="h-4 w-4" /></span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white" aria-hidden="true"><PhoneCall className="h-4 w-4" /></span></div></div>
                </div>
              </div>
              <div className="absolute -left-3 top-10 hidden rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-float backdrop-blur sm:block dark:border-white/10 dark:bg-slate-900/95"><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Consultation</p><p className="mt-1 text-xs font-extrabold text-ink dark:text-white">Video and voice</p></div>
              <div className="absolute -right-3 bottom-12 hidden rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-float backdrop-blur sm:block dark:border-white/10 dark:bg-slate-900/95"><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Status</p><p className="mt-1 text-xs font-extrabold text-ink dark:text-white">Ready to join</p></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="after-consultation-heading" className="bg-canvas py-20 sm:py-24 lg:py-28">
        <div className="app-container">
          <Reveal className="mx-auto max-w-2xl text-center"><p className="eyebrow">After consultation</p><h2 id="after-consultation-heading" className="section-title mt-3">Everything Stays Connected</h2><p className="section-description">Keep the information and tools you need close after your consultation.</p></Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
            {[{ title: 'Health Records', description: 'Keep your available medical records organized.', icon: FileHeart, tone: 'primary' }, { title: 'Prescriptions', description: 'Access prescriptions provided through the platform.', icon: ClipboardList, tone: 'teal' }, { title: 'Medicines', description: 'Search for medicines and pharmacy information.', icon: Pill, tone: 'warning' }].map((card, index) => (
              <Reveal key={card.title} delay={index * 0.08} className="h-full"><article className="group h-full rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-float motion-reduce:transform-none dark:border-white/[0.08] dark:bg-slate-900/80 dark:hover:border-primary-800/70"><IconBadge icon={card.icon} tone={card.tone} size="lg" /><h3 className="mt-7 text-xl font-extrabold tracking-tight text-ink dark:text-white">{card.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{card.description}</p><span className="mt-7 inline-flex items-center gap-1.5 text-sm font-extrabold text-primary-700 dark:text-primary-300">Available in your care space<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" /></span></article></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="ai-guidance-heading" className="relative overflow-hidden border-y border-slate-200/80 bg-white py-20 sm:py-24 lg:py-28 dark:border-white/[0.08] dark:bg-slate-950">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-violet-100/55 blur-3xl dark:bg-violet-950/20" aria-hidden="true" />
        <div className="app-container relative">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-violet-700 dark:text-violet-300">AI-ASSISTED</p>
              <h2 id="ai-guidance-heading" className="section-title mt-3 text-balance text-3xl sm:text-4xl lg:text-[2.85rem]">Need Help Understanding Your Symptoms?</h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-500 dark:text-slate-400">Describe your symptoms and use the AI symptom checker to receive preliminary health information and guidance.</p>
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-100"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" /><p>AI-generated information is for assistance and does not replace professional medical advice.</p></div>
              <Button asChild variant="outline" className="mt-7"><Link to="/symptom-checker">Explore Symptom Guidance<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            </Reveal>
            <Reveal delay={0.1} y={24} className="relative">
              <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-violet-100 via-primary-50 to-cyan-50 opacity-80 dark:from-violet-950/50 dark:via-primary-950/40 dark:to-cyan-950/30" aria-hidden="true" />
              <MockWindow label="AI symptom checker" className="p-1.5 shadow-float sm:p-2">
                <div className="rounded-[1.1rem] bg-slate-50/80 p-4 dark:bg-slate-950/60 sm:p-6">
                  <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-200" aria-hidden="true"><Bot className="h-5 w-5" /></span><div><p className="text-sm font-extrabold text-ink dark:text-white">Health information assistant</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Ready when you are</p></div></div><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-label="Assistant ready" /></div>
                  <div className="mt-7 space-y-3"><div className="ml-auto max-w-[86%] rounded-2xl rounded-tr-md bg-primary-600 px-4 py-3 text-sm leading-6 text-white">I need help understanding how I am feeling.</div><div className="max-w-[90%] rounded-2xl rounded-tl-md border border-primary-100 bg-white px-4 py-3 text-sm leading-6 text-primary-950 shadow-sm dark:border-primary-800/70 dark:bg-primary-950/40 dark:text-primary-100">Share what you notice, and use the information as a starting point for your next care decision.</div></div>
                  <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/[0.08] dark:bg-slate-900"><span className="flex-1 text-xs text-slate-400">Describe your symptoms...</span><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-white" aria-hidden="true"><Send className="h-3.5 w-3.5" /></span></div>
                </div>
              </MockWindow>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="doctors-heading" className="bg-canvas py-20 sm:py-24 lg:py-28">
        <div className="app-container">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
            <Reveal className="relative">
              <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary-100/80 to-cyan-50/60 blur-2xl dark:from-primary-900/50 dark:to-cyan-950/20" aria-hidden="true" />
              <MockWindow label="Doctor dashboard" className="p-1.5 shadow-float sm:p-2">
                <div className="rounded-[1.1rem] bg-slate-50/80 p-4 dark:bg-slate-950/60 sm:p-6">
                  <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">Doctor workspace</p><h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-ink dark:text-white">Your care overview</h3></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300" aria-hidden="true"><LayoutDashboard className="h-5 w-5" /></span></div>
                  <div className="mt-6 grid grid-cols-3 gap-2.5"><div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-slate-900"><p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Schedule</p><p className="mt-1 text-lg font-extrabold text-ink dark:text-white">Today</p></div><div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-slate-900"><p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Rooms</p><p className="mt-1 text-lg font-extrabold text-ink dark:text-white">Ready</p></div><div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-slate-900"><p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Care</p><p className="mt-1 text-lg font-extrabold text-ink dark:text-white">Connected</p></div></div>
                  <div className="mt-4 space-y-2.5"><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-slate-900"><MiniAvatar initials="PT" tone="teal" className="h-9 w-9" /><div className="min-w-0 flex-1"><p className="text-xs font-extrabold text-ink dark:text-white">Upcoming appointment</p><p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Consultation room available</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Ready</span></div><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300" aria-hidden="true"><FileText className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-extrabold text-ink dark:text-white">Care information</p><p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Records and prescriptions</p></div><ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" aria-hidden="true" /></div></div>
                </div>
              </MockWindow>
            </Reveal>
            <Reveal>
              <p className="eyebrow">For doctors</p>
              <h2 id="doctors-heading" className="section-title mt-3 text-balance text-3xl sm:text-4xl lg:text-[2.85rem]">Built for Doctors, Too</h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-500 dark:text-slate-400">A focused workspace helps doctors stay oriented around appointments, patients and online care.</p>
              <ol className="mt-8 space-y-3">
                {doctorSteps.map((step) => (
                  <li key={step.number} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-soft dark:border-white/[0.08] dark:bg-slate-900/70"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-extrabold text-primary-700 dark:bg-slate-800 dark:text-primary-300">{step.number}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold text-ink dark:text-white">{step.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{step.description}</p></div><step.icon className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" aria-hidden="true" /></li>
                ))}
              </ol>
              <Button asChild variant="outline" className="mt-7"><Link to="/login/doctor">Doctor Login<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-heading" className="border-y border-slate-200/80 bg-white py-20 sm:py-24 lg:py-28 dark:border-white/[0.08] dark:bg-slate-950">
        <div className="app-container">
          <Reveal className="mx-auto max-w-2xl text-center"><p className="eyebrow">The experience</p><h2 id="principles-heading" className="section-title mt-3">Designed around the way care feels.</h2><p className="section-description">A calm interface helps patients and doctors focus on the next useful action.</p></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.07} className="h-full"><article className="group h-full rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-float motion-reduce:transform-none dark:border-white/[0.08] dark:bg-slate-900/80 dark:hover:border-primary-800/70"><IconBadge icon={principle.icon} tone={principle.tone} size="lg" /><h3 className="mt-7 text-xl font-extrabold text-ink dark:text-white">{principle.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{principle.description}</p><span className="mt-7 block h-1 w-10 rounded-full bg-primary-100 transition-all duration-300 group-hover:w-16 dark:bg-primary-900/60" aria-hidden="true" /></article></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="final-cta-heading" className="bg-canvas py-16 sm:py-20 lg:py-24">
        <div className="app-container">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-800 via-primary-700 to-cyan-700 px-6 py-14 text-center text-white shadow-premium sm:px-10 sm:py-16 lg:px-16">
            <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-2xl" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)', backgroundSize: '24px 24px' }} aria-hidden="true" />
            <div className="relative mx-auto max-w-2xl"><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary-100">Your next step</p><h2 id="final-cta-heading" className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl lg:text-5xl">Your Healthcare Journey Starts Here</h2><p className="mx-auto mt-4 max-w-xl text-base leading-8 text-primary-50/85">Find a doctor, book an appointment and connect with healthcare services through SwasthyaConnect.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg" className="bg-white text-primary-700 shadow-xl hover:bg-primary-50"><Link to="/book-appointment">Find a Doctor</Link></Button><Button asChild size="lg" className="border border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15"><a href="#services">Explore Services</a></Button></div></div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
