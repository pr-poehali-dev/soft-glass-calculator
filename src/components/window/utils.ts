import { WindowCalculation, filmTypes } from './types';

export const calculateArea = (calculation: WindowCalculation) => {
  const { верх, право } = calculation;
  return (верх * право) / 1000000;
};

export const calculatePerimeter = (calculation: WindowCalculation) => {
  const { верх, право, низ, лево } = calculation;
  return (верх + право + низ + лево) / 1000;
};

export const calculateGrommetsCount = (calculation: WindowCalculation, minStep: number = 250, maxStep: number = 350) => {
  const kantSize = calculation.kantSize;
  const topSideMm = calculation.верх + kantSize;
  
  // Расстояние между угловыми люверсами по ОСЯМ (от центра до центра)
  // Первый люверс на расстоянии kantSize/4 от края
  // Последний люверс на расстоянии kantSize/4 от противоположного края
  // Расстояние между их центрами = общая длина - kantSize/4 - kantSize/4 = общая длина - kantSize/2
  const distanceBetweenCornerAxes = topSideMm - (kantSize / 4) - (kantSize / 4);
  
  // Подбираем количество люверсов так, чтобы шаг между ОСЯМИ был в диапазоне 250-350 мм
  let count = 2;
  let spacing = distanceBetweenCornerAxes / (count - 1);
  
  while (spacing > maxStep && count < 50) {
    count++;
    spacing = distanceBetweenCornerAxes / (count - 1);
  }
  
  // Если шаг меньше минимального, уменьшаем количество
  if (spacing < minStep && count > 2) {
    count--;
  }
  
  return Math.max(2, count);
};

export const calculateRingGrommetsCount = (calculation: WindowCalculation, grommetsStepMm: number = 350) => {
  const kantSize = calculation.kantSize;
  const leftSideMm = calculation.лево + kantSize;
  const rightSideMm = calculation.право + kantSize;
  const bottomSideMm = calculation.низ + kantSize;
  
  const calculateSideGrommets = (sideMm: number) => {
    // Расстояние между угловыми люверсами по ОСЯМ (от центра до центра)
    // Первый люверс на расстоянии kantSize/4 от края
    // Последний люверс на расстоянии kantSize/4 от противоположного края
    const distanceBetweenCornerAxes = sideMm - (kantSize / 4) - (kantSize / 4);
    let count = 2;
    
    if (distanceBetweenCornerAxes <= 0) return 2;
    
    // Шаг между ОСЯМИ люверсов
    let spacing = distanceBetweenCornerAxes / (count - 1);
    
    while (spacing > 450 && count < 50) {
      count++;
      spacing = distanceBetweenCornerAxes / (count - 1);
    }
    
    if (spacing < 350 && count > 2) {
      count--;
    }
    
    return count;
  };
  
  const leftGrommets = calculateSideGrommets(leftSideMm);
  const rightGrommets = calculateSideGrommets(rightSideMm);
  const bottomGrommets = calculateSideGrommets(bottomSideMm);
  
  return leftGrommets + rightGrommets + bottomGrommets - 2;
};

export const calculatePrice = (calculation: WindowCalculation) => {
  const area = calculateArea(calculation);
  const filmPrice = filmTypes.find(f => f.id === calculation.filmType)?.price || 450;
  let pricePerWindow = area * filmPrice;

  if (calculation.grommets) pricePerWindow += calculation.grommetsCount * 150;
  if (calculation.ringGrommets) pricePerWindow += calculation.ringGrommetsCount * 180;
  if (calculation.frenchLock) pricePerWindow += area * 80;
  
  const perimeter = calculatePerimeter(calculation);
  pricePerWindow += perimeter * 15;

  const quantity = calculation.quantity || 1;
  const totalPrice = pricePerWindow * quantity;
  const totalArea = area * quantity;

  return { area, price: pricePerWindow, totalPrice, totalArea, quantity };
};