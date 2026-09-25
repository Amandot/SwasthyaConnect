import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import {
  Video,
  Clock3,
  PhoneOff,
  CheckCircle2,
  Lightbulb,
  FileText,
  Pill,
  CalendarCheck,
  CalendarDays,
  Stethoscope,
  UserRound,
  Users
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const consultationTips = [
  'Choose a quiet, well-lit space for clear visibility.',
  'Keep relevant prescriptions and medical reports nearby.',
  'Describe all symptoms clearly, including small changes.',
  'Ask the clinician to repeat guidance if audio becomes unclear.',
  'Wait for the clinician to confirm when the session is finished.'
];

const nextSteps = [
  {
    icon: FileText,
    text: 'Check your health records for the digital prescription.'
  },
  {
    icon: Pill,
    text: 'Find and order prescribed medicines at nearby pharmacies.'
  },
  {
    icon: CalendarCheck,
    text: 'Schedule a follow-up appointment if recommended.'
  }
];

export default function Consultation({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callEnded, setCallEnded] = useState(false);

  const userRole = localStorage.getItem('userRole') || user?.role || 'patient';
  const displayName = user?.displayName || user?.email?.split('@')[0] || (userRole === 'doctor' ? 'Doctor' : 'Patient');

  useEffect(() => {
    fetchAppointment();
  }, [roomId]);

  const fetchAppointment = async () => {
    try {
      setAppointment({
        id: '1',
        doctorName: userRole === 'doctor' ? displayName : 'Your doctor',
        patientName: userRole === 'patient' ? displayName : 'The patient',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'video',
        roomId
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleLeaveCall = useCallback(() => {
    setCallEnded(true);
  }, []);

  const handleReturnToDashboard = () => {
    navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard');
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[100dvh] items-center justify-center bg-slate-950 px-6 py-10 text-white dark:bg-[#07111f]"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 animate-spin rounded-2xl border-2 border-slate-700 border-t-primary-400 motion-reduce:animate-none" aria-hidden="true" />
            <Video className="h-7 w-7 text-primary-300" aria-hidden="true" />
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-primary-300">Telemedicine workspace</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Preparing your consultation room</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Loading the appointment and opening video room {roomId}. Keep this page open while the room loads.
          </p>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-canvas px-4 py-10 text-ink dark:bg-[#07111f] dark:text-white sm:px-6">
        <span className="sr-only" role="status" aria-live="polite">Consultation completed</span>
        <Card className="w-full max-w-2xl overflow-hidden border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-slate-900">
          <div className="p-6 text-center sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700 dark:text-emerald-300">Session complete</p>
            <h1 id="consultation-complete-title" className="mt-2 text-3xl font-extrabold tracking-tight text-ink dark:text-white">Consultation completed</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Your session with <strong className="font-bold text-ink dark:text-white">{appointment?.doctorName}</strong> has ended. Review the available next steps below.
            </p>
          </div>

          <div className="border-y border-slate-200 bg-slate-50 px-6 py-5 dark:border-white/10 dark:bg-slate-950/40 sm:px-9">
            <dl className="grid grid-cols-2 gap-5 text-left">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</dt>
                <dd className="mt-1 font-bold text-ink dark:text-white">{appointment?.date}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Time</dt>
                <dd className="mt-1 font-bold text-ink dark:text-white">{appointment?.time}</dd>
              </div>
            </dl>
          </div>

          <div className="p-6 sm:p-9">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Next steps</h2>
            <ol className="mt-5 space-y-4">
              {nextSteps.map(({ icon: Icon, text }, index) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-primary-300">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <span className="sr-only">Step {index + 1}:</span>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button onClick={handleReturnToDashboard} className="w-full">Return to dashboard</Button>
              <Button variant="outline" onClick={() => navigate('/health-records')} className="w-full">View health records</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] min-h-[480px] flex-col overflow-hidden bg-slate-950 text-white dark:bg-[#07111f]">
      <header className="h-20 shrink-0 border-b border-slate-800 bg-slate-950/95 dark:border-white/10 dark:bg-[#07111f]/95">
        <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary-400/20 bg-primary-500/10 text-primary-300">
              <Video className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-primary-300 sm:text-xs">Telemedicine workspace</p>
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <h1 className="truncate text-sm font-extrabold tracking-tight text-white sm:text-base">Video consultation</h1>
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 sm:hidden" role="status">
                  <span className="sr-only">Session active</span>
                </span>
                <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300 sm:flex" role="status" aria-label="Session active">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  Active
                </div>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
                {userRole === 'doctor' ? appointment?.patientName : appointment?.doctorName}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 lg:flex">
              <Clock3 className="h-4 w-4 text-primary-300" aria-hidden="true" />
              <span>{appointment?.time}</span>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleLeaveCall}
              aria-label="End consultation session"
              className="min-h-10 px-3 sm:px-4"
            >
              <PhoneOff className="mr-2 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">End session</span>
              <span className="sm:hidden">End</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100 p-3 text-ink dark:bg-[#07111f] dark:text-white lg:overflow-hidden lg:p-4" aria-label="Video consultation workspace">
        <div className="mx-auto grid min-h-full w-full max-w-[1800px] gap-4 lg:h-full lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="relative h-[calc(100dvh-6.5rem)] min-h-[380px] overflow-hidden rounded-[22px] border border-slate-300 bg-black shadow-2xl dark:border-white/10 lg:h-full lg:min-h-0" aria-label="Video consultation">
            <VideoCall
              roomId={roomId}
              userName={displayName}
              userRole={userRole}
              onLeave={handleLeaveCall}
            />
          </section>

          <aside className="min-w-0 space-y-4 pb-2 lg:h-full lg:overflow-y-auto lg:pr-1" aria-label="Consultation information">
            <Card className="p-0 border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-5 dark:border-white/10">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-700 dark:text-primary-300">Session details</p>
                  <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ink dark:text-white">Appointment overview</h2>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Active
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-3 dark:border-primary-900/70 dark:bg-primary-950/35">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm dark:bg-slate-800 dark:text-primary-300">
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300">You · <span className="capitalize">{userRole}</span></p>
                    <p className="truncate text-sm font-extrabold text-ink dark:text-white">{displayName}</p>
                  </div>
                </div>

                <dl className="mt-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Stethoscope className="h-4 w-4" aria-hidden="true" />
                      Doctor
                    </dt>
                    <dd className="text-right text-sm font-bold text-ink dark:text-white">{appointment?.doctorName}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Users className="h-4 w-4" aria-hidden="true" />
                      Patient
                    </dt>
                    <dd className="text-right text-sm font-bold text-ink dark:text-white">{appointment?.patientName}</dd>
                  </div>
                </dl>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                    <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      Date
                    </dt>
                    <dd className="mt-1.5 text-sm font-extrabold text-ink dark:text-white">{appointment?.date}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                    <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      Time
                    </dt>
                    <dd className="mt-1.5 text-sm font-extrabold text-ink dark:text-white">{appointment?.time}</dd>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/45 dark:text-amber-300">
                  <Lightbulb className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Before you begin</p>
                  <h2 className="mt-0.5 text-lg font-extrabold tracking-tight text-ink dark:text-white">Consultation guide</h2>
                </div>
              </div>

              <ol className="mt-5 space-y-3">
                {consultationTips.map((tip, index) => (
                  <li key={tip} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800/60">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-extrabold text-white" aria-hidden="true">{index + 1}</span>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{tip}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Button
              type="button"
              variant="danger"
              onClick={handleLeaveCall}
              aria-label="End consultation session"
              className="w-full"
            >
              <PhoneOff className="mr-2 h-4 w-4" aria-hidden="true" />
              End session
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
