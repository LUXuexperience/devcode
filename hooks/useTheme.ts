import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';


const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return (localStorage.getItem('theme') as Theme) || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const body = document.body;
        
        body.classList.remove('light', 'dark');
        body.classList.add(theme);
        
        localStorage.setItem('theme', theme);
    }, [theme]); // Se ejecuta cada vez que 'theme' cambia

    const toggleTheme = useCallback(() => {
        setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
    }, []);

    return { theme, toggleTheme };
};

export default useTheme;