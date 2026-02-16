(function() {
    'use strict';

    const Header = {
        el: null,

        init() {
            this.el = document.getElementById('main-header');
            if (!this.el) return;

            window.addEventListener('scroll', () => this.handleScroll());
            this.handleScroll(); // Init state
        },

        handleScroll() {
            if (window.scrollY > 20) {
                this.el.classList.add('bg-white/90', 'dark:bg-slate-950/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
                this.el.classList.remove('py-5', 'border-transparent');
                this.el.classList.add('border-slate-200', 'dark:border-white/5');
            } else {
                this.el.classList.remove('bg-white/90', 'dark:bg-slate-950/90', 'backdrop-blur-md', 'shadow-sm', 'py-3', 'border-slate-200', 'dark:border-white/5');
                this.el.classList.add('py-5', 'border-transparent');
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Header.init());
    } else {
        Header.init();
    }
})();
