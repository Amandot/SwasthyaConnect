import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock3,
  Headphones,
  Stethoscope,
  Video
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { IconBadge, StatusBadge } from './ui/PagePrimitives';
import { cn } from '../lib/utils';

function AppointmentCard({ appointment, onCancel, featured = false }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <StatusBadge status="scheduled" />;
      case 'completed':
        return <StatusBadge status="completed" />;
      case 'cancelled':
        return <StatusBadge status="cancelled" />;
      case 'in-progress':
        return <StatusBadge status="in-progress" label="In Progress" />;
      default:
        return <span className="status-badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 border border-slate-200">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const roomId = appointment.room_id || appointment.roomId;
  const handleJoinCall = () => {
    if (roomId) navigate(`/consultation/${roomId}`);
  };

  const doctorName = appointment.doctor?.name || appointment.doctorName || 'Doctor';
  const displayDoctorName = /^dr\./i.test(doctorName) ? doctorName : `Dr. ${doctorName}`;

  return (
    <Card
      hoverEffect
      role="article"
      className={cn(
        'group relative overflow-hidden',
        featured
          ? 'border-primary-100 bg-gradient-to-br from-white via-white to-primary-50/80 dark:border-primary-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950/30'
          : 'p-5 sm:p-6'
      )}
    >
      {featured && (
        <>
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-900/20" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-1 w-24 rounded-full bg-primary-500 dark:bg-primary-400" aria-hidden="true" />
        </>
      )}

      <div className={cn('relative', featured && 'p-6 sm:p-8')}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <IconBadge
              icon={Stethoscope}
              tone={featured ? 'primary' : 'neutral'}
              size={featured ? 'lg' : 'md'}
            />
            <div className="min-w-0">
              {featured && (
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">
                  Appointment spotlight
                </p>
              )}
              <h3 className={cn(
                'font-extrabold tracking-tight text-ink dark:text-white',
                featured ? 'text-xl sm:text-2xl' : 'text-lg'
              )}>
                {displayDoctorName}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {appointment.type === 'video' ? 'Video consultation' : 'Audio consultation'}
              </p>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>

        {featured ? (
          <dl className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary-100/80 bg-white/80 p-4 dark:border-primary-900/50 dark:bg-slate-950/20">
              <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                Date
              </dt>
              <dd className="mt-2 text-sm font-bold text-ink dark:text-white">
                <time dateTime={appointment.date}>{formatDate(appointment.date)}</time>
              </dd>
            </div>
            <div className="rounded-2xl border border-primary-100/80 bg-white/80 p-4 dark:border-primary-900/50 dark:bg-slate-950/20">
              <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                <Clock3 className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                Time
              </dt>
              <dd className="mt-2 text-sm font-bold text-ink dark:text-white">
                {appointment.time || '10:00 AM'}
              </dd>
            </div>
            <div className="rounded-2xl border border-primary-100/80 bg-white/80 p-4 dark:border-primary-900/50 dark:bg-slate-950/20">
              <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {appointment.type === 'video' ? (
                  <Video className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                ) : (
                  <Headphones className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                )}
                Consultation
              </dt>
              <dd className="mt-2 text-sm font-bold text-ink dark:text-white">
                {appointment.type === 'video' ? 'Video call' : 'Audio call'}
              </dd>
            </div>
          </dl>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
              <time dateTime={appointment.date}>{formatDate(appointment.date)}</time>
            </span>
            <span className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
              {appointment.time || '10:00 AM'}
            </span>
            <span className="flex items-center gap-2">
              {appointment.type === 'video' ? (
                <Video className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <Headphones className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              {appointment.type === 'video' ? 'Video Call' : 'Audio Call'}
            </span>
          </div>
        )}

        {appointment.notes && (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            Note: {appointment.notes}
          </p>
        )}

        <div className={cn(
          'flex flex-wrap items-center gap-3',
          featured && 'mt-7 border-t border-primary-100/80 pt-6 dark:border-primary-900/50'
        )}>
          {appointment.status === 'scheduled' && (
            <>
              <Button
                type="button"
                size={featured ? 'md' : 'sm'}
                 icon={Video}
                 disabled={!roomId}
                 onClick={handleJoinCall}
              >
                 {roomId ? 'Join Call' : 'Room unavailable'}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  size={featured ? 'md' : 'sm'}
                  variant="ghost"
                  onClick={() => onCancel(appointment.id)}
                >
                  Cancel
                </Button>
              )}
            </>
          )}
          {appointment.status === 'completed' && (
            <Button asChild size={featured ? 'md' : 'sm'} variant="secondary">
              <Link to="/health-records">View records</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default AppointmentCard;
