import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CommitHeatmap({ data, setTooltip }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!data || !containerRef.current) return;

        d3.select(containerRef.current).selectAll('*').remove();

        // 1. Process Data
        const commitsByDate = new Map();
        let totalYearCommits = 0;

        data.forEach(d => {
            const dateStr = new Date(d.commit.author.date).toISOString().split('T')[0];
            commitsByDate.set(dateStr, (commitsByDate.get(dateStr) || 0) + 1);
            totalYearCommits++;
        });

        // 2. Generate last 364/365 days of data
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);

        const days = [];
        let currentWeek = 0;

        // For Month Labels
        const monthLabels = [];
        let lastMonth = -1;

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            if (d.getDay() === 0 && days.length > 0) {
                currentWeek++;
            }

            const month = d.getMonth();
            if (month !== lastMonth && d.getDate() < 14) {
                monthLabels.push({
                    label: d.toLocaleString('default', { month: 'short' }),
                    week: currentWeek
                });
                lastMonth = month;
            }

            const dateStr = d.toISOString().split('T')[0];
            days.push({
                date: new Date(d),
                dateStr,
                count: commitsByDate.get(dateStr) || 0,
                week: currentWeek,
                dayIndex: d.getDay()
            });
        }

        const cellSize = 13;
        const cellMargin = 3;
        const width = (currentWeek + 1) * (cellSize + cellMargin) + 40;
        const height = 7 * (cellSize + cellMargin) + 30;

        const svg = d3.select(containerRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(30, 20)');

        // 3. Color scale (Updated to requested palette)
        const colorScale = d3.scaleThreshold()
            .domain([1, 3, 6, 10]) // 0 commits implicit, 1-2, 3-5, 6-9, 10+
            .range(['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']);

        // Glow Filter for Hover
        const defs = svg.append('defs');
        const filter = defs.append('filter').attr('id', 'cell-glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // 4. Draw Labels
        const dayLabels = ['Mon', 'Wed', 'Fri'];
        svg.selectAll('.dayLabel')
            .data(dayLabels)
            .enter()
            .append('text')
            .text(d => d)
            .attr('x', -26)
            .attr('y', (d, i) => (i * 2 + 1) * (cellSize + cellMargin) + 11)
            .attr('font-size', '10px')
            .attr('font-family', 'var(--font-mono)')
            .attr('fill', 'var(--text-muted)');

        svg.selectAll('.monthLabel')
            .data(monthLabels)
            .enter()
            .append('text')
            .text(d => d.label)
            .attr('x', d => d.week * (cellSize + cellMargin))
            .attr('y', -8)
            .attr('font-size', '11px')
            .attr('font-family', 'var(--font-mono)')
            .attr('fill', 'var(--text-muted)');

        // 5. Draw Cells
        svg.selectAll('rect')
            .data(days)
            .enter()
            .append('rect')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('x', d => d.week * (cellSize + cellMargin))
            .attr('y', d => d.dayIndex * (cellSize + cellMargin))
            .attr('rx', 3)
            .attr('fill', d => d.count === 0 ? 'rgba(255,255,255,0.03)' : colorScale(d.count))
            .style('transform-origin', d => `${d.week * (cellSize + cellMargin) + cellSize / 2}px ${d.dayIndex * (cellSize + cellMargin) + cellSize / 2}px`)
            .style('transition', 'transform 0.15s ease-out, filter 0.15s ease-out')
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .style('transform', 'scale(1.3)')
                    .style('filter', d.count > 0 ? 'url(#cell-glow)' : 'none')
                    .style('z-index', 10);

                setTooltip({
                    visible: true,
                    x: event.pageX,
                    y: event.pageY,
                    content: `<div style="font-family: var(--font-display);"><strong style="color:var(--text-primary)">${d.count} commits</strong> on ${d.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>`
                });
            })
            .on('mousemove', (event) => {
                setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY }));
            })
            .on('mouseout', (event) => {
                d3.select(event.currentTarget)
                    .style('transform', 'scale(1)')
                    .style('filter', 'none')
                    .style('z-index', 1);

                setTooltip({ visible: false, x: 0, y: 0, content: '' });
            });

        // Animate cells in
        svg.selectAll('rect')
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .delay(d => d.week * 10)
            .attr('opacity', 1);

        // Make total stats available outside hook
        if (containerRef.current.parentElement) {
            const summaryNode = containerRef.current.parentElement.nextElementSibling;
            if (summaryNode) {
                summaryNode.innerHTML = `🔥 <span style="color: var(--text-primary); font-weight: 600;">${totalYearCommits} contributions</span> in the fetched data scope`;
            }
        }

    }, [data, setTooltip]);

    return (
        <div className="chart-card flex flex-col h-full w-full">
            <h3 className="section-heading">Commit Heatmap</h3>
            <div className="w-full overflow-x-auto custom-scrollbar flex-grow pb-4 flex items-center">
                <div ref={containerRef} className="min-w-max mx-auto" />
            </div>
            <p className="text-sm text-text-secondary mt-4 text-center w-full bg-[#ffffff05] rounded-lg py-2 border border-border">
                {/* Placeholder populated by D3 */}
                🔥 Loading summary...
            </p>
        </div>
    );
}
