import React from 'react';
import { SkillCategory } from '../../types';

interface SkillsRadarChartProps {
  skills: SkillCategory[];
  activeCategory: SkillCategory | null;
  onCategoryHover: (category: SkillCategory | null) => void;
}

const CHART_SIZE = 400;
const CHART_CENTER = CHART_SIZE / 2;
const MAX_RADIUS = CHART_CENTER * 0.8;
const PRIMARY_COLOR = '#00ffff';
const ACTIVE_COLOR = '#ffffff';

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ skills, activeCategory, onCategoryHover }) => {
  const numAxes = skills.length;

  // Calculate the average proficiency for each category
  const dataPoints = skills.map((cat, i) => {
    const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2; // Start from top
    const avgLevel = cat.skills.reduce((acc, skill) => acc + skill.level, 0) / cat.skills.length;
    const radius = (avgLevel / 100) * MAX_RADIUS;
    return {
      x: CHART_CENTER + radius * Math.cos(angle),
      y: CHART_CENTER + radius * Math.sin(angle),
      category: cat.category,
    };
  });

  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const axes = skills.map((cat, i) => {
    const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
    return {
      x2: CHART_CENTER + MAX_RADIUS * Math.cos(angle),
      y2: CHART_CENTER + MAX_RADIUS * Math.sin(angle),
      labelX: CHART_CENTER + (MAX_RADIUS + 25) * Math.cos(angle),
      labelY: CHART_CENTER + (MAX_RADIUS + 25) * Math.sin(angle),
      category: cat,
    };
  });

  return (
    <>
      <style>{`
        @keyframes draw-in { to { stroke-dashoffset: 0; } }
        @keyframes fade-in { to { opacity: 1; transform: scale(1); } }
        
        .radar-polygon-fill { animation: fade-in 0.8s ease 0.5s forwards; opacity: 0; transform-origin: ${CHART_CENTER}px ${CHART_CENTER}px; transform: scale(0.8); }
        .radar-polygon-stroke { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw-in 1.5s ease forwards; }
        .radar-axis, .radar-grid-line { stroke-dasharray: 500; stroke-dashoffset: 500; animation: draw-in 1s ease forwards; transition: all 0.3s ease; }
        .radar-label { opacity: 0; animation: fade-in 0.5s ease forwards; transition: all 0.3s ease; cursor: pointer; }
        .radar-data-point { opacity: 0; transform-origin: center; transform: scale(0); animation: fade-in 0.5s ease forwards; transition: all 0.2s ease; }
        .radar-label:hover { fill: ${ACTIVE_COLOR}; filter: drop-shadow(0 0 5px ${ACTIVE_COLOR}); }
      `}</style>
      <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} width="100%" height="100%" style={{ maxHeight: '400px', maxWidth: '400px' }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines (Hexagons) */}
        {[0.25, 0.5, 0.75, 1].map((scale, index) => {
          const radius = MAX_RADIUS * scale;
          const points = Array.from({ length: numAxes }).map((_, i) => {
            const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
            const x = CHART_CENTER + radius * Math.cos(angle);
            const y = CHART_CENTER + radius * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon key={scale} points={points} fill="none" stroke={PRIMARY_COLOR} strokeOpacity="0.2" strokeWidth="1" className="radar-grid-line" style={{ animationDelay: `${index * 0.1}s` }} />
          );
        })}

        {/* Axes */}
        {axes.map((axis, i) => {
            const isActive = activeCategory?.category === axis.category.category;
            return (
                <g key={`axis-${i}`} onMouseEnter={() => onCategoryHover(axis.category)} onMouseLeave={() => onCategoryHover(null)}>
                    <line x1={CHART_CENTER} y1={CHART_CENTER} x2={axis.x2} y2={axis.y2} stroke={isActive ? ACTIVE_COLOR : PRIMARY_COLOR} strokeOpacity={isActive ? 0.9 : 0.4} strokeWidth={isActive ? "2" : "1"} className="radar-axis" style={{ animationDelay: `${i * 0.1}s` }} />
                    <text x={axis.labelX} y={axis.labelY} fill={isActive ? ACTIVE_COLOR : PRIMARY_COLOR} fontSize="12" textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-family)" className="radar-label" style={{ animationDelay: `${0.5 + i * 0.1}s`, fontWeight: isActive ? 700 : 400 }}>
                    {axis.category.category.toUpperCase()}
                    </text>
                </g>
            );
        })}

        {/* Data Polygon */}
        <polygon points={polygonPoints} fill={PRIMARY_COLOR} fillOpacity="0.15" className="radar-polygon-fill" />
        <polygon points={polygonPoints} fill="none" stroke={PRIMARY_COLOR} strokeWidth="2" filter="url(#glow)" className="radar-polygon-stroke" />
        
        {/* Data Points */}
        {dataPoints.map((point, i) => {
            const isActive = activeCategory?.category === point.category;
            return (
                <circle key={`point-${i}`} cx={point.x} cy={point.y} r={isActive ? 7 : 4} fill={isActive ? ACTIVE_COLOR : PRIMARY_COLOR} stroke="#050810" strokeWidth="2" className="radar-data-point" style={{ animationDelay: `${1 + i * 0.1}s`, filter: isActive ? `drop-shadow(0 0 8px ${ACTIVE_COLOR})` : 'none' }} onMouseEnter={() => onCategoryHover(skills.find(s => s.category === point.category) || null)} onMouseLeave={() => onCategoryHover(null)} />
            )
        })}
      </svg>
    </>
  );
};