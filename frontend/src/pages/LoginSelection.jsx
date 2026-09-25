import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FileHeart,
  HeartHandshake,
  Stethoscope,
  UserRound,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      audience="general"
      eyebrow="Welcome to SwasthyaConnect"
      title="Choose your care portal"
      description="Select patient or doctor access to continue to the workspace designed for your role."
    >
      <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
        <Card
          hoverEffect
          className="group flex h-full cursor-pointer flex-col border-primary-100/90 bg-gradient-to-b from-primary-50/70 to-white p-5 text-left transition-[border-color,box-shadow] duration-200 hover:border-primary-200 sm:p-6 dark:border-primary-900/50 dark:from-primary-900/20 dark:to-slate-900"
          onClick={() => navigate('/login/patient')}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-100 bg-white text-primary-700 shadow-card transition-transform duration-200 group-hover:scale-[1.03] dark:border-primary-800/70 dark:bg-primary-900/45 dark:text-primary-300">
              <UserRound className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="rounded-full border border-primary-100 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-primary-700 dark:border-primary-800/70 dark:bg-primary-900/40 dark:text-primary-300">
              For patients
            </span>
          </div>
          <h2 className="mt-6 text-xl font-extrabold tracking-[-0.03em] text-ink dark:text-white">Patient portal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Book consultations, review health records, and return to your care space.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2.5">
              <CalendarDays className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              Appointment booking
            </li>
            <li className="flex items-center gap-2.5">
              <FileHeart className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              Health records
            </li>
            <li className="flex items-center gap-2.5">
              <Video className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              Consultation access
            </li>
          </ul>
          <div className="mt-auto grid gap-3 pt-7">
            <Button
              type="button"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/signup/patient');
              }}
            >
              Create patient account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/login/patient');
              }}
            >
              Sign in as patient
            </Button>
          </div>
        </Card>

        <Card
          hoverEffect
          className="group flex h-full cursor-pointer flex-col border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 text-left transition-[border-color,box-shadow] duration-200 hover:border-slate-300 sm:p-6 dark:border-white/10 dark:from-slate-800/50 dark:to-slate-900"
          onClick={() => navigate('/login/doctor')}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-card transition-transform duration-200 group-hover:scale-[1.03] dark:border-white/10 dark:bg-slate-800 dark:text-slate-200">
              <Stethoscope className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200">
              For doctors
            </span>
          </div>
          <h2 className="mt-6 text-xl font-extrabold tracking-[-0.03em] text-ink dark:text-white">Doctor portal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Review appointments, access patient records, and continue to consultations.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2.5">
              <CalendarDays className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              Appointment schedule
            </li>
            <li className="flex items-center gap-2.5">
              <ClipboardList className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              Patient records
            </li>
            <li className="flex items-center gap-2.5">
              <HeartHandshake className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              Consultation workspace
            </li>
          </ul>
          <div className="mt-auto grid gap-3 pt-7">
            <Button
              type="button"
              className="w-full bg-ink-950 hover:bg-ink-900 focus-visible:ring-ink-700 dark:bg-slate-100 dark:text-ink-950 dark:hover:bg-white dark:focus-visible:ring-slate-300"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/signup/doctor');
              }}
            >
              Create doctor account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/login/doctor');
              }}
            >
              Sign in as doctor
            </Button>
          </div>
        </Card>
      </div>
    </AuthLayout>
  );
}
