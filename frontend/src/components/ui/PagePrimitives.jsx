import { AlertCircle, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function PageShell({ children, className, contained = true }) {
  return (
    <main className={cn('flex-1 w-full', contained && 'app-container', className)}>
      {children}
    </main>
  );
}

export function PageHeader({ eyebrow, title, description, actions, icon: Icon, className }) {
  return (
    <header className={cn('page-header', className)}>
      <div className="min-w-0 flex items-start gap-4">
        {Icon && (
          <span className="page-header-icon" aria-hidden="true">
            <Icon className="h-6 w-6" strokeWidth={1.9} />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}

export function SectionHeader({ eyebrow, title, description, action, align = 'left', className }) {
  return (
    <div className={cn('section-header', align === 'center' && 'text-center items-center', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function IconBadge({ icon: Icon, tone = 'primary', size = 'md', className }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-700 dark:bg-primary-950/45 dark:text-primary-300 border-primary-100/80 dark:border-primary-800/60',
    teal: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-100 dark:border-cyan-800/60',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-100 dark:border-amber-800/60',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-100 dark:border-red-800/60',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
  };
  const sizes = {
    sm: 'h-9 w-9 rounded-xl',
    md: 'h-11 w-11 rounded-[14px]',
    lg: 'h-14 w-14 rounded-2xl'
  };

  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center border', tones[tone], sizes[size], className)} aria-hidden="true">
      <Icon className={cn(size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} strokeWidth={1.9} />
    </span>
  );
}

export function StatusBadge({ status = 'scheduled', label, className }) {
  const normalized = String(status).trim().toLowerCase();
  const styles = {
    scheduled: 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/45 dark:text-primary-300',
    upcoming: 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/45 dark:text-primary-300',
    'in-progress': 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/45 dark:text-amber-300',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300',
    cancelled: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/45 dark:text-red-300',
    available: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300',
    unavailable: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/45 dark:text-red-300'
  };
  const icons = {
    scheduled: Clock3,
    upcoming: Clock3,
    'in-progress': Clock3,
    completed: CheckCircle2,
    cancelled: XCircle,
    available: CheckCircle2,
    unavailable: XCircle
  };
  const Icon = icons[normalized] || AlertCircle;
  const fallbackLabels = {
    scheduled: 'Scheduled',
    upcoming: 'Upcoming',
    'in-progress': 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    available: 'Available',
    unavailable: 'Unavailable'
  };

  return (
    <span className={cn('status-badge', styles[normalized] || 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200', className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label || fallbackLabels[normalized] || status || 'Unknown'}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('empty-state', className)}>
      {Icon && (
        <span className="empty-state-icon" aria-hidden="true">
          <Icon className="h-7 w-7" strokeWidth={1.8} />
        </span>
      )}
      <h3 className="text-lg font-bold tracking-tight text-ink dark:text-white">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />;
}

export function PageSkeleton({ cards = 3 }) {
  return (
    <PageShell className="py-12 sm:py-16">
      <div className="mb-8 space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[34rem] max-w-full" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index} className="card space-y-5 p-6">
            <Skeleton className="h-11 w-11 rounded-[14px]" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">Loading content</span>
    </PageShell>
  );
}

export function DataPanel({ children, className }) {
  return <section className={cn('data-panel', className)}>{children}</section>;
}

export function MetricCard({ icon: Icon, label, value, detail, tone = 'primary' }) {
  return (
    <div className="metric-card">
      <IconBadge icon={Icon} tone={tone} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink dark:text-white">{value}</p>
        {detail && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>}
      </div>
    </div>
  );
}

export function InlineNotice({ icon: Icon, title, children, tone = 'info', className }) {
  const tones = {
    info: 'border-primary-100 bg-primary-50/70 text-primary-950 dark:border-primary-800/70 dark:bg-primary-950/30 dark:text-primary-100',
    success: 'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800/70 dark:bg-emerald-950/30 dark:text-emerald-100',
    warning: 'border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-100',
    danger: 'border-red-200 bg-red-50/80 text-red-950 dark:border-red-800/70 dark:bg-red-950/30 dark:text-red-100'
  };

  return (
    <div className={cn('flex gap-4 rounded-2xl border p-4 sm:p-5', tones[tone], className)}>
      {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
      <div className="min-w-0">
        {title && <p className="font-bold">{title}</p>}
        <div className={cn('text-sm leading-6', title && 'mt-1', 'opacity-80')}>{children}</div>
      </div>
    </div>
  );
}
