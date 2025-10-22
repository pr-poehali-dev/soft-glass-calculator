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
      <svg width="900" height="680" viewBox="0 0 450 400" className="border rounded bg-white blueprint-svg">
        
        <rect x="60" y="40" width="320" height="220" fill="#A0522D" stroke="none"/>
        <rect x="95" y="75" width="250" height="150" fill="#B3E5FC" stroke="none"/>
        
        <line x1="60" y1="15" x2="380" y2="15" stroke="#000" strokeWidth="1"/>
        <line x1="60" y1="12" x2="60" y2="18" stroke="#000" strokeWidth="1"/>
        <line x1="380" y1="12" x2="380" y2="18" stroke="#000" strokeWidth="1"/>
        <text x="220" y="10" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">A = {a + calculation.kantSize} мм</text>
        
        <line x1="104" y1="90" x2="336" y2="90" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5,3"/>
        <line x1="104" y1="87" x2="104" y2="93" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="115" y1="87" x2="115" y2="93" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="325" y1="87" x2="325" y2="93" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="336" y1="87" x2="336" y2="93" stroke="#22C55E" strokeWidth="1.5"/>
        <text x="220" y="86" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#22C55E">ПВХ: {a + 50} мм</text>
        
        <line x1="405" y1="40" x2="405" y2="260" stroke="#000" strokeWidth="1"/>
        <line x1="402" y1="40" x2="408" y2="40" stroke="#000" strokeWidth="1"/>
        <line x1="402" y1="260" x2="408" y2="260" stroke="#000" strokeWidth="1"/>
        <text x="420" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(90 420 150)">B = {b + calculation.kantSize} мм</text>
        
        <line x1="325" y1="84" x2="325" y2="216" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5,3"/>
        <line x1="322" y1="84" x2="328" y2="84" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="322" y1="95" x2="328" y2="95" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="322" y1="205" x2="328" y2="205" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="322" y1="216" x2="328" y2="216" stroke="#22C55E" strokeWidth="1.5"/>
        <text x="332" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#22C55E" transform="rotate(90 332 150)">ПВХ: {b + 50} мм</text>
        
        <line x1="60" y1="285" x2="380" y2="285" stroke="#000" strokeWidth="1"/>
        <line x1="60" y1="282" x2="60" y2="288" stroke="#000" strokeWidth="1"/>
        <line x1="380" y1="282" x2="380" y2="288" stroke="#000" strokeWidth="1"/>
        <text x="220" y="300" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">C = {c + calculation.kantSize} мм</text>
        
        <line x1="104" y1="210" x2="336" y2="210" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5,3"/>
        <line x1="104" y1="207" x2="104" y2="213" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="115" y1="207" x2="115" y2="213" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="325" y1="207" x2="325" y2="213" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="336" y1="207" x2="336" y2="213" stroke="#22C55E" strokeWidth="1.5"/>
        <text x="220" y="224" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#22C55E">ПВХ: {c + 50} мм</text>
        
        <line x1="25" y1="40" x2="25" y2="260" stroke="#000" strokeWidth="1"/>
        <line x1="22" y1="40" x2="28" y2="40" stroke="#000" strokeWidth="1"/>
        <line x1="22" y1="260" x2="28" y2="260" stroke="#000" strokeWidth="1"/>
        <text x="15" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(-90 15 150)">D = {d + calculation.kantSize} мм</text>
        
        <line x1="115" y1="84" x2="115" y2="216" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5,3"/>
        <line x1="112" y1="84" x2="118" y2="84" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="112" y1="95" x2="118" y2="95" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="112" y1="205" x2="118" y2="205" stroke="#22C55E" strokeWidth="1.5"/>
        <line x1="112" y1="216" x2="118" y2="216" stroke="#22C55E" strokeWidth="1.5"/>
        <text x="108" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#22C55E" transform="rotate(-90 108 150)">ПВХ: {d + 50} мм</text>
        

        <text x="220" y="320" textAnchor="middle" fontSize="11" fill="#666">ПВХ пленка: A×B | Общий размер с кантом: +{calculation.kantSize/2}мм с каждой стороны</text>
        
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
              
              // Координаты канта на чертеже: левый край = 60, правый край = 380
              // Ширина канта на чертеже = 35 пикселей
              const kantWidthPx = 35;
              const kantCenterOffsetPx = kantWidthPx / 2; // 17.5 пикселей от края до центра канта
              
              // Люверсы в центре канта (в углах)
              const firstGrommetXpx = 60 + kantCenterOffsetPx; // Левый угол
              const lastGrommetXpx = 380 - kantCenterOffsetPx; // Правый угол
              
              // Масштаб: 320 пикселей = topSideMm миллиметров
              const totalWidthPx = 320;
              const scale = totalWidthPx / topSideMm;
              
              // Расстояние между угловыми люверсами в мм (от центра канта до центра канта)
              const distanceBetweenCornersMm = topSideMm - kantSize;
              
              // Расчет оптимального шага (250-350 мм) для равномерного распределения
              const spacingMm = distanceBetweenCornersMm / (count - 1 || 1);
              
              // Расстояние в пикселях между люверсами
              const spacingPx = (lastGrommetXpx - firstGrommetXpx) / (count - 1 || 1);
              
              for (let i = 0; i < count; i++) {
                positions.push([firstGrommetXpx + i * spacingPx, 52]);
              }
              
              return { positions, spacingMm, kantCenterOffsetPx, distanceBetweenCornersMm };
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
              
              // Координаты канта на чертеже
              const kantWidthPx = 35;
              const kantCenterOffsetPx = kantWidthPx / 2;
              const firstGrommetXpx = 60 + kantCenterOffsetPx;
              const lastGrommetXpx = 380 - kantCenterOffsetPx;
              const edgeX = 60;
              const totalWidthPx = 320;
              const scale = totalWidthPx / topSideMm;
              const distanceBetweenCornersMm = topSideMm - kantSize;
              const spacingMm = distanceBetweenCornersMm / (count - 1 || 1);
              const spacingPx = (lastGrommetXpx - firstGrommetXpx) / (count - 1 || 1);
              
              return (
                <>
                  {/* Отступы от края до люверса - динамические по канту */}
                  <g>
                    {/* Левый отступ = kantSize/2 (25 мм для 100мм канта, до 50мм для 300мм) */}
                    <line x1={edgeX} y1={28} x2={firstGrommetXpx} y2={28} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={edgeX} y1={25} x2={edgeX} y2={31} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={firstGrommetXpx} y1={25} x2={firstGrommetXpx} y2={31} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={(edgeX + firstGrommetXpx) / 2} y={24} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35">
                      {(kantSize/2).toFixed(0)} мм
                    </text>
                    
                    {/* Правый отступ = kantSize/2 */}
                    <line x1={lastGrommetXpx} y1={28} x2={380} y2={28} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={lastGrommetXpx} y1={25} x2={lastGrommetXpx} y2={31} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={380} y1={25} x2={380} y2={31} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={(lastGrommetXpx + 380) / 2} y={24} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35">
                      {(kantSize/2).toFixed(0)} мм
                    </text>
                  </g>

                  {/* Расстояние между люверсами */}
                  {count > 1 && (() => {
                    const x1 = firstGrommetXpx;
                    const x2 = firstGrommetXpx + spacingPx;
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
            <text x="220" y="389" textAnchor="middle" fontSize="11" fill="#0066CC">
              Люверсы 16мм: {calculation.grommetsCount} шт (верх)
            </text>
          </>
        )}

        {calculation.ringGrommets && calculation.ringGrommetsCount > 0 && (
          <>
            {(() => {
              const positions = [];
              const totalCount = calculation.ringGrommetsCount;
              
              // Параметры
              const kantWidthPx = 35;
              const kantCenterOffsetPx = kantWidthPx / 2;
              const leftSideMm = d + 25;
              const rightSideMm = b + 25;
              const bottomSideMm = c + 25;
              
              // Распределяем по 3 сторонам (левая, правая, нижняя)
              const sidesPerimeter = (leftSideMm + rightSideMm + bottomSideMm) / 1000;
              const leftCount = Math.max(1, Math.round((leftSideMm / 1000 / sidesPerimeter) * totalCount));
              const rightCount = Math.max(1, Math.round((rightSideMm / 1000 / sidesPerimeter) * totalCount));
              const bottomCount = Math.max(1, totalCount - leftCount - rightCount);
              
              // Левая сторона (сторона d)
              const leftEdgeY = 40;
              const leftBottomY = 260;
              const leftTotalHeightPx = leftBottomY - leftEdgeY;
              const leftScaleLocal = leftTotalHeightPx / leftSideMm;
              
              // Первый люверс 42х22 на расстоянии 350-450 мм от люверса 16 мм
              const minDistanceFromTop = 350; // мм
              const maxDistanceFromTop = 450; // мм
              const leftDistanceFromTopMm = Math.min(maxDistanceFromTop, Math.max(minDistanceFromTop, leftSideMm * 0.3));
              const leftFirstGrommetY = leftEdgeY + leftDistanceFromTopMm * leftScaleLocal;
              const leftLastGrommetY = leftBottomY - kantCenterOffsetPx;
              const leftSpacingPx = (leftLastGrommetY - leftFirstGrommetY) / (leftCount - 1 || 1);
              
              for (let i = 0; i < leftCount; i++) {
                positions.push([72, leftFirstGrommetY + i * leftSpacingPx, 'left', leftDistanceFromTopMm]);
              }
              
              // Правая сторона (сторона b)
              const rightEdgeY = 40;
              const rightBottomY = 260;
              const rightTotalHeightPx = rightBottomY - rightEdgeY;
              const rightScaleLocal = rightTotalHeightPx / rightSideMm;
              
              // Первый люверс 42х22 на расстоянии 350-450 мм от люверса 16 мм
              const rightDistanceFromTopMm = Math.min(maxDistanceFromTop, Math.max(minDistanceFromTop, rightSideMm * 0.3));
              const rightFirstGrommetY = rightEdgeY + rightDistanceFromTopMm * rightScaleLocal;
              const rightLastGrommetY = rightBottomY - kantCenterOffsetPx;
              const rightSpacingPx = (rightLastGrommetY - rightFirstGrommetY) / (rightCount - 1 || 1);
              
              for (let i = 0; i < rightCount; i++) {
                positions.push([368, rightFirstGrommetY + i * rightSpacingPx, 'right', rightDistanceFromTopMm]);
              }
              
              // Нижняя сторона (сторона c) - с динамическим шагом 350-450 мм
              const bottomEdgeX = 60;
              const bottomRightX = 380;
              const bottomTotalWidthPx = bottomRightX - bottomEdgeX;
              const bottomScaleLocal = bottomTotalWidthPx / bottomSideMm;
              const bottomY = 248;
              const kantSize = calculation.kantSize;
              
              // Отступ от углов, чтобы не накладываться на люверсы сторон B и D
              const grommetOffsetMm = 350; // минимальное расстояние между люверсами
              const grommetOffsetPx = grommetOffsetMm * bottomScaleLocal;
              
              const bottomFirstGrommetX = bottomEdgeX + kantCenterOffsetPx + grommetOffsetPx;
              const bottomLastGrommetX = bottomRightX - kantCenterOffsetPx - grommetOffsetPx;
              const bottomSpacingPx = (bottomLastGrommetX - bottomFirstGrommetX) / (bottomCount - 1 || 1);
              
              for (let i = 0; i < bottomCount; i++) {
                positions.push([bottomFirstGrommetX + i * bottomSpacingPx, bottomY, 'bottom', 0]);
              }
              
              return { positions, leftDistanceFromTopMm, rightDistanceFromTopMm };
            })().positions.map(([x, y, side, distanceFromTop], i) => (
              <g key={`ring-grommet-${i}`}>
                {/* Люверсы 42х22 развернуты по вертикали на сторонах b,d */}
                {side === 'left' || side === 'right' ? (
                  <>
                    <ellipse cx={x} cy={y} rx="6" ry="11" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="4.5" ry="9" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="3" ry="6" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <ellipse cx={x-1} cy={y-2} rx="1" ry="2" fill="rgba(255,255,255,0.7)"/>
                  </>
                ) : (
                  <>
                    <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
                  </>
                )}
              </g>
            ))}
            {(() => {
              const kantWidthPx = 35;
              const kantCenterOffsetPx = kantWidthPx / 2;
              const leftSideMm = d + 25;
              const rightSideMm = b + 25;
              const bottomSideMm = a + 25;
              const kantSize = calculation.kantSize;
              
              const minSpacing = 350;
              const maxSpacing = 450;
              const optimalSpacing = 400;
              
              const calculateSide = (sideMm: number) => {
                const minEdgeDistance = kantSize / 2;
                const maxEdgeDistance = kantSize;
                const availableLength = sideMm - minEdgeDistance * 2;
                
                let count = Math.max(1, Math.round(availableLength / optimalSpacing) + 1);
                let spacing = availableLength / (count - 1 || 1);
                
                while (spacing < minSpacing && count > 1) {
                  count--;
                  spacing = availableLength / (count - 1 || 1);
                }
                
                while (spacing > maxSpacing) {
                  count++;
                  spacing = availableLength / (count - 1 || 1);
                }
                
                const actualSpacing = count > 1 ? availableLength / (count - 1) : 0;
                const edgeDistance = (sideMm - availableLength) / 2;
                
                return { count, spacing: actualSpacing, edgeDistance };
              };
              
              const left = calculateSide(leftSideMm);
              const right = calculateSide(rightSideMm);
              const bottom = calculateSide(bottomSideMm);
              
              const leftCount = left.count;
              const rightCount = right.count;
              const bottomCount = bottom.count;
              
              // Левая сторона
              const leftEdgeY = 40;
              const leftBottomY = 260;
              const leftTotalHeightPx = leftBottomY - leftEdgeY;
              const leftScaleLocal = leftTotalHeightPx / leftSideMm;
              const leftDistanceFromTopMm = left.edgeDistance;
              const leftFirstGrommetY = leftEdgeY + leftDistanceFromTopMm * leftScaleLocal;
              const leftLastGrommetY = leftBottomY - (left.edgeDistance * leftScaleLocal);
              const leftSpacingPx = (leftLastGrommetY - leftFirstGrommetY) / (leftCount - 1 || 1);
              
              // Правая сторона
              const rightEdgeY = 40;
              const rightBottomY = 260;
              const rightTotalHeightPx = rightBottomY - rightEdgeY;
              const rightScaleLocal = rightTotalHeightPx / rightSideMm;
              const rightDistanceFromTopMm = right.edgeDistance;
              const rightFirstGrommetY = rightEdgeY + rightDistanceFromTopMm * rightScaleLocal;
              const rightLastGrommetY = rightBottomY - (right.edgeDistance * rightScaleLocal);
              const rightSpacingPx = (rightLastGrommetY - rightFirstGrommetY) / (rightCount - 1 || 1);
              
              // Нижняя сторона
              const bottomEdgeX = 60;
              const bottomRightX = 380;
              const bottomTotalWidthPx = bottomRightX - bottomEdgeX;
              const bottomScaleLocal = bottomTotalWidthPx / bottomSideMm;
              const bottomDistanceFromLeftMm = bottom.edgeDistance;
              const bottomFirstGrommetX = bottomEdgeX + bottomDistanceFromLeftMm * bottomScaleLocal;
              const bottomDistanceFromRightMm = bottom.edgeDistance;
              const bottomLastGrommetX = bottomRightX - bottomDistanceFromRightMm * bottomScaleLocal;
              const bottomSpacingPx = (bottomLastGrommetX - bottomFirstGrommetX) / (bottomCount - 1 || 1);
              
              const edgeX = 60;
              const edgeY = 40;
              
              return (
                <>
                  {/* Отступы от края до кольцевых люверсов (низ) - динамические по канту */}
                  <g>
                    {/* Левый отступ низа */}
                    <line x1={bottomEdgeX} y1={275} x2={bottomFirstGrommetX} y2={275} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={bottomEdgeX} y1={272} x2={bottomEdgeX} y2={278} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={bottomFirstGrommetX} y1={272} x2={bottomFirstGrommetX} y2={278} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={(bottomEdgeX + bottomFirstGrommetX) / 2} y={271} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35">
                      {bottomDistanceFromLeftMm.toFixed(0)} мм
                    </text>
                    
                    {/* Правый отступ низа */}
                    <line x1={bottomLastGrommetX} y1={275} x2={bottomRightX} y2={275} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={bottomLastGrommetX} y1={272} x2={bottomLastGrommetX} y2={278} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={bottomRightX} y1={272} x2={bottomRightX} y2={278} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={(bottomLastGrommetX + bottomRightX) / 2} y={271} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35">
                      {bottomDistanceFromRightMm.toFixed(0)} мм
                    </text>
                  </g>

                  {/* Расстояние между кольцевыми люверсами (низ) */}
                  {bottomCount > 1 && (() => {
                    const x1 = bottomFirstGrommetX;
                    const x2 = bottomFirstGrommetX + bottomSpacingPx;
                    const y = 270;
                    const spacingMm = (bottomLastGrommetX - bottomFirstGrommetX) / bottomScaleLocal / (bottomCount - 1);
                    
                    return (
                      <g>
                        <line x1={x1} y1={y} x2={x2} y2={y} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x1} y1={y-3} x2={x1} y2={y+3} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x2} y1={y-3} x2={x2} y2={y+3} stroke="#B8860B" strokeWidth="1.5"/>
                        <text x={(x1 + x2) / 2} y={y + 12} textAnchor="middle" fontSize="11" fill="#B8860B" fontWeight="bold">
                          {spacingMm.toFixed(0)}мм
                        </text>
                      </g>
                    );
                  })()}
                  
                  {/* Отступы от края до кольцевых люверсов (левая сторона) */}
                  <g>
                    {/* Верхний отступ левой стороны */}
                    <line x1={50} y1={leftEdgeY} x2={50} y2={leftFirstGrommetY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={47} y1={leftEdgeY} x2={53} y2={leftEdgeY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={47} y1={leftFirstGrommetY} x2={53} y2={leftFirstGrommetY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={45} y={(leftEdgeY + leftFirstGrommetY) / 2 + 3} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35" transform={`rotate(-90 45 ${(leftEdgeY + leftFirstGrommetY) / 2 + 3})`}>
                      {leftDistanceFromTopMm.toFixed(0)} мм
                    </text>
                    
                    {/* Нижний отступ левой стороны */}
                    <line x1={50} y1={leftLastGrommetY} x2={50} y2={leftBottomY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={47} y1={leftLastGrommetY} x2={53} y2={leftLastGrommetY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={47} y1={leftBottomY} x2={53} y2={leftBottomY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={45} y={(leftLastGrommetY + leftBottomY) / 2 + 3} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35" transform={`rotate(-90 45 ${(leftLastGrommetY + leftBottomY) / 2 + 3})`}>
                      {left.edgeDistance.toFixed(0)} мм
                    </text>
                  </g>
                  
                  {/* Отступы от края до кольцевых люверсов (правая сторона) */}
                  <g>
                    {/* Верхний отступ правой стороны */}
                    <line x1={390} y1={rightEdgeY} x2={390} y2={rightFirstGrommetY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={387} y1={rightEdgeY} x2={393} y2={rightEdgeY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={387} y1={rightFirstGrommetY} x2={393} y2={rightFirstGrommetY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={395} y={(rightEdgeY + rightFirstGrommetY) / 2 + 3} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35" transform={`rotate(90 395 ${(rightEdgeY + rightFirstGrommetY) / 2 + 3})`}>
                      {rightDistanceFromTopMm.toFixed(0)} мм
                    </text>
                    
                    {/* Нижний отступ правой стороны */}
                    <line x1={390} y1={rightLastGrommetY} x2={390} y2={rightBottomY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={387} y1={rightLastGrommetY} x2={393} y2={rightLastGrommetY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <line x1={387} y1={rightBottomY} x2={393} y2={rightBottomY} stroke="#FF6B35" strokeWidth="1.5"/>
                    <text x={395} y={(rightLastGrommetY + rightBottomY) / 2 + 3} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B35" transform={`rotate(90 395 ${(rightLastGrommetY + rightBottomY) / 2 + 3})`}>
                      {right.edgeDistance.toFixed(0)} мм
                    </text>
                  </g>

                  {/* Расстояние между кольцевыми люверсами на левой стороне */}
                  {leftCount > 1 && (() => {
                    const y1 = leftFirstGrommetY;
                    const y2 = leftFirstGrommetY + leftSpacingPx;
                    const x = 35;
                    const spacingMm = (leftLastGrommetY - leftFirstGrommetY) / leftScaleLocal / (leftCount - 1);
                    
                    return (
                      <g>
                        <line x1={x} y1={y1} x2={x} y2={y2} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x-3} y1={y1} x2={x+3} y2={y1} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x-3} y1={y2} x2={x+3} y2={y2} stroke="#B8860B" strokeWidth="1.5"/>
                        <text x={30} y={(y1 + y2) / 2 + 3} textAnchor="middle" fontSize="11" fill="#B8860B" fontWeight="bold" transform={`rotate(-90 30 ${(y1 + y2) / 2 + 3})`}>
                          {spacingMm.toFixed(0)}мм
                        </text>
                      </g>
                    );
                  })()}
                  
                  {/* Расстояние между кольцевыми люверсами на правой стороне */}
                  {rightCount > 1 && (() => {
                    const y1 = rightFirstGrommetY;
                    const y2 = rightFirstGrommetY + rightSpacingPx;
                    const x = 415;
                    const spacingMm = (rightLastGrommetY - rightFirstGrommetY) / rightScaleLocal / (rightCount - 1);
                    
                    return (
                      <g>
                        <line x1={x} y1={y1} x2={x} y2={y2} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x-3} y1={y1} x2={x+3} y2={y1} stroke="#B8860B" strokeWidth="1.5"/>
                        <line x1={x-3} y1={y2} x2={x+3} y2={y2} stroke="#B8860B" strokeWidth="1.5"/>
                        <text x={420} y={(y1 + y2) / 2 + 3} textAnchor="middle" fontSize="11" fill="#B8860B" fontWeight="bold" transform={`rotate(90 420 ${(y1 + y2) / 2 + 3})`}>
                          {spacingMm.toFixed(0)}мм
                        </text>
                      </g>
                    );
                  })()}
                </>
              );
            })()}
            <text x="220" y="366" textAnchor="middle" fontSize="11" fill="#B8860B">
              Кольцевые люверсы 42×22мм: {calculation.ringGrommetsCount} шт
            </text>
          </>
        )}

        {calculation.frenchLock && calculation.frenchLockCount > 0 && (
          <text x="220" y="343" textAnchor="middle" fontSize="11" fill="#8B4513">
            Скоба поворотная: {calculation.frenchLockCount} шт
          </text>
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