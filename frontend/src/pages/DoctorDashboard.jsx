import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  Phone,
  Stethoscope,
  UserRound,
  Users,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  EmptyState,
  MetricCard,
  PageHeader,
  PageShell,
  SectionHeader,
  Skeleton,
  StatusBadge
} from '../components/ui/PagePrimitives';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  }
};

function parseAppointmentDate(value) {
  if (!value) return null;

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }
    return parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDayStamp(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
}

function formatAppointmentDate(value) {
  const parsed = parseAppointmentDate(value);
  if (!parsed) return null;
  return parsed.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function formatFieldLabel(value) {
  return String(value)
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitials(value) {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function isUpcomingAppointment(appointment) {
  const status = String(appointment?.status || '').trim().toLowerCase();
  return status === 'scheduled' || status === 'upcoming';
}

function getPatientName(appointment) {
  return appointment.patient?.name || appointment.patientName || '';
}

function getPatientContact(appointment) {
  return (
    appointment.patient?.email ||
    appointment.patient?.phone ||
    appointment.patientEmail ||
    appointment.patientPhone ||
    ''
  );
}

function getPatientIdentityKey(appointment) {
  return (
    appointment.patient?.id ||
    appointment.patient_id ||
    getPatientContact(appointment) ||
    getPatientName(appointment) ||
    null
  );
}

export default function DoctorDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getAppointments();
        setAppointments(response.data || []);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <PageShell contained={false} className="pb-10 sm:pb-14">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden lg:block" aria-label="Workspace navigation loading">
              <Card className="p-3">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
              </Card>
            </aside>
            <div className="min-w-0">
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80 sm:p-6">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="mt-3 h-9 w-64 max-w-full" />
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Skeleton className="h-12 w-full rounded-[14px] sm:w-36" />
                  <Skeleton className="h-12 w-full rounded-[14px] sm:w-44" />
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <Card key={index} className="space-y-4">
                    <Skeleton className="h-11 w-11 rounded-[14px]" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </Card>
                ))}
              </div>
              <Card className="mt-6 p-0">
                <div className="border-b border-slate-100 p-5 dark:border-white/[0.06] sm:p-6">
                  <Skeleton className="h-7 w-64 max-w-full" />
                  <Skeleton className="mt-3 h-4 w-80 max-w-full" />
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="flex items-center gap-4 p-5 sm:p-6">
                      <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-40 max-w-full" />
                        <Skeleton className="h-3 w-64 max-w-full" />
                      </div>
                      <Skeleton className="hidden h-10 w-28 rounded-xl sm:block" />
                    </div>
                  ))}
                </div>
              </Card>
              <span className="sr-only" role="status" aria-live="polite">Loading appointments</span>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const doctorIdentity = user?.displayName || user?.email || '';
  const now = new Date();
  const todayStamp = getDayStamp(now);
  const todayAppointments = appointments.filter((appointment) => {
    const date = parseAppointmentDate(appointment.date);
    return date ? getDayStamp(date) === todayStamp : false;
  });
  const upcomingAppointments = appointments.filter(isUpcomingAppointment);
  const openRoomId = upcomingAppointments.find((appointment) => appointment.room_id || appointment.roomId)?.room_id
    || upcomingAppointments.find((appointment) => appointment.room_id || appointment.roomId)?.roomId;
  const identifiedPatients = new Set(
    appointments.map(getPatientIdentityKey).filter(Boolean)
  );
  const schedule = [...appointments].sort((first, second) => {
    const firstDate = parseAppointmentDate(first.date);
    const secondDate = parseAppointmentDate(second.date);
    const firstStamp = firstDate ? getDayStamp(firstDate) : null;
    const secondStamp = secondDate ? getDayStamp(secondDate) : null;
    const firstRank = firstStamp === null ? 2 : firstStamp === todayStamp ? 0 : firstStamp > todayStamp ? 1 : 3;
    const secondRank = secondStamp === null ? 2 : secondStamp === todayStamp ? 0 : secondStamp > todayStamp ? 1 : 3;

    if (firstRank !== secondRank) return firstRank - secondRank;
    if (firstDate && secondDate) return firstDate.getTime() - secondDate.getTime();
    return 0;
  });
  const appointmentLabel = appointments.length === 1 ? 'appointment' : 'appointments';
  const metrics = [
    {
      label: "Today's schedule",
      value: todayAppointments.length,
      detail: `${appointments.length} loaded ${appointmentLabel}`,
      icon: CalendarDays,
      tone: 'primary'
    },
    {
      label: 'Upcoming',
      value: upcomingAppointments.length,
      detail: 'Scheduled or upcoming status',
      icon: Clock3,
      tone: 'teal'
    },
    {
      label: 'Identified patients',
      value: identifiedPatients.size,
      detail: 'Unique patient records in view',
      icon: Users,
      tone: 'success'
    }
  ];
  const workspaceLinks = [
    { label: 'Overview', href: '#overview', icon: LayoutDashboard },
    { label: 'Schedule', href: '#schedule', icon: CalendarDays, count: appointments.length }
  ];

  return (
    <PageShell contained={false} className="pb-10 sm:pb-14">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-32 hidden lg:block"
            aria-label="Doctor workspace sidebar"
          >
            <Card className="overflow-hidden p-3">
              <a
                href="#overview"
                className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-white/[0.05]"
                aria-label="Doctor workspace overview"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 dark:bg-primary-950/60 dark:text-primary-300 dark:ring-primary-800/70">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold tracking-tight text-ink dark:text-white">Doctor workspace</span>
                  {doctorIdentity && (
                    <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{doctorIdentity}</span>
                  )}
                </span>
              </a>

              <nav className="mt-5 space-y-1.5" aria-label="Workspace sections">
                {workspaceLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-current={link.label === 'Overview' ? 'location' : undefined}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-slate-300 dark:hover:bg-primary-950/40 dark:hover:text-primary-300"
                  >
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{link.label}</span>
                    {link.count !== undefined && (
                      <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-white/[0.07] dark:text-slate-300">
                        {link.count}
                      </span>
                    )}
                  </a>
                ))}
              </nav>

              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                  Loaded schedule
                </div>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink dark:text-white">{appointments.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{appointmentLabel} available</p>
              </div>
            </Card>
          </motion.aside>

          <div className="min-w-0">
            <nav
              className="mb-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80 lg:hidden"
              aria-label="Workspace sections"
            >
              <div className="flex min-w-max items-center gap-1.5">
                {workspaceLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-current={link.label === 'Overview' ? 'location' : undefined}
                    className="flex min-h-10 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-slate-300 dark:hover:bg-primary-950/40 dark:hover:text-primary-300"
                  >
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                    {link.count !== undefined && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-white/[0.07]">{link.count}</span>
                    )}
                  </a>
                ))}
              </div>
            </nav>

            <motion.div
              id="overview"
              className="scroll-mt-32"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <PageHeader
                eyebrow="Doctor workspace"
                title={doctorIdentity || 'Doctor workspace'}
                description="A focused view of your loaded appointments and consultation access."
                actions={(
                  <Button
                    type="button"
                    icon={Video}
                    disabled={!openRoomId}
                    onClick={() => openRoomId && navigate(`/consultation/${openRoomId}`)}
                  >
                    {openRoomId ? 'Open consultation room' : 'No open room'}
                  </Button>
                )}
              />

              <motion.section
                aria-labelledby="appointment-metrics-heading"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <h2 id="appointment-metrics-heading" className="sr-only">Appointment metrics</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {metrics.map((metric) => (
                    <motion.div key={metric.label} variants={itemVariants}>
                      <MetricCard
                        icon={metric.icon}
                        label={metric.label}
                        value={metric.value}
                        detail={metric.detail}
                        tone={metric.tone}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <section id="schedule" className="mt-10 scroll-mt-32 sm:mt-12" aria-label="Appointment schedule">
                <SectionHeader
                  eyebrow="Appointments"
                  title="Today's & upcoming schedule"
                  description={`${appointments.length} loaded ${appointmentLabel}, with today's and upcoming visits shown first.`}
                />

                <Card className="overflow-hidden p-0">
                  {appointments.length === 0 ? (
                    <EmptyState
                      icon={CalendarDays}
                      title="No appointments to show"
                      description="The loaded appointment list is empty. New schedule items will appear here when available."
                      className="border-0 bg-transparent dark:bg-transparent"
                    />
                  ) : (
                    <motion.ol
                      className="divide-y divide-slate-100 dark:divide-white/[0.06]"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                    >
                      {schedule.map((appointment, index) => {
                        const appointmentDate = parseAppointmentDate(appointment.date);
                        const isToday = appointmentDate ? getDayStamp(appointmentDate) === todayStamp : false;
                        const dateLabel = isToday ? 'Today' : formatAppointmentDate(appointment.date);
                        const patientName = getPatientName(appointment);
                        const patientContact = getPatientContact(appointment);
                        const patientIdentity = patientName || patientContact;
                        const initials = getInitials(patientIdentity);
                        const appointmentStatus = String(appointment.status || '').trim();
                        const appointmentType = String(appointment.type || '').trim();
                        const TypeIcon = appointmentType.toLowerCase().includes('video') ? Video : Phone;
                        const appointmentKey = appointment.id || `${appointment.patient_id || appointment.room_id || appointment.roomId || 'appointment'}-${appointment.date || 'date'}-${appointment.time || 'time'}-${index}`;
                        const appointmentRoomId = appointment.room_id || appointment.roomId;

                        return (
                          <motion.li
                            key={appointmentKey}
                            variants={itemVariants}
                            className="group px-4 py-5 transition-colors hover:bg-slate-50/80 sm:px-6 sm:py-6 dark:hover:bg-white/[0.025]"
                          >
                            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-8">
                              <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-50 text-sm font-extrabold text-primary-700 ring-1 ring-primary-100 dark:bg-primary-950/55 dark:text-primary-300 dark:ring-primary-800/70 sm:h-14 sm:w-14">
                                  {initials ? <span aria-hidden="true">{initials}</span> : <UserRound className="h-5 w-5" aria-hidden="true" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="truncate text-base font-extrabold tracking-tight text-ink dark:text-white sm:text-lg">
                                    {patientIdentity || 'Patient details unavailable'}
                                  </h3>
                                  {patientContact && patientContact !== patientIdentity && (
                                    <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{patientContact}</p>
                                  )}
                                  {(dateLabel || appointment.time || appointmentType) && (
                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                      {dateLabel && (
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                                          <CalendarDays className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                                          <time dateTime={appointment.date}>{dateLabel}</time>
                                        </span>
                                      )}
                                      {appointment.time && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <Clock3 className="h-4 w-4" aria-hidden="true" />
                                          <time dateTime={appointment.time}>{appointment.time}</time>
                                        </span>
                                      )}
                                      {appointmentType && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <TypeIcon className="h-4 w-4" aria-hidden="true" />
                                          {formatFieldLabel(appointmentType)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end sm:border-0 sm:pt-0 dark:border-white/[0.06] xl:min-w-[250px]">
                                {appointmentStatus && (
                                  <div className="flex items-center justify-between gap-3 sm:justify-start">
                                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Status</span>
                                    <StatusBadge
                                      status={appointmentStatus}
                                      label={formatFieldLabel(appointmentStatus)}
                                    />
                                  </div>
                                )}
                                {isUpcomingAppointment(appointment) && appointmentRoomId && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    icon={Video}
                                    className="w-full sm:w-auto"
                                    aria-label={patientIdentity ? `Join call with ${patientIdentity}` : 'Join call'}
                                    onClick={() => navigate(`/consultation/${appointmentRoomId}`)}
                                  >
                                    Join Call
                                  </Button>
                                )}
                                {isUpcomingAppointment(appointment) && !appointmentRoomId && (
                                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Room unavailable</p>
                                )}
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </motion.ol>
                  )}
                </Card>
              </section>
            </motion.div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
