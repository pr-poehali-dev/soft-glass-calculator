export interface WindowCalculation {
  shape: string;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  grommets: boolean;
  grommetsCount: number;
  frenchLock: boolean;
  ringGrommets: boolean;
  ringGrommetsCount: number;
  filmType: string;
  kantSize: number;
  area: number;
  price: number;
}

export const shapes = [
  { id: 'rectangle', name: 'Прямоугольник', params: ['a', 'b', 'c', 'd'] }
];

export const filmTypes = [
  { id: 'transparent', name: 'Прозрачная ПВХ', price: 450 },
  { id: 'colored', name: 'Цветная ПВХ', price: 520 },
  { id: 'textured', name: 'Текстурированная ПВХ', price: 590 }
];
