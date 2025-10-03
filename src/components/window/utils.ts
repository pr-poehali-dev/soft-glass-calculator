import { WindowCalculation, filmTypes } from './types';

export const calculateArea = (calculation: WindowCalculation) => {
  const { a, b } = calculation;
  return (a * b) / 1000000;
};

export const calculatePerimeter = (calculation: WindowCalculation) => {
  const { a, b, c, d } = calculation;
  return (a + b + c + d) / 1000;
};

export const calculateGrommetsCount = (calculation: WindowCalculation, grommetsStep: number = 0.3) => {
  const topSideMeters = calculation.a / 1000;
  return Math.ceil(topSideMeters / grommetsStep);
};

export const calculateRingGrommetsCount = (calculation: WindowCalculation, grommetsStep: number = 0.5) => {
  const leftSideMeters = calculation.d / 1000;
  const rightSideMeters = calculation.b / 1000;
  const bottomSideMeters = calculation.c / 1000;
  const threesSidesPerimeter = leftSideMeters + rightSideMeters + bottomSideMeters;
  return Math.ceil(threesSidesPerimeter / grommetsStep);
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