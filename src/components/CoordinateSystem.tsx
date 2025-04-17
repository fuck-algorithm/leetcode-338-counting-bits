import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Point {
  x: number;
  y: number;
}

interface CoordinateSystemProps {
  points: Point[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  highlightedPoint?: Point | null;
  currentStep?: number;
  maxX: number;
  maxY: number;
}

const CoordinateSystem: React.FC<CoordinateSystemProps> = ({
  points,
  width = 1200,
  height = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 50 },
  highlightedPoint = null,
  currentStep = -1,
  maxX,
  maxY,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevPointsRef = useRef<Point[]>([]);
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
      .on('mousemove', function(event) {
        // 添加鼠标移动时的视觉反馈效果
        const [mouseX, mouseY] = d3.pointer(event);
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
      .attr('fx', '25%')
      .attr('fy', '25%');
      
    pointGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8bdb97')
      .attr('stop-opacity', 1);
      
    pointGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', '#4caf50')
      .attr('stop-opacity', 0.9);
      
    pointGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#388e3c')
      .attr('stop-opacity', 0.8);
    
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
      .attr('fx', '25%')
      .attr('fy', '25%');
      
    highlightGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffcc80')
      .attr('stop-opacity', 1);
      
    highlightGradient.append('stop')
      .attr('offset', '60%')
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
      .attr('opacity', 0.3);

    // 创建X轴比例尺
    const xScale = d3
      .scaleLinear()
      .domain([0, maxX])
      .range([0, innerWidth]);

    // 创建Y轴比例尺
    const yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([innerHeight, 0]);

    // 绘制网格线 - 添加过渡效果
    const gridGroup = g.append('g').attr('class', 'grid-lines');
    
    // 水平网格线
    gridGroup.selectAll('.h-grid-line')
      .data(d3.range(0, maxY + 1))
      .enter()
      .append('line')
      .attr('class', 'h-grid-line')
      .attr('x1', 0)
      .attr('y1', (d: number) => yScale(d))
      .attr('x2', 0)  // 起始宽度为0，之后动画展开
      .attr('y2', (d: number) => yScale(d))
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.5)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('x2', innerWidth)
      .attr('opacity', 0.7);
      
    // 垂直网格线
    gridGroup.selectAll('.v-grid-line')
      .data(d3.range(0, maxX + 1))
      .enter()
      .append('line')
      .attr('class', 'v-grid-line')
      .attr('x1', (d: number) => xScale(d))
      .attr('y1', innerHeight)  // 起始高度为底部，之后动画展开
      .attr('x2', (d: number) => xScale(d))
      .attr('y2', innerHeight)
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.5)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('y1', 0)
      .attr('opacity', 0.7);
    
    // 创建简化版的X轴
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${margin.left}, ${margin.top + innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(maxX + 1, 10)));
    
