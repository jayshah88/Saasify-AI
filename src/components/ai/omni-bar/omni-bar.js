(function() {
    'use strict';

    /**
     * OmniBar Component
     * Handles global search and navigation via Cmd+K.
     */
    const OmniBar = {
        el: null,
        input: null,
        results: null,
        isOpen: false,
        selectedIndex: -1,

        init() {
            this.el = document.getElementById('omni-bar');
            this.input = document.getElementById('omni-bar-input');
            this.results = document.getElementById('omni-bar-results');
            this.backdrop = document.getElementById('omni-bar-backdrop');

            if (!this.el) return;

            this.bindEvents();
        },

        bindEvents() {
            // Global Keyboard Shortcuts
            window.addEventListener('keydown', (e) => {
                // Cmd+K or Ctrl+K
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    this.toggle();
                }

                // Escape to close
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }

                // Arrow Navigation
                if (this.isOpen) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        this.navigate(1);
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        this.navigate(-1);
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        this.select();
                    }
                }
            });

            // Click backdrop to close
            this.backdrop?.addEventListener('click', () => this.close());

            // Handle selection clicks
            this.results?.addEventListener('click', (e) => {
                const item = e.target.closest('.omni-item');
                if (item) {
                    this.executeItem(item);
                }
            });
        },

        toggle() {
            this.isOpen ? this.close() : this.open();
        },

        open() {
            this.isOpen = true;
            this.el.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Wait for next frame to focus
            requestAnimationFrame(() => {
                this.input.focus();
            });

            // Dispatch global event
            window.dispatchEvent(new CustomEvent('saasify:omni-bar-open'));
        },

        close() {
            this.isOpen = false;
            this.el.classList.add('hidden');
            document.body.style.overflow = '';
            this.input.value = '';
            this.selectedIndex = -1;
            
            window.dispatchEvent(new CustomEvent('saasify:omni-bar-close'));
        },

        navigate(direction) {
            const items = this.results.querySelectorAll('.omni-item');
            if (!items.length) return;

            this.selectedIndex += direction;

            if (this.selectedIndex >= items.length) this.selectedIndex = 0;
            if (this.selectedIndex < 0) this.selectedIndex = items.length - 1;

            items.forEach((item, index) => {
                if (index === this.selectedIndex) {
                    item.classList.add('bg-white/10', 'border-indigo-500/50');
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.classList.remove('bg-white/10', 'border-indigo-500/50');
                }
            });
        },

        select() {
            const items = this.results.querySelectorAll('.omni-item');
            const selected = items[this.selectedIndex];
            if (selected) {
                this.executeItem(selected);
            }
        },

        executeItem(item) {
            const url = item.getAttribute('data-url');
            const action = item.getAttribute('data-action');

            if (url) {
                window.location.href = url;
            } else if (action === 'ask-ai') {
                console.log('[OmniBar] Trigger AI Query:', this.input.value);
                // Dispatch event for AI component
                window.dispatchEvent(new CustomEvent('saasify:ai-request', {
                    detail: { query: this.input.value }
                }));
                this.close();
            }
        }
    };

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => OmniBar.init());
    } else {
        OmniBar.init();
    }

    // Expose to window for potential external control
    window.SaasifyOmniBar = OmniBar;

})();
