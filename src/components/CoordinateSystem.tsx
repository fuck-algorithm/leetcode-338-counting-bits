import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';

interface Point {
  x: number;
  y: number;
  color?: string;
}

interface SeriesData {
  points: Point[];
  color: string;
  id: string;
}

interface CoordinateSystemProps {
  points: Point[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  highlightedPoint?: Point | null;
  highlightedPoints?: (Point | null)[];
  currentStep?: number;
  maxX: number;
  maxY: number;
  multiSeriesData?: SeriesData[];
}

const CoordinateSystem: React.FC<CoordinateSystemProps> = ({
  points,
  width = 1200,
  height = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 50 },
  highlightedPoint = null,
  highlightedPoints = [],
  currentStep = -1,
  maxX,
  maxY,
  multiSeriesData = [],
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [uniqueId] = useState(() => `coord-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // 获取容器宽度以实现响应式
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = height;
    
    // 清除之前的SVG内容
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', containerHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // 添加背景矩形用于交互
    svg.append('rect')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('fill', 'transparent')
      .on('mousemove', function() {
        // 添加鼠标移动时的视觉反馈效果
        d3.select(this).style('cursor', 'default');
      });
    
    // 添加定义标签用于渐变和动画效果
    const defs = svg.append('defs');
    
    // 创建点的渐变效果 - 增强渐变色彩更加鲜明
    const pointGradient = defs.append('radialGradient')
      .attr('id', `point-gradient-${uniqueId}`)
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
      
    pointGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#81c784')
      .attr('stop-opacity', 1);
      
    pointGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#388e3c')
      .attr('stop-opacity', 0.8);
    
    // 为每个系列创建渐变
    multiSeriesData.forEach(series => {
      const baseColor = series.color;
      const seriesId = series.id;
      
      // 提取颜色的HSL值，创建亮色和暗色变体
      const colorObj = d3.color(baseColor);
      const brighterColor = colorObj ? colorObj.brighter(0.5).toString() : baseColor;
      const darkerColor = colorObj ? colorObj.darker(0.2).toString() : baseColor;
      
      // 为该系列点创建径向渐变
      const seriesGradient = defs.append('radialGradient')
        .attr('id', `series-gradient-${seriesId}-${uniqueId}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%')
        .attr('fx', '35%')
        .attr('fy', '35%');
        
      seriesGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', brighterColor)
        .attr('stop-opacity', 1);
        
      seriesGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', darkerColor)
        .attr('stop-opacity', 0.8);
      
      // 创建高亮版本
      const highlightSeriesGradient = defs.append('radialGradient')
        .attr('id', `highlight-series-gradient-${seriesId}-${uniqueId}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%')
        .attr('fx', '25%')
        .attr('fy', '25%');
      
      // 更亮的版本用于高亮
      const veryLightColor = d3.rgb(baseColor).brighter(1.2);
        
      highlightSeriesGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', veryLightColor.toString())
        .attr('stop-opacity', 1);
        
      highlightSeriesGradient.append('stop')
        .attr('offset', '60%')
        .attr('stop-color', brighterColor)
        .attr('stop-opacity', 0.9);
        
      highlightSeriesGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', darkerColor)
        .attr('stop-opacity', 0.8);
    });
    
    // 创建点悬停效果的渐变
    const pointHoverGradient = defs.append('radialGradient')
      .attr('id', `point-hover-gradient-${uniqueId}`)
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '25%')
      .attr('fy', '25%');
      
    pointHoverGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#a0f0b2')
      .attr('stop-opacity', 1);
      
    pointHoverGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', '#69db7c')
      .attr('stop-opacity', 0.9);
      
    pointHoverGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#40c057')
      .attr('stop-opacity', 0.8);
      
    // 创建高亮点的渐变效果 - 更加鲜明的橙色渐变
    const highlightGradient = defs.append('radialGradient')
      .attr('id', `highlight-gradient-${uniqueId}`)
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '30%')
      .attr('fy', '30%');
      
    highlightGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffcc80')
      .attr('stop-opacity', 1);
      
    highlightGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#ff9800')
      .attr('stop-opacity', 0.9);
      
    highlightGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f57c00')
      .attr('stop-opacity', 0.8);
    
    // 创建外发光效果
    const glowFilter = defs.append('filter')
      .attr('id', `glow-filter-${uniqueId}`)
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    glowFilter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '2')
      .attr('result', 'blur');
      
    glowFilter.append('feColorMatrix')
      .attr('in', 'blur')
      .attr('mode', 'matrix')
      .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
      .attr('result', 'glow');
      
    glowFilter.append('feBlend')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'glow')
      .attr('mode', 'normal');
    
    // 创建强烈外发光效果（用于高亮点）
    const strongGlowFilter = defs.append('filter')
      .attr('id', `strong-glow-filter-${uniqueId}`)
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    strongGlowFilter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '3')
      .attr('result', 'blur');
      
    strongGlowFilter.append('feColorMatrix')
      .attr('in', 'blur')
      .attr('mode', 'matrix')
      .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8')
      .attr('result', 'glow');
      
    strongGlowFilter.append('feBlend')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'glow')
      .attr('mode', 'normal');
    
    // 创建脉冲动画滤镜
    const pulseFilter = defs.append('filter')
      .attr('id', `pulse-filter-${uniqueId}`)
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    pulseFilter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '2')
      .attr('result', 'blur');
    
    // 创建旋转的光效
    const rotatingGradient = defs.append('linearGradient')
      .attr('id', `rotating-gradient-${uniqueId}`)
      .attr('gradientTransform', 'rotate(0)');
      
    rotatingGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ff9800')
      .attr('stop-opacity', 0.8);
      
    rotatingGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#ff5722')
      .attr('stop-opacity', 0.4);
      
    rotatingGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff9800')
      .attr('stop-opacity', 0.8);
    
    // 背景灰度网格效果
    const patternSize = 20;
    const gridPattern = defs.append('pattern')
      .attr('id', `grid-pattern-${uniqueId}`)
      .attr('width', patternSize)
      .attr('height', patternSize)
      .attr('patternUnits', 'userSpaceOnUse');
      
    gridPattern.append('rect')
      .attr('width', patternSize)
      .attr('height', patternSize)
      .attr('fill', 'white');
      
    gridPattern.append('path')
      .attr('d', `M ${patternSize} 0 L 0 0 0 ${patternSize}`)
      .attr('stroke', '#f8f9fa')
      .attr('stroke-width', 1)
      .attr('fill', 'none');
      
    // 计算实际绘图区域的尺寸
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    // 创建绘图区域
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // 添加背景
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', `url(#grid-pattern-${uniqueId})`)
      .attr('rx', 4)
      .attr('ry', 4);
    
    // X轴和Y轴的比例尺
    const xScale = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([innerHeight, 0]);
    
    // 创建X轴和Y轴
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(maxX, 10))
      .tickSize(-innerHeight)
      .tickPadding(10);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    // 添加X轴
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('line')
      .attr('class', 'grid-line')
      .attr('stroke', '#e9ecef')
      .attr('stroke-opacity', 0.5);
    
    // 添加Y轴
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('line')
      .attr('class', 'grid-line')
      .attr('stroke', '#e9ecef')
      .attr('stroke-opacity', 0.5);
    
    // 调整轴标签样式
    svg.selectAll('.axis text')
      .attr('fill', '#5c6b73')
      .attr('font-size', '12px')
      .attr('font-weight', '500');
    
    svg.selectAll('.axis path')
      .attr('stroke', '#ced4da')
      .attr('stroke-width', '1.5');
    
    svg.selectAll('.axis line')
      .attr('stroke', '#ced4da')
      .attr('stroke-width', '0.7');
    
    svg.selectAll('.grid-line')
      .attr('stroke', '#f0f0f0')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-opacity', 0.6);
    
    // 如果提供了多系列数据，则绘制多条曲线
    if (multiSeriesData.length > 0) {
      // 为每个系列创建组
      multiSeriesData.forEach((series, seriesIndex) => {
        const seriesPoints = series.points || [];
        const seriesColor = series.color;
        const seriesId = series.id;
        
        // 创建线生成器
        const line = d3.line<Point>()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))
          .curve(d3.curveMonotoneX);
        
        // 添加曲线
        if (seriesPoints.length > 1) {
          g.append('path')
            .datum(seriesPoints)
            .attr('fill', 'none')
            .attr('stroke', seriesColor)
            .attr('stroke-width', 2.5)
            .attr('stroke-opacity', 0.7)
            .attr('d', line)
            .attr('class', `series-line series-${seriesId}`)
            .attr('stroke-dasharray', function() {
              return this.getTotalLength();
            })
            .attr('stroke-dashoffset', function() {
              return this.getTotalLength();
            })
            .transition()
            .duration(1200)
            .ease(d3.easeQuadOut)
            .attr('stroke-dashoffset', 0);
        }
        
        // 添加点
        g.selectAll(`.point-${seriesId}`)
          .data(seriesPoints)
          .enter()
          .append('circle')
          .attr('class', `point point-${seriesId}`)
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('r', 0) // 初始半径为0，之后会通过动画增大
          .attr('fill', d => d.color || `url(#series-gradient-${seriesId}-${uniqueId})`)
          .attr('stroke', seriesColor)
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.85)
          .attr('filter', `url(#glow-filter-${uniqueId})`)
          .attr('data-x', d => d.x)
          .attr('data-y', d => d.y)
          .attr('data-series', seriesId)
          .transition()
          .delay((d, i) => i * 80 + seriesIndex * 150) // 添加延迟，使点按顺序出现
          .duration(500)
          .ease(d3.easeElasticOut.amplitude(0.8))
          .attr('r', 5);
      });
      
      // 添加高亮点
      if (highlightedPoints && highlightedPoints.length > 0) {
        highlightedPoints.forEach((point, index) => {
          if (!point) return;
          
          const seriesId = multiSeriesData[index]?.id || '';
          const color = point.color || multiSeriesData[index]?.color || '#ff9800';
          
          // 高亮点
          g.append('circle')
            .attr('class', 'highlighted-point')
            .attr('cx', xScale(point.x))
            .attr('cy', yScale(point.y))
            .attr('r', 8)
            .attr('fill', `url(#highlight-gradient-${uniqueId})`)
            .attr('filter', `url(#strong-glow-filter-${uniqueId})`)
            .attr('data-series', seriesId)
            .style('transform-origin', `${xScale(point.x)}px ${yScale(point.y)}px`)
            .style('animation', 'pulse-scale 1.5s ease-in-out infinite');
          
          // 添加脉冲环
          g.append('circle')
            .attr('class', 'pulse-ring')
            .attr('cx', xScale(point.x))
            .attr('cy', yScale(point.y))
            .attr('r', 10)
            .attr('stroke', color)
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')
            .attr('opacity', 1)
            .attr('data-series', seriesId)
            .style('animation', 'pulse 1.8s ease-out infinite');
            
          // 添加高亮环
          g.append('circle')
            .attr('class', 'highlight-ring')
            .attr('cx', xScale(point.x))
            .attr('cy', yScale(point.y))
            .attr('r', 14)
            .attr('stroke', `url(#rotating-gradient-${uniqueId})`)
            .attr('stroke-width', 1.5)
            .attr('fill', 'none')
            .attr('opacity', 0.7)
            .attr('data-series', seriesId)
            .style('filter', `url(#pulse-filter-${uniqueId})`)
            .style('transform-origin', `${xScale(point.x)}px ${yScale(point.y)}px`)
            .style('animation', 'rotate 8s linear infinite');
        });
      }
    } else {
      // 单系列数据处理
      // 创建线生成器
      const line = d3.line<Point>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);
      
