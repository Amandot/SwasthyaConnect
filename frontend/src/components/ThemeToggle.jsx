import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ThemeToggle({ className, variant }) {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();

  // Wait until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={cn(
          "w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse border border-transparent", 
          className
        )} 
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        "relative flex items-center w-16 h-8 p-1 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 shadow-inner border border-slate-200/50 dark:border-slate-700/50 overflow-hidden",
        isDark ? "bg-slate-800" : "bg-slate-100",
        className
      )}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Sliding indicator */}
      <motion.div
        className={cn(
          "absolute flex items-center justify-center w-6 h-6 rounded-full shadow-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 z-10"
        )}
        initial={false}
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0.5 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute"
        >
          <Sun className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            rotate: isDark ? 0 : -180,
            scale: isDark ? 1 : 0.5,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute"
        >
          <Moon className="w-3.5 h-3.5 text-yellow-400" strokeWidth={2.5} />
        </motion.div>
      </motion.div>
      
      {/* Background Icons (Subtle hints behind the indicator) */}
      <div className="flex w-full justify-between px-1.5 opacity-30 pointer-events-none">
        <Moon className="w-3.5 h-3.5 text-slate-500" strokeWidth={2.5} />
        <Sun className="w-3.5 h-3.5 text-slate-500" strokeWidth={2.5} />
      </div>
    </button>
  );
}