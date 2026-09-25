import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  FileHeart,
  HeartPulse,
  MessageCircleMore,
  Stethoscope,
  UserRound,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { IconBadge, InlineNotice } from './ui/PagePrimitives';

const audienceContent = {
  general: {
    label: 'Connected care',
    title: 'A clearer path through every healthcare moment.',
    description: 'Choose the portal designed around the care you are here to access or provide.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=85&w=1200&h=1600',
    gradient: 'from-primary-900/95 via-primary-900/90 to-ink-950/95',
    icon: HeartPulse,
    tone: 'teal',
    benefits: [
      'Patient and doctor portals, clearly separated',
      'Appointments, records, and consultations in one workflow',
      'A focused experience on every screen'
    ]
  },
  patient: {
    label: 'Patient experience',
    title: 'Care essentials, connected around you.',
    description: 'Return to appointments, health records, and consultation spaces from one patient portal.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=85&w=1200&h=1600',
    gradient: 'from-primary-900/95 via-primary-900/90 to-cyan-950/95',
    icon: UserRound,
    tone: 'primary',
    benefits: [
      'Book and manage consultations',
      'Keep your health records close',
      'Return to consultation spaces when needed'
    ]
  },
  doctor: {
    label: 'Doctor workspace',
    title: 'A focused workspace for your care practice.',
    description: 'Move from appointments to patient records and consultation sessions in one doctor portal.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=85&w=1200&h=1600',
    gradient: 'from-ink-950/95 via-slate-900/95 to-blue-950/95',
    icon: Stethoscope,
    tone: 'neutral',
    benefits: [
      'Review your appointment schedule',
      'Access patient records in context',
      'Continue into consultation sessions'
    ]
  }
};

const benefitIcons = [CalendarDays, FileHeart, Video];

export default function AuthLayout({
  audience = 'general',
  eyebrow,
  title,
  description,
  icon: Icon,
  error,
  backLink,
  switchLink,
  footer,
  children
}) {
  const reduceMotion = useReducedMotion();
  const content = audienceContent[audience] || audienceContent.general;
  const HeaderIcon = Icon || content.icon;

  return (
    <section className="w-full px-3 pb-3 pt-1 sm:px-6 sm:pb-6 sm:pt-2 lg:px-8 lg:pb-10 lg:pt-4" aria-labelledby="auth-page-title">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-[1440px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-float dark:border-white/10 dark:bg-slate-900 sm:min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-10.5rem)] lg:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.12fr)] xl:grid-cols-[minmax(380px,0.95fr)_minmax(0,1.05fr)]"
      >
        <aside className={cn('relative isolate hidden min-w-0 overflow-hidden p-10 lg:flex xl:p-14', `bg-gradient-to-br ${content.gradient}`)} aria-label="Healthcare portal benefits">
          <img
            src={content.image}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-slate-950/35" aria-hidden="true" />
          <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10 bg-white/5" aria-hidden="true" />
          <div className="absolute -bottom-28 -left-24 -z-10 h-80 w-80 rounded-full border border-white/10 bg-white/5" aria-hidden="true" />

          <div className="relative z-10 flex h-full w-full flex-col text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                <HeartPulse className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[15px] font-extrabold tracking-[-0.03em]">SwasthyaConnect</p>
                <p className="text-xs font-semibold text-white/65">Healthcare access</p>
              </div>
            </div>

            <div className="my-auto py-10">
              <span className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/10 px-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                {content.label}
              </span>
              <h2 className="mt-6 max-w-lg text-balance text-3xl font-extrabold leading-[1.12] tracking-[-0.04em] xl:text-[2.65rem]">
                {content.title}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-white/75">
                {content.description}
              </p>
              <ul className="mt-9 space-y-4">
                {content.benefits.map((benefit, index) => {
                  const BenefitIcon = benefitIcons[index];
                  return (
                    <li key={benefit} className="flex items-center gap-3.5 text-sm font-semibold text-white/90">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
                        <BenefitIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {benefit}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-2 border-t border-white/15 pt-5 text-xs font-semibold text-white/60">
              <Check className="h-4 w-4" aria-hidden="true" />
              Choose the portal that matches your role
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 items-center justify-center bg-white px-4 py-6 dark:bg-slate-900 sm:px-8 sm:py-9 lg:px-12 xl:px-16">
          <div className="mx-auto flex w-full max-w-[560px] flex-col">
            <div className="mb-7 flex min-h-11 items-center justify-between gap-2 sm:mb-9">
              <div className="flex items-center gap-2.5 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/55 dark:text-primary-300">
                  <HeartPulse className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="hidden text-sm font-extrabold tracking-[-0.03em] text-ink dark:text-white sm:block">SwasthyaConnect</span>
              </div>
              {backLink ? (
                <Link
                  to={backLink.to}
                  className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white sm:px-3"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{backLink.label}</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              ) : (
                <span className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 text-xs font-bold text-slate-500 dark:bg-white/[0.05] dark:text-slate-300 lg:hidden">
                  <MessageCircleMore className="h-4 w-4" aria-hidden="true" />
                  Choose a portal
                </span>
              )}
              {switchLink && (
                <Link
                  to={switchLink.to}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-primary-300 dark:hover:bg-primary-900/40 sm:px-3"
                  aria-label={switchLink.label}
                >
                  <span className="hidden md:inline">{switchLink.label}</span>
                  <span className="md:hidden">{switchLink.shortLabel || switchLink.label}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>

            <header className="text-center">
              <IconBadge icon={HeaderIcon} tone={content.tone} size="lg" className="mb-5 h-14 w-14 shadow-card" />
              {eyebrow && <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.17em] text-primary-700 dark:text-primary-300">{eyebrow}</p>}
              <h1 id="auth-page-title" className="text-balance text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-ink dark:text-white sm:text-[2.35rem]">
                {title}
              </h1>
              {description && <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7 text-slate-500 dark:text-slate-400">{description}</p>}
            </header>

            {error && (
              <div id="auth-error" role="alert" aria-live="polite" className="mt-6">
                <InlineNotice icon={AlertCircle} tone="danger">
                  {error}
                </InlineNotice>
              </div>
            )}

            <div className={error ? 'mt-6' : 'mt-7 sm:mt-8'}>{children}</div>

            {footer && (
              <div className="mt-7 border-t border-slate-200/80 pt-6 text-center text-sm leading-6 text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                {footer}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
