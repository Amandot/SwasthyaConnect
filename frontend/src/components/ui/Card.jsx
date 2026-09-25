import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Card({ className, children, hoverEffect = false, ...props }) {
  const reduceMotion = useReducedMotion();
  const baseClasses = 'rounded-[22px] border border-slate-200/80 bg-white p-6 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80';

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -3 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className={cn(baseClasses, 'transition-[border-color,box-shadow] duration-200 hover:border-primary-200 hover:shadow-soft dark:hover:border-primary-800/70', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(baseClasses, className)} {...props}>
      {children}
    </div>
  );
}
