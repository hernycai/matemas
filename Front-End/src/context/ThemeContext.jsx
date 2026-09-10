import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('mate_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback a modo claro si hay problemas leyendo storage
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('mate_theme', theme);
    } catch (e) {
      console.warn('No se pudo guardar la preferencia de tema en localStorage', e);
    }

    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      root.classList.remove('dark-theme');
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Si se utiliza fuera del provider (por seguridad en componentes aislados), devolver valores seguros por defecto
    return {
      theme: 'light',
      toggleTheme: () => {},
      isDark: false,
      setTheme: () => {},
    };
  }
  return context;
};

export default ThemeContext;
