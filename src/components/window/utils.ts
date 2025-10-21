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

export const calculateRingGrommetsCount = (calculation: WindowCalculation, minStep: number = 350, maxStep: number = 450) => {
  const kantSize = calculation.kantSize;
  const grommetSize = 42; // Внешний размер люверса 42х22
  
  // Размеры сторон с припуском
  const leftSideMm = calculation.d + 25;
  const rightSideMm = calculation.b + 25;
  const bottomSideMm = calculation.c + 25;
  
  // Функция расчёта люверсов для одной стороны
  const calculateSideGrommets = (sideMm: number) => {
    // Расстояние между центрами угловых люверсов
    const distanceBetweenCorners = sideMm - kantSize;
    
    // Минимум 2 люверса (угловые)
    let count = 2;
    let spacing = distanceBetweenCorners / (count - 1);
    
    // Добавляем люверсы, пока шаг больше максимального
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
  
  const leftGrommets = calculateSideGrommets(leftSideMm);
  const rightGrommets = calculateSideGrommets(rightSideMm);
  const bottomGrommets = calculateSideGrommets(bottomSideMm);
  
  // Вычитаем 4 угловых люверса (они считаются в каждой стороне)
  return leftGrommets + rightGrommets + bottomGrommets - 4;
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