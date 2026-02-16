(function() {
    'use strict';

    const NotificationDrawer = {
        el: null,
        panel: null,
        backdrop: null,
        isOpen: false,

        init() {
            this.el = document.getElementById('notification-drawer');
            this.panel = document.getElementById('notification-panel');
            this.backdrop = document.getElementById('notification-backdrop');
            this.closeBtn = document.getElementById('close-notification');

            if (!this.el) return;

            this.bindEvents();
        },

        bindEvents() {
            this.closeBtn?.addEventListener('click', () => this.close());
            this.backdrop?.addEventListener('click', () => this.close());
            
            // Listen for custom trigger event
            window.addEventListener('saasify:open-notifications', () => this.open());
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
        document.addEventListener('DOMContentLoaded', () => NotificationDrawer.init());
    } else {
        NotificationDrawer.init();
    }

    window.SaasifyNotifications = NotificationDrawer;
})();
