(function() {
    'use strict';

    const ProfileDrawer = {
        el: null,
        panel: null,
        backdrop: null,
        isOpen: false,

        init() {
            this.el = document.getElementById('profile-drawer');
            this.panel = document.getElementById('profile-panel');
            this.backdrop = document.getElementById('profile-backdrop');
            this.closeBtn = document.getElementById('close-profile');
            this.signOutBtn = document.getElementById('profile-sign-out');

            if (!this.el) return;

            this.bindEvents();
        },

        bindEvents() {
            this.closeBtn?.addEventListener('click', () => this.close());
            this.backdrop?.addEventListener('click', () => this.close());
            
            // Listen for custom trigger event
            window.addEventListener('saasify:open-profile', () => this.open());

            // Handle Escape key
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Handle navigation routes
            this.el.querySelectorAll('.profile-nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const route = link.getAttribute('data-route');
                    if (!route) return;

                    const root = window.SaasifyRoot || '';
                    window.location.href = `${root}${route}`;
                });
            });

            // Sign out handler
            this.signOutBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    localStorage.removeItem('saasify_user');
                } catch (err) {}
                const root = window.SaasifyRoot || '';
                window.location.href = `${root}auth/login.html`;
            });
        },

        open() {
            this.isOpen = true;
            this.el.classList.remove('hidden');
            this.el.offsetHeight;
            this.panel.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        },

        close() {
            this.isOpen = false;
            this.panel.classList.add('translate-x-full');
            setTimeout(() => {
                if (!this.isOpen) this.el.classList.add('hidden');
            }, 300);
            document.body.style.overflow = '';
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProfileDrawer.init());
    } else {
        ProfileDrawer.init();
    }

    window.SaasifyProfile = ProfileDrawer;
})();
