import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storage from '../services/storageService';

const THEME_KEY = 'menux_theme';
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        // Dark mode desabilitado — design atual é light-only.
        // Quando dark mode for projetado, restaurar detecção do sistema aqui.
        return 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        storage.set(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    const setTheme = useCallback((t) => {
        if (t === 'light' || t === 'dark') setThemeState(t);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
