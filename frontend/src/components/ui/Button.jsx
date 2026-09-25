import { motion, useReducedMotion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const MotionButton = motion.button;
const MotionSlot = motion.create(Slot);

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  icon: Icon,
  loadingText,
  asChild = false,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-[0_12px_24px_-14px_rgba(18,104,177,0.7)] focus-visible:ring-primary-500',
    secondary: 'border border-primary-200 bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50 focus-visible:ring-primary-500 dark:border-primary-800 dark:bg-slate-900 dark:text-primary-300 dark:hover:border-primary-700 dark:hover:bg-primary-950/40',
    outline: 'border border-slate-200 bg-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800',
    danger: 'bg-brand-emergency text-white hover:bg-red-700 shadow-[0_12px_24px_-14px_rgba(217,45,32,0.7)] focus-visible:ring-red-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
  };
  const sizes = {
    sm: 'min-h-10 rounded-xl px-4 py-2 text-sm',
    md: 'min-h-12 rounded-[14px] px-5 py-3 text-sm',
    lg: 'min-h-14 rounded-2xl px-6 py-3.5 text-base'
  };
  const Component = asChild ? MotionSlot : MotionButton;

  return (
    <Component
      whileHover={reduceMotion ? undefined : { y: -1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap font-bold transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      disabled={asChild ? undefined : isLoading || disabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          {loadingText || children}
        </>
      ) : Icon ? (
        <>
          <Icon className={cn('h-4 w-4', children && 'mr-2')} aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Component>
  );
}
