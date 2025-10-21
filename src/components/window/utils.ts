import { WindowCalculation, filmTypes } from './types';

export const calculateArea = (calculation: WindowCalculation) => {
  const { a, b } = calculation;
  return (a * b) / 1000000;
};

export const calculatePerimeter = (calculation: WindowCalculation) => {
  const { a, b, c, d } = calculation;
  return (a + b + c + d) / 1000;
};

export const calculateGrommetsCount = (calculation: WindowCalculation, minStep: number = 250, maxStep: number = 350) => {
  const topSideMm = calculation.a + 25; // Размер ПВХ с припуском
  const kantSize = calculation.kantSize;
  
  // Расстояние между угловыми люверсами (от центра канта до центра канта)
  const distanceBetweenCorners = topSideMm - kantSize;
  
  // Подбираем количество люверсов так, чтобы шаг был в диапазоне 250-350 мм
  let count = 2;
  let spacing = distanceBetweenCorners / (count - 1);
  
  while (spacing > maxStep && count < 50) {
    count++;
    spacing = distanceBetweenCorners / (count - 1);
  }
  
  // Если шаг меньше минимального, уменьшаем количество
  if (spacing < minStep && count > 2) {
    count--;
  }
  
  return Math.max(2, count);
};

export const calculateRingGrommetsCount = (calculation: WindowCalculation, grommetsStepMm: number = 350) => {
  const leftSideMm = calculation.d + 25;
  const rightSideMm = calculation.b + 25;
  const bottomSideMm = calculation.c + 25;
  const threesSidesPerimeterMm = leftSideMm + rightSideMm + bottomSideMm;
  return Math.ceil(threesSidesPerimeterMm / grommetsStepMm);
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