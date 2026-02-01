/**
 * Saasify AI - Main JavaScript
 * 
 * This file handles all interactive elements of the template.
 * It is written in pure Vanilla JS with no external dependencies.
 * 
 * Functionality:
 * 1. Theme Toggling (Dark/Light Mode)
 * 2. Mobile Navigation
 * 3. Sticky Header Scroll Effect
 * 4. Interactive Components (Tabs, Accordions, Modals)
 * 5. Pricing Toggle Logic
 * 6. Utilities (Alerts, Countdown)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // 1. Theme Management (Dark/Light Mode)
    // ==========================================
    const initTheme = () => {
        const themeToggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
        const html = document.documentElement;
        
        // Safety check
        if (!themeToggleBtns.length) return;

        const sunIcons = document.querySelectorAll('#icon-sun');
        const moonIcons = document.querySelectorAll('#icon-moon');
        
        // Helper to update icons based on current theme
        const updateIcons = (isDark) => {
            sunIcons.forEach(icon => {
                if (isDark) icon.classList.remove('hidden');
                else icon.classList.add('hidden');
            });
            moonIcons.forEach(icon => {
                if (isDark) icon.classList.add('hidden');
                else icon.classList.remove('hidden');
            });
        };

        // Check local storage or system preference
        const isDark = localStorage.theme === 'dark' || 
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        // Apply initial theme
        if (isDark) {
            html.classList.add('dark');
            updateIcons(true);
        } else {
            html.classList.remove('dark');
            updateIcons(false);
        }

        // Handle Toggle Click
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default if inside a form
                const isDarkModeNow = html.classList.toggle('dark');
                if (isDarkModeNow) {
                    localStorage.theme = 'dark';
                    updateIcons(true);
                } else {
                    localStorage.theme = 'light';
                    updateIcons(false);
                }
            });
        });
    };
    initTheme();

    // ==========================================
    // 2. Mobile Navigation
    // ==========================================
    const initMobileMenu = () => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                
                // Optional: Update aria attributes for accessibility
                const isExpanded = !mobileMenu.classList.contains('hidden');
                menuBtn.setAttribute('aria-expanded', isExpanded);
                menuBtn.setAttribute('aria-label', isExpanded ? 'Close Menu' : 'Open Menu');
            });

            // Close menu when clicking a link inside it
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    };
    initMobileMenu();

    // ==========================================
    // 3. Header Scroll Effect (Sticky Blur)
    // ==========================================
    const initHeaderScroll = () => {
        const header = document.getElementById('main-header');
        if (header) {
            const handleScroll = () => {
                if (window.scrollY > 20) {
                    header.classList.add('bg-white/90', 'dark:bg-neutral-950/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
                    header.classList.remove('py-5', 'border-transparent');
                    header.classList.add('border-neutral-200', 'dark:border-neutral-800');
                } else {
                    header.classList.remove('bg-white/90', 'dark:bg-neutral-950/90', 'backdrop-blur-md', 'shadow-sm', 'py-3', 'border-neutral-200', 'dark:border-neutral-800');
                    header.classList.add('py-5', 'border-transparent');
                }
            };
            
            window.addEventListener('scroll', handleScroll);
            // Check on load in case page is refreshed while scrolled
            handleScroll();
        }
    };
    initHeaderScroll();

    // ==========================================
    // 4. Accordions (FAQ & Features)
    // ==========================================
    const initAccordions = () => {
        const triggers = document.querySelectorAll('.accordion-btn');
        
        triggers.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('aria-controls');
                if (!targetId) return;

                const content = document.getElementById(targetId);
                const icon = btn.querySelector('.accordion-icon');

                if (content) {
                    // Toggle visibility
                    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !isExpanded);
                    content.classList.toggle('hidden');
                    
                    // Rotate icon if it exists
                    if (icon) {
                        icon.classList.toggle('rotate-180');
                    }
                }
            });
        });
    };
    initAccordions();

    // ==========================================
    // 5. Tabs System
    // ==========================================
    const initTabs = () => {
        const triggers = document.querySelectorAll('[data-tab-target]');
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                // 1. Get targets
                const targetSelector = trigger.getAttribute('data-tab-target');
                if (!targetSelector) return;
                
                const targetContent = document.querySelector(targetSelector);
                const container = trigger.closest('.tabs-container');

                if (!container || !targetContent) return;

                // 2. Reset active states within this container
                const allTriggers = container.querySelectorAll('[data-tab-target]');
                const allContents = container.querySelectorAll('.tab-content');

                allTriggers.forEach(t => {
                    t.classList.remove('text-primary-600', 'border-primary-600', 'dark:text-primary-400', 'dark:border-primary-400', 'active');
                    t.classList.add('text-neutral-500', 'border-transparent');
                });
                
                allContents.forEach(c => c.classList.add('hidden'));

                // 3. Activate clicked tab
                trigger.classList.remove('text-neutral-500', 'border-transparent');
                trigger.classList.add('text-primary-600', 'border-primary-600', 'dark:text-primary-400', 'dark:border-primary-400', 'active');
                targetContent.classList.remove('hidden');
            });
        });
    };
    initTabs();

    // ==========================================
    // 6. Pricing Toggle (Monthly/Yearly)
    // ==========================================
    const initPricing = () => {
        const toggleBtn = document.getElementById('pricing-toggle');
        // Return early if not on pricing page
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const circle = document.getElementById('toggle-circle');
            const prices = document.querySelectorAll('.pricing-amount');
            const monthlyLabel = document.getElementById('monthly-label');
            const yearlyLabel = document.getElementById('yearly-label');
            
            if (!circle || !monthlyLabel || !yearlyLabel) return;

            // Check current state via circle position class or a data attribute
            // We assume default is Monthly (circle on left)
            const isYearlyNow = !circle.classList.contains('translate-x-6');

            if (isYearlyNow) {
                // Switch to Yearly
                circle.classList.add('translate-x-6');
                monthlyLabel.classList.remove('text-neutral-900', 'dark:text-white');
                monthlyLabel.classList.add('text-neutral-500');
                yearlyLabel.classList.add('text-neutral-900', 'dark:text-white');
                yearlyLabel.classList.remove('text-neutral-500');

                prices.forEach(price => {
                    const yearlyPrice = price.getAttribute('data-yearly');
                    if (yearlyPrice) price.textContent = yearlyPrice;
                });
            } else {
                // Switch to Monthly
                circle.classList.remove('translate-x-6');
                monthlyLabel.classList.add('text-neutral-900', 'dark:text-white');
                monthlyLabel.classList.remove('text-neutral-500');
                yearlyLabel.classList.remove('text-neutral-900', 'dark:text-white');
                yearlyLabel.classList.add('text-neutral-500');
                
                prices.forEach(price => {
                    const monthlyPrice = price.getAttribute('data-monthly');
                    if (monthlyPrice) price.textContent = monthlyPrice;
                });
            }
        });
    };
    initPricing();

    // ==========================================
    // 7. Modals
    // ==========================================
    const initModals = () => {
        const openBtns = document.querySelectorAll('[data-modal-target]');
        const closeBtns = document.querySelectorAll('[data-modal-close]');
        
        // Open logic
        openBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal-target');
                if (!modalId) return;

                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden'; // Prevent background scroll
                }
            });
        });

        // Close logic (Buttons)
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                closeModal(modal);
            });
        });

        // Close logic (Click Outside)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });

        function closeModal(modal) {
            if (modal) {
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }
    };
    initModals();

    // ==========================================
    // 8. Dismissible Alerts
    // ==========================================
    const initAlerts = () => {
        document.querySelectorAll('[data-dismiss-target]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-dismiss-target');
                if (!targetId) return;
                
                const alertEl = document.getElementById(targetId);
                if (alertEl) {
                    alertEl.remove();
                }
            });
        });
    };
    initAlerts();
    
    // ==========================================
    // 9. Countdown Timer (Coming Soon Page)
    // ==========================================
    const initCountdown = () => {
        const countdownContainer = document.getElementById('countdown');
        if (!countdownContainer) return;

        // Set target date (e.g., 2 days from now)
        // In a real template, you might parse a date string from data-date attribute
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

            const dEl = document.getElementById('days');
            const hEl = document.getElementById('hours');
            const mEl = document.getElementById('minutes');
            const sEl = document.getElementById('seconds');

            if (dEl) dEl.innerText = String(days).padStart(2, '0');
            if (hEl) hEl.innerText = String(hours).padStart(2, '0');
            if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
            if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
        };

        // Run only if elements exist
        if (document.getElementById('days')) {
            setInterval(updateTimer, 1000);
            updateTimer(); // Run immediately
        }
    };
    initCountdown();

    // ==========================================
    // 10. Active Link Highlight
    // ==========================================
    const initActiveLinks = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('text-primary-600', 'dark:text-primary-400');
                link.classList.remove('text-neutral-500', 'text-neutral-600');
                
                // Optional: Scroll active link into view for mobile nav
                // link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    };
    initActiveLinks();

});