    // 创建简化版的Y轴
    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale).ticks(Math.min(maxY + 1, 5)));
    
    // 添加X轴标签
    svg.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', margin.top + innerHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text('数字');
    
    // 添加Y轴标签
    svg.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', `rotate(-90, ${margin.left - 35}, ${margin.top + innerHeight / 2})`)
      .attr('x', margin.left - 35)
      .attr('y', margin.top + innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text('1的个数');

    // 计算新增的点
    const existingPointIds = new Set(prevPointsRef.current.map(p => `${p.x}-${p.y}`));
    const isNewPoint = (p: Point) => !existingPointIds.has(`${p.x}-${p.y}`);
    
    // 创建用于绘制点的组
    const pointsGroup = g.append('g').attr('class', 'points-group');
    
    // 为每个点创建一个组，包含点和标签
    const pointElements = pointsGroup.selectAll('.point-element')
      .data(points, (d: any) => `${d.x}-${d.y}`)
      .enter()
      .append('g')
      .attr('class', 'point-element')
      .attr('transform', (d: Point) => `translate(${xScale(d.x)},${innerHeight + 20})`)  // 从底部下方开始
      .style('opacity', 0);
    
    // 为每个点添加悬停区域（增大可点击区域）
    pointElements.append('circle')
      .attr('class', 'point-hover-area')
      .attr('r', 15)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer');
      
    // 绘制点
    pointElements.append('circle')
      .attr('class', 'point')
      .attr('r', 0)
      .attr('filter', (d: Point) => 
        highlightedPoint && d.x === highlightedPoint.x && d.y === highlightedPoint.y 
          ? `url(#strong-glow-filter-${uniqueId})` 
          : 'none'
      )
      .attr('fill', (d: Point) => 
        highlightedPoint && d.x === highlightedPoint.x && d.y === highlightedPoint.y 
          ? `url(#highlight-gradient-${uniqueId})` 
          : `url(#point-gradient-${uniqueId})`
      )
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
      
    // 添加标签
    pointElements.append('text')
      .attr('class', 'point-label')
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'white')
      .attr('stroke-width', '3px')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('fill', '#333')
      .style('opacity', 0)
      .text((d: Point) => `(${d.x},${d.y})`);
    
    // 添加点击和悬停事件
    pointElements.each(function() {
      const el = d3.select(this);
      
      el.on('mouseover', function() {
        // 放大点并显示标签
        el.select('.point')
          .transition()
          .duration(150)
          .attr('r', 8)
          .attr('fill', `url(#point-hover-gradient-${uniqueId})`);
        
        el.select('.point-label')
          .transition()
          .duration(150)
          .style('opacity', 1)
          .attr('font-weight', 'bold');
      })
      .on('mouseout', function() {
        // 恢复正常大小，根据是否是高亮点决定填充色
        const d = d3.select(this).datum() as Point;
        const isHighlighted = highlightedPoint && 
                             d.x === highlightedPoint.x && 
                             d.y === highlightedPoint.y;
        
        el.select('.point')
          .transition()
          .duration(150)
          .attr('r', isHighlighted ? 7 : 6)
          .attr('fill', isHighlighted 
            ? `url(#highlight-gradient-${uniqueId})` 
            : `url(#point-gradient-${uniqueId})`);
        
        el.select('.point-label')
          .transition()
          .duration(150)
          .style('opacity', isHighlighted ? 1 : 0.7)
          .attr('font-weight', isHighlighted ? 'bold' : 'normal');
      })
      .on('click', function() {
        // 点击时播放一个动画效果
        const clickCircle = el.append('circle')
          .attr('r', 0)
          .attr('fill', 'rgba(255, 255, 255, 0.5)')
          .attr('stroke', 'rgba(255, 255, 255, 0.8)')
          .attr('stroke-width', 2);
          
        clickCircle.transition()
          .duration(500)
          .attr('r', 20)
          .style('opacity', 0)
          .remove();
      });
    });
    
    // 动画过渡 - 使用更富有弹性的动画效果
    pointElements.transition()
      .duration((d: Point) => isNewPoint(d) ? 800 : 400)
      .delay((d: Point, i: number) => isNewPoint(d) ? i * 100 : 0)
      .ease(d3.easeCubicOut)  // 添加缓动函数
      .attr('transform', (d: Point) => `translate(${xScale(d.x)},${yScale(d.y)})`)
      .style('opacity', 1)
      .on('start', function() {
        const el = d3.select(this);
        // 点的大小动画
        el.select('.point')
          .transition()
          .duration(400)
          .ease(d3.easeElasticOut.amplitude(1).period(0.3))  // 弹性动画
          .attr('r', (d: any) => 
            highlightedPoint && d.x === highlightedPoint.x && d.y === highlightedPoint.y ? 7 : 6
          );
          
        // 标签的淡入动画
        el.select('.point-label')
          .transition()
          .duration(400)
          .delay(200)
          .style('opacity', (d: any) => 
            highlightedPoint && d.x === highlightedPoint.x && d.y === highlightedPoint.y ? 1 : 0.7
          )
          .attr('y', -12)
          .attr('font-weight', (d: any) => 
            highlightedPoint && d.x === highlightedPoint.x && d.y === highlightedPoint.y ? 'bold' : 'normal'
          );
      });
    
    // 添加高亮效果
    if (highlightedPoint) {
      // 脉冲环 - 先创建元素，再添加过渡动画
      const highlightGroup = g.append('g')
        .attr('class', 'highlight-group')
        .attr('transform', `translate(${xScale(highlightedPoint.x)},${yScale(highlightedPoint.y)})`)
        .style('opacity', 0);
      
      // 添加外环
      highlightGroup.append('circle')
        .attr('class', 'highlight-ring')
        .attr('r', 14)
        .attr('fill', 'none')
        .attr('stroke', `url(#rotating-gradient-${uniqueId})`)
        .attr('stroke-width', 3)
        .attr('stroke-opacity', 0.8)
        .attr('stroke-dasharray', '6,3');
      
      // 添加脉冲动画
      highlightGroup.append('circle')
        .attr('class', 'pulse-ring')
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', '#ff9800')
        .attr('stroke-width', 2.5)
        .attr('stroke-opacity', 0.7)
        .attr('filter', `url(#glow-filter-${uniqueId})`)
        .style('transform-origin', 'center');
      
      // 添加第二个脉冲环
      highlightGroup.append('circle')
        .attr('class', 'pulse-ring-delayed')
        .attr('r', 10)
        .attr('fill', 'none')
        .attr('stroke', '#ff5722')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.5)
        .style('transform-origin', 'center');
        
      // 整体淡入动画
      highlightGroup.transition()
        .duration(300)
        .style('opacity', 1);
    }

    // 窗口大小变化时重新渲染
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        svg.attr('viewBox', `0 0 ${newWidth} ${containerHeight}`);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // 更新前一次点的引用
    prevPointsRef.current = [...points];
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [points, width, height, margin, highlightedPoint, currentStep, maxX, maxY, uniqueId]);

  return (
    <div 
      ref={containerRef} 
      className="coordinate-system-container" 
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.8); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.7; }
          }
          
          @keyframes pulse-delayed {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(2.2); opacity: 0.2; }
            100% { transform: scale(1); opacity: 0.6; }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0); }
          }
          
          .pulse-ring {
            animation: pulse 1.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
          }
          
          .pulse-ring-delayed {
            animation: pulse-delayed 2s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
            animation-delay: 0.5s;
          }
          
          .point-element {
            transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .point {
            transition: r 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.3s ease;
          }
          
          .point-label {
            transition: all 0.4s ease, opacity 0.3s ease;
            animation: float 3s ease-in-out infinite;
          }
          
          .highlight-ring {
            animation: rotate 8s linear infinite;
          }
          
          .h-grid-line, .v-grid-line {
            transition: opacity 0.3s ease;
          }
          
          /* 坐标轴样式优化 */
          .x-axis path, .y-axis path {
            stroke-width: 1.5;
          }
          
          .x-axis text, .y-axis text {
            font-size: 11px;
            font-weight: 500;
          }
          
          .x-axis line, .y-axis line {
            stroke: #adb5bd;
          }
        `}
      </style>
      <svg
        ref={svgRef}
        className="coordinate-system"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
};

export default CoordinateSystem; 