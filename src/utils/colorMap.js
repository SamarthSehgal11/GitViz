import * as d3 from 'd3';

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

export function getColorForContributor(identifier) {
    if (!identifier) return '#8b949e';
    return colorScale(identifier);
}
