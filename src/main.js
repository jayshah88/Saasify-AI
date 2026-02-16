import './style.css';
import { ThemeManager } from './config/theme.js';
import { EventBus } from './core/events.js';
import { UI } from './core/ui.js';

console.log('[Saasify] Script loading...');

/**
 * Saasify Component Loader
 * Dynamically injects global components like OmniBar.
 */
const ComponentLoader = {
    // Deterministic path resolution for XAMPP/Subdirectory environments
    getProjectRoot() {
        const path = window.location.pathname;
        // In dist, we might be at /Saasify-AI/dist/dashboard/index.html
        // We want /Saasify-AI/dist/
        const distIndex = path.indexOf('/dist/');
        if (distIndex !== -1) {
            return path.substring(0, distIndex + 6);
        }
        // Fallback for src development
        const srcIndex = path.indexOf('/src/');
        if (srcIndex !== -1) {
            return path.substring(0, srcIndex);
        }
        // Fallback to current domain root
        return '/';
    },

    async inject(containerId, htmlPath, scriptPath) {
        const root = this.getProjectRoot();
        // Ensure path starts with src/
        const cleanHtmlPath = htmlPath.startsWith('/') ? htmlPath.substring(1) : htmlPath;
        const cleanScriptPath = scriptPath ? (scriptPath.startsWith('/') ? scriptPath.substring(1) : scriptPath) : null;

        const fullHtmlPath = `${root}${cleanHtmlPath}`;
        
        try {
            const response = await fetch(fullHtmlPath);
            if (!response.ok) throw new Error(`HTTP ${response.status} for ${fullHtmlPath}`);
            const html = await response.text();
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const element = tempDiv.firstElementChild;

            const container = document.getElementById(containerId);
            if (container) {
                container.appendChild(element);
            } else if (containerId === 'body' || !container) {
                document.body.appendChild(element);
            }

            if (cleanScriptPath) {
                const fullScriptPath = `${root}${cleanScriptPath}`;
                const script = document.createElement('script');
                script.src = fullScriptPath;
                script.type = 'text/javascript';
                document.body.appendChild(script);
            }
            console.log(`[Loader] Injected: ${fullHtmlPath}`);
        } catch (e) {
            console.error(`[Loader] Failed to inject ${htmlPath}:`, e);
        }
    },

    async loadAI(name, targetId = null) {
        const path = `src/components/ai/${name}/${name}`;
        await this.inject(targetId || 'body', `${path}.html`, `${path}.js`);
    },

    async loadBase(name, targetId) {
        const path = `src/components/base/${name}/${name}`;
        await this.inject(targetId, `${path}.html`, `${path}.js`);
    }
};

// Global Error Handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('[Saasify Runtime Error]', { message, source, lineno, colno, error });
};

// Initialize Core Services
try {
    ThemeManager.init();
    UI.init();
} catch (e) {
    console.error('[Saasify Init Error]', e);
}

// Global UI Handlers
const bootstrap = async () => {
    console.log('[Saasify] Bootstrapping components...');
    
    // 1. Load Global Components
    await ComponentLoader.loadAI('omni-bar');
    await ComponentLoader.loadAI('citation-drawer');
    await ComponentLoader.loadBase('notification-drawer', 'body');
    await ComponentLoader.loadBase('profile-drawer', 'body');
    
    // 2. Load Conditional Components
    if (document.getElementById('mobile-cta-container')) {
        await ComponentLoader.loadBase('cta', 'mobile-cta-container');
    }
    
    if (document.getElementById('sidebar-container')) {
        await ComponentLoader.loadBase('sidebar', 'sidebar-container');
    }

    if (document.getElementById('prompt-input-demo')) {
        await ComponentLoader.loadAI('prompt-input', 'prompt-input-demo');
    }

    if (document.getElementById('syntax-terminal-demo')) {
        await ComponentLoader.loadAI('syntax-terminal', 'syntax-terminal-demo');
    }

    // Header Toggle Logic (Sync with ThemeManager)
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');

    const updateIcons = (theme) => {
        if (theme === 'dark') {
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        } else {
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        }
    };

    updateIcons(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            ThemeManager.toggle();
        });
    }

    EventBus.on('saasify:theme-change', (e) => {
        updateIcons(e.detail.theme);
    });

    console.log('--- Saasify-AI Fully Initialized ---');
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    bootstrap();
} else {
    document.addEventListener('DOMContentLoaded', bootstrap);
}
