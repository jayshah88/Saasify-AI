(function() {
    'use strict';

    /**
     * CitationDrawer Component
     * Handles side-drawer visibility and source display.
     */
    const CitationDrawer = {
        el: null,
        panel: null,
        backdrop: null,
        closeBtn: null,
        isOpen: false,

        init() {
            this.el = document.getElementById('citation-drawer');
            this.panel = document.getElementById('citation-drawer-panel');
            this.backdrop = document.getElementById('citation-drawer-backdrop');
            this.closeBtn = document.getElementById('citation-drawer-close');

            if (!this.el) return;

            this.bindEvents();
        },

        bindEvents() {
            // Close logic
            this.closeBtn?.addEventListener('click', () => this.close());
            this.backdrop?.addEventListener('click', () => this.close());

            // Global trigger listener
            window.addEventListener('saasify:open-citation', (e) => {
                this.open(e.detail);
            });

            // Keyboard support
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        },

        open(data) {
            this.isOpen = true;
            this.el.classList.remove('hidden');
            
            // Allow browser to register hidden removal before adding animation class
            requestAnimationFrame(() => {
                document.body.classList.add('citation-drawer-open');
                document.body.style.overflow = 'hidden';
            });

            // Update content if provided
            if (data?.name) {
                const nameEl = document.getElementById('source-name');
                if (nameEl) nameEl.textContent = data.name;
            }
        },

        close() {
            this.isOpen = false;
            document.body.classList.remove('citation-drawer-open');
            document.body.style.overflow = '';

            // Hide element after animation completes (300ms)
            setTimeout(() => {
                if (!this.isOpen) {
                    this.el.classList.add('hidden');
                }
            }, 300);
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CitationDrawer.init());
    } else {
        CitationDrawer.init();
    }

})();