      // 添加曲线
      if (points.length > 1) {
        g.append('path')
          .datum(points)
          .attr('fill', 'none')
          .attr('stroke', '#4caf50')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.8)
          .attr('d', line)
          .attr('class', 'line')
          .attr('stroke-dasharray', function() {
            return this.getTotalLength();
          })
          .attr('stroke-dashoffset', function() {
            return this.getTotalLength();
          })
          .transition()
          .duration(1000)
          .attr('stroke-dashoffset', 0);
      }
      
      // 添加点
      g.selectAll('.point')
        .data(points)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 0) // 初始半径为0，之后会通过动画增大
        .attr('fill', d => d.color || `url(#point-gradient-${uniqueId})`)
        .attr('stroke', '#388e3c')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.85)
        .attr('filter', `url(#glow-filter-${uniqueId})`)
        .attr('data-x', d => d.x)
        .attr('data-y', d => d.y)
        .transition()
        .delay((d, i) => i * 80) // 添加延迟，使点按顺序出现
        .duration(500)
        .ease(d3.easeElasticOut.amplitude(0.8))
        .attr('r', 5);
      
      // 如果有高亮点，为其增加特殊效果
      if (highlightedPoint) {
        // 高亮点
        g.append('circle')
          .attr('class', 'highlighted-point')
          .attr('cx', xScale(highlightedPoint.x))
          .attr('cy', yScale(highlightedPoint.y))
          .attr('r', 8)
          .attr('fill', `url(#highlight-gradient-${uniqueId})`)
          .attr('filter', `url(#strong-glow-filter-${uniqueId})`)
          .style('transform-origin', `${xScale(highlightedPoint.x)}px ${yScale(highlightedPoint.y)}px`)
          .style('animation', 'pulse-scale 1.5s ease-in-out infinite');
        
        // 添加脉冲环
        g.append('circle')
          .attr('class', 'pulse-ring')
          .attr('cx', xScale(highlightedPoint.x))
          .attr('cy', yScale(highlightedPoint.y))
          .attr('r', 10)
          .attr('stroke', highlightedPoint.color || '#ff9800')
          .attr('stroke-width', 2.5)
          .attr('fill', 'none')
          .attr('opacity', 0.9)
          .style('animation', 'pulse 1.8s ease-out infinite');
          
        // 添加高亮环
        g.append('circle')
          .attr('class', 'highlight-ring')
          .attr('cx', xScale(highlightedPoint.x))
          .attr('cy', yScale(highlightedPoint.y))
          .attr('r', 14)
          .attr('stroke', `url(#rotating-gradient-${uniqueId})`)
          .attr('stroke-width', 1.5)
          .attr('fill', 'none')
          .attr('opacity', 0.7)
          .style('filter', `url(#pulse-filter-${uniqueId})`)
          .style('transform-origin', `${xScale(highlightedPoint.x)}px ${yScale(highlightedPoint.y)}px`)
          .style('animation', 'rotate 8s linear infinite');
      }
    }
    
    // 添加X轴标签
    g.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#868e96')
      .text('数字 n');
    
    // 添加Y轴标签
    g.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#868e96')
      .text('比特数 (1的个数)');
    
    // 为背景添加微妙的阴影效果
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('stroke', '#dee2e6')
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('filter', 'drop-shadow(0px 2px 3px rgba(0,0,0,0.1))');
  }, [points, width, height, margin, highlightedPoint, currentStep, maxX, maxY, multiSeriesData, highlightedPoints, uniqueId]);

  return (
    <div 
      ref={containerRef} 
      className="coordinate-system-container"
      style={{ width: '100%', height: `${height}px`, position: 'relative' }}
    >
      <svg ref={svgRef} className="coordinate-system"></svg>
      
      {/* 添加CSS动画 */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(2.2);
              opacity: 0;
            }
          }
          
          @keyframes pulse-scale {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.15);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .coordinate-system-container {
            position: relative;
            overflow: visible;
          }
          
          .axis text {
            transition: font-size 0.3s ease;
          }
          
          .axis text:hover {
            font-size: 14px;
            font-weight: bold;
          }
          
          .point {
            transition: r 0.3s ease;
            cursor: pointer;
          }
          
          .point:hover {
            r: 7;
          }
        `}
      </style>
    </div>
  );
};

export default CoordinateSystem; 