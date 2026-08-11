import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Language } from '../../types';
import { MapPin } from 'lucide-react';

interface GeographicalHeatmapProps {
  lang: Language;
}

const gazaRegions = [
  { id: 'north', nameAr: 'شمال غزة', nameEn: 'North Gaza', x: 70, y: 30, value: 320 },
  { id: 'gaza', nameAr: 'مدينة غزة', nameEn: 'Gaza City', x: 65, y: 45, value: 580 },
  { id: 'middle', nameAr: 'المحافظة الوسطى', nameEn: 'Middle Area', x: 60, y: 60, value: 410 },
  { id: 'khan', nameAr: 'خانيونس', nameEn: 'Khan Younis', x: 50, y: 75, value: 450 },
  { id: 'rafah', nameAr: 'رفح', nameEn: 'Rafah', x: 45, y: 90, value: 290 },
];

export const GeographicalHeatmap: React.FC<GeographicalHeatmapProps> = ({ lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 400; // Fixed height for visualization

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous rendering

    svg.attr('width', width).attr('height', height);

    // Create a color scale based on values
    const maxValue = d3.max(gazaRegions, (d) => d.value) || 1000;
    
    // Abstract coordinates mapping to actual width/height
    // Gaza strip is roughly a diagonal strip. We map x and y from 0-100 to SVG coordinates.
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([0, height]);
    
    const radiusScale = d3.scaleSqrt().domain([0, maxValue]).range([10, 40]);
    const colorScale = d3.scaleSequential(d3.interpolate('#042f2e', '#14b8a6')).domain([0, maxValue]);

    // Add a simple abstract coastal line
    const lineGenerator = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveCatmullRom);

    const coastLine: [number, number][] = [[85, 10], [80, 25], [75, 45], [70, 60], [60, 80], [55, 95]];
    
    svg.append('path')
      .datum(coastLine)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#0f172a') // dark stroke representing coast
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5');

    // Tooltip
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(15, 23, 42, 0.9)')
      .style('border', '1px solid #14b8a6')
      .style('border-radius', '8px')
      .style('padding', '8px 12px')
      .style('color', '#fff')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 10)
      .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');

    const nodes = svg.selectAll('g.node')
      .data(gazaRegions)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', radiusScale(d.value) + 5)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
        
        const label = isAr ? d.nameAr : d.nameEn;
        const countLabel = isAr ? 'فرصة/مبادرة' : 'Initiatives';
        
        tooltip.html(`
          <div style="font-weight: bold; color: #5eead4; margin-bottom: 4px;">${label}</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #cbd5e1;">${d.value}</span>
            <span style="color: #94a3b8; font-size: 10px;">${countLabel}</span>
          </div>
        `)
          .style('visibility', 'visible');
      })
      .on('mousemove', function (event) {
        // Adjust tooltip position based on mouse within container
        const containerRect = containerRef.current!.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;
        
        tooltip
          .style('top', `${mouseY - 60}px`)
          .style('left', `${mouseX - 50}px`);
      })
      .on('mouseout', function (event, d) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', radiusScale(d.value))
          .attr('stroke', 'none');
        
        tooltip.style('visibility', 'hidden');
      });

    // Add glowing gradient defs
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Render Circles
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => colorScale(d.value))
      .style('filter', 'url(#glow)')
      .style('opacity', 0.8)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 150)
      .attr('r', d => radiusScale(d.value));

    // Render Text Labels
    nodes.append('text')
      .text(d => isAr ? d.nameAr : d.nameEn)
      .attr('text-anchor', isAr ? 'end' : 'start')
      .attr('x', isAr ? -15 : 15)
      .attr('y', 4)
      .style('fill', '#e2e8f0')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 150 + 500)
      .style('opacity', 1);

    // Render pulsing rings
    nodes.append('circle')
      .attr('r', d => radiusScale(d.value))
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d.value))
      .attr('stroke-width', 1)
      .style('opacity', 0.5)
      .transition()
      .duration(2000)
      .delay((d, i) => i * 200)
      .on('start', function repeat() {
        d3.active(this as any)
          ?.attr('r', (d: any) => radiusScale(d.value) + 15)
          .style('opacity', 0)
          .transition()
          .duration(0)
          .attr('r', (d: any) => radiusScale(d.value))
          .style('opacity', 0.5)
          .transition()
          .duration(2000)
          .on('start', repeat);
      });

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [lang]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>{isAr ? 'التوزيع الجغرافي للفرص الإنسانية (Heatmap)' : 'Geographical Distribution Heatmap'}</span>
        </h3>
        <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-1 rounded font-mono border border-teal-500/20">
          D3.js ENGINE
        </span>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
        {isAr 
          ? 'خريطة حرارية تفاعلية توضح الكثافة الجغرافية لتوزيع فرص الدعم والمبادرات عبر محافظات قطاع غزة.' 
          : 'Interactive heatmap showing the geographical density of support opportunities and initiatives across Gaza governorates.'}
      </p>

      <div 
        ref={containerRef} 
        className="w-full relative h-[400px] bg-slate-950/50 rounded-xl border border-slate-800/80 overflow-hidden"
      >
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};
