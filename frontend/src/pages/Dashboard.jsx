import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  FileHeart,
  Lightbulb,
  Phone,
  Pill,
  Stethoscope
} from 'lucide-react';
import { appointmentAPI, aiAPI } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  EmptyState,
  IconBadge,
  InlineNotice,
  PageHeader,
  PageShell,
  PageSkeleton,
  SectionHeader
} from '../components/ui/PagePrimitives';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const quickActions = [
  {
    title: 'Health Records',
    description: 'View medical history',
    icon: FileHeart,
    link: '/health-records',
    tone: 'primary'
  },
  {
    title: 'Prescriptions',
    description: 'Review prescriptions in your records',
    icon: ClipboardList,
    link: '/health-records',
    tone: 'teal'
  },
  {
    title: 'Medicines',
    description: 'Find local pharmacies',
    icon: Pill,
    link: '/medicines',
    tone: 'warning'
  },
  {
    title: 'AI Symptoms',
    description: 'Start a health assessment',
    icon: Activity,
    link: '/symptom-checker',
    tone: 'success'
  }
];

export default function Dashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [healthTip, setHealthTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(false);
  const [healthTipError, setHealthTipError] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const appointmentsRes = await appointmentAPI.getAppointments({
        patientId: user.uid,
        status: 'scheduled'
      });
      const mappedAppointments = appointmentsRes.data.map(apt => ({
        ...apt,
        roomId: apt.room_id || apt.roomId
      }));
      setAppointments(mappedAppointments.slice(0, 3));
      setAppointmentsError(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointmentsError(true);
      setAppointments([]);
    }

    try {
      const tipsRes = await aiAPI.getHealthTips();
      setHealthTip(tipsRes.data.dailyTip);
      setHealthTipError(false);
    } catch (error) {
      console.error('Error fetching health tips:', error);
      setHealthTipError(true);
      setHealthTip('');
    } finally {
      setLoading(false);
    }
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'Patient';
  const greeting = getGreeting();
  const spotlightAppointment = appointments[0];
  const additionalAppointments = appointments.slice(1);

  if (loading) {
    return <PageSkeleton cards={4} />;
  }

  return (
    <PageShell className="py-8 sm:py-10 lg:py-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-12 sm:space-y-16"
      >
        <Card className="relative overflow-hidden border-slate-200/80 bg-gradient-to-br from-white via-white to-primary-50/70 p-0 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950/25">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary-100/70 blur-3xl dark:bg-primary-900/25" aria-hidden="true" />
          <div className="absolute -bottom-36 left-1/3 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl dark:bg-cyan-900/10" aria-hidden="true" />
          <PageHeader
            className="!mb-0 p-6 sm:p-8 lg:p-10"
            icon={Stethoscope}
            eyebrow="Patient health overview"
            title={`${greeting}, ${displayName}`}
            description="Appointments, health records, medicines, and symptom support—organized around your next step."
            actions={(
              <>
                <Button asChild size="lg" icon={Stethoscope} className="w-full sm:w-auto">
                  <Link to="/book-appointment">Book consultation</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" icon={Activity} className="w-full sm:w-auto">
                  <Link to="/symptom-checker">Check symptoms</Link>
                </Button>
              </>
            )}
          />
        </Card>

        {(appointmentsError || healthTipError) && (
          <div className="space-y-3" aria-label="Data status">
            {appointmentsError && (
              <InlineNotice icon={AlertCircle} tone="warning" title="Appointments are temporarily unavailable">
                No appointment details are shown until the live service responds. Refresh the page to try again.
              </InlineNotice>
            )}
            {healthTipError && (
              <InlineNotice icon={AlertCircle} tone="warning" title="The live daily tip is temporarily unavailable">
                No daily tip is shown until the live service responds.
              </InlineNotice>
            )}
          </div>
        )}

        <section aria-labelledby="care-actions-title">
          <SectionHeader
            eyebrow="Care shortcuts"
            title={<span id="care-actions-title">What do you need today?</span>}
            description="Move directly to the care tools you use most."
          />
          <div className="-mx-4 hide-scrollbars flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="group min-w-[78vw] max-w-[20rem] snap-start rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:min-w-0 sm:max-w-none"
              >
                <Card hoverEffect className="flex min-h-[190px] flex-col p-5">
                  <IconBadge icon={action.icon} tone={action.tone} size="lg" />
                  <h3 className="mt-5 text-base font-extrabold tracking-tight text-ink dark:text-white">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {action.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary-700 dark:text-primary-300">
                    Open
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="appointments-title">
          <SectionHeader
            eyebrow="Care schedule"
            title={<span id="appointments-title">Upcoming appointments</span>}
            description="Your first available appointment is highlighted, followed by any other scheduled visits."
            action={(
              <Button asChild variant="secondary" size="sm">
                <Link to="/book-appointment">View all</Link>
              </Button>
            )}
          />

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]">
            <div>
              {appointments.length > 0 ? (
                <div className="space-y-7">
                  <AppointmentCard appointment={spotlightAppointment} featured />

                  {additionalAppointments.length > 0 && (
                    <div>
                      <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Additional appointments
                      </h3>
                      <ul className="space-y-4">
                        {additionalAppointments.map((appointment) => (
                          <li key={appointment.id}>
                            <AppointmentCard appointment={appointment} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  icon={Stethoscope}
                  title="No upcoming appointments"
                  description="Get the care you need. Book a video or audio consultation with an available doctor."
                  action={(
                    <Button asChild icon={Stethoscope}>
                      <Link to="/book-appointment">Book Appointment</Link>
                    </Button>
                  )}
                />
              )}
            </div>

            <aside className="space-y-5" aria-label="Care information">
              {healthTip && (
                <Card className="relative overflow-hidden border-cyan-100 bg-gradient-to-br from-cyan-50/80 to-white dark:border-cyan-900/50 dark:from-cyan-950/25 dark:to-slate-900">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-200/30 blur-2xl dark:bg-cyan-700/10" aria-hidden="true" />
                  <div className="relative flex items-start gap-4">
                    <IconBadge icon={Lightbulb} tone="teal" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-cyan-800 dark:text-cyan-300">
                        Daily health tip
                      </h3>
                      <p className="mt-2 text-[15px] font-medium leading-7 text-slate-700 dark:text-slate-200">
                        {healthTip}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="border-red-100 bg-red-50/55 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-4">
                  <IconBadge icon={Phone} tone="danger" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-red-950 dark:text-red-100">
                      Emergency help
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-red-800/80 dark:text-red-200/75">
                      Press the button below for immediate medical assistance or ambulance services.
                    </p>
                  </div>
                </div>
                <Button asChild variant="danger" icon={Phone} className="mt-5 w-full">
                  <a href="tel:102">Call Emergency 102</a>
                </Button>
              </Card>
            </aside>
          </div>
        </section>
      </motion.div>
    </PageShell>
  );
}
