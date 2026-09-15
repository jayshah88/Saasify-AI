import { ChartThemeAdapter } from '../../components/base/charts/chart-config.js';
import { MockAI } from '../../core/mock-ai.js';

(function() {
    'use strict';

    const Dashboard = {
        chart: null,
        chartData: {
            '24h': {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                data: [4200, 3100, 8900, 18400, 24600, 19200, 12800],
                total: '91,200 Tokens',
                throughput: '3,120 req/s',
                credit: '86.4k'
            },
            '7d': {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [12000, 19000, 14000, 22000, 28000, 18000, 30000],
                total: '124,592 Tokens',
                throughput: '2,840 req/s',
                credit: '84.2k'
            },
            '30d': {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [84000, 112000, 145000, 178000],
                total: '519,000 Tokens',
                throughput: '2,650 req/s',
                credit: '78.5k'
            },
            '90d': {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                data: [380000, 490000, 680000],
                total: '1.55M Tokens',
                throughput: '2,420 req/s',
                credit: '64.0k'
            }
        },

        init() {
            this.renderRevenueChart();
            this.bindTimeRangeFilter();
            this.bindAgentTable();
            this.bindQuickInferenceConsole();
            this.bindDeployModal();
            this.bindExportCSV();
            this.updateAgentCounts();
        },

        renderRevenueChart() {
            const ctx = document.getElementById('revenue-chart');
            if (!ctx) return;

            const initialRange = '7d';
            const rangeData = this.chartData[initialRange];

            this.chart = ChartThemeAdapter.create(ctx, {
                type: 'line',
                data: {
                    labels: rangeData.labels,
                    datasets: [{
                        label: 'Tokens Generated',
                        data: rangeData.data,
                        borderColor: '#4F46E5', // Indigo 600
                        backgroundColor: (context) => {
                            const chartCtx = context.chart?.ctx;
                            if (!chartCtx) return 'rgba(79, 70, 229, 0.2)';
                            const gradient = chartCtx.createLinearGradient(0, 0, 0, 220);
                            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
                            gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#4F46E5'
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
        },

        updateChartData(range) {
            if (!this.chart || !this.chartData[range]) return;
            const dataSet = this.chartData[range];

            this.chart.data.labels = dataSet.labels;
            this.chart.data.datasets[0].data = dataSet.data;
            this.chart.update();

            const tokenEl = document.getElementById('stat-tokens-generated');
            if (tokenEl) tokenEl.textContent = dataSet.total;

            const creditEl = document.getElementById('stat-credit-balance');
            if (creditEl) creditEl.textContent = dataSet.credit;

            const throughputEl = document.getElementById('telemetry-throughput');
            if (throughputEl) throughputEl.textContent = dataSet.throughput;
        },

        bindTimeRangeFilter() {
            const group = document.getElementById('time-range-group');
            const select = document.getElementById('chart-range-select');

            if (group) {
                const buttons = group.querySelectorAll('.time-range-btn');
                buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const range = btn.getAttribute('data-range');
                        buttons.forEach(b => {
                            b.className = 'time-range-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
                        });
                        btn.className = 'time-range-btn px-3 py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm transition-all';

                        if (select) select.value = range;
                        this.updateChartData(range);
                    });
                });
            }

            if (select) {
                select.addEventListener('change', (e) => {
                    const range = e.target.value;
                    const groupBtn = group?.querySelector(`[data-range="${range}"]`);
                    if (groupBtn) groupBtn.click();
                    else this.updateChartData(range);
                });
            }
        },

        bindAgentTable() {
            const searchInput = document.getElementById('agent-search-input');
            const tableBody = document.getElementById('agent-table-body');
            const filterTabs = document.getElementById('agent-filter-tabs');

            let currentStatusFilter = 'all';

            const filterRows = () => {
                if (!tableBody) return;
                const query = (searchInput?.value || '').toLowerCase().trim();
                const rows = tableBody.querySelectorAll('.agent-row');
                let visibleCount = 0;

                rows.forEach(row => {
                    const name = (row.getAttribute('data-name') || '').toLowerCase();
                    const model = (row.getAttribute('data-model') || '').toLowerCase();
                    const status = (row.getAttribute('data-status') || '').toLowerCase();

                    const matchesQuery = !query || name.includes(query) || model.includes(query);
                    const matchesStatus = currentStatusFilter === 'all' || status === currentStatusFilter;

                    if (matchesQuery && matchesStatus) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });

                const countEl = document.getElementById('visible-agent-count');
                if (countEl) countEl.textContent = visibleCount;
            };

            searchInput?.addEventListener('input', filterRows);

            if (filterTabs) {
                const tabBtns = filterTabs.querySelectorAll('.agent-filter-btn');
                tabBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        tabBtns.forEach(b => {
                            b.className = 'agent-filter-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
                        });
                        btn.className = 'agent-filter-btn px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-xs transition-all';

                        currentStatusFilter = btn.getAttribute('data-filter') || 'all';
                        filterRows();
                    });
                });
            }

            // Table Body Event Delegation (Test & Pause/Resume)
            tableBody?.addEventListener('click', (e) => {
                const testBtn = e.target.closest('.agent-test-btn');
                if (testBtn) {
                    const agentName = testBtn.getAttribute('data-agent');
                    const select = document.getElementById('quick-agent-select');
                    if (select && agentName) {
                        select.value = agentName;
                    }
                    const consoleEl = document.getElementById('quick-prompt-input');
                    consoleEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    consoleEl?.focus();
                    this.showToast(`Ready to test ${agentName}`);
                    return;
                }

                const pauseBtn = e.target.closest('.agent-pause-btn');
                if (pauseBtn) {
                    const row = pauseBtn.closest('.agent-row');
                    if (!row) return;

                    const currentStatus = row.getAttribute('data-status');
                    const statusBadge = row.querySelector('.agent-status-badge');

                    if (currentStatus === 'running') {
                        row.setAttribute('data-status', 'idle');
                        pauseBtn.textContent = 'Resume';
                        if (statusBadge) {
                            statusBadge.className = 'agent-status-badge px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5 w-fit';
                            statusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>Idle</span>';
                        }
                        this.showToast('Agent paused');
                    } else {
                        row.setAttribute('data-status', 'running');
                        pauseBtn.textContent = 'Pause';
                        if (statusBadge) {
                            statusBadge.className = 'agent-status-badge px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 w-fit';
                            statusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span><span>Running</span>';
                        }
                        this.showToast('Agent resumed and running');
                    }

                    this.updateAgentCounts();
                    filterRows();
                }
            });
        },

        updateAgentCounts() {
            const tableBody = document.getElementById('agent-table-body');
            if (!tableBody) return;

            const rows = tableBody.querySelectorAll('.agent-row');
            let running = 0;
            let idle = 0;
            let ingesting = 0;

            rows.forEach(r => {
                const s = r.getAttribute('data-status');
                if (s === 'running') running++;
                else if (s === 'idle') idle++;
                else if (s === 'ingesting') ingesting++;
            });

            const countAll = document.getElementById('count-all');
            const countRunning = document.getElementById('count-running');
            const countIdle = document.getElementById('count-idle');
            const countIngesting = document.getElementById('count-ingesting');
            const statActive = document.getElementById('stat-active-agents');

            if (countAll) countAll.textContent = rows.length;
            if (countRunning) countRunning.textContent = running;
            if (countIdle) countIdle.textContent = idle;
            if (countIngesting) countIngesting.textContent = ingesting;
            if (statActive) statActive.textContent = running + ingesting;
        },

        bindQuickInferenceConsole() {
            const runBtn = document.getElementById('quick-run-btn');
            const promptInput = document.getElementById('quick-prompt-input');
            const terminalOutput = document.getElementById('quick-terminal-content');
            const agentSelect = document.getElementById('quick-agent-select');
            const terminalStatus = document.getElementById('quick-terminal-status');
            const copyBtn = document.getElementById('quick-copy-output');
            const chips = document.querySelectorAll('.quick-chip');

            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const prompt = chip.getAttribute('data-prompt');
                    if (prompt && promptInput) {
                        promptInput.value = prompt;
                        promptInput.focus();
                    }
                });
            });

            agentSelect?.addEventListener('change', () => {
                if (terminalStatus) {
                    terminalStatus.textContent = `Target: ${agentSelect.value} • Ready`;
                }
            });

            let isRunning = false;

            runBtn?.addEventListener('click', async () => {
                if (isRunning) return;
                const prompt = promptInput?.value?.trim() || 'Analyze system latency bottlenecks';
                const agent = agentSelect?.value || 'Coder-Agent-Enterprise';

                isRunning = true;
                runBtn.disabled = true;
                runBtn.classList.add('opacity-70');
                if (terminalStatus) terminalStatus.textContent = `Target: ${agent} • Streaming inference...`;

                if (terminalOutput) {
                    terminalOutput.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400 font-semibold">[${agent}] Dispatching query: "${prompt}"</span>\n<span class="text-slate-500 dark:text-slate-400">// Awaiting first token...</span>\n\n`;
                }

                try {
                    let accumulated = '';
                    const stream = MockAI.generateResponse(prompt, 'expert');
                    
                    if (terminalOutput) {
                        terminalOutput.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400 font-semibold">[${agent}] Response Stream:</span>\n\n`;
                    }

                    for await (const chunk of stream) {
                        accumulated += chunk;
                        if (terminalOutput) {
                            terminalOutput.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400 font-semibold">[${agent}] Response Stream:</span>\n\n` +
                                `<span class="text-slate-900 dark:text-slate-100">${escapeHtml(accumulated)}</span>` +
                                `<span class="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle"></span>`;
                            terminalOutput.scrollTop = terminalOutput.scrollHeight;
                        }
                    }

                    if (terminalOutput) {
                        terminalOutput.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400 font-semibold">[${agent}] Response Stream:</span>\n\n` +
                            `<span class="text-slate-900 dark:text-slate-100">${escapeHtml(accumulated)}</span>\n\n` +
                            `<span class="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">✓ Inference finished (248 tokens generated, latency 82ms, cost $0.0012)</span>`;
                    }

                    if (terminalStatus) terminalStatus.textContent = `Target: ${agent} • Completed`;
                    this.showToast('Inference streamed successfully');
                } catch (err) {
                    if (terminalOutput) {
                        terminalOutput.innerHTML += `\n<span class="text-red-500">Error: ${err.message}</span>`;
                    }
                    if (terminalStatus) terminalStatus.textContent = `Target: ${agent} • Error`;
                } finally {
                    isRunning = false;
                    runBtn.disabled = false;
                    runBtn.classList.remove('opacity-70');
                }
            });

            copyBtn?.addEventListener('click', () => {
                if (!terminalOutput) return;
                const text = terminalOutput.innerText;
                navigator.clipboard?.writeText(text).then(() => {
                    this.showToast('Copied output to clipboard');
                }).catch(() => {
                    this.showToast('Copied output');
                });
            });
        },

        bindDeployModal() {
            const modal = document.getElementById('deploy-agent-modal');
            const openBtn = document.getElementById('open-deploy-modal-btn');
            const closeBtn = document.getElementById('close-deploy-modal-btn');
            const cancelBtn = document.getElementById('cancel-deploy-btn');
            const form = document.getElementById('deploy-agent-form');

            const openModal = () => {
                modal?.classList.remove('hidden');
            };

            const closeModal = () => {
                modal?.classList.add('hidden');
            };

            openBtn?.addEventListener('click', openModal);
            closeBtn?.addEventListener('click', closeModal);
            cancelBtn?.addEventListener('click', closeModal);

            modal?.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                    closeModal();
                }
            });

            form?.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('new-agent-name');
                const modelSelect = document.getElementById('new-agent-model');
                const tableBody = document.getElementById('agent-table-body');

                const name = nameInput?.value?.trim() || 'New-Worker-Agent';
                const model = modelSelect?.value || 'GPT-4o';
                const initials = name.substring(0, 2).toUpperCase();
                const newId = 'agt-' + Math.floor(10000 + Math.random() * 90000) + '-prod';

                const newRow = document.createElement('tr');
                newRow.className = 'agent-row hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors animate-fade-in-up';
                newRow.setAttribute('data-agent-id', newId);
                newRow.setAttribute('data-status', 'running');
                newRow.setAttribute('data-name', name);
                newRow.setAttribute('data-model', model);

                newRow.innerHTML = `
                    <td class="px-5 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                ${initials}
                            </div>
                            <div>
                                <div class="text-sm font-bold text-slate-900 dark:text-white">${escapeHtml(name)}</div>
                                <div class="text-[11px] text-slate-500 font-mono">ID: ${newId}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-5 py-4">
                        <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">${escapeHtml(model)}</span>
                    </td>
                    <td class="px-5 py-4">
                        <span class="agent-status-badge px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Running</span>
                        </span>
                    </td>
                    <td class="px-5 py-4 text-xs font-semibold text-slate-900 dark:text-white font-mono">1,240</td>
                    <td class="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">72ms avg</td>
                    <td class="px-5 py-4 text-xs font-semibold text-slate-900 dark:text-white">$0.02</td>
                    <td class="px-5 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button class="agent-test-btn px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-300 text-xs font-semibold transition-colors" data-agent="${escapeHtml(name)}">Test</button>
                            <button class="agent-pause-btn px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-colors">Pause</button>
                        </div>
                    </td>
                `;

                if (tableBody) {
                    tableBody.insertBefore(newRow, tableBody.firstChild);
                }

                // Also add to quick select dropdown
                const quickSelect = document.getElementById('quick-agent-select');
                if (quickSelect) {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = `${name} (${model})`;
                    quickSelect.appendChild(opt);
                }

                this.updateAgentCounts();
                closeModal();
                this.showToast(`Deployed ${name} to cluster!`);
            });
        },

        bindExportCSV() {
            const btn = document.getElementById('export-csv-btn');
            btn?.addEventListener('click', () => {
                const rows = document.querySelectorAll('#agent-table-body .agent-row');
                const headers = ['Agent ID', 'Agent Name', 'Foundation Model', 'Status', 'Tokens 24h', 'Avg Latency', 'Cost 24h'];
                const csvData = [headers.join(',')];

                rows.forEach(r => {
                    const id = r.querySelector('.font-mono')?.textContent?.replace('ID: ', '') || '';
                    const name = r.getAttribute('data-name') || '';
                    const model = r.getAttribute('data-model') || '';
                    const status = r.getAttribute('data-status') || '';
                    const cells = r.querySelectorAll('td');
                    const tokens = cells[3]?.textContent?.trim() || '';
                    const latency = cells[4]?.textContent?.trim() || '';
                    const cost = cells[5]?.textContent?.trim() || '';

                    csvData.push([`"${id}"`, `"${name}"`, `"${model}"`, `"${status}"`, `"${tokens}"`, `"${latency}"`, `"${cost}"`].join(','));
                });

                const blob = new Blob([csvData.join('\n')], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `saasify-fleet-audit-${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                this.showToast('Audit log CSV exported successfully');
            });
        },

        showToast(message) {
            const toast = document.getElementById('toast-notification');
            const msgEl = document.getElementById('toast-message');
            if (!toast || !msgEl) return;

            msgEl.textContent = message;
            toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
            }, 3000);
        }
    };

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Dashboard.init());
    } else {
        Dashboard.init();
    }
})();
