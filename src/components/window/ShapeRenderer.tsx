import React from 'react';
import Icon from '@/components/ui/icon';
import { WindowCalculation } from './types';

interface ShapeRendererProps {
  calculation: WindowCalculation;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({ calculation }) => {
  const { shape, a, b, c, d } = calculation;
  
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
        
        {calculation.grommets && (
          <>
            {(() => {
              const positions = [];
              const startX = 65;
              const spacing = 20;
              const endX = 335;
              
              for (let x = startX; x <= endX; x += spacing) {
                positions.push([x, 52]);
              }
              return positions;
            })().map(([x, y], i) => (
              <g key={`top-${i}`}>
                <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
                <text x={x} y={y-15} textAnchor="middle" fontSize="10" fill="#666">16мм</text>
              </g>
            ))}
          </>
        )}

        {calculation.ringGrommets && (
          <>
            {(() => {
              const positions = [];
              const startY = 90;
              const spacing = 40;
              const endY = 210;
              
              for (let y = startY; y <= endY; y += spacing) {
                positions.push([52, y]);
              }
              return positions;
            })().map(([x, y], i) => (
              <g key={`left-${i}`}>
                <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
                <text x={x-25} y={y+3} textAnchor="middle" fontSize="8" fill="#666">42×22</text>
              </g>
            ))}
            
            {(() => {
              const positions = [];
              const startY = 90;
              const spacing = 40;
              const endY = 210;
              
              for (let y = startY; y <= endY; y += spacing) {
                positions.push([348, y]);
              }
              return positions;
            })().map(([x, y], i) => (
              <g key={`right-${i}`}>
                <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
                <text x={x+25} y={y+3} textAnchor="middle" fontSize="8" fill="#666">42×22</text>
              </g>
            ))}
            
            {(() => {
              const positions = [];
              const startX = 90;
              const spacing = 40;
              const endX = 310;
              
              for (let x = startX; x <= endX; x += spacing) {
                positions.push([x, 248]);
              }
              return positions;
            })().map(([x, y], i) => (
              <g key={`bottom-${i}`}>
                <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
                <text x={x} y={y+20} textAnchor="middle" fontSize="8" fill="#666">42×22</text>
              </g>
            ))}
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
