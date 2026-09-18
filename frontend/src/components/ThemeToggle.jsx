import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeProvider';

/**
 * ThemeToggle - A fully accessible theme switcher with dropdown menu
 * Supports: Light, Dark, System modes with keyboard navigation
 */
export default function ThemeToggle({
  className,
  showLabel = false,
  variant = 'default' // 'default' | 'compact' | 'minimal'
}) {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Always use light mode' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark mode' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Match OS preference' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % themes.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + themes.length) % themes.length);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (highlightedIndex >= 0) {
          selectTheme(themes[highlightedIndex].value);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  }, [isOpen, highlightedIndex]);

  const selectTheme = useCallback((value) => {
    setTheme(value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [setTheme]);

  // Focus management when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(themes.findIndex(t => t.value === theme));
    }
  }, [isOpen, theme]);

  if (!mounted) {
    // Render skeleton to prevent layout shift
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <div className="w-9 h-9 rounded-lg bg-slate-200 animate-pulse dark:bg-slate-700" />
        {showLabel && <div className="w-20 h-5 rounded bg-slate-200 animate-pulse dark:bg-slate-700" />}
      </div>
    );
  }

  const currentTheme = themes.find(t => t.value === theme);

  const buttonVariants = {
    default: "inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    compact: "inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    minimal: "inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  };

  const IconComponent = currentTheme?.icon || Monitor;

  return (
    <div ref={dropdownRef} className={cn('relative inline-flex', className)}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current theme: ${currentTheme?.label}. Click to change theme.`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="theme-dropdown"
        className={cn(buttonVariants[variant], 'group')}
      >
        <span className="relative flex items-center justify-center">
          <IconComponent
            className={cn(
              "h-5 w-5 transition-all duration-300",
              variant === 'compact' && "h-4.5 w-4.5",
              theme === 'dark' && "text-yellow-400",
              theme === 'light' && "text-orange-400",
              theme === 'system' && "text-slate-600 dark:text-slate-300"
            )}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          {variant !== 'compact' && (
            <ChevronDown
              className={cn(
                "ml-1.5 h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          )}
        </span>
        {showLabel && variant !== 'compact' && (
          <span className="hidden sm:inline-block text-sm font-medium text-slate-700 dark:text-slate-300">
            {currentTheme?.label}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="theme-dropdown"
            role="listbox"
            aria-label="Select theme"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-56 z-50"
          >
            {/* Dropdown Background */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden py-1.5">
              {/* Theme Options */}
              <ul role="listbox" className="space-y-0.5 px-1.5">
                {themes.map((themeOption, index) => {
                  const isSelected = theme === themeOption.value;
                  const isHighlighted = highlightedIndex === index;

                  return (
                    <li key={themeOption.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        aria-current={isSelected ? 'true' : undefined}
                        onClick={() => selectTheme(themeOption.value)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onMouseLeave={() => setHighlightedIndex(-1)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
                          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800",
                          isSelected
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50",
                          isHighlighted && !isSelected && "bg-slate-100 dark:bg-slate-700/50"
                        )}
                        tabIndex={isHighlighted ? 0 : -1}
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all duration-200">
                          <themeOption.icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isSelected ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500"
                            )}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>

                        <div className="flex-1 min-w-0 text-left">
                          <span className={cn(
                            "block font-medium transition-colors duration-150",
                            isSelected ? "text-primary-700 dark:text-primary-300" : "text-slate-900 dark:text-slate-100"
                          )}>
                            {themeOption.label}
                          </span>
                          <span className={cn(
                            "block text-xs mt-0.5 transition-colors duration-150",
                            isSelected ? "text-primary-500 dark:text-primary-400" : "text-slate-500 dark:text-slate-400"
                          )}>
                            {themeOption.description}
                          </span>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="flex-shrink-0 text-primary-600 dark:text-primary-400"
                          >
                            <Check className="h-4.5 w-4.5" strokeWidth={2.5} aria-hidden="true" />
                          </motion.div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Current Theme Indicator */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-slate-200/50 dark:border-slate-700/50 mt-1.5 pt-1.5 px-3 pb-2"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Monitor className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                    <span>Current: </span>
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                    resolvedTheme === 'dark'
                      ? "bg-slate-800 text-slate-100 dark:bg-slate-200 dark:text-slate-800"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  )}>
                    {resolvedTheme}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Dropdown Arrow */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-4 -top-1.5 w-3 h-3 bg-white dark:bg-slate-800 rotate-45 border-t border-l border-slate-200/50 dark:border-slate-700/50"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}