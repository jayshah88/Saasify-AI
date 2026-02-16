(function() {
    'use strict';

    /**
     * SyntaxTerminal Component
     * Handles code copying and haptic feedback.
     */
    const SyntaxTerminal = {
        init() {
            // Find all terminal instances on the page
            const terminals = document.querySelectorAll('.syntax-terminal');
            terminals.forEach(terminal => this.bindEvents(terminal));
        },

        bindEvents(terminal) {
            const copyBtn = terminal.querySelector('.terminal-copy-btn');
            const codeEl = terminal.querySelector('code');
            const copyIcon = terminal.querySelector('.copy-icon');
            const checkIcon = terminal.querySelector('.check-icon');

            if (!copyBtn || !codeEl) return;

            copyBtn.addEventListener('click', async () => {
                const text = codeEl.innerText;
                
                try {
                    await navigator.clipboard.writeText(text);
                    
                    // Visual Haptic Feedback
                    copyIcon?.classList.add('hidden');
                    checkIcon?.classList.remove('hidden');
                    copyBtn.classList.add('bg-emerald-500/10');

                    setTimeout(() => {
                        copyIcon?.classList.remove('hidden');
                        checkIcon?.classList.add('hidden');
                        copyBtn.classList.remove('bg-emerald-500/10');
                    }, 2000);

                    console.log('[SyntaxTerminal] Code copied to clipboard.');
                } catch (err) {
                    console.error('[SyntaxTerminal] Failed to copy:', err);
                }
            });
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SyntaxTerminal.init());
    } else {
        SyntaxTerminal.init();
    }

})();
