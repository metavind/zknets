import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { gaussianRandom } from '@/utils/math';

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
  height: number,
  offset: number
) => {
  const points: Point[] = [];
  const centerX = width / 2 + offset / 2;
  const centerY = height / 2 + offset / 2;

  // Generate points on a unit circle with Gaussian noise
  for (let i = 0; i < count; i += 1) {
    const angle = (i * 2 * Math.PI) / count;
    const unitX = Math.cos(angle);
    const unitY = Math.sin(angle);
    const noiseX = gaussianRandom() * 0.025;
    const noiseY = gaussianRandom() * 0.025;
    points.push({ x: unitX + noiseX, y: unitY + noiseY, color });
  }

  // Scale and translate points to the canvas
  const scaledPoints = points.map((point) => ({
    x: centerX + point.x * radius,
    y: centerY + point.y * radius,
    color: point.color,
  }));

  return scaledPoints;
};

const renderGrid = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  width: number,
  height: number,
  gridSize: number
) => {
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
  height: number,
  offset: number
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
      const centerX = width / 2 + offset / 2;
      const centerY = height / 2 + offset / 2;
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

  const scaleFactor = 0.4;
  const offset = 60;
  const gridSize = (height + offset) / 16;

  useEffect(() => {
    const greenPoints = generatePoints(
      height / 2,
      180,
      'green',
      width,
      height,
      offset
    );
    const bluePoints = generatePoints(
      (height / 2) * scaleFactor,
      60,
      'blue',
      width,
      height,
      offset
    );
    setPoints([...bluePoints, ...greenPoints]);
  }, [width, height]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    renderGrid(svg, width + offset, height + offset, gridSize);
    renderCircles(
      svg,
      points,
      selectedPoint,
      setSelectedPoint,
      onInputChange,
      width,
      height,
      offset
    );
  }, [width, height, gridSize, onInputChange, points, selectedPoint]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Select Point</h2>
      <svg ref={svgRef} width={width + offset} height={height + offset} />
    </div>
  );
};

export default Circles;
