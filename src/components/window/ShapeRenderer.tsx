import React from 'react';
import Icon from '@/components/ui/icon';
import { WindowCalculation } from './types';
import { calculatePerimeter } from './utils';

interface ShapeRendererProps {
  calculation: WindowCalculation;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({ calculation }) => {
  const { shape, a, b, c, d } = calculation;
  
  const distributeGrommetsOnSide = (sideLength: number, totalPerimeter: number, grommetsCount: number) => {
    const sideRatio = sideLength / totalPerimeter;
    return Math.max(2, Math.round(grommetsCount * sideRatio));
  };
  
  const perimeter = calculatePerimeter(calculation);
  
  if (shape === 'rectangle') {
    return (
      <svg width="400" height="320" className="border rounded bg-white">
        <rect x="40" y="40" width="320" height="220" fill="#A0522D" stroke="none"/>
        <rect x="65" y="65" width="270" height="170" fill="#B3E5FC" stroke="none"/>
        
        <line x1="40" y1="25" x2="360" y2="25" stroke="#000" strokeWidth="1"/>
        <line x1="40" y1="22" x2="40" y2="28" stroke="#000" strokeWidth="1"/>
        <line x1="360" y1="22" x2="360" y2="28" stroke="#000" strokeWidth="1"/>
        <text x="200" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">A = {a} мм</text>
        
        <line x1="375" y1="40" x2="375" y2="260" stroke="#000" strokeWidth="1"/>
        <line x1="372" y1="40" x2="378" y2="40" stroke="#000" strokeWidth="1"/>
        <line x1="372" y1="260" x2="378" y2="260" stroke="#000" strokeWidth="1"/>
        <text x="385" y="155" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(90 385 155)">B = {b} мм</text>
        
        <line x1="40" y1="275" x2="360" y2="275" stroke="#000" strokeWidth="1"/>
        <line x1="40" y1="272" x2="40" y2="278" stroke="#000" strokeWidth="1"/>
        <line x1="360" y1="272" x2="360" y2="278" stroke="#000" strokeWidth="1"/>
        <text x="200" y="290" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">C = {c} мм</text>
        
        <line x1="25" y1="40" x2="25" y2="260" stroke="#000" strokeWidth="1"/>
        <line x1="22" y1="40" x2="28" y2="40" stroke="#000" strokeWidth="1"/>
        <line x1="22" y1="260" x2="28" y2="260" stroke="#000" strokeWidth="1"/>
        <text x="15" y="155" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(-90 15 155)">D = {d} мм</text>
        
        <text x="200" y="310" textAnchor="middle" fontSize="12" fill="#666">Кант: {calculation.kantSize}мм</text>
        
        {calculation.grommets && calculation.grommetsCount > 0 && (
          <>
            {(() => {
              const positions = [];
              const topCount = distributeGrommetsOnSide(a / 1000, perimeter, calculation.grommetsCount);
              const rightCount = distributeGrommetsOnSide(b / 1000, perimeter, calculation.grommetsCount);
              const bottomCount = distributeGrommetsOnSide(c / 1000, perimeter, calculation.grommetsCount);
              const leftCount = distributeGrommetsOnSide(d / 1000, perimeter, calculation.grommetsCount);
              
              // Верхняя сторона
              const topSpacing = 270 / (topCount - 1 || 1);
              for (let i = 0; i < topCount; i++) {
                positions.push([65 + i * topSpacing, 52, 'top']);
              }
              
              // Правая сторона
              const rightSpacing = 170 / (rightCount - 1 || 1);
              for (let i = 0; i < rightCount; i++) {
                positions.push([348, 65 + i * rightSpacing, 'right']);
              }
              
              // Нижняя сторона
              const bottomSpacing = 270 / (bottomCount - 1 || 1);
              for (let i = 0; i < bottomCount; i++) {
                positions.push([335 - i * bottomSpacing, 248, 'bottom']);
              }
              
              // Левая сторона
              const leftSpacing = 170 / (leftCount - 1 || 1);
              for (let i = 0; i < leftCount; i++) {
                positions.push([52, 235 - i * leftSpacing, 'left']);
              }
              
              return positions;
            })().map(([x, y, side], i) => (
              <g key={`grommet-${i}`}>
                <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
              </g>
            ))}
            <text x="200" y="150" textAnchor="middle" fontSize="12" fill="#0066CC" fontWeight="bold">
              Люверсы 16мм: {calculation.grommetsCount} шт
            </text>
          </>
        )}

        {calculation.ringGrommets && calculation.ringGrommetsCount > 0 && (
          <>
            {(() => {
              const positions = [];
              const topCount = distributeGrommetsOnSide(a / 1000, perimeter, calculation.ringGrommetsCount);
              const rightCount = distributeGrommetsOnSide(b / 1000, perimeter, calculation.ringGrommetsCount);
              const bottomCount = distributeGrommetsOnSide(c / 1000, perimeter, calculation.ringGrommetsCount);
              const leftCount = distributeGrommetsOnSide(d / 1000, perimeter, calculation.ringGrommetsCount);
              
              // Верхняя сторона
              const topSpacing = 270 / (topCount - 1 || 1);
              for (let i = 0; i < topCount; i++) {
                positions.push([65 + i * topSpacing, 52, 'top']);
              }
              
              // Правая сторона
              const rightSpacing = 170 / (rightCount - 1 || 1);
              for (let i = 0; i < rightCount; i++) {
                positions.push([348, 65 + i * rightSpacing, 'right']);
              }
              
              // Нижняя сторона
              const bottomSpacing = 270 / (bottomCount - 1 || 1);
              for (let i = 0; i < bottomCount; i++) {
                positions.push([335 - i * bottomSpacing, 248, 'bottom']);
              }
              
              // Левая сторона
              const leftSpacing = 170 / (leftCount - 1 || 1);
              for (let i = 0; i < leftCount; i++) {
                positions.push([52, 235 - i * leftSpacing, 'left']);
              }
              
              return positions;
            })().map(([x, y, side], i) => (
              <g key={`ring-grommet-${i}`}>
                <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
              </g>
            ))}
            <text x="200" y="165" textAnchor="middle" fontSize="12" fill="#B8860B" fontWeight="bold">
              Кольцевые люверсы 42×22мм: {calculation.ringGrommetsCount} шт
            </text>
          </>
        )}

        {calculation.frenchLock && (
          <>
            {[
              [50, 150], [350, 150]
            ].map(([x, y], i) => (
              <g key={i}>
                <rect x={x-8} y={y-6} width="16" height="12" fill="#B8860B" stroke="#A0700B" strokeWidth="1" rx="2"/>
                <rect x={x-6} y={y-4} width="12" height="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5" rx="1"/>
                <rect x={x-2} y={y-2} width="4" height="4" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" rx="0.5"/>
                <circle cx={x-4} cy={y-2} r="0.8" fill="#808080"/>
                <circle cx={x+4} cy={y-2} r="0.8" fill="#808080"/>
              </g>
            ))}
          </>
        )}
      </svg>
    );
  }
  
  return (
    <div className="w-[400px] h-[300px] border rounded bg-white flex items-center justify-center">
      <Icon name="Shapes" size={60} className="text-primary" />
    </div>
  );
};

export default ShapeRenderer;