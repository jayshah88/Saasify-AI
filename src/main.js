import './style.css';
import { ThemeManager } from './config/theme.js';
import { EventBus } from './core/events.js';
import { UI } from './core/ui.js';
import { MockAI } from './core/mock-ai.js';
import './components/base/sidebar/sidebar.js';

console.log('[Saasify] Script loading...');

/**
 * Saasify Component Loader
 * Dynamically injects modular components like OmniBar, Sidebar, and Drawers.
 */
const ComponentLoader = {
    getProjectRoot() {
        try {
            const moduleUrl = new URL(import.meta.url);
            const rootUrl = new URL('../', moduleUrl);
            let rootPath = rootUrl.pathname;
            if (!rootPath.endsWith('/')) rootPath += '/';
            window.SaasifyRoot = rootPath;
            return rootPath;
        } catch (e) {
            window.SaasifyRoot = '/';
            return '/';
        }
    },

    async inject(containerId, htmlPath, scriptPath) {
        if (window.location.protocol === 'file:') {
            console.warn('[Saasify] Component dynamic injection requires an HTTP server (e.g. Vite dev, preview, or static web server).');
            return;
        }

        const root = this.getProjectRoot();
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
                if (!container.firstElementChild) {
                    container.appendChild(element);
                }
            } else if (containerId === 'body' || !container) {
                document.body.appendChild(element);
            }

            if (cleanScriptPath) {
                const fullScriptPath = `${root}${cleanScriptPath}`;
                if (!document.querySelector(`script[src="${fullScriptPath}"]`)) {
                    const script = document.createElement('script');
                    script.src = fullScriptPath;
                    script.type = 'text/javascript';
                    document.body.appendChild(script);
                }
            }
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

// Wire MockAI Streaming Engine to Global AI Requests
window.addEventListener('saasify:ai-request', async (e) => {
    const prompt = e.detail?.prompt || e.detail?.query || 'Analyze system architecture and latency cycles';
    console.log('[Saasify AI] Processing request:', prompt);

    const terminalCode = document.querySelector('#syntax-terminal-demo code, .syntax-terminal code');
    if (terminalCode) {
        terminalCode.textContent = '// Initializing neural reasoning stream...\n';
        window.dispatchEvent(new CustomEvent('saasify:ai-loading-start'));

        let fullText = '';
        try {
            for await (const token of MockAI.generateResponse(prompt, 'expert')) {
                fullText += token;
                terminalCode.textContent = fullText;
                const pre = terminalCode.closest('pre') || terminalCode.parentElement;
                if (pre) pre.scrollTop = pre.scrollHeight;
            }
            UI.showToast('Response generated successfully!', 'success');
        } catch (err) {
            terminalCode.textContent += '\n// [Error] Token generation interrupted.';
            console.error('[Saasify AI] Stream error:', err);
        } finally {
            window.dispatchEvent(new CustomEvent('saasify:ai-loading-end'));
        }
    } else {
        UI.showToast(`AI query processed: "${prompt.slice(0, 35)}..."`, 'success');
    }
});

// Interactive Form and Auth Handlers
const initForms = () => {
    const root = window.SaasifyRoot || ComponentLoader.getProjectRoot();

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const emailInput = loginForm.querySelector('#email, input[type="email"]');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> Signing in...`;
            }

            try {
                localStorage.setItem('saasify_user', JSON.stringify({
                    email: emailInput?.value || 'jay@example.com',
                    name: 'Jay Shah',
                    role: 'Owner'
                }));
            } catch (err) {}

            UI.showToast('Welcome back! Redirecting to Dashboard...', 'success');
            setTimeout(() => {
                const target = window.location.pathname.includes('/auth/') ? '../dashboard/index.html' : 'dashboard/index.html';
                window.location.href = target;
            }, 700);
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const emailInput = registerForm.querySelector('input[type="email"]');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> Creating Account...`;
            }

            try {
                localStorage.setItem('saasify_user', JSON.stringify({
                    email: emailInput?.value || 'jay@example.com',
                    name: 'Jay Shah',
                    role: 'Owner'
                }));
            } catch (err) {}

            UI.showToast('Account created! Redirecting to Dashboard...', 'success');
            setTimeout(() => {
                const target = window.location.pathname.includes('/auth/') ? '../dashboard/index.html' : 'dashboard/index.html';
                window.location.href = target;
            }, 700);
        });
    }

    // Contact Form
    const contactForm = document.querySelector('form.max-w-lg');
    if (contactForm && window.location.pathname.includes('contact')) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Message Received!';
                submitBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                submitBtn.classList.add('bg-emerald-600');
            }
            contactForm.reset();
            UI.showToast('Thank you! We will get back to you within 24 hours.', 'success');
        });
    }

    // Forgot Password Form
    const forgotForm = document.querySelector('main form.space-y-6');
    if (forgotForm && window.location.pathname.includes('forgot-password')) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = forgotForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Link Sent!';
                submitBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                submitBtn.classList.add('bg-emerald-600');
            }
            UI.showToast('Password reset link sent to your email address.', 'success');
        });
    }
};

// Global UI Handlers
const bootstrap = async () => {
    console.log('[Saasify] Bootstrapping components...');
    ComponentLoader.getProjectRoot();
    
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
        const sidebarContainer = document.getElementById('sidebar-container');
        if (!sidebarContainer.firstElementChild) {
            await ComponentLoader.loadBase('sidebar', 'sidebar-container');
        } else if (window.SaasifySidebar && typeof window.SaasifySidebar.init === 'function') {
            window.SaasifySidebar.init();
        }
    }

    if (document.getElementById('prompt-input-demo')) {
        await ComponentLoader.loadAI('prompt-input', 'prompt-input-demo');
    }

    if (document.getElementById('syntax-terminal-demo')) {
        await ComponentLoader.loadAI('syntax-terminal', 'syntax-terminal-demo');
    }

    // Header Toggle Logic
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

    // Initialize interactive form handlers
    initForms();

    console.log('--- Saasify-AI Fully Initialized ---');
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    bootstrap();
} else {
    document.addEventListener('DOMContentLoaded', bootstrap);
}
