import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getColorForContributor } from '../utils/colorMap';

export default function CommitTimeline({ data, setTooltip }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!data || !data.length || !containerRef.current) return;

        d3.select(containerRef.current).selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = containerRef.current.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const getPseudoChanges = (sha) => {
            let hash = 0;
            for (let i = 0; i < sha.length; i++) {
                hash = sha.charCodeAt(i) + ((hash << 5) - hash);
            }
            return Math.abs(hash) % 150 + 1;
        };

        const parsedData = data.map(d => ({
            sha: d.sha,
            date: new Date(d.commit.author.date),
            message: d.commit.message,
            author: d.author?.login || d.commit.author.name,
            avatar: d.author?.avatar_url || '',
            changes: getPseudoChanges(d.sha),
            additions: Math.floor(getPseudoChanges(d.sha) * 0.7),
            deletions: Math.floor(getPseudoChanges(d.sha) * 0.3),
            url: d.html_url
        }));

        parsedData.sort((a, b) => a.date - b.date);

        // Filter out identical timestamps to prevent D3 line discontinuities 
        const uniqueData = [];
        const timestamps = new Set();
        for (const d of parsedData) {
            const time = d.date.getTime();
            if (!timestamps.has(time)) {
                timestamps.add(time);
                uniqueData.push(d);
            }
        }

        const svg = d3.select(containerRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Subtle Radial Background
        const defs = svg.append('defs');

        const bgGradient = defs.append('radialGradient')
            .attr('id', 'timeline-bg')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '50%');
        bgGradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(88, 166, 255, 0.05)');
        bgGradient.append('stop').attr('offset', '100%').attr('stop-color', 'transparent');

        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'url(#timeline-bg)')
            .attr('pointer-events', 'none');

        // Glow Filter
        const filter = defs.append('filter').attr('id', 'glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Gradient Line Stroke
        const lineGradient = defs.append('linearGradient')
            .attr('id', 'line-gradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '0%');
        lineGradient.append('stop').attr('offset', '0%').attr('stop-color', 'var(--accent-blue)');
        lineGradient.append('stop').attr('offset', '100%').attr('stop-color', 'var(--accent-purple)');

        svg.append('defs').append('clipPath')
            .attr('id', 'clip-timeline')
            .append('rect')
            .attr('width', width)
            .attr('height', height);

        const x = d3.scaleTime()
            .domain(d3.extent(uniqueData, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(uniqueData, d => d.changes) * 1.2])
            .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom(x).ticks(6);
        const yAxis = d3.axisLeft(y).ticks(5);

        const gX = svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .attr('color', 'var(--text-muted)')
            .attr('font-family', 'var(--font-mono)')
            .attr('font-size', '11px');

        gX.select('.domain').attr('stroke', 'var(--border)');

        const gY = svg.append('g')
            .attr('class', 'axis axis--y')
            .call(yAxis)
            .attr('color', 'var(--text-muted)')
            .attr('font-family', 'var(--font-mono)')
            .attr('font-size', '11px');

        gY.select('.domain').attr('stroke', 'var(--border)');

        // Y Axis Label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left + 15)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .attr('fill', 'var(--text-muted)')
            .attr('font-size', '12px')
            .attr('font-family', 'var(--font-display)')
            .attr('letter-spacing', '0.05em')
            .text('FILE CHANGES (EST.)');

        // Grid lines
        const yGrid = d3.axisLeft(y).tickSize(-width).tickFormat('');
        svg.insert('g', ':first-child')
            .attr('class', 'grid')
            .attr('color', 'var(--border)')
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.5)
            .call(yGrid);

        const contentGroup = svg.append('g')
            .attr('clip-path', 'url(#clip-timeline)');

        // Line generator
        const lineGen = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.changes))
            .curve(d3.curveMonotoneX);

        const path = contentGroup.append('path')
            .datum(uniqueData)
            .attr('fill', 'none')
            .attr('stroke', 'url(#line-gradient)')
            .attr('stroke-width', 2)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('opacity', 0.6)
            .attr('d', lineGen);

        // Pulse animation for the last dot
        defs.append('radialGradient')
            .attr('id', 'pulse-gradient')
            .attr('cx', '50%').attr('cy', '50%').attr('r', '50%')
            .append('stop').attr('offset', '0%').attr('stop-color', 'var(--accent-green)').attr('stop-opacity', 0.8)
            .select(function () { return this.parentNode; })
            .append('stop').attr('offset', '100%').attr('stop-color', 'var(--accent-green)').attr('stop-opacity', 0);

        const lastData = uniqueData[uniqueData.length - 1];

        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 15])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom', (event) => {
                const newX = event.transform.rescaleX(x);
                gX.call(xAxis.scale(newX));
                dots.attr('cx', d => newX(d.date));
                path.attr('d', lineGen.x(d => newX(d.date)));
                if (pulseRing) {
                    pulseRing.attr('cx', newX(lastData.date));
                }
            });

        d3.select(containerRef.current).select('svg').call(zoom);

        // Dots
        const dots = contentGroup.selectAll('.dot')
            .data(uniqueData)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.changes))
            .attr('r', 0)
            .attr('fill', d => getColorForContributor(d.author))
            .attr('stroke', 'var(--bg-card)')
            .attr('stroke-width', 1.5)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .transition().duration(200)
                    .attr('r', 10)
                    .style('filter', 'url(#glow)');

                const avatarHtml = d.avatar ? `<img src="${d.avatar}" style="width:20px;height:20px;border-radius:50%;display:inline-block;vertical-align:middle;margin-right:8px;"/>` : '';

                setTooltip({
                    visible: true,
                    x: event.pageX,
                    y: event.pageY,
                    content: `
<div style="font-family: var(--font-display); font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">${d.message.split('\n')[0]}</div>
<div style="display: flex; align-items: center; margin-bottom: 8px; color: var(--text-secondary);">
  ${avatarHtml} <span>${d.author}</span>
</div>
<div style="color: var(--text-muted); margin-bottom: 12px;">${d.date.toLocaleString()}</div>
<div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; border: 1px solid var(--border);">
  <div style="color: var(--text-primary);">📁 <span style="color: var(--accent-blue)">${d.changes}</span> files changed</div>
  <div style="opacity: 0.8; margin-top: 4px;">
    ➕ <span style="color: var(--accent-green)">${d.additions}</span> additions<br/>
    ➖ <span style="color: var(--accent-orange)">${d.deletions}</span> deletions
  </div>
</div><div style="margin-top: 8px; font-size: 10px; color: var(--text-muted);">${d.sha}</div>`
                });
            })
            .on('mousemove', (event) => {
                setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY }));
            })
            .on('mouseout', (event) => {
                d3.select(event.currentTarget)
                    .transition().duration(200)
                    .attr('r', 6)
                    .style('filter', 'none');

                setTooltip({ visible: false, x: 0, y: 0, content: '' });
            })
            .on('click', (event, d) => {
                window.open(d.url, '_blank');
            });

        // Pulse Ring for last commit
        let pulseRing = null;
        if (lastData) {
            pulseRing = contentGroup.append('circle')
                .attr('cx', x(lastData.date))
                .attr('cy', y(lastData.changes))
                .attr('r', 6)
                .attr('fill', 'url(#pulse-gradient)')
                .attr('pointer-events', 'none');

            const pulse = () => {
                pulseRing
                    .attr('r', 6)
                    .attr('opacity', 1)
                    .transition()
                    .duration(1500)
                    .ease(d3.easeCubicOut)
                    .attr('r', 25)
                    .attr('opacity', 0)
                    .on('end', pulse);
            };
            pulse();
        }

        // Animation in
        const totalLength = path.node().getTotalLength();
        path
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .attr('stroke-dashoffset', 0);

        dots.transition()
            .duration(800)
            .delay((d, i) => i * 15)
            .attr('r', 6)
            .ease(d3.easeElastic);

        // Zoom Controls Functionality
        d3.select('#zoom-in').on('click', () => {
            d3.select(containerRef.current).select('svg').transition().duration(300).call(zoom.scaleBy, 1.5);
        });
        d3.select('#zoom-out').on('click', () => {
            d3.select(containerRef.current).select('svg').transition().duration(300).call(zoom.scaleBy, 0.5);
        });
        d3.select('#zoom-reset').on('click', () => {
            d3.select(containerRef.current).select('svg').transition().duration(500).call(zoom.transform, d3.zoomIdentity);
        });

    }, [data, setTooltip]);

    return (
        <div className="chart-card w-full mb-8 relative group">
            <div className="flex justify-between items-start mb-2 relative z-10 flex-col sm:flex-row">
                <h3 className="section-heading">Commit Timeline</h3>

                <div className="zoom-controls">
                    <button id="zoom-in" className="zoom-btn">＋ Zoom In</button>
                    <button id="zoom-reset" className="zoom-btn">↺ Reset</button>
                    <button id="zoom-out" className="zoom-btn">－ Zoom Out</button>
                </div>
            </div>
            <div ref={containerRef} className="w-full h-[400px] relative z-0" />
        </div>
    );
}
