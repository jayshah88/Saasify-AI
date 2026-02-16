(function() {
    'use strict';

    const MobileCTA = {
        el: null,
        threshold: 600, // Show after 600px of scrolling

        init() {
            this.el = document.getElementById('mobile-cta-bar');
            if (!this.el) return;

            window.addEventListener('scroll', () => this.handleScroll());
            this.handleScroll();
        },

        handleScroll() {
            // Only run logic on mobile viewports
            if (window.innerWidth >= 768) {
                this.el.classList.add('translate-y-full');
                return;
            }

            if (window.scrollY > this.threshold) {
                this.el.classList.remove('translate-y-full');
            } else {
                this.el.classList.add('translate-y-full');
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MobileCTA.init());
    } else {
        MobileCTA.init();
    }
})();
