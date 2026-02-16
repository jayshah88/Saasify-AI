import { ChartThemeAdapter } from '../../components/base/charts/chart-config.js';

(function() {
    'use strict';

    const Dashboard = {
        init() {
            this.renderRevenueChart();
        },

        renderRevenueChart() {
            const ctx = document.getElementById('revenue-chart');
            if (!ctx) return;

            ChartThemeAdapter.create(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Tokens Generated',
                        data: [12000, 19000, 3000, 5000, 20000, 30000],
                        borderColor: '#4F46E5', // Indigo 600
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.5)');
                            gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Dashboard.init());
    } else {
        Dashboard.init();
    }
})();
