(function() {
    'use strict';

    /**
     * PromptInput Component
     * Handles auto-expanding textarea and event dispatching.
     */
    const PromptInput = {
        el: null,
        textarea: null,
        btn: null,

        init() {
            // Find the component instance
            this.textarea = document.getElementById('ai-prompt-textarea');
            this.btn = document.getElementById('ai-generate-btn');

            if (!this.textarea || !this.btn) return;

            this.bindEvents();
        },

        bindEvents() {
            // Auto-resize logic
            this.textarea.addEventListener('input', () => {
                this.textarea.style.height = 'auto';
                this.textarea.style.height = (this.textarea.scrollHeight) + 'px';
                
                // Toggle button state based on content
                if (this.textarea.value.trim().length > 0) {
                    this.btn.classList.add('shadow-glow-primary');
                } else {
                    this.btn.classList.remove('shadow-glow-primary');
                }
            });

            // Submit on Cmd+Enter
            this.textarea.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    this.submit();
                }
            });

            // Click handler
            this.btn.addEventListener('click', () => this.submit());

            // Loading state listener (optional hook for future)
            window.addEventListener('saasify:ai-loading-start', () => this.setLoading(true));
            window.addEventListener('saasify:ai-loading-end', () => this.setLoading(false));
        },

        submit() {
            const prompt = this.textarea.value.trim();
            if (!prompt) return;

            console.log('[PromptInput] Dispatching:', prompt);
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('saasify:ai-request', {
                detail: { prompt }
            }));

            // Reset UI
            this.textarea.value = '';
            this.textarea.style.height = 'auto';
            this.setLoading(true); // Optimistic UI
        },

        setLoading(isLoading) {
            this.btn.disabled = isLoading;
            const span = this.btn.querySelector('span');
            if (span) {
                span.textContent = isLoading ? 'Generating...' : 'Generate';
            }
            
            // Simulate end of loading after timeout if no event received (fallback)
            if (isLoading) {
                setTimeout(() => this.setLoading(false), 2000); 
            }
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PromptInput.init());
    } else {
        PromptInput.init();
    }

})();
