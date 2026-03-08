import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getColorForContributor } from '../utils/colorMap';

export default function ContributorsChart({ data, setTooltip }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!data || !data.length || !containerRef.current) return;

        d3.select(containerRef.current).selectAll('*').remove();

        const topContributors = data.slice(0, 10);

        const margin = { top: 20, right: 60, bottom: 40, left: 160 };
        const width = containerRef.current.clientWidth - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;

        const svg = d3.select(containerRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const defs = svg.append('defs');

        // Glow Filter for Bars
        const filter = defs.append('filter').attr('id', 'bar-glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        const x = d3.scaleLinear()
            .domain([0, d3.max(topContributors, d => d.contributions)])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(topContributors.map(d => d.login))
            .range([0, height])
            .padding(0.4);

        // X Axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('d')))
            .attr('color', 'var(--text-muted)')
            .attr('font-family', 'var(--font-mono)')
            .select('.domain').attr('stroke', 'var(--border)');

        // Grid lines
        svg.append('g')
            .attr('class', 'grid')
            .attr('color', 'var(--border)')
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.3)
            .call(d3.axisBottom(x).tickSize(height).tickFormat(''));

        // Y Axis line (hidden text)
        svg.append('g')
            .call(d3.axisLeft(y).tickSize(0).tickFormat(''))
            .select('.domain').attr('stroke', 'var(--border)');

        // Custom Y Axis Labels
        const labels = svg.selectAll('.y-label')
            .data(topContributors)
            .enter()
            .append('g')
            .attr('class', 'y-label')
            .attr('transform', d => `translate(-10, ${y(d.login) + y.bandwidth() / 2})`);

        // Avatars
        defs.append('clipPath')
            .attr('id', 'avatar-clip')
            .append('circle')
            .attr('r', 14)
            .attr('cx', 14)
            .attr('cy', 14);

        labels.append('image')
            .attr('xlink:href', d => d.avatar_url)
            .attr('x', -32)
            .attr('y', -14)
            .attr('width', 28)
            .attr('height', 28)
            .attr('clip-path', 'url(#avatar-clip)')
            .attr('class', 'transition-all duration-300');

        labels.append('text')
            .attr('x', -42)
            .attr('y', 4)
            .attr('text-anchor', 'end')
            .attr('fill', 'var(--text-primary)')
            .attr('font-size', '14px')
            .attr('font-family', 'var(--font-display)')
            .attr('font-weight', '500')
            .text(d => d.login.length > 12 ? d.login.substring(0, 10) + '...' : d.login);

        // Medals for top 3
        const medals = ['🥇', '🥈', '🥉'];
        labels.append('text')
            .attr('x', -150)
            .attr('y', 5)
            .attr('font-size', '16px')
            .text((d, i) => i < 3 ? medals[i] : '');

        // Total Contributions for Tooltip Math
        const totalCommits = d3.sum(topContributors, d => d.contributions);

        // Bars
        svg.selectAll('.barGroup')
            .data(topContributors)
            .enter()
            .append('g')
            .attr('class', 'barGroup')
            .each(function (d, i) {
                const group = d3.select(this);
                const color = getColorForContributor(d.login);
                const gradientId = `grad-${i}`;

                // Create specific gradient for this bar
                const grad = defs.append('linearGradient')
                    .attr('id', gradientId)
                    .attr('x1', '0%').attr('y1', '0%')
                    .attr('x2', '100%').attr('y2', '0%');

                grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 1);
                grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.1);

                group.append('rect')
                    .attr('class', 'bar')
                    .attr('x', x(0))
                    .attr('y', y(d.login))
                    .attr('width', 0)
                    .attr('height', y.bandwidth())
                    .attr('fill', `url(#${gradientId})`)
                    .attr('rx', 4)
                    .style('cursor', 'pointer')
                    .on('mouseover', (event) => {
                        d3.select(event.currentTarget)
                            .transition().duration(200)
                            .style('filter', 'url(#bar-glow)');

                        const pct = ((d.contributions / totalCommits) * 100).toFixed(1);
                        setTooltip({
                            visible: true,
                            x: event.pageX,
                            y: event.pageY,
                            content: `
<div style="display:flex; align-items:center; gap:8px;">
  <div style="width:12px; height:12px; border-radius:50%; background:${color}; box-shadow:0 0 10px ${color};"></div>
  <span style="font-family:var(--font-display); font-weight:600; font-size:16px;">${d.login}</span>
</div>
<div style="margin-top: 8px; color:var(--text-secondary);">
  <b style="color:var(--text-primary);">${d.contributions}</b> commits
</div>
<div style="margin-top: 4px; font-size:12px; color:var(--text-muted);">${pct}% of top 10 total</div>`
                        });
                    })
                    .on('mousemove', (event) => {
                        setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY }));
                    })
                    .on('mouseout', (event) => {
                        d3.select(event.currentTarget)
                            .transition().duration(200)
                            .style('filter', 'none');
                        setTooltip({ visible: false, x: 0, y: 0, content: '' });
                    })
                    .transition()
                    .duration(1000)
                    .ease(d3.easeCubicOut)
                    .delay(i * 150) // Staggered delay
                    .attr('width', Math.max(x(d.contributions), 4));

                // Value Badges mapping
                const badgeGroup = group.append('g')
                    .attr('transform', `translate(${x(0)}, ${y(d.login) + y.bandwidth() / 2})`)
                    .attr('opacity', 0);

                badgeGroup.append('rect')
                    .attr('rx', 12)
                    .attr('height', 24)
                    .attr('y', -12)
                    .attr('fill', color)
                    .attr('fill-opacity', 0.2)
                    .attr('stroke', color)
                    .attr('stroke-opacity', 0.5);

                const text = badgeGroup.append('text')
                    .text(d.contributions)
                    .attr('fill', 'var(--text-primary)')
                    .attr('font-size', '12px')
                    .attr('font-family', 'var(--font-mono)')
                    .attr('font-weight', '600')
                    .attr('text-anchor', 'middle')
                    .attr('y', 4)
                    .attr('x', 20);

                // Adjust rect width based on text width after drawing
                const textNode = text.node();
                const bbox = textNode ? textNode.getBBox() : { width: 20 };
                const badgeWidth = Math.max(bbox.width + 16, 32);

                badgeGroup.select('rect')
                    .attr('width', badgeWidth)
                    .attr('x', 0);

                text.attr('x', badgeWidth / 2);

                badgeGroup.transition()
                    .duration(1000)
                    .ease(d3.easeCubicOut)
                    .delay(i * 150 + 200)
                    .attr('transform', `translate(${x(d.contributions) + 12}, ${y(d.login) + y.bandwidth() / 2})`)
                    .attr('opacity', 1);
            });

    }, [data, setTooltip]);

    return (
        <div className="chart-card flex flex-col h-full w-full">
            <h3 className="section-heading">Top Contributors</h3>
            <div ref={containerRef} className="w-full h-full min-h-[450px]" />
        </div>
    );
}
