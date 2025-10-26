import React from 'react';
import { SkillCategory } from '../../types';

interface SkillsRadarChartProps {
  skills: SkillCategory[];
  selectedCategory: SkillCategory | null;
  hoveredCategory: SkillCategory | null;
  onCategorySelect: (category: SkillCategory) => void;
  onCategoryHover: (category: SkillCategory | null) => void;
}

const CHART_SIZE = 180; // Ukuran chart diperkecil dari 220
const CHART_CENTER = CHART_SIZE / 2;
const MAX_RADIUS = CHART_CENTER * 0.75;

// Define a vibrant, game-like color palette for each category
const CATEGORY_COLORS = [
  '#00ffff', // Cyan - Leadership
  '#00ff7f', // Spring Green - Web
  '#ffa500', // Orange - AI/ML
  '#ff00ff', // Magenta - Blockchain
  '#ffd700', // Gold - Creative Tech
  '#9370db', // Medium Purple - Arts
];

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ skills, selectedCategory, hoveredCategory, onCategorySelect, onCategoryHover }) => {
  const numAxes = skills.length;

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

  const axes = skills.map((_, i) => {
    const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
    return {
      x2: CHART_CENTER + MAX_RADIUS * Math.cos(angle),
      y2: CHART_CENTER + MAX_RADIUS * Math.sin(angle),
      labelX: CHART_CENTER + (MAX_RADIUS + 20) * Math.cos(angle), // Jarak label disesuaikan
      labelY: CHART_CENTER + (MAX_RADIUS + 20) * Math.sin(angle),
    };
  });

  return (
    <>
      <style>{`
        @keyframes draw-in { to { stroke-dashoffset: 0; } }
        @keyframes fade-in { to { opacity: 1; transform: scale(1); } }
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 4px currentColor); }
          50% { filter: drop-shadow(0 0 10px currentColor); }
          100% { filter: drop-shadow(0 0 4px currentColor); }
        }
        
        .radar-grid-line { stroke-dasharray: 500; stroke-dashoffset: 500; animation: draw-in 1s ease forwards; }
        .radar-axis { stroke-dasharray: 500; stroke-dashoffset: 500; animation: draw-in 1s ease forwards; transition: all 0.2s ease; }
        
        .radar-label-group { opacity: 0; transform-origin: center; transform: scale(0.8); animation: fade-in 0.5s ease forwards; transition: transform 0.2s ease; }
        .radar-label-bg { transition: all 0.2s ease; }
        
        .interactive-sector { cursor: pointer; }
        .interactive-sector.hovered .radar-label-group { transform: scale(1.1); }
        .interactive-sector.hovered .radar-label-bg { opacity: 0.5; }

        .radar-data-slice { opacity: 0; transform-origin: ${CHART_CENTER}px ${CHART_CENTER}px; transform: scale(0.8); animation: fade-in 0.8s ease 0.5s forwards; transition: opacity 0.3s; }
        .radar-active .radar-data-slice { animation: pulse-glow 2s infinite; }
      `}</style>
      <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} width="100%" height="100%" style={{ maxHeight: '400px', maxWidth: '400px' }}>
        
        {/* Grid lines (Hexagons) */}
        {[0.25, 0.5, 0.75, 1].map((scale, index) => {
          const radius = MAX_RADIUS * scale;
          const points = Array.from({ length: numAxes }).map((_, i) => {
            const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
            return `${CHART_CENTER + radius * Math.cos(angle)},${CHART_CENTER + radius * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon key={scale} points={points} fill="none" stroke="#00ffff" strokeOpacity="0.2" strokeWidth="1" className="radar-grid-line" style={{ animationDelay: `${index * 0.1}s` }} />
          );
        })}

        {/* Data Polygon Slices */}
        {dataPoints.map((point, i) => {
            const prevPoint = dataPoints[(i - 1 + numAxes) % numAxes];
            const isSelected = selectedCategory?.category === skills[i].category;
            const slicePoints = `${CHART_CENTER},${CHART_CENTER} ${prevPoint.x},${prevPoint.y} ${point.x},${point.y}`;
            return (
                <polygon
                    key={`slice-${i}`}
                    points={slicePoints}
                    fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                    fillOpacity={isSelected ? 0.4 : 0.2}
                    className="radar-data-slice"
                    style={{
                        animationDelay: `${0.5 + i * 0.1}s`,
                        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length], // For pulse-glow filter
                    }}
                />
            );
        })}

        {/* Axes and Interactive Labels */}
        {axes.map((axis, i) => {
            const category = skills[i];
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
            const isSelected = selectedCategory?.category === category.category;
            const isHovered = hoveredCategory?.category === category.category;

            const labelWidth = 60; // Lebar box diperkecil
            const labelHeight = 15; // Tinggi box diperkecil
            
            return (
                <g 
                    key={`axis-${i}`} 
                    className={`interactive-sector ${isSelected ? 'radar-active' : ''} ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => onCategoryHover(category)} 
                    onMouseLeave={() => onCategoryHover(null)}
                    onClick={() => onCategorySelect(category)}
                >
                    {/* Axis Line */}
                    <line x1={CHART_CENTER} y1={CHART_CENTER} x2={axis.x2} y2={axis.y2} stroke={color} strokeOpacity={isSelected ? 1 : 0.5} strokeWidth={isSelected ? 1.5 : 1} className="radar-axis" style={{ animationDelay: `${i * 0.1}s` }} />

                    {/* Label Button */}
                    <g className="radar-label-group" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                        <rect
                            x={axis.labelX - labelWidth / 2}
                            y={axis.labelY - labelHeight / 2}
                            width={labelWidth}
                            height={labelHeight}
                            rx="3" // Radius disesuaikan
                            ry="3"
                            fill={color}
                            fillOpacity={isSelected ? 0.3 : 0.15}
                            stroke={color}
                            strokeWidth="1"
                            strokeOpacity={isSelected ? 0.8 : 0.4}
                            className="radar-label-bg"
                        />
                        <text
                            x={axis.labelX}
                            y={axis.labelY}
                            fill={isSelected ? '#ffffff' : color}
                            fontSize="5.5" // Font diperkecil secara drastis
                            fontWeight="700"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontFamily="var(--font-family)"
                            style={{ textShadow: isSelected ? '0 0 5px #ffffff' : 'none' }}
                        >
                            {category.category.toUpperCase()}
                        </text>
                    </g>
                </g>
            );
        })}
      </svg>
    </>
  );
};
