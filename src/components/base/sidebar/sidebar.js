(function() {
    'use strict';

    const Sidebar = {
        el: null,
        toggleBtn: null,
        overlay: null,
        isCollapsed: false,

        init() {
            this.el = document.getElementById('sidebar');
            this.toggleBtn = document.getElementById('sidebar-toggle');
            this.overlay = document.getElementById('sidebar-overlay');
            this.mobileToggle = document.getElementById('mobile-menu-btn'); // Reuse existing btn or new one

            if (!this.el) return;

            // Restore state
            const savedState = localStorage.getItem('saasify-sidebar-collapsed');
            if (savedState === 'true' && window.innerWidth >= 768) {
                this.setCollapsed(true);
            }

            this.bindEvents();
        },

        bindEvents() {
            // Desktop Collapse
            this.toggleBtn?.addEventListener('click', () => {
                this.setCollapsed(!this.isCollapsed);
            });

            // Mobile Open
            this.mobileToggle?.addEventListener('click', () => {
                this.setMobileOpen(true);
            });

            // Mobile Close (Overlay)
            this.overlay?.addEventListener('click', () => {
                this.setMobileOpen(false);
            });
        },

        setCollapsed(collapsed) {
            this.isCollapsed = collapsed;
            if (collapsed) {
                this.el.classList.add('collapsed');
                localStorage.setItem('saasify-sidebar-collapsed', 'true');
            } else {
                this.el.classList.remove('collapsed');
                localStorage.setItem('saasify-sidebar-collapsed', 'false');
            }
            
            // Adjust main content margin (simplified)
            const main = document.querySelector('main');
            if (main) {
                main.style.marginLeft = collapsed ? '4rem' : '16rem';
            }
        },

        setMobileOpen(isOpen) {
            if (isOpen) {
                this.el.classList.add('mobile-open');
                this.overlay?.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                this.el.classList.remove('mobile-open');
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

})();
