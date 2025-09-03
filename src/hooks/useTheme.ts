import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'auto';
    }
    return 'auto';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (newTheme: Theme) => {
      root.classList.remove('light', 'dark');

      if (newTheme === 'auto') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
        root.setAttribute('data-theme', systemTheme);
      } else {
        root.classList.add(newTheme);
        root.setAttribute('data-theme', newTheme);
      }
    };

    applyTheme(theme);

    // Listen for system theme changes when in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setThemeWithPersistence = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const getCurrentTheme = (): 'light' | 'dark' => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  return {
    theme,
    setTheme: setThemeWithPersistence,
    currentTheme: getCurrentTheme(),
  };
}