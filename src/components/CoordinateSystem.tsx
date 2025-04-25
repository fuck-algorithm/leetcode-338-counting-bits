import React, { useRef, useEffect, useState } from 'react';
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
      .attr('fill', '#f8f9fa')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('stroke', '#dee2e6')
      .attr('stroke-width', 1);
    
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
      .attr('font-size', '12px');
    
    svg.selectAll('.axis path')
      .attr('stroke', '#ced4da')
      .attr('stroke-width', '1.5');
    
    svg.selectAll('.axis line')
      .attr('stroke', '#ced4da')
      .attr('stroke-width', '0.7');
    
    // 添加图示文本
    g.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', '#333')
      .attr('font-size', '14px')
      .text('横轴：数字 (0到n)');
    
    g.append('text')
      .attr('x', 10)
      .attr('y', 45)
      .attr('fill', '#333')
      .attr('font-size', '14px')
      .text('纵轴：该数字二进制中1的个数');
    
    // 如果提供了多系列数据，则绘制多条线并添加图例
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
          .curve(d3.curveLinear); // 使用直线连接，更加简单直观
        
        // 添加曲线
        if (seriesPoints.length > 1) {
          g.append('path')
            .datum(seriesPoints)
            .attr('fill', 'none')
            .attr('stroke', seriesColor)
            .attr('stroke-width', 2)
            .attr('d', line);
        }
        
        // 添加点
        g.selectAll(`.point-${seriesId}`)
          .data(seriesPoints)
          .enter()
          .append('circle')
          .attr('class', `point point-${seriesId}`)
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('r', 4)
          .attr('fill', seriesColor)
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .attr('data-x', d => d.x)
          .attr('data-y', d => d.y)
          .attr('data-series', seriesId);
      });
      
      // 添加高亮点
      if (highlightedPoints && highlightedPoints.length > 0) {
        highlightedPoints.forEach((point, index) => {
          if (!point) return;
          
          const color = point.color || multiSeriesData[index]?.color || '#ff9800';
          
          // 高亮点 - 使用大一点的圆圈和不同的颜色
          g.append('circle')
            .attr('class', 'highlighted-point')
            .attr('cx', xScale(point.x))
            .attr('cy', yScale(point.y))
            .attr('r', 8)
            .attr('fill', color)
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
          
          // 添加文本标签显示坐标
          g.append('text')
            .attr('x', xScale(point.x) + 10)
            .attr('y', yScale(point.y) - 10)
            .attr('fill', '#333')
            .attr('font-size', '12px')
            .text(`数字: ${point.x}, 1的个数: ${point.y}`);
        });
      }
      
      // 添加图例
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${innerWidth - 150}, 20)`);
      
      multiSeriesData.forEach((series, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 25})`);
        
        legendRow.append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', series.color);
        
        legendRow.append('text')
          .attr('x', 20)
          .attr('y', 12)
          .attr('fill', '#333')
          .text(series.id);
      });
    } else {
      // 单系列数据处理
      // 创建线生成器
      const line = d3.line<Point>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveLinear); // 使用直线，更加直观
      
      // 添加曲线
      if (points.length > 1) {
        g.append('path')
          .datum(points)
          .attr('fill', 'none')
          .attr('stroke', '#4caf50')
          .attr('stroke-width', 2)
          .attr('d', line);
      }
      
      // 添加点
      g.selectAll('.point')
        .data(points)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 4)
        .attr('fill', '#4caf50')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('data-x', d => d.x)
        .attr('data-y', d => d.y);
      
      // 如果有高亮点，为其增加特殊效果
      if (highlightedPoint) {
        // 高亮点使用更大的圆和不同的颜色
        g.append('circle')
          .attr('class', 'highlighted-point')
          .attr('cx', xScale(highlightedPoint.x))
          .attr('cy', yScale(highlightedPoint.y))
          .attr('r', 8)
          .attr('fill', '#ff9800')
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
        
        // 添加文本标签
        g.append('text')
          .attr('x', xScale(highlightedPoint.x) + 10)
          .attr('y', yScale(highlightedPoint.y) - 10)
          .attr('fill', '#333')
          .attr('font-size', '12px')
          .text(`当前数字: ${highlightedPoint.x}, 1的个数: ${highlightedPoint.y}`);
      }
    }
    
    // 添加X轴标签
    g.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-weight', 'bold')
      .text('数字 n');
    
    // 添加Y轴标签
    g.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-weight', 'bold')
      .text('1的个数');
    
  }, [points, width, height, margin, highlightedPoint, currentStep, maxX, maxY, multiSeriesData, highlightedPoints, uniqueId]);

  return (
    <div 
      ref={containerRef} 
      className="coordinate-system-container"
      style={{ width: '100%', height: `${height}px`, position: 'relative' }}
    >
      <svg ref={svgRef} className="coordinate-system"></svg>
      
      {/* 简化的样式 */}
      <style>
        {`
          .coordinate-system-container {
            position: relative;
          }
          
          .point:hover {
            r: 6;
            stroke-width: 2;
          }
          
          /* 添加图表描述 */
          .coordinate-description {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(255,255,255,0.8);
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
            font-size: 12px;
          }
        `}
      </style>
      
      {/* 添加说明文字 */}
      <div className="coordinate-description">
        <p><strong>图表说明</strong>：</p>
        <p>- 每个点代表一个数字</p>
        <p>- 横坐标是数字的值</p>
        <p>- 纵坐标是该数字二进制中1的个数</p>
        <p>- 黄色圆圈表示当前正在处理的数字</p>
      </div>
    </div>
  );
};

export default CoordinateSystem; 