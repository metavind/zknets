import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Point {
  x: number;
  y: number;
  color: string;
}

interface CirclesProps {
  width: number;
  height: number;
  onInputChange: (input: number[]) => void;
}

const generatePoints = (
  radius: number,
  count: number,
  color: string,
  width: number,
  height: number
) => {
  const points: Point[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  for (let i = 0; i < count; i += 1) {
    const angle = (((i * 360) / count) * Math.PI) / 180;
    const x = centerX + (radius + Math.random() * 20 - 10) * Math.cos(angle);
    const y = centerY + (radius + Math.random() * 20 - 10) * Math.sin(angle);
    points.push({ x, y, color });
  }
  return points;
};

const renderGrid = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  width: number,
  height: number
) => {
  const gridSize = 50;
  const xAxisTicks = d3.range(0, width + gridSize, gridSize);
  const yAxisTicks = d3.range(0, height + gridSize, gridSize);

  svg
    .selectAll('.x-axis')
    .data(xAxisTicks)
    .join('line')
    .attr('class', 'x-axis')
    .attr('x1', (d) => d)
    .attr('y1', 0)
    .attr('x2', (d) => d)
    .attr('y2', height)
    .attr('stroke', 'lightgray')
    .attr('stroke-width', 0.5);

  svg
    .selectAll('.y-axis')
    .data(yAxisTicks)
    .join('line')
    .attr('class', 'y-axis')
    .attr('x1', 0)
    .attr('y1', (d) => d)
    .attr('x2', width)
    .attr('y2', (d) => d)
    .attr('stroke', 'lightgray')
    .attr('stroke-width', 0.5);
};

const renderCircles = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  points: Point[],
  selectedPoint: Point | null,
  setSelectedPoint: (point: Point | null) => void,
  onInputChange: (input: number[]) => void,
  width: number,
  height: number
) => {
  svg
    .selectAll('circle')
    .data(points)
    .join('circle')
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .attr('r', 6)
    .attr('fill', (d) => d.color)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .style('cursor', 'default')
    .on('mouseenter', (event: React.PointerEvent<SVGCircleElement>) => {
      const circle = d3.select(event.currentTarget);
      circle.attr('r', 9).style('cursor', 'pointer');
    })
    .on('mouseleave', (event: React.PointerEvent<SVGCircleElement>) => {
      const circle = d3.select(event.currentTarget);
      circle.attr('r', 6).style('cursor', 'default');
    })
    .on('click', (_, d: Point) => {
      setSelectedPoint(d);
      const centerX = width / 2;
      const centerY = height / 2;
      const X = (d.x - centerX) / (width / 2);
      const Y = (centerY - d.y) / (height / 2);
      onInputChange([X, Y]);
    });

  if (selectedPoint) {
    svg
      .selectAll('.selected-point')
      .data([selectedPoint])
      .join('circle')
      .attr('class', 'selected-point')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 12)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 4)
      .style('cursor', 'default');
  } else {
    svg.selectAll('.selected-point').remove();
  }
};

const Circles: React.FC<CirclesProps> = ({ width, height, onInputChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  useEffect(() => {
    const bluePoints = generatePoints(150, 90, 'blue', width, height);
    const redPoints = generatePoints(300, 180, 'green', width, height);
    setPoints([...bluePoints, ...redPoints]);
  }, [width, height]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    renderGrid(svg, width, height);
    renderCircles(
      svg,
      points,
      selectedPoint,
      setSelectedPoint,
      onInputChange,
      width,
      height
    );
  }, [width, height, onInputChange, points, selectedPoint]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default Circles;
