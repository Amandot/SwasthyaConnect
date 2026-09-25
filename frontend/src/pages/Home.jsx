import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Baby,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileHeart,
  Headphones,
  HeartPulse,
  Languages,
  LayoutGrid,
  Mic2,
  Pill,
  Search,
  Smartphone,
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
  Video,
  Wifi
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { IconBadge } from '../components/ui/PagePrimitives';
import Footer from '../components/Footer';
import HowItWorksSection from '../components/HowItWorksSection';
import ServicesSection from '../components/ServicesSection';

const metrics = [
  {
    value: '6',
    label: 'care services',
    description: 'Connected across the patient journey',
    icon: HeartPulse
  },
  {
    value: '2',
    label: 'consultation modes',
    description: 'Video and voice options',
    icon: Video
  },
  {
    value: '7',
    label: 'voice languages',
    description: 'For voice-enabled interactions',
    icon: Languages
  }
];

const specialties = [
  { name: 'General Physician', icon: Stethoscope },
  { name: 'Pediatrician', icon: Baby },
  { name: 'Cardiologist', icon: HeartPulse },
  { name: 'Dermatologist', icon: Sparkles }
];

const pwaFeatures = [
  {
    title: 'Responsive navigation',
    description: 'Core care actions stay easy to reach across phone, tablet, and desktop layouts.',
    icon: Smartphone
  },
  {
    title: 'Standalone display',
    description: 'The platform includes progressive web app support for a focused app-like view.',
    icon: LayoutGrid
  },
  {
    title: 'Focused interface',
    description: 'Clear cards and concise actions help you move through your care journey.',
    icon: Wifi
  }
];

