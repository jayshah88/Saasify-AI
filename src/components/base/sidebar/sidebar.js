(function() {
    'use strict';

    const Sidebar = {
        el: null,
        toggleBtn: null,
        overlay: null,
        closeMobileBtn: null,
        mobileToggle: null,
        isCollapsed: false,

        init() {
            this.el = document.getElementById('sidebar');
            this.toggleBtn = document.getElementById('sidebar-toggle');
            this.overlay = document.getElementById('sidebar-overlay');
            this.closeMobileBtn = document.getElementById('sidebar-close-mobile');
            this.mobileToggle = document.getElementById('mobile-menu-btn');

            if (!this.el) return;

            // Highlight active link
            this.updateActiveLink();

            // Restore desktop state
            try {
                const savedState = localStorage.getItem('saasify-sidebar-collapsed');
                if (savedState === 'true' && window.innerWidth >= 768) {
                    this.setCollapsed(true);
                }
            } catch (e) {
                // Storage restricted
            }

            this.bindEvents();
        },

        updateActiveLink() {
            const currentPath = window.location.pathname;
            const filename = currentPath.split('/').pop() || 'index.html';
            const links = this.el.querySelectorAll('.sidebar-link');

            links.forEach(link => {
                const page = link.getAttribute('data-page');
                const isMatch = (filename === page) || 
                    (filename === '' && page === 'index.html') ||
                    (filename === 'index.html' && page === 'index.html' && !currentPath.includes('analytics') && !currentPath.includes('lab') && !currentPath.includes('team') && !currentPath.includes('billing') && !currentPath.includes('settings'));

                if (isMatch) {
                    link.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-50', 'hover:dark:bg-white/5');
                    link.classList.add('text-indigo-600', 'dark:text-white', 'bg-indigo-50', 'dark:bg-white/10', 'font-semibold');
                    const svg = link.querySelector('svg');
                    if (svg) {
                        svg.classList.add('text-indigo-600', 'dark:text-indigo-400');
                        svg.classList.remove('text-slate-500', 'dark:text-slate-400');
                    }
                }
            });
        },

        bindEvents() {
            // Desktop Collapse
            this.toggleBtn?.addEventListener('click', () => {
                this.setCollapsed(!this.isCollapsed);
            });

            // Mobile Open
            this.mobileToggle?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setMobileOpen(true);
            });

            // Mobile Close Button
            this.closeMobileBtn?.addEventListener('click', () => {
                this.setMobileOpen(false);
            });

            // Mobile Close (Overlay)
            this.overlay?.addEventListener('click', () => {
                this.setMobileOpen(false);
            });

            // Close on escape key
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.el.classList.contains('mobile-open')) {
                    this.setMobileOpen(false);
                }
            });
        },

        setCollapsed(collapsed) {
            this.isCollapsed = collapsed;
            if (collapsed) {
                this.el.classList.add('collapsed');
                try { localStorage.setItem('saasify-sidebar-collapsed', 'true'); } catch (e) {}
            } else {
                this.el.classList.remove('collapsed');
                try { localStorage.setItem('saasify-sidebar-collapsed', 'false'); } catch (e) {}
            }
            
            const main = document.querySelector('main');
            if (main && window.innerWidth >= 768) {
                main.style.marginLeft = collapsed ? '4rem' : '16rem';
            }
        },

        setMobileOpen(isOpen) {
            if (isOpen) {
                this.el.classList.remove('-translate-x-full');
                this.el.classList.add('translate-x-0', 'mobile-open');
                this.overlay?.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                this.el.classList.remove('translate-x-0', 'mobile-open');
                this.el.classList.add('-translate-x-full');
                this.overlay?.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Sidebar.init());
    } else {
        Sidebar.init();
    }

    window.SaasifySidebar = Sidebar;
})();
