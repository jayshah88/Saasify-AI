import { EventBus } from '../core/events.js';

/**
 * ThemeManager
 * 
 * Handles Dark/Light mode state and persistence.
 */
export const ThemeManager = {
    storageKey: 'saasify-theme',

    init() {
        let theme = 'light'; // Default to light for broader compatibility
        
        try {
            const savedTheme = localStorage.getItem(this.storageKey);
            if (savedTheme) {
                theme = savedTheme;
            } else {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = systemPrefersDark ? 'dark' : 'light';
            }
        } catch (e) {
            console.warn('[ThemeManager] LocalStorage inaccessible, defaulting to light mode.');
        }
        
        this.setTheme(theme);

        // Listen for system changes if no preference is saved
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            try {
                if (!localStorage.getItem(this.storageKey)) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            } catch (err) {
                // Silently ignore if storage inaccessible
            }
        });
    },

    toggle() {
        const isDark = document.documentElement.classList.contains('dark');
        this.setTheme(isDark ? 'light' : 'dark');
    },

    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        try {
            localStorage.setItem(this.storageKey, theme);
        } catch (e) {
            // Persistence failed, but UI updated
        }
        
        EventBus.emit('saasify:theme-change', { theme });
    }
};