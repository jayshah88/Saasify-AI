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

            if (!this.el) return;

            this.bindEvents();
        },

        bindEvents() {
            this.closeBtn?.addEventListener('click', () => this.close());
            this.backdrop?.addEventListener('click', () => this.close());
            
            // Listen for custom trigger event
            window.addEventListener('saasify:open-profile', () => this.open());
        },

        open() {
            this.isOpen = true;
            this.el.classList.remove('hidden');
            // Force reflow for animation
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
