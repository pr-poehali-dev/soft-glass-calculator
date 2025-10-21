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
      <svg width="450" height="340" className="border rounded bg-white blueprint-svg">
        {calculation.grommets && calculation.grommetsCount > 0 && (
          <text x="350" y="15" textAnchor="end" fontSize="11" fill="#0066CC" fontWeight="bold">
            Шаг 300мм
          </text>
        )}
        {calculation.ringGrommets && calculation.ringGrommetsCount > 0 && (
          <text x="50" y="305" textAnchor="start" fontSize="11" fill="#B8860B" fontWeight="bold">
            Шаг 350мм
          </text>
        )}
        
        <rect x="60" y="40" width="320" height="220" fill="#A0522D" stroke="none"/>
        <rect x="85" y="65" width="270" height="170" fill="#B3E5FC" stroke="none"/>
        
        <line x1="60" y1="15" x2="380" y2="15" stroke="#000" strokeWidth="1"/>
        <line x1="60" y1="12" x2="60" y2="18" stroke="#000" strokeWidth="1"/>
        <line x1="380" y1="12" x2="380" y2="18" stroke="#000" strokeWidth="1"/>
        <text x="220" y="10" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">A = {a + calculation.kantSize} мм</text>
        
        <line x1="405" y1="40" x2="405" y2="260" stroke="#000" strokeWidth="1"/>
        <line x1="402" y1="40" x2="408" y2="40" stroke="#000" strokeWidth="1"/>
        <line x1="402" y1="260" x2="408" y2="260" stroke="#000" strokeWidth="1"/>
        <text x="420" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(90 420 150)">B = {b + calculation.kantSize} мм</text>
        
        <line x1="60" y1="285" x2="380" y2="285" stroke="#000" strokeWidth="1"/>
        <line x1="60" y1="282" x2="60" y2="288" stroke="#000" strokeWidth="1"/>
        <line x1="380" y1="282" x2="380" y2="288" stroke="#000" strokeWidth="1"/>
        <text x="220" y="300" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">C = {c + calculation.kantSize} мм</text>
        
        <line x1="25" y1="40" x2="25" y2="260" stroke="#000" strokeWidth="1"/>
        <line x1="22" y1="40" x2="28" y2="40" stroke="#000" strokeWidth="1"/>
        <line x1="22" y1="260" x2="28" y2="260" stroke="#000" strokeWidth="1"/>
        <text x="15" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(-90 15 150)">D = {d + calculation.kantSize} мм</text>
        
        {/* Размеры канта */}
        <line x1="60" y1="52" x2="85" y2="52" stroke="#FF6600" strokeWidth="1.5"/>
        <line x1="60" y1="49" x2="60" y2="55" stroke="#FF6600" strokeWidth="1.5"/>
        <line x1="85" y1="49" x2="85" y2="55" stroke="#FF6600" strokeWidth="1.5"/>
        <text x="72.5" y="48" textAnchor="middle" fontSize="10" fill="#FF6600" fontWeight="bold">{calculation.kantSize}мм</text>
        
        {/* Размеры ПВХ с припуском */}
        <line x1="75" y1="80" x2="365" y2="80" stroke="#2E7D32" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="75" y1="77" x2="75" y2="83" stroke="#2E7D32" strokeWidth="1"/>
        <line x1="365" y1="77" x2="365" y2="83" stroke="#2E7D32" strokeWidth="1"/>
        <text x="220" y="95" textAnchor="middle" fontSize="11" fill="#2E7D32" fontWeight="bold">ПВХ: {a + 25} мм</text>
        
        <line x1="90" y1="70" x2="90" y2="230" stroke="#2E7D32" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="87" y1="70" x2="93" y2="70" stroke="#2E7D32" strokeWidth="1"/>
        <line x1="87" y1="230" x2="93" y2="230" stroke="#2E7D32" strokeWidth="1"/>
        <text x="105" y="150" textAnchor="middle" fontSize="11" fill="#2E7D32" fontWeight="bold" transform="rotate(-90 105 150)">ПВХ: {d + 25} мм</text>
        
        {/* Размер ПВХ снизу (сторона C) */}
        <line x1="75" y1="220" x2="365" y2="220" stroke="#2E7D32" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="75" y1="217" x2="75" y2="223" stroke="#2E7D32" strokeWidth="1"/>
        <line x1="365" y1="217" x2="365" y2="223" stroke="#2E7D32" strokeWidth="1"/>
        <text x="220" y="210" textAnchor="middle" fontSize="11" fill="#2E7D32" fontWeight="bold">ПВХ: {c + 25} мм</text>
        
        {/* Размер ПВХ справа (сторона B) */}
        <line x1="350" y1="70" x2="350" y2="230" stroke="#2E7D32" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="347" y1="70" x2="353" y2="70" stroke="#2E7D32" strokeWidth="1"/>
        <line x1="347" y1="230" x2="353" y2="230" stroke="#2E7D32" strokeWidth="1"/>
        <text x="335" y="150" textAnchor="middle" fontSize="11" fill="#2E7D32" fontWeight="bold" transform="rotate(90 335 150)">ПВХ: {b + 25} мм</text>
        
        <text x="220" y="325" textAnchor="middle" fontSize="12" fill="#666">ПВХ пленка: A×B | Общий размер с кантом: +{calculation.kantSize/2}мм с каждой стороны</text>
        
        {calculation.grommets && calculation.grommetsCount > 0 && (
          <>
            {(() => {
              const positions = [];
              const count = calculation.grommetsCount;
              const kantSize = calculation.kantSize;
              const topSideMm = a + 25; // Размер ПВХ с припуском
              
              // Первый и последний люверсы точно в центре углов с учетом внешнего диаметра 30мм
              const grommetOuterDiameter = 30; // Внешний диаметр люверса
              const grommetRadius = grommetOuterDiameter / 2;
              const kantCenterOffset = kantSize / 2;
              
              // Люверсы в центре угла = центр канта
              const firstGrommetX = 60 + kantCenterOffset; // 60 - левый край канта
              const lastGrommetX = 380 - kantCenterOffset; // 380 - правый край канта
              
              // Расстояние между центрами крайних люверсов в пикселях
              const totalDistancePx = lastGrommetX - firstGrommetX;
              
              // Масштаб: вся длина ПВХ = 320 пикселей (380-60)
              const totalWidthPx = 320;
              const scale = totalWidthPx / topSideMm;
              
              // Расстояние между центрами крайних люверсов в мм
              const distanceMm = topSideMm - kantSize;
              
              // Расчет шага между люверсами с учетом того, что они не должны касаться (диаметр 30мм)
              const spacingMm = distanceMm / (count - 1 || 1);
              
              for (let i = 0; i < count; i++) {
                positions.push([firstGrommetX + i * spacingMm * scale, 52]);
              }
              
              return { positions, spacingMm, kantCenterOffset, distanceMm };
            })().positions.map(([x, y], i) => (
              <g key={`grommet-${i}`}>
                <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
              </g>
            ))}
            {(() => {
              const count = calculation.grommetsCount;
              const kantSize = calculation.kantSize;
              const topSideMm = a + 25;
              const kantCenterOffset = kantSize / 2;
              const firstGrommetX = 60 + kantCenterOffset;
              const edgeX = 60;
              const totalWidthPx = 320;
              const scale = totalWidthPx / topSideMm;
              const distanceMm = topSideMm - kantSize;
              const spacingMm = distanceMm / (count - 1 || 1);
              
              return (
                <>
                  {/* Отступ от края до первого люверса (центр канта) */}
                  <g>
                    <line x1={edgeX} y1={35} x2={firstGrommetX} y2={35} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={edgeX} y1={32} x2={edgeX} y2={38} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={firstGrommetX} y1={32} x2={firstGrommetX} y2={38} stroke="#FF6600" strokeWidth="1.5"/>
                    <text x={(edgeX + firstGrommetX) / 2} y={33} textAnchor="middle" fontSize="10" fill="#FF6600" fontWeight="bold">
                      {kantCenterOffset.toFixed(0)}мм
                    </text>
                  </g>
                  
                  {/* Расстояние между люверсами */}
                  {count > 1 && (() => {
                    const x1 = firstGrommetX;
                    const x2 = firstGrommetX + spacingMm * scale;
                    const y = 30;
                    
                    return (
                      <g>
                        <line x1={x1} y1={y} x2={x2} y2={y} stroke="#0066CC" strokeWidth="1.5"/>
                        <line x1={x1} y1={y-3} x2={x1} y2={y+3} stroke="#0066CC" strokeWidth="1.5"/>
                        <line x1={x2} y1={y-3} x2={x2} y2={y+3} stroke="#0066CC" strokeWidth="1.5"/>
                        <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" fontSize="11" fill="#0066CC" fontWeight="bold">
                          {spacingMm.toFixed(0)}мм
                        </text>
                      </g>
                    );
                  })()}
                </>
              );
            })()}
            <text x="220" y="150" textAnchor="middle" fontSize="12" fill="#0066CC" fontWeight="bold">
              Люверсы 16мм: {calculation.grommetsCount} шт (верх)
            </text>
          </>
        )}

        {calculation.ringGrommets && calculation.ringGrommetsCount > 0 && (
          <>
            {(() => {
              const positions = [];
              const totalCount = calculation.ringGrommetsCount;
              
              // Распределяем по 3 сторонам (левая, правая, нижняя)
              const sidesPerimeter = (b + c + d) / 1000;
              const leftCount = Math.max(1, Math.round((d / 1000 / sidesPerimeter) * totalCount));
              const rightCount = Math.max(1, Math.round((b / 1000 / sidesPerimeter) * totalCount));
              const bottomCount = Math.max(1, totalCount - leftCount - rightCount);
              
              // Левая сторона
              const leftSpacing = 170 / (leftCount - 1 || 1);
              for (let i = 0; i < leftCount; i++) {
                positions.push([72, 65 + i * leftSpacing, 'left']);
              }
              
              // Правая сторона
              const rightSpacing = 170 / (rightCount - 1 || 1);
              for (let i = 0; i < rightCount; i++) {
                positions.push([368, 65 + i * rightSpacing, 'right']);
              }
              
              // Нижняя сторона
              const bottomSpacing = 270 / (bottomCount - 1 || 1);
              for (let i = 0; i < bottomCount; i++) {
                positions.push([85 + i * bottomSpacing, 248, 'bottom']);
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
            {(() => {
              const totalCount = calculation.ringGrommetsCount;
              const sidesPerimeter = (b + c + d) / 1000;
              const leftCount = Math.max(1, Math.round((d / 1000 / sidesPerimeter) * totalCount));
              const rightCount = Math.max(1, Math.round((b / 1000 / sidesPerimeter) * totalCount));
              const bottomCount = Math.max(1, totalCount - leftCount - rightCount);
              
              const firstGrommetX = 85;
              const edgeX = 60;
              const firstGrommetY = 65;
              const edgeY = 40;
              
              return (
                <>
                  {/* Отступ от края до первого люверса (низ) */}
                  <g>
                    <line x1={edgeX} y1={268} x2={firstGrommetX} y2={268} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={edgeX} y1={265} x2={edgeX} y2={271} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={firstGrommetX} y1={265} x2={firstGrommetX} y2={271} stroke="#FF6600" strokeWidth="1.5"/>
                    <text x={(edgeX + firstGrommetX) / 2} y={279} textAnchor="middle" fontSize="10" fill="#FF6600" fontWeight="bold">
                      15мм
                    </text>
                  </g>
                  
                  {/* Отступ от края до первого люверса (левая сторона) */}
                  <g>
                    <line x1={35} y1={edgeY} x2={35} y2={firstGrommetY} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={32} y1={edgeY} x2={38} y2={edgeY} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={32} y1={firstGrommetY} x2={38} y2={firstGrommetY} stroke="#FF6600" strokeWidth="1.5"/>
                    <text x={30} y={(edgeY + firstGrommetY) / 2 + 3} textAnchor="middle" fontSize="10" fill="#FF6600" fontWeight="bold" transform={`rotate(-90 30 ${(edgeY + firstGrommetY) / 2 + 3})`}>
                      15мм
                    </text>
                  </g>
                  
                  {/* Отступ от края до первого люверса (правая сторона) */}
                  <g>
                    <line x1={385} y1={edgeY} x2={385} y2={firstGrommetY} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={382} y1={edgeY} x2={388} y2={edgeY} stroke="#FF6600" strokeWidth="1.5"/>
                    <line x1={382} y1={firstGrommetY} x2={388} y2={firstGrommetY} stroke="#FF6600" strokeWidth="1.5"/>
                    <text x={390} y={(edgeY + firstGrommetY) / 2 + 3} textAnchor="middle" fontSize="10" fill="#FF6600" fontWeight="bold" transform={`rotate(90 390 ${(edgeY + firstGrommetY) / 2 + 3})`}>
                      15мм
                    </text>
                  </g>
                  
                  {/* Расстояние между кольцевыми люверсами */}
                  {bottomCount > 1 && (() => {
                    const bottomSpacing = 270 / (bottomCount - 1 || 1);
                    const x1 = 85;
                    const x2 = 85 + bottomSpacing;
                    const y = 265;
                    
                    return (
                      <g>
                        <line x1={x1} y1={y} x2={x2} y2={y} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x1} y1={y-3} x2={x1} y2={y+3} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x2} y1={y-3} x2={x2} y2={y+3} stroke="#B8860B" strokeWidth="1.5"/>
                        <text x={(x1 + x2) / 2} y={y + 12} textAnchor="middle" fontSize="11" fill="#B8860B" fontWeight="bold">
                          350мм
                        </text>
                      </g>
                    );
                  })()}
                  
                  {/* Расстояние между кольцевыми люверсами на левой стороне */}
                  {leftCount > 1 && (() => {
                    const leftSpacing = 170 / (leftCount - 1 || 1);
                    const y1 = 65;
                    const y2 = 65 + leftSpacing;
                    const x = 35;
                    
                    return (
                      <g>
                        <line x1={x} y1={y1} x2={x} y2={y2} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x-3} y1={y1} x2={x+3} y2={y1} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x-3} y1={y2} x2={x+3} y2={y2} stroke="#B8860B" strokeWidth="1.5"/>
                        <text x={30} y={(y1 + y2) / 2 + 3} textAnchor="middle" fontSize="11" fill="#B8860B" fontWeight="bold" transform={`rotate(-90 30 ${(y1 + y2) / 2 + 3})`}>
                          350мм
                        </text>
                      </g>
                    );
                  })()}
                </>
              );
            })()}
            <text x="220" y="165" textAnchor="middle" fontSize="12" fill="#B8860B" fontWeight="bold">
              Кольцевые люверсы 42×22мм: {calculation.ringGrommetsCount} шт (л/п/н)
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