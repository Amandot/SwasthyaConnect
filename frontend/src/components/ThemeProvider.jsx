import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(undefined);

/**
 * ThemeProvider - A lightweight theme provider mimicking next-themes API for Vite/React
 * Supports: 'light', 'dark', 'system' themes with persistence and no hydration flicker
 */
export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = true,
  storageKey = 'theme'
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = useCallback(() => {
    if (!enableSystem || typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, [enableSystem]);

  // Resolve the actual theme to apply
  const resolveTheme = useCallback((themeValue) => {
    if (themeValue === 'system') {
      return getSystemTheme();
    }
    return themeValue;
  }, [getSystemTheme]);

  // Apply theme to document
  const applyTheme = useCallback((themeValue) => {
    const resolved = resolveTheme(themeValue);
    setResolvedTheme(resolved);

    if (attribute === 'class') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);
    } else if (attribute === 'data-theme') {
      document.documentElement.setAttribute('data-theme', resolved);
    }

    // Disable transitions during theme change to prevent flickering
    if (disableTransitionOnChange) {
      document.documentElement.style.transition = 'none';
      requestAnimationFrame(() => {
        document.documentElement.style.transition = '';
      });
    }
  }, [attribute, disableTransitionOnChange, resolveTheme]);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Read from localStorage
    const stored = localStorage.getItem(storageKey);
    const initialTheme = stored || defaultTheme;
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme, defaultTheme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem, applyTheme]);

  // Update theme when theme state changes
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, mounted, applyTheme, storageKey]);

  // Force update resolved theme (useful for manual sync)
  const forceUpdate = useCallback(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
    themes: ['light', 'dark', 'system'],
    forceUpdate,
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme hook - Access theme context (mimics next-themes useTheme)
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}