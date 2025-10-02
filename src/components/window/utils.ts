import { WindowCalculation, filmTypes } from './types';

export const calculateArea = (calculation: WindowCalculation) => {
  const { a, b } = calculation;
  return (a * b) / 1000000;
};

export const calculatePerimeter = (calculation: WindowCalculation) => {
  const { a, b, c, d } = calculation;
  return (a + b + c + d) / 1000;
};

export const calculatePrice = (calculation: WindowCalculation) => {
  const area = calculateArea(calculation);
  const filmPrice = filmTypes.find(f => f.id === calculation.filmType)?.price || 450;
  let price = area * filmPrice;

  if (calculation.grommets) price += calculation.grommetsCount * 150;
  if (calculation.ringGrommets) price += calculation.ringGrommetsCount * 180;
  if (calculation.frenchLock) price += area * 80;
  
  const perimeter = calculatePerimeter(calculation);
  price += perimeter * 15;

  return { area, price };
};
