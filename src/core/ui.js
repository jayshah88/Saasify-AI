/**
 * Saasify UI Helpers
 * 
 * Uses event delegation for maximum reliability across dynamic component injection.
 */

export const UI = {
    init() {
        console.log('[UI] Initializing event delegation...');
        this.bindEvents();
    },

    bindEvents() {
        // Single listener for all standard UI interactions
        document.addEventListener('click', (e) => {
            // 1. Accordion Toggle
            const accordionBtn = e.target.closest('.accordion-btn');
            if (accordionBtn) {
                this.handleAccordion(accordionBtn);
                return;
            }

            // 2. Tab Trigger
            const tabTrigger = e.target.closest('[data-tab-target]');
            if (tabTrigger) {
                this.handleTab(tabTrigger);
                return;
            }

            // 3. Modal Open/Close
            const modalOpenBtn = e.target.closest('[data-modal-target]');
            const modalCloseBtn = e.target.closest('[data-modal-close]');
            
            if (modalOpenBtn) {
                const modal = document.getElementById(modalOpenBtn.getAttribute('data-modal-target'));
                if (modal) {
                    modal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
                return;
            }

            if (modalCloseBtn) {
                const modal = modalCloseBtn.closest('.modal') || modalCloseBtn.closest('[role="dialog"]');
                if (modal) {
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
                return;
            }

            // 4. Mobile Menu Toggle
            const mobileBtn = e.target.closest('#mobile-menu-btn');
            if (mobileBtn) {
                this.handleMobileMenu();
                return;
            }
            
            // 5. Mobile Menu Link Click (Close menu)
            const mobileLink = e.target.closest('#mobile-menu a');
            if (mobileLink) {
                this.handleMobileMenu(false); // Close
                return;
            }

            // 6. Pricing Toggle
            const pricingToggle = e.target.closest('#pricing-toggle');
            if (pricingToggle) {
                this.handlePricing();
                return;
            }
        });

        // Initialize non-click components
        this.initCountdown();
        this.initTooltips();
        this.initSliders();
        this.initHeaderScroll();
    },

    initHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('bg-white/80', 'dark:bg-slate-950/80', 'backdrop-blur-lg', 'shadow-sm', 'py-3');
                header.classList.remove('py-5', 'border-transparent');
                header.classList.add('border-slate-200', 'dark:border-white/10');
            } else {
                header.classList.remove('bg-white/80', 'dark:bg-slate-950/80', 'backdrop-blur-lg', 'shadow-sm', 'py-3', 'border-slate-200', 'dark:border-white/10');
                header.classList.add('py-5', 'border-transparent');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
    },

    handleAccordion(btn) {
        const targetId = btn.getAttribute('aria-controls');
        const content = document.getElementById(targetId);
        const icon = btn.querySelector('.accordion-icon');

        if (content) {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('hidden');
            
            if (!isExpanded) {
                content.classList.add('accordion-content-active');
            } else {
                content.classList.remove('accordion-content-active');
            }

            if (icon) {
                icon.classList.toggle('rotate-180');
            }
        }
    },

    handleTab(trigger) {
        const targetSelector = trigger.getAttribute('data-tab-target');
        const targetContent = document.querySelector(targetSelector);
        const container = trigger.closest('.tabs-container') || document.body;

        if (!targetContent) return;

        container.querySelectorAll('[data-tab-target]').forEach(t => {
            t.classList.remove('active', 'text-indigo-600', 'border-indigo-600');
            t.classList.add('text-slate-500', 'border-transparent');
        });

        container.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

        trigger.classList.add('active', 'text-indigo-600', 'border-indigo-600');
        trigger.classList.remove('text-slate-500', 'border-transparent');
        targetContent.classList.remove('hidden');
    },

    handleMobileMenu(forceState) {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;

        const isHidden = menu.classList.contains('hidden');
        const shouldShow = forceState !== undefined ? forceState : isHidden;

        if (shouldShow) {
            menu.classList.remove('hidden');
            // Force reflow
            menu.offsetHeight;
            menu.classList.remove('opacity-0', '-translate-y-4');
        } else {
            menu.classList.add('opacity-0', '-translate-y-4');
            setTimeout(() => menu.classList.add('hidden'), 300);
        }
    },

    handlePricing() {
        const circle = document.getElementById('toggle-circle');
        const prices = document.querySelectorAll('.pricing-amount');
        const monthlyLabel = document.getElementById('monthly-label');
        const yearlyLabel = document.getElementById('yearly-label');

        if (!circle || !monthlyLabel || !yearlyLabel) return;

        const isYearlyNow = !circle.classList.contains('translate-x-6');

        if (isYearlyNow) {
            circle.classList.add('translate-x-6');
            monthlyLabel.classList.remove('text-slate-900', 'dark:text-white');
            monthlyLabel.classList.add('text-slate-500');
            yearlyLabel.classList.add('text-slate-900', 'dark:text-white');
            yearlyLabel.classList.remove('text-slate-500');

            prices.forEach(price => {
                const yearlyPrice = price.getAttribute('data-yearly');
                if (yearlyPrice) price.textContent = yearlyPrice;
            });
        } else {
            circle.classList.remove('translate-x-6');
            monthlyLabel.classList.add('text-slate-900', 'dark:text-white');
            monthlyLabel.classList.remove('text-slate-500');
            yearlyLabel.classList.remove('text-slate-900', 'dark:text-white');
            yearlyLabel.classList.add('text-slate-500');

            prices.forEach(price => {
                const monthlyPrice = price.getAttribute('data-monthly');
                if (monthlyPrice) price.textContent = monthlyPrice;
            });
        }
    },

    initCountdown() {
        const countdownContainer = document.getElementById('countdown');
        if (!countdownContainer) return;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                countdownContainer.innerHTML = '<div class="text-2xl font-bold">Launched!</div>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const val = id === 'days' ? days : id === 'hours' ? hours : id === 'minutes' ? minutes : seconds;
                    el.innerText = String(val).padStart(2, '0');
                }
            });
        };

        if (document.getElementById('days')) {
            setInterval(updateTimer, 1000);
            updateTimer();
        }
    },

    initTooltips() {
        const triggers = document.querySelectorAll('[data-tooltip]');

        triggers.forEach(trigger => {
            const text = trigger.getAttribute('data-tooltip');
            let tooltipEl;

            trigger.addEventListener('mouseenter', () => {
                tooltipEl = document.createElement('div');
                tooltipEl.className = 'absolute z-[60] px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded shadow-sm dark:bg-slate-800 pointer-events-none opacity-0 transition-opacity duration-200';
                tooltipEl.textContent = text;
                document.body.appendChild(tooltipEl);

                const rect = trigger.getBoundingClientRect();
                const tooltipRect = tooltipEl.getBoundingClientRect();

                tooltipEl.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
                tooltipEl.style.top = `${rect.top - tooltipRect.height - 8 + window.scrollY}px`;

                requestAnimationFrame(() => tooltipEl.classList.remove('opacity-0'));
            });

            trigger.addEventListener('mouseleave', () => {
                if (tooltipEl) {
                    tooltipEl.remove();
                    tooltipEl = null;
                }
            });
        });
    },

    initSliders() {
        const sliders = document.querySelectorAll('.simple-slider');

        sliders.forEach(slider => {
            const track = slider.querySelector('.slider-track');
            const prevBtn = slider.querySelector('.slider-prev');
            const nextBtn = slider.querySelector('.slider-next');
            if (!track) return;

            let index = 0;
            const slides = track.children;
            const max = slides.length - 1;

            const updateSlider = () => {
                track.style.transform = `translateX(-${index * 100}%)`;
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    index = (index === max) ? 0 : index + 1;
                    updateSlider();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    index = (index === 0) ? max : index - 1;
                    updateSlider();
                });
            }
        });
    }
};