export default function Home() {
  const reduceMotion = useReducedMotion();

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : 0.05
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-hidden bg-canvas text-ink dark:bg-[#07111f] dark:text-slate-100">
        <section className="relative overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-14">
          <div className="pointer-events-none absolute -left-28 top-8 h-72 w-72 rounded-full bg-primary-100/70 blur-3xl dark:bg-primary-900/20 sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl dark:bg-cyan-900/10 sm:h-[28rem] sm:w-[28rem]" aria-hidden="true" />
          <div className="app-container relative">
            <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:gap-16">
              <motion.div
                initial={reduceMotion ? false : 'hidden'}
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left"
              >
                <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3.5 py-2 text-xs font-bold text-primary-700 shadow-soft backdrop-blur dark:border-primary-800/70 dark:bg-slate-900/70 dark:text-primary-300">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/60" aria-hidden="true">
                    <HeartPulse className="h-3.5 w-3.5" />
                  </span>
                  Healthcare access, made simpler
                </motion.div>

                <motion.h1 variants={fadeUp} className="text-balance text-[2.65rem] font-extrabold leading-[1.04] tracking-[-0.05em] text-ink dark:text-white sm:text-6xl lg:text-[4.2rem] xl:text-[4.85rem]">
                  Healthcare Access,
                  <span className="mt-1 block bg-gradient-to-r from-primary-700 via-primary-600 to-cyan-500 bg-clip-text text-transparent dark:from-primary-300 dark:via-primary-400 dark:to-cyan-300">
                    Wherever You Are
                  </span>
                </motion.h1>

                <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-balance text-base font-medium leading-8 text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">
                  Discover doctors, choose video or voice, and manage your healthcare journey from one accessible platform.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button asChild size="lg" className="group w-full sm:w-auto">
                    <Link to="/book-appointment">
                      Find a Doctor
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                    <a href="#services">
                      Explore Healthcare Services
                      <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 lg:justify-start">
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand-success dark:text-emerald-400" aria-hidden="true" />
                    Video and voice
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand-success dark:text-emerald-400" aria-hidden="true" />
                    Health records
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand-success dark:text-emerald-400" aria-hidden="true" />
                    Text and voice guidance
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto w-full max-w-xl px-3 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10 lg:max-w-none lg:px-10"
              >
                <div className="absolute inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-primary-200/70 via-cyan-100/50 to-transparent blur-2xl dark:from-primary-800/40 dark:via-cyan-900/20 dark:to-transparent" aria-hidden="true" />

                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/80 bg-slate-200 shadow-float sm:rounded-[2.5rem] dark:border-white/10 dark:bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=80&w=800&h=600"
                    alt="A doctor consulting with a patient"
                    className="h-full w-full object-cover object-center"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-primary-900/5" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="inline-flex max-w-[16rem] items-center gap-3 rounded-2xl border border-white/20 bg-ink-950/55 px-4 py-3 text-white backdrop-blur-xl">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10" aria-hidden="true">
                        <Stethoscope className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-200">Care, connected</span>
                        <span className="mt-0.5 block text-sm font-bold">From discovery to follow-through</span>
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                  className="absolute left-0 top-4 w-[11.25rem] rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:left-1 sm:w-[13.25rem] sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
                      <Video className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Consultation</p>
                      <p className="mt-0.5 text-sm font-extrabold text-ink dark:text-white">Video or voice</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                    <Clock3 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
                    Choose a suitable time
                  </div>
                </motion.div>

                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-1 right-0 w-[11.75rem] rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:right-1 sm:w-[13.5rem] sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-brand-success dark:bg-emerald-950/60 dark:text-emerald-300" aria-hidden="true">
                      <FileHeart className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Health record</p>
                      <p className="mt-0.5 text-sm font-extrabold text-ink dark:text-white">Organized in one place</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                    Appointments and reports
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section aria-labelledby="platform-capabilities" className="border-y border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-slate-900/70">
          <div className="app-container py-8 sm:py-10">
            <h2 id="platform-capabilities" className="sr-only">Platform capabilities</h2>
            <div className="grid divide-y divide-slate-200/80 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-white/[0.08]">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
                  className="flex items-center gap-4 py-5 first:pt-0 last:pb-0 md:justify-center md:px-5 md:py-1 md:first:justify-start md:first:pl-0 md:last:justify-end md:last:pr-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-800/70 dark:bg-primary-900/50 dark:text-primary-300" aria-hidden="true">
                    <metric.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-extrabold tracking-[-0.04em] text-ink dark:text-white">
                      {metric.value} <span className="text-sm font-bold tracking-normal text-slate-600 dark:text-slate-300">{metric.label}</span>
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{metric.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ServicesSection />
        <section className="relative overflow-hidden border-y border-slate-200/80 bg-white py-20 sm:py-24 lg:py-28 dark:border-white/[0.08] dark:bg-slate-950">
          <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-primary-50 blur-3xl dark:bg-primary-900/20" aria-hidden="true" />
          <div className="app-container relative">
            <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 xl:gap-20">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: reduceMotion ? 0 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reduceMotion ? 0 : 0.55 }}
              >
                <p className="eyebrow">Doctor discovery</p>
                <h2 className="section-title max-w-xl text-balance text-3xl sm:text-4xl lg:text-[2.75rem]">Start with the specialty you need.</h2>
                <p className="mt-5 max-w-lg text-base leading-8 text-slate-500 dark:text-slate-400">
                  Browse the available specialties, review the care options shown in the booking experience, and choose a date and time that works for you.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link to="/book-appointment">
                      Find a Doctor
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="#how-it-works">See how it works</a>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: reduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: reduceMotion ? 0 : 0.6 }}
                className="relative"
              >
                <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2.25rem] bg-gradient-to-br from-primary-100 to-cyan-50 opacity-70 dark:from-primary-900/60 dark:to-cyan-950/20" aria-hidden="true" />
                <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-canvas shadow-float dark:border-white/[0.08] dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-5 py-5 dark:border-white/[0.08] dark:bg-slate-950/60 sm:px-7">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-primary-700 dark:text-primary-300">Doctor directory</p>
                      <h3 className="mt-1 text-lg font-extrabold text-ink dark:text-white">Browse by specialty</h3>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
                      <Search className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {specialties.map((specialty) => (
                        <Link
                          key={specialty.name}
                          to="/book-appointment"
                          className="group flex min-h-[5.5rem] items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 transition hover:border-primary-200 hover:bg-primary-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-white/[0.08] dark:bg-slate-950/50 dark:hover:border-primary-800 dark:hover:bg-primary-900/25"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-primary-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-900 dark:group-hover:text-primary-300" aria-hidden="true">
                            <specialty.icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1 text-sm font-extrabold text-ink dark:text-white">{specialty.name}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600 motion-reduce:transform-none dark:text-slate-600 dark:group-hover:text-primary-300" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3 border-t border-slate-200/80 pt-5 sm:grid-cols-3 dark:border-white/[0.08]">
                      {[
                        { icon: CalendarDays, label: 'Choose a date' },
                        { icon: Clock3, label: 'Pick a time' },
                        { icon: Headphones, label: 'Video or voice' }
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm dark:bg-slate-800 dark:text-primary-300" aria-hidden="true">
                            <item.icon className="h-4 w-4" />
                          </span>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <section className="py-20 sm:py-24 lg:py-28">
          <div className="app-container">
            <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:gap-20">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: reduceMotion ? 0 : 0.6 }}
                className="relative mx-auto w-full max-w-lg lg:max-w-none"
              >
                <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary-100/80 to-cyan-50/60 blur-2xl dark:from-primary-900/60 dark:to-cyan-950/20" aria-hidden="true" />
                <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100 shadow-float dark:border-white/[0.08] dark:bg-slate-800 lg:aspect-[5/4]">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600&h=400"
                    alt="A doctor in a clinical setting"
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 sm:left-8 sm:right-auto sm:w-64 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
                      <UsersRound className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-ink dark:text-white">Dedicated access</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Choose the right portal</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: reduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduceMotion ? 0 : 0.55 }}
              >
                <p className="eyebrow">Access made clear</p>
                <h2 className="section-title text-balance text-3xl sm:text-4xl lg:text-[2.75rem]">One platform, separate patient and doctor access.</h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500 dark:text-slate-400">
                  Start with the portal that matches your role and continue to the tools designed for your healthcare tasks.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <article className="flex h-full flex-col rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80">
                    <IconBadge icon={UserRound} tone="primary" size="lg" />
                    <h3 className="mt-6 text-xl font-extrabold text-ink dark:text-white">For patients</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">Book consultations, use symptom guidance, review records, find medicines, and access nearby care information.</p>
                    <div className="mt-auto flex flex-col gap-2.5 pt-6">
                      <Button asChild className="w-full">
                        <Link to="/login">Patient Login</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/signup/patient">Create Patient Account</Link>
                      </Button>
                    </div>
                  </article>

                  <article className="flex h-full flex-col rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80">
                    <IconBadge icon={Stethoscope} tone="teal" size="lg" />
                    <h3 className="mt-6 text-xl font-extrabold text-ink dark:text-white">For doctors</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">Access the doctor dashboard to view appointments and join the consultation rooms available to you.</p>
                    <div className="mt-auto flex flex-col gap-2.5 pt-6">
                      <Button asChild className="w-full">
                        <Link to="/login/doctor">Doctor Login</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/signup/doctor">Create Doctor Account</Link>
                      </Button>
                    </div>
                  </article>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/80 bg-primary-50/50 py-20 sm:py-24 lg:py-28 dark:border-white/[0.08] dark:bg-slate-900/45">
          <div className="app-container">
            <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: reduceMotion ? 0 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduceMotion ? 0 : 0.55 }}
              >
                <p className="eyebrow">Designed for mobile</p>
                <h2 className="section-title max-w-xl text-balance text-3xl sm:text-4xl lg:text-[2.75rem]">Your care experience, ready for smaller screens.</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-500 dark:text-slate-400">
                  SwasthyaConnect is designed as a responsive progressive web app, keeping the core care journey easy to navigate on the devices you already use.
                </p>

                <div className="mt-8 space-y-3">
                  {pwaFeatures.map((feature) => (
                    <div key={feature.title} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-soft backdrop-blur-sm transition hover:border-primary-200 hover:bg-white dark:border-white/[0.08] dark:bg-slate-900/70 dark:hover:border-primary-800/70">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-primary-300 dark:ring-white/[0.08]" aria-hidden="true">
                        <feature.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-ink dark:text-white">{feature.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild className="mt-7">
                  <Link to="/dashboard">Open Patient Dashboard</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: reduceMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduceMotion ? 0 : 0.65 }}
                className="relative mx-auto w-full max-w-[21rem]"
              >
                <div className="absolute -inset-8 -z-10 rounded-full bg-primary-200/50 blur-3xl dark:bg-primary-800/20" aria-hidden="true" />
                <div className="relative rounded-[2.75rem] border-[6px] border-ink-950 bg-ink-950 p-2 shadow-[0_40px_90px_-35px_rgba(11,24,37,0.65)] dark:border-slate-800">
                  <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-ink-950 dark:bg-slate-900" aria-hidden="true" />
                  <div className="relative h-[35rem] overflow-hidden rounded-[2.15rem] bg-canvas dark:bg-[#0b1825] sm:h-[38rem]">
                    <div className="bg-gradient-to-br from-primary-700 to-primary-900 px-5 pb-8 pt-14 text-white dark:from-primary-800 dark:to-[#0a2239]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10" aria-hidden="true">
                            <HeartPulse className="h-4 w-4 text-cyan-300" />
                          </span>
                          <div>
                            <p className="text-[10px] font-bold text-primary-100">Welcome to</p>
                            <p className="text-xs font-extrabold">SwasthyaConnect</p>
                          </div>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
                          <UserRound className="h-4 w-4" />
                        </span>
                      </div>
                      <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.17em] text-primary-200">Your dashboard</p>
                      <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Healthcare, organized.</h3>
                    </div>

                    <div className="relative -mt-3 space-y-3 px-4">
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-white/[0.08] dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300" aria-hidden="true">
                              <CalendarDays className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Appointments</p>
                              <p className="text-sm font-extrabold text-ink dark:text-white">Book a consultation</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-white/[0.08] dark:bg-slate-900">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300" aria-hidden="true">
                            <Activity className="h-5 w-5" />
                          </span>
                          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Guidance</p>
                          <p className="mt-0.5 text-sm font-extrabold text-ink dark:text-white">Symptoms</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-white/[0.08] dark:bg-slate-900">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-brand-success dark:bg-emerald-950/60 dark:text-emerald-300" aria-hidden="true">
                            <FileHeart className="h-5 w-5" />
                          </span>
                          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">History</p>
                          <p className="mt-0.5 text-sm font-extrabold text-ink dark:text-white">Records</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-white/[0.08] dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" aria-hidden="true">
                            <Pill className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Medicine finder</p>
                            <p className="truncate text-sm font-extrabold text-ink dark:text-white">Search nearby pharmacies</p>
                          </div>
                          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-primary-100 bg-primary-50/80 p-4 dark:border-primary-800/60 dark:bg-primary-900/35">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm dark:bg-slate-900 dark:text-primary-300" aria-hidden="true">
                            <Mic2 className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-extrabold text-primary-900 dark:text-primary-100">Voice-enabled guidance</p>
                            <p className="mt-0.5 text-xs text-primary-800/75 dark:text-primary-200/70">Text or voice options</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 border-t border-slate-200/80 bg-white/95 px-5 py-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-slate-950/95">
                      <div className="flex items-center justify-around text-slate-400">
                        <span className="flex flex-col items-center gap-1 text-[9px] font-bold text-primary-700 dark:text-primary-300" aria-hidden="true">
                          <LayoutGrid className="h-4 w-4" />
                          Home
                        </span>
                        <span className="flex flex-col items-center gap-1 text-[9px] font-bold" aria-hidden="true">
                          <Stethoscope className="h-4 w-4" />
                          Care
                        </span>
                        <span className="flex flex-col items-center gap-1 text-[9px] font-bold" aria-hidden="true">
                          <UserRound className="h-4 w-4" />
                          Profile
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 dark:bg-slate-950">
          <div className="app-container">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: reduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduceMotion ? 0 : 0.55 }}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-800 via-primary-700 to-cyan-700 px-6 py-12 text-center shadow-premium sm:px-10 sm:py-14 lg:px-16"
            >
              <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-300/20 blur-2xl" aria-hidden="true" />
              <div className="relative mx-auto max-w-2xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-primary-100">Your next step</p>
                <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">Healthcare access can start with one simple action.</h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-primary-50/80">Find a doctor or explore the healthcare services already available in SwasthyaConnect.</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild size="lg" className="bg-white text-primary-700 shadow-xl hover:bg-primary-50">
                    <Link to="/book-appointment">Find a Doctor</Link>
                  </Button>
                  <Button asChild size="lg" className="border border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15">
                    <a href="#services">Explore Healthcare Services</a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </MotionConfig>
  );
}
