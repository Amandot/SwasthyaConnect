import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Card({ className, children, hoverEffect = false, ...props }) {
  const baseClasses = "bg-white dark:bg-slate-800 rounded-2xl border border-slate-100/50 dark:border-slate-700/50 p-6 shadow-soft";

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(baseClasses, "hover:shadow-premium hover:border-primary-100 dark:hover:border-primary-900 transition-colors duration-300", className)}
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
