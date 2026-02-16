import { Chart, registerables } from 'chart.js';
import { EventBus } from '../../../core/events.js';

Chart.register(...registerables);

/**
 * ChartThemeAdapter
 * 
 * Handles synchronizing Chart.js defaults with the Saasify theme.
 */
export const ChartThemeAdapter = {
    instances: [],

    init() {
        // Set initial defaults
        this.updateDefaults(document.documentElement.classList.contains('dark'));

        // Listen for theme changes
        EventBus.on('saasify:theme-change', (e) => {
            const isDark = e.detail.theme === 'dark';
            this.updateDefaults(isDark);
            this.refreshCharts();
        });
    },

    updateDefaults(isDark) {
        const textColor = isDark ? '#94a3b8' : '#64748b'; // Slate 400 / 500
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = gridColor;
        Chart.defaults.scale.grid.color = gridColor;
        Chart.defaults.font.family = "'Geist', 'Inter', sans-serif";
    },

    /**
     * Create a managed chart instance
     * @param {HTMLCanvasElement} ctx 
     * @param {object} config 
     * @returns {Chart}
     */
    create(ctx, config) {
        const chart = new Chart(ctx, config);
        this.instances.push(chart);
        return chart;
    },

    refreshCharts() {
        this.instances.forEach(chart => chart.update());
    }
};

ChartThemeAdapter.init